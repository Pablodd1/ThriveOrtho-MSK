/**
 * Camera & LiDAR Detector
 * Auto-detects available cameras, depth sensors (LiDAR), and selects maximum resolution
 * Provides user-friendly device selection and configuration
 */

class CameraLidarDetector {
    constructor() {
        this.devices = [];
        this.selectedDevice = null;
        this.selectedResolution = null;
        this.stream = null;
        
        // Supported capabilities
        this.capabilities = {
            video: false,
            depth: false,      // LiDAR / depth camera
            infrared: false,
            multiCamera: false
        };
        
        // Error state
        this.errors = [];
    }

    /**
     * Detect all available cameras and sensors
     */
    async detectDevices() {
        try {
            console.log('🔍 Detecting cameras and sensors...');
            
            // Request permissions first
            const permissionResult = await this.requestPermissions();
            if (!permissionResult.success) {
                throw new Error(permissionResult.error);
            }
            
            // Enumerate all media devices
            const devices = await navigator.mediaDevices.enumerateDevices();
            
            // Filter video input devices
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            console.log(`✅ Found ${videoDevices.length} camera(s)`);
            
            // Get capabilities for each device
            this.devices = await Promise.all(
                videoDevices.map(async (device) => await this.analyzeDevice(device))
            );
            
            // Detect special capabilities
            this.detectSpecialCapabilities();
            
            // Auto-select best device
            this.autoSelectBestDevice();
            
            return {
                success: true,
                devices: this.devices,
                capabilities: this.capabilities,
                selected: this.selectedDevice
            };
            
        } catch (error) {
            console.error('❌ Device detection failed:', error);
            this.errors.push({
                type: 'detection',
                message: error.message,
                timestamp: Date.now()
            });
            
            return {
                success: false,
                error: error.message,
                errorType: this.getErrorType(error)
            };
        }
    }

    /**
     * Request camera permissions
     */
    async requestPermissions() {
        try {
            // Request basic video access to trigger permission prompt
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true,
                audio: false
            });
            
            // Stop immediately (we just needed the permission)
            stream.getTracks().forEach(track => track.stop());
            
            console.log('✅ Camera permissions granted');
            
