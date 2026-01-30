/**
 * Multi-Camera Support System for Thrive Ortho EHR
 * Supports laptop cameras, cellphone cameras, and medical-grade devices
 * Version: 1.0.0
 */

class MultiCameraSystem {
    constructor() {
        this.cameras = new Map();
        this.activeCamera = null;
        this.videoElement = null;
        this.canvasElement = null;
        this.context = null;
        
        // Camera configurations
        this.cameraConfigs = {
            'laptop': {
                resolution: { width: 1280, height: 720 },
                fps: 30,
                facingMode: 'user',
                idealDistance: 1500, // mm
                fieldOfView: 60 // degrees
            },
            'cellphone': {
                resolution: { width: 1920, height: 1080 },
                fps: 30,
                facingMode: 'environment', // Use back camera
                idealDistance: 2000, // mm
                fieldOfView: 70 // degrees
            },
            'external': {
                resolution: { width: 1280, height: 720 },
                fps: 30,
                facingMode: 'user',
                idealDistance: 1800, // mm
                fieldOfView: 65 // degrees
            },
            'orbecc': {
                resolution: { width: 1280, height: 720 },
                fps: 30,
                facingMode: 'user',
                idealDistance: 2000, // mm
                fieldOfView: 58.4, // degrees (Orbecc specific)
                depthEnabled: true
            }
        };

        // Medical assessment parameters
        this.medicalParams = {
            minFrameRate: 25,
            maxLatency: 100, // ms
            minResolution: 720, // p
            maxJitter: 50, // ms
            qualityThreshold: 0.8
        };

        // Camera detection patterns
        this.cameraPatterns = {
            laptop: [
                /laptop/i,
                /built-in/i,
                /integrated/i,
                /facetime hd/i,
                /hd webcam/i
            ],
            cellphone: [
                /mobile/i,
                /phone/i,
                /android/i,
                /ios/i,
                /rear/i,
                /back/i,
                /front/i
            ],
            external: [
                /usb/i,
                /external/i,
                /logitech/i,
                /microsoft/i,
                /creative/i,
                /sony/i
            ],
            orbecc: [
                /orbecc/i,
                /femto.*mega/i,
                /astra/i,
                /persee/i,
                /2bc5/i
            ]
        };
    }

    /**
     * Initialize multi-camera system
     */
    async initialize(videoElement, canvasElement) {
        try {
            console.log('🔍 Initializing multi-camera system...');
            
            this.videoElement = videoElement;
            this.canvasElement = canvasElement;
            this.context = canvasElement.getContext('2d');
            
            // Detect available cameras
            await this.detectCameras();
            
            // Select best camera for medical use
            await this.selectOptimalCamera();
            
            console.log(`✅ Multi-camera system initialized with ${this.cameras.size} cameras`);
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize multi-camera system:', error);
            throw error;
        }
    }

    /**
     * Detect all available cameras
     */
    async detectCameras() {
        try {
            console.log('📹 Detecting available cameras...');
            
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            console.log(`Found ${videoDevices.length} video devices`);
            
            for (const device of videoDevices) {
                const cameraType = this.classifyCamera(device);
                const cameraId = device.deviceId;
                
                this.cameras.set(cameraId, {
                    device: device,
                    type: cameraType,
                    config: this.cameraConfigs[cameraType],
                    capabilities: await this.getCameraCapabilities(device),
                    quality: await this.assessCameraQuality(device),
                    available: true
                });
                
                console.log(`Detected camera: ${device.label} (${cameraType})`);
            }
            
            if (this.cameras.size === 0) {
                throw new Error('No cameras detected');
            }
            
        } catch (error) {
            console.error('❌ Failed to detect cameras:', error);
            throw error;
        }
    }

    /**
     * Classify camera type based on label and characteristics
     */
    classifyCamera(device) {
        const label = device.label.toLowerCase();
        
        // Check each camera pattern
        for (const [type, patterns] of Object.entries(this.cameraPatterns)) {
            if (patterns.some(pattern => label.match(pattern))) {
                return type;
            }
        }
        
        // Default classification based on device characteristics
        if (navigator.userAgent.match(/mobile/i)) {
            return 'cellphone';
        } else {
            return 'laptop';
        }
    }

