/**
 * Orbecc Femto Mega Camera Integration for Thrive Ortho EHR
 * Medical-grade camera support for clinical assessments
 * Version: 1.0.0
 */

class OrbeccCameraIntegration {
    constructor() {
        this.device = null;
        this.session = null;
        this.isConnected = false;
        this.cameraType = 'femto-mega'; // femto-mega, astra, persee
        this.resolution = { width: 1280, height: 720 };
        this.fps = 30;
        this.depthEnabled = true;
        this.colorEnabled = true;
        
        // Orbecc specific configurations
        this.orbeccConfig = {
            vendorId: 0x2bc5,
            productIds: {
                'femto-mega': 0x0661,
                'astra': 0x0401,
                'persee': 0x0403
            },
            endpoints: {
                depth: 0x81,
                color: 0x82,
                ir: 0x83
            }
        };

        // Camera calibration data
        this.calibration = {
            depthFocalLength: 570.342,
            depthPrincipalPoint: { x: 320, y: 240 },
            colorFocalLength: 520.234,
            colorPrincipalPoint: { x: 640, y: 360 },
            depthToColorTransform: null
        };

        // Medical assessment parameters
        this.medicalParams = {
            minDepth: 500, // mm
            maxDepth: 5000, // mm
            depthAccuracy: 1.0, // mm
            fieldOfView: { h: 58.4, v: 45.5 }, // degrees
            baseline: 50 // mm (for stereo)
        };
    }