            return { success: true };
            
        } catch (error) {
            console.error('❌ Permission denied:', error);
            
            let errorMessage = 'Camera access denied';
            let userAction = 'Please allow camera access in your browser settings';
            
            if (error.name === 'NotAllowedError') {
                errorMessage = 'Camera permission denied by user';
                userAction = 'Click the camera icon in the address bar and allow access';
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'No camera found on this device';
                userAction = 'Please connect a camera and refresh the page';
            } else if (error.name === 'NotReadableError') {
                errorMessage = 'Camera is already in use';
                userAction = 'Close other apps using the camera and try again';
            }
            
            return {
                success: false,
                error: errorMessage,
                userAction: userAction
            };
        }
    }

    /**
     * Analyze individual device capabilities
     */
    async analyzeDevice(device) {
        try {
            // Get stream to analyze capabilities
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: { exact: device.deviceId }
                }
            });
            
            const track = stream.getVideoTracks()[0];
            const capabilities = track.getCapabilities();
            const settings = track.getSettings();
            
            // Stop stream immediately
            stream.getTracks().forEach(t => t.stop());
            
            // Detect device type
            const deviceType = this.detectDeviceType(device.label, capabilities);
            
            // Get supported resolutions
            const resolutions = this.getSupportedResolutions(capabilities);
            
            // Find maximum resolution
            const maxResolution = this.findMaxResolution(resolutions);
            
            return {
                deviceId: device.deviceId,
                label: device.label || `Camera ${this.devices.length + 1}`,
                type: deviceType,
                capabilities: capabilities,
                resolutions: resolutions,
                maxResolution: maxResolution,
                supportsDepth: this.checkDepthSupport(capabilities, device.label),
                facingMode: settings.facingMode || capabilities.facingMode?.[0] || 'unknown',
                recommended: false // Will be set during auto-selection
            };
            
        } catch (error) {
            console.warn(`⚠️ Could not analyze device ${device.label}:`, error);
            
            return {
                deviceId: device.deviceId,
                label: device.label || 'Unknown Camera',
                type: 'standard',
                error: error.message,
                resolutions: [],
                maxResolution: null,
                supportsDepth: false,
                facingMode: 'unknown',
                recommended: false
            };
        }
    }

    /**
     * Detect device type (standard, depth, LiDAR, etc.)
     */
    detectDeviceType(label, capabilities) {
        const labelLower = label.toLowerCase();
        
        // Check for depth/LiDAR indicators
        if (labelLower.includes('depth') || labelLower.includes('lidar')) {
            return 'depth';
        }
        
        if (labelLower.includes('kinect') || labelLower.includes('realsense')) {
            return 'depth';
        }
        
        if (labelLower.includes('infrared') || labelLower.includes('ir')) {
            return 'infrared';
        }
        
        // Check for high-end cameras
        if (labelLower.includes('hd') || labelLower.includes('4k') || labelLower.includes('ultra')) {
            return 'high-quality';
        }
        
        return 'standard';
    }

    /**
     * Get supported resolutions from capabilities
     */
    getSupportedResolutions(capabilities) {
        const resolutions = [];
        
        // Common resolutions to test
        const standardResolutions = [
            { width: 7680, height: 4320, name: '8K UHD' },
            { width: 3840, height: 2160, name: '4K UHD' },
            { width: 2560, height: 1440, name: '2K QHD' },
            { width: 1920, height: 1080, name: '1080p FHD' },
            { width: 1280, height: 720, name: '720p HD' },
            { width: 640, height: 480, name: '480p VGA' },
            { width: 320, height: 240, name: '240p' }
        ];
        
        // Check if capabilities specify supported resolutions
        if (capabilities.width && capabilities.height) {
            const maxWidth = capabilities.width.max || 1920;
            const maxHeight = capabilities.height.max || 1080;
            
            // Filter resolutions that device can support
            standardResolutions.forEach(res => {
                if (res.width <= maxWidth && res.height <= maxHeight) {
                    resolutions.push({
                        ...res,
                        aspectRatio: (res.width / res.height).toFixed(2),
                        pixels: res.width * res.height
                    });
                }
            });
        }
        
        return resolutions;
    }

    /**
     * Find maximum supported resolution
     */
    findMaxResolution(resolutions) {
        if (resolutions.length === 0) {
            return { width: 1280, height: 720, name: '720p HD (default)' };
        }
        
        // Find resolution with most pixels
        return resolutions.reduce((max, current) => {
            return current.pixels > max.pixels ? current : max;
        });
    }

    /**
     * Check if device supports depth sensing
     */
    checkDepthSupport(capabilities, label) {
        const labelLower = label.toLowerCase();
        
        // Known depth camera patterns
        const depthKeywords = [
            'depth', 'lidar', 'kinect', 'realsense', 
            'orbbec', 'structure', 'zed', 'oak-d'
        ];
        
        return depthKeywords.some(keyword => labelLower.includes(keyword));
    }

    /**
     * Detect special capabilities (depth, multi-camera, etc.)
     */
    detectSpecialCapabilities() {
        this.capabilities.video = this.devices.length > 0;
        this.capabilities.depth = this.devices.some(d => d.supportsDepth);
        this.capabilities.multiCamera = this.devices.length > 1;
        
        // Check for infrared
        this.capabilities.infrared = this.devices.some(d => d.type === 'infrared');
        
        console.log('📊 Device capabilities:', this.capabilities);
    }

    /**
     * Auto-select best device
     */
    autoSelectBestDevice() {
        if (this.devices.length === 0) {
            console.warn('⚠️ No devices available for selection');
            return;
        }
        
        // Priority: depth camera > high-quality > standard
        let bestDevice = null;
        
        // First, look for depth cameras
        const depthCameras = this.devices.filter(d => d.supportsDepth);
        if (depthCameras.length > 0) {
            bestDevice = depthCameras[0];
            console.log('✅ Auto-selected depth camera:', bestDevice.label);
        }
        
        // Next, high-quality cameras
        if (!bestDevice) {
            const hqCameras = this.devices.filter(d => d.type === 'high-quality');
            if (hqCameras.length > 0) {
                bestDevice = hqCameras[0];
                console.log('✅ Auto-selected high-quality camera:', bestDevice.label);
            }
        }
        
        // Finally, any camera with max resolution
        if (!bestDevice) {
            bestDevice = this.devices.reduce((best, current) => {
                const bestPixels = best.maxResolution?.pixels || 0;
                const currentPixels = current.maxResolution?.pixels || 0;
                return currentPixels > bestPixels ? current : best;
            });
            console.log('✅ Auto-selected camera:', bestDevice.label);
        }
        
        bestDevice.recommended = true;
        this.selectedDevice = bestDevice;
        this.selectedResolution = bestDevice.maxResolution;
    }

    /**
     * Start camera stream with maximum resolution
     */
    async startCamera(deviceId = null, resolution = null) {
        try {
            // Use selected device if not specified
            const targetDevice = deviceId || this.selectedDevice?.deviceId;
            const targetResolution = resolution || this.selectedResolution;
            
            if (!targetDevice) {
                throw new Error('No camera device selected');
            }
            
            console.log(`🎥 Starting camera: ${this.selectedDevice?.label}`);
            console.log(`📐 Resolution: ${targetResolution?.name} (${targetResolution?.width}x${targetResolution?.height})`);
            
            // Build constraints
            const constraints = {
                video: {
                    deviceId: { exact: targetDevice },
                    width: { ideal: targetResolution?.width || 1920 },
                    height: { ideal: targetResolution?.height || 1080 },
                    frameRate: { ideal: 30, max: 60 }
                },
                audio: false
            };
            
            // Get stream
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // Verify actual resolution
            const track = this.stream.getVideoTracks()[0];
            const settings = track.getSettings();
            
            console.log(`✅ Camera started at ${settings.width}x${settings.height} @ ${settings.frameRate}fps`);
            
            return {
                success: true,
                stream: this.stream,
                actualResolution: {
                    width: settings.width,
                    height: settings.height,
                    frameRate: settings.frameRate
                }
            };
            
        } catch (error) {
            console.error('❌ Failed to start camera:', error);
            
            this.errors.push({
                type: 'camera_start',
                message: error.message,
                timestamp: Date.now()
            });
            
            return {
                success: false,
                error: error.message,
                errorType: this.getErrorType(error),
                userAction: this.getUserAction(error)
            };
        }
    }

    /**
     * Stop camera stream
     */
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            console.log('🛑 Camera stopped');
        }
    }

    /**
     * Select specific device
     */
    selectDevice(deviceId) {
        const device = this.devices.find(d => d.deviceId === deviceId);
        if (device) {
            this.selectedDevice = device;
            this.selectedResolution = device.maxResolution;
            console.log('📷 Device selected:', device.label);
            return true;
        }
        return false;
    }

    /**
     * Select specific resolution
     */
    selectResolution(width, height) {
        if (!this.selectedDevice) {
            console.warn('⚠️ No device selected');
            return false;
        }
        
        const resolution = this.selectedDevice.resolutions.find(
            r => r.width === width && r.height === height
        );
        
        if (resolution) {
            this.selectedResolution = resolution;
            console.log('📐 Resolution selected:', resolution.name);
            return true;
        }
        
        return false;
    }

    /**
     * Get error type for user-friendly messages
     */
    getErrorType(error) {
        if (error.name === 'NotAllowedError') return 'permission_denied';
        if (error.name === 'NotFoundError') return 'no_camera';
        if (error.name === 'NotReadableError') return 'camera_busy';
        if (error.name === 'OverconstrainedError') return 'resolution_not_supported';
        return 'unknown';
    }

    /**
     * Get user action for error
     */
    getUserAction(error) {
        const actions = {
            'permission_denied': 'Please allow camera access in browser settings',
            'no_camera': 'Connect a camera and refresh the page',
            'camera_busy': 'Close other apps using the camera',
            'resolution_not_supported': 'Try selecting a lower resolution'
        };
        
        return actions[this.getErrorType(error)] || 'Please check your camera settings and try again';
    }

    /**
     * Get device summary for UI
     */
    getDeviceSummary() {
        return {
            total: this.devices.length,
            hasDepth: this.capabilities.depth,
            hasMultiple: this.capabilities.multiCamera,
            selected: this.selectedDevice ? {
                label: this.selectedDevice.label,
                type: this.selectedDevice.type,
                resolution: this.selectedResolution?.name,
                width: this.selectedResolution?.width,
                height: this.selectedResolution?.height
            } : null
        };
    }

    /**
     * Check if browser supports required features
     */
    static checkBrowserSupport() {
        const support = {
            mediaDevices: !!navigator.mediaDevices,
            getUserMedia: !!navigator.mediaDevices?.getUserMedia,
            enumerateDevices: !!navigator.mediaDevices?.enumerateDevices,
            mediaRecorder: typeof MediaRecorder !== 'undefined',
            webGL: (() => {
                try {
                    const canvas = document.createElement('canvas');
                    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
                } catch (e) {
                    return false;
                }
            })()
        };
        
        const allSupported = Object.values(support).every(v => v);
        
        return {
            supported: allSupported,
            details: support,
            missingFeatures: Object.keys(support).filter(k => !support[k])
        };
    }
}

// Export
if (typeof window !== 'undefined') {
    window.CameraLidarDetector = CameraLidarDetector;
}