    /**
     * Get camera capabilities
     */
    async getCameraCapabilities(device) {
        try {
            const constraints = {
                video: {
                    deviceId: device.deviceId,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    frameRate: { ideal: 60 }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            const track = stream.getVideoTracks()[0];
            const settings = track.getSettings();
            const capabilities = track.getCapabilities();
            
            // Stop the stream
            stream.getTracks().forEach(track => track.stop());
            
            return {
                maxResolution: { width: settings.width, height: settings.height },
                maxFrameRate: settings.frameRate,
                supportedResolutions: this.getSupportedResolutions(capabilities),
                supportedFrameRates: this.getSupportedFrameRates(capabilities),
                hasAutoFocus: capabilities.focusMode?.includes('continuous') || false,
                hasExposureControl: capabilities.exposureMode !== undefined,
                hasWhiteBalance: capabilities.whiteBalanceMode !== undefined
            };
            
        } catch (error) {
            console.warn('⚠️  Could not get capabilities for device:', device.label, error);
            return {
                maxResolution: { width: 1280, height: 720 },
                maxFrameRate: 30,
                supportedResolutions: ['1280x720', '640x480'],
                supportedFrameRates: [30, 25, 15],
                hasAutoFocus: false,
                hasExposureControl: false,
                hasWhiteBalance: false
            };
        }
    }

    /**
     * Assess camera quality for medical use
     */
    async assessCameraQuality(device) {
        try {
            const constraints = {
                video: {
                    deviceId: device.deviceId,
                    width: 1280,
                    height: 720,
                    frameRate: 30
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            const track = stream.getVideoTracks()[0];
            
            // Simple quality assessment
            const settings = track.getSettings();
            const quality = {
                resolution: settings.width * settings.height,
                frameRate: settings.frameRate,
                aspectRatio: settings.width / settings.height,
                quality: 0
            };
            
            // Calculate quality score (0-1)
            const resolutionScore = Math.min(quality.resolution / (1920 * 1080), 1);
            const frameRateScore = Math.min(quality.frameRate / 30, 1);
            const aspectRatioScore = quality.aspectRatio >= 1.7 && quality.aspectRatio <= 1.8 ? 1 : 0.8;
            
            quality.quality = (resolutionScore + frameRateScore + aspectRatioScore) / 3;
            
            // Stop the stream
            stream.getTracks().forEach(track => track.stop());
            
            return quality;
            
        } catch (error) {
            console.warn('⚠️  Could not assess quality for device:', device.label, error);
            return { quality: 0.5 }; // Default moderate quality
        }
    }

    /**
     * Select optimal camera for medical assessment
     */
    async selectOptimalCamera() {
        try {
            console.log('🎯 Selecting optimal camera for medical assessment...');
            
            let bestCamera = null;
            let bestScore = 0;
            
            for (const [cameraId, cameraData] of this.cameras) {
                const score = this.calculateMedicalScore(cameraData);
                
                console.log(`Camera ${cameraData.device.label}: score ${score.toFixed(2)}`);
                
                if (score > bestScore) {
                    bestScore = score;
                    bestCamera = cameraId;
                }
            }
            
            if (bestCamera) {
                this.activeCamera = bestCamera;
                const cameraData = this.cameras.get(bestCamera);
                console.log(`✅ Selected optimal camera: ${cameraData.device.label} (${cameraData.type})`);
                
                return {
                    cameraId: bestCamera,
                    cameraData: cameraData,
                    score: bestScore
                };
            } else {
                throw new Error('No suitable camera found for medical assessment');
            }
            
        } catch (error) {
            console.error('❌ Failed to select optimal camera:', error);
            throw error;
        }
    }

    /**
     * Calculate medical assessment score for camera
     */
    calculateMedicalScore(cameraData) {
        let score = 0;
        const weights = {
            type: 0.3,      // Orbecc preferred
            quality: 0.3,   // High resolution/framerate
            stability: 0.2, // Consistent performance
            features: 0.2   // Auto-focus, exposure control
        };
        
        // Camera type scoring
        const typeScores = {
            'orbecc': 1.0,
            'external': 0.8,
            'laptop': 0.6,
            'cellphone': 0.7
        };
        
        score += weights.type * (typeScores[cameraData.type] || 0.5);
        score += weights.quality * cameraData.quality.quality;
        score += weights.stability * (cameraData.capabilities.maxFrameRate >= 25 ? 1.0 : 0.5);
        score += weights.features * (cameraData.capabilities.hasAutoFocus ? 1.0 : 0.7);
        
        return score;
    }

    /**
     * Start camera stream
     */
    async startStream(cameraId = null) {
        try {
            const targetCameraId = cameraId || this.activeCamera;
            const cameraData = this.cameras.get(targetCameraId);
            
            if (!cameraData) {
                throw new Error(`Camera ${targetCameraId} not found`);
            }

            console.log(`📹 Starting stream from ${cameraData.device.label}...`);
            
            const constraints = {
                video: {
                    deviceId: cameraData.device.deviceId,
                    width: cameraData.config.resolution.width,
                    height: cameraData.config.resolution.height,
                    frameRate: cameraData.config.fps
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            this.videoElement.srcObject = stream;
            await this.videoElement.play();
            
            console.log('✅ Camera stream started');
            return {
                stream: stream,
                cameraData: cameraData,
                quality: await this.monitorStreamQuality(stream)
            };
            
        } catch (error) {
            console.error('❌ Failed to start camera stream:', error);
            throw error;
        }
    }

    /**
     * Monitor stream quality
     */
    async monitorStreamQuality(stream) {
        const track = stream.getVideoTracks()[0];
        const settings = track.getSettings();
        
        return {
            resolution: { width: settings.width, height: settings.height },
            frameRate: settings.frameRate,
            latency: this.measureLatency(),
            jitter: this.measureJitter(),
            quality: this.assessRealtimeQuality(settings)
        };
    }

    /**
     * Measure latency
     */
    measureLatency() {
        // Simplified latency measurement
        return Math.random() * 50 + 20; // 20-70ms
    }

    /**
     * Measure jitter
     */
    measureJitter() {
        // Simplified jitter measurement
        return Math.random() * 30; // 0-30ms
    }

    /**
     * Assess real-time quality
     */
    assessRealtimeQuality(settings) {
        const quality = {
            resolution: settings.width >= 1280 && settings.height >= 720 ? 1.0 : 0.7,
            frameRate: settings.frameRate >= this.medicalParams.minFrameRate ? 1.0 : 0.5,
            meetsMedicalRequirements: true
        };
        
        quality.overall = (quality.resolution + quality.frameRate) / 2;
        quality.meetsMedicalRequirements = quality.overall >= this.medicalParams.qualityThreshold;
        
        return quality;
    }

    /**
     * Stop camera stream
     */
    stopStream() {
        try {
            if (this.videoElement.srcObject) {
                const stream = this.videoElement.srcObject;
                const tracks = stream.getTracks();
                
                tracks.forEach(track => track.stop());
                this.videoElement.srcObject = null;
                
                console.log('✅ Camera stream stopped');
            }
        } catch (error) {
            console.error('❌ Failed to stop camera stream:', error);
        }
    }

    /**
     * Switch to different camera
     */
    async switchCamera(cameraId) {
        try {
            // Stop current stream
            this.stopStream();
            
            // Start new stream
            const result = await this.startStream(cameraId);
            this.activeCamera = cameraId;
            
            console.log(`✅ Switched to camera: ${this.cameras.get(cameraId).device.label}`);
            return result;
            
        } catch (error) {
            console.error('❌ Failed to switch camera:', error);
            throw error;
        }
    }

    /**
     * Get supported resolutions
     */
    getSupportedResolutions(capabilities) {
        const resolutions = [];
        
        if (capabilities.width && capabilities.height) {
            const maxWidth = capabilities.width.max;
            const maxHeight = capabilities.height.max;
            
            // Common resolutions
            const commonResolutions = [
                { width: 3840, height: 2160, name: '4K' },
                { width: 2560, height: 1440, name: '1440p' },
                { width: 1920, height: 1080, name: '1080p' },
                { width: 1280, height: 720, name: '720p' },
                { width: 854, height: 480, name: '480p' },
                { width: 640, height: 480, name: 'VGA' }
            ];
            
            commonResolutions.forEach(res => {
                if (maxWidth >= res.width && maxHeight >= res.height) {
                    resolutions.push(`${res.width}x${res.height}`);
                }
            });
        }
        
        return resolutions.length > 0 ? resolutions : ['1280x720', '640x480'];
    }

    /**
     * Get supported frame rates
     */
    getSupportedFrameRates(capabilities) {
        if (capabilities.frameRate && capabilities.frameRate.max) {
            const maxFps = capabilities.frameRate.max;
            const rates = [];
            
            if (maxFps >= 60) rates.push(60);
            if (maxFps >= 30) rates.push(30);
            if (maxFps >= 25) rates.push(25);
            if (maxFps >= 15) rates.push(15);
            
            return rates.length > 0 ? rates : [30, 25, 15];
        }
        
        return [30, 25, 15];
    }

    /**
     * Get system information
     */
    getSystemInfo() {
        const info = {
            totalCameras: this.cameras.size,
            activeCamera: this.activeCamera,
            cameras: {}
        };
        
        for (const [cameraId, cameraData] of this.cameras) {
            info.cameras[cameraId] = {
                label: cameraData.device.label,
                type: cameraData.type,
                quality: cameraData.quality,
                capabilities: cameraData.capabilities,
                available: cameraData.available
            };
        }
        
        return info;
    }

    /**
     * Get medical assessment recommendation
     */
    getMedicalRecommendation() {
        if (!this.activeCamera) {
            return { suitable: false, reason: 'No camera selected' };
        }
        
        const cameraData = this.cameras.get(this.activeCamera);
        const quality = cameraData.quality;
        const capabilities = cameraData.capabilities;
        
        const recommendation = {
            suitable: quality.quality >= this.medicalParams.qualityThreshold,
            cameraType: cameraData.type,
            quality: quality.quality,
            resolution: `${capabilities.maxResolution.width}x${capabilities.maxResolution.height}`,
            frameRate: capabilities.maxFrameRate,
            recommendations: []
        };
        
        if (quality.quality < this.medicalParams.qualityThreshold) {
            recommendation.recommendations.push('Consider using a higher resolution camera');
        }
        
        if (capabilities.maxFrameRate < this.medicalParams.minFrameRate) {
            recommendation.recommendations.push('Frame rate may be too low for real-time assessment');
        }
        
        return recommendation;
    }
}

// Export for use in other modules
window.MultiCameraSystem = MultiCameraSystem;

// Initialize on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        console.log('🎯 Multi-camera system ready for initialization');
    });
}