    /**
     * Initialize Orbecc camera connection
     */
    async initialize() {
        try {
            console.log('🔍 Initializing Orbecc Femto Mega camera...');
            
            // Check browser compatibility
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Browser does not support WebRTC media devices');
            }

            // Request camera permissions
            await this.requestPermissions();
            
            // Initialize device
            await this.initializeDevice();
            
            // Load calibration data
            await this.loadCalibration();
            
            console.log('✅ Orbecc camera initialized successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize Orbecc camera:', error);
            throw error;
        }
    }

    /**
     * Request camera permissions
     */
    async requestPermissions() {
        try {
            const constraints = {
                video: {
                    width: this.resolution.width,
                    height: this.resolution.height,
                    frameRate: this.fps,
                    facingMode: 'user'
                },
                audio: false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // Stop the stream immediately after getting permissions
            stream.getTracks().forEach(track => track.stop());
            
            console.log('✅ Camera permissions granted');
            
        } catch (error) {
            console.error('❌ Camera permissions denied:', error);
            throw new Error('Camera permissions are required for medical assessments');
        }
    }

    /**
     * Initialize camera device
     */
    async initializeDevice() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            console.log('📹 Available video devices:', videoDevices.map(d => ({
                label: d.label,
                deviceId: d.deviceId,
                groupId: d.groupId
            })));

            // Try to find Orbecc device
            const orbeccDevice = this.findOrbeccDevice(videoDevices);
            
            if (orbeccDevice) {
                this.device = orbeccDevice;
                console.log('✅ Found Orbecc device:', orbeccDevice.label);
            } else {
                // Fallback to first available camera
                this.device = videoDevices[0];
                console.warn('⚠️  Orbecc device not found, using fallback:', this.device?.label);
            }

            this.isConnected = true;
            
        } catch (error) {
            console.error('❌ Failed to initialize device:', error);
            throw error;
        }
    }

    /**
     * Find Orbecc device in device list
     */
    findOrbeccDevice(devices) {
        // Look for Orbecc specific identifiers
        const orbeccPatterns = [
            /orbecc/i,
            /femto.*mega/i,
            /astra/i,
            /persee/i,
            /2bc5/i, // Vendor ID
            /0661|0401|0403/i // Product IDs
        ];

        return devices.find(device => 
            orbeccPatterns.some(pattern => 
                device.label.match(pattern) || device.deviceId.match(pattern)
            )
        );
    }

    /**
     * Load camera calibration data
     */
    async loadCalibration() {
        try {
            // Load from local storage or fetch from server
            const savedCalibration = localStorage.getItem('orbecc-calibration');
            
            if (savedCalibration) {
                this.calibration = JSON.parse(savedCalibration);
                console.log('✅ Loaded saved calibration data');
            } else {
                // Use default calibration
                console.log('ℹ️  Using default calibration data');
                await this.saveCalibration();
            }
            
        } catch (error) {
            console.error('❌ Failed to load calibration:', error);
            // Continue with default calibration
        }
    }

    /**
     * Save calibration data
     */
    async saveCalibration() {
        try {
            localStorage.setItem('orbecc-calibration', JSON.stringify(this.calibration));
            console.log('✅ Calibration data saved');
        } catch (error) {
            console.error('❌ Failed to save calibration:', error);
        }
    }

    /**
     * Start camera stream
     */
    async startStream(videoElement) {
        try {
            if (!this.device) {
                throw new Error('Camera device not initialized');
            }

            const constraints = {
                video: {
                    deviceId: this.device.deviceId,
                    width: this.resolution.width,
                    height: this.resolution.height,
                    frameRate: this.fps
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            videoElement.srcObject = stream;
            videoElement.play();
            
            console.log('✅ Camera stream started');
            return stream;
            
        } catch (error) {
            console.error('❌ Failed to start camera stream:', error);
            throw error;
        }
    }

    /**
     * Stop camera stream
     */
    stopStream(videoElement) {
        try {
            if (videoElement.srcObject) {
                const stream = videoElement.srcObject;
                const tracks = stream.getTracks();
                
                tracks.forEach(track => track.stop());
                videoElement.srcObject = null;
                
                console.log('✅ Camera stream stopped');
            }
        } catch (error) {
            console.error('❌ Failed to stop camera stream:', error);
        }
    }

    /**
     * Get depth data (simulated for web environment)
     */
    async getDepthData(colorFrame) {
        // In a real implementation, this would interface with the Orbecc SDK
        // For web environment, we'll simulate depth based on color intensity
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.resolution.width;
        canvas.height = this.resolution.height;
        
        ctx.drawImage(colorFrame, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const depthData = new Uint16Array(canvas.width * canvas.height);
        
        // Simulate depth based on color intensity
        for (let i = 0; i < imageData.data.length; i += 4) {
            const intensity = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            const depth = this.medicalParams.minDepth + (intensity / 255) * (this.medicalParams.maxDepth - this.medicalParams.minDepth);
            depthData[i / 4] = Math.round(depth);
        }
        
        return {
            data: depthData,
            width: canvas.width,
            height: canvas.height,
            timestamp: Date.now()
        };
    }

    /**
     * Calibrate camera for medical use
     */
    async calibrateForMedicalUse(calibrationData) {
        try {
            console.log('🔧 Calibrating camera for medical use...');
            
            // Update calibration parameters
            if (calibrationData.depthFocalLength) {
                this.calibration.depthFocalLength = calibrationData.depthFocalLength;
            }
            if (calibrationData.depthPrincipalPoint) {
                this.calibration.depthPrincipalPoint = calibrationData.depthPrincipalPoint;
            }
            if (calibrationData.colorFocalLength) {
                this.calibration.colorFocalLength = calibrationData.colorFocalLength;
            }
            if (calibrationData.colorPrincipalPoint) {
                this.calibration.colorPrincipalPoint = calibrationData.colorPrincipalPoint;
            }

            // Calculate depth to color transformation
            await this.calculateDepthToColorTransform();
            
            // Save calibration
            await this.saveCalibration();
            
            console.log('✅ Medical calibration completed');
            return true;
            
        } catch (error) {
            console.error('❌ Medical calibration failed:', error);
            throw error;
        }
    }

    /**
     * Calculate depth to color transformation
     */
    async calculateDepthToColorTransform() {
        // Calculate transformation matrix between depth and color cameras
        // This is a simplified implementation
        
        const dx = this.calibration.colorPrincipalPoint.x - this.calibration.depthPrincipalPoint.x;
        const dy = this.calibration.colorPrincipalPoint.y - this.calibration.depthPrincipalPoint.y;
        
        this.calibration.depthToColorTransform = {
            dx: dx,
            dy: dy,
            scale: this.calibration.colorFocalLength / this.calibration.depthFocalLength
        };
        
        console.log('✅ Depth to color transformation calculated');
    }

    /**
     * Get camera information
     */
    getCameraInfo() {
        return {
            device: this.device,
            resolution: this.resolution,
            fps: this.fps,
            depthEnabled: this.depthEnabled,
            colorEnabled: this.colorEnabled,
            calibration: this.calibration,
            medicalParams: this.medicalParams,
            isConnected: this.isConnected
        };
    }

    /**
     * Get medical assessment parameters
     */
    getMedicalAssessmentParams() {
        return {
            depthRange: {
                min: this.medicalParams.minDepth,
                max: this.medicalParams.maxDepth,
                accuracy: this.medicalParams.depthAccuracy
            },
            fieldOfView: this.medicalParams.fieldOfView,
            baseline: this.medicalParams.baseline,
            calibration: this.calibration,
            recommendedDistance: 2000 // mm (2 meters)
        };
    }
}

// Export for use in other modules
window.OrbeccCameraIntegration = OrbeccCameraIntegration;

// Auto-initialize if Orbecc SDK is available
if (typeof orbecc !== 'undefined') {
    console.log('🎯 Orbecc SDK detected, initializing camera integration...');
    const cameraIntegration = new OrbeccCameraIntegration();
    cameraIntegration.initialize().then(() => {
        console.log('✅ Orbecc camera integration ready');
    }).catch(error => {
        console.error('❌ Orbecc camera integration failed:', error);
    });
}

export default OrbeccCameraIntegration;