/**
 * Device Data Parser Module
 * Handles parsing and normalizing data from various 3D motion capture systems
 * Supports: Kinetisense, Vicon, OptiTrack, Generic 3D systems
 */

class DeviceDataParser {
    constructor() {
        this.supportedDevices = {
            'kinetisense': {
                name: 'Kinetisense 3D',
                formats: ['csv', 'json', 'xml'],
                parser: this.parseKinetisense.bind(this)
            },
            'vicon': {
                name: 'Vicon Motion Capture',
                formats: ['c3d', 'csv', 'json'],
                parser: this.parseVicon.bind(this)
            },
            'optitrack': {
                name: 'OptiTrack',
                formats: ['bvh', 'csv', 'fbx'],
                parser: this.parseOptiTrack.bind(this)
            },
            'generic_3d': {
                name: 'Generic 3D System',
                formats: ['csv', 'json'],
                parser: this.parseGeneric3D.bind(this)
            }
        };

        // Standard joint mapping
        this.standardJoints = [
            'head', 'neck', 'spine_upper', 'spine_mid', 'spine_lower',
            'shoulder_left', 'shoulder_right',
            'elbow_left', 'elbow_right',
            'wrist_left', 'wrist_right',
            'hip_left', 'hip_right',
            'knee_left', 'knee_right',
            'ankle_left', 'ankle_right'
        ];
    }

    /**
     * Auto-detect device type from file content
     */
    async autoDetectDevice(fileContent, fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        
        // Try to detect from content patterns
        if (extension === 'json') {
            const data = JSON.parse(fileContent);
            
            // Kinetisense pattern
            if (data.device && data.device.toLowerCase().includes('kinetisense')) {
                return 'kinetisense';
            }
            
            // Vicon pattern
            if (data.vicon || data.system === 'vicon') {
                return 'vicon';
            }
            
            // Generic 3D with standard structure
            if (data.frames && data.joints) {
                return 'generic_3d';
            }
        }
        
        // CSV detection
        if (extension === 'csv') {
            const firstLine = fileContent.split('\n')[0].toLowerCase();
            
            if (firstLine.includes('kinetisense')) return 'kinetisense';
            if (firstLine.includes('vicon')) return 'vicon';
            if (firstLine.includes('optitrack')) return 'optitrack';
        }
        
        // Default to generic 3D
        return 'generic_3d';
    }

    /**
     * Parse file based on device type
     */
    async parseFile(file, deviceType = 'auto_detect') {
        try {
            const fileContent = await this.readFile(file);
            
            // Auto-detect if needed
            if (deviceType === 'auto_detect') {
                deviceType = await this.autoDetectDevice(fileContent, file.name);
            }
            
            const device = this.supportedDevices[deviceType];
            if (!device) {
                throw new Error(`Unsupported device type: ${deviceType}`);
            }
            
            // Parse with device-specific parser
            const parsedData = await device.parser(fileContent, file.name);
            
            // Normalize to standard format
            const normalized = this.normalizeData(parsedData, deviceType);
            
            // Validate data
            const validation = this.validateData(normalized);
            
            return {
                success: true,
                deviceType,
                deviceName: device.name,
                data: normalized,
                validation,
                dataPoints: normalized.frames.length,
                warnings: validation.warnings
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Read file content
     */
    async readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    /**
     * Parse Kinetisense data
     * Expected format: JSON with frames array containing joint positions and angles
     */
    async parseKinetisense(content, fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        
        if (extension === 'json') {
            const data = JSON.parse(content);
            
            // Kinetisense JSON format
            return {
                metadata: {
                    device: 'kinetisense',
                    subject: data.subject || 'Unknown',
                    date: data.timestamp || new Date().toISOString(),
                    assessmentType: data.assessmentType || 'movement_screen'
                },
                frames: data.frames || data.data || []
            };
        } else if (extension === 'csv') {
            return this.parseCSV(content, 'kinetisense');
        }
        
        throw new Error('Unsupported Kinetisense file format');
    }

    /**
     * Parse Vicon data
     */
    async parseVicon(content, fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        
        if (extension === 'json') {
            const data = JSON.parse(content);
            
            return {
                metadata: {
                    device: 'vicon',
                    subject: data.SubjectName || 'Unknown',
                    date: data.Date || new Date().toISOString(),
                    frameRate: data.FrameRate || 120
                },
                frames: data.Frames || []
            };
        } else if (extension === 'csv') {
            return this.parseCSV(content, 'vicon');
        }
        
        throw new Error('Unsupported Vicon file format');
    }

    /**
     * Parse OptiTrack data
     */
    async parseOptiTrack(content, fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        
        if (extension === 'csv') {
            return this.parseCSV(content, 'optitrack');
        }
        
        throw new Error('Unsupported OptiTrack file format');
    }

    /**
     * Parse Generic 3D data
     */
    async parseGeneric3D(content, fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        
        if (extension === 'json') {
            const data = JSON.parse(content);
            
            return {
                metadata: {
                    device: 'generic_3d',
                    subject: data.subject || data.patient || 'Unknown',
                    date: data.date || data.timestamp || new Date().toISOString()
                },
                frames: data.frames || data.data || []
            };
        } else if (extension === 'csv') {
            return this.parseCSV(content, 'generic_3d');
        }
        
        throw new Error('Unsupported Generic 3D file format');
    }

    /**
     * Generic CSV parser
     */
    parseCSV(content, deviceType) {
        const lines = content.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const frames = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const frame = {};
            
            headers.forEach((header, index) => {
                const value = values[index];
                // Try to parse as number
                frame[header] = !isNaN(value) ? parseFloat(value) : value;
            });
            
            frames.push(frame);
        }
        
        return {
            metadata: {
                device: deviceType,
                subject: 'CSV Import',
                date: new Date().toISOString()
            },
            frames
        };
    }

    /**
     * Normalize data to standard format
     */
    normalizeData(parsedData, deviceType) {
        const { metadata, frames } = parsedData;
        
        const normalized = {
            metadata: {
                device: deviceType,
                subject: metadata.subject,
                date: metadata.date,
                frameCount: frames.length,
                frameRate: metadata.frameRate || 30
            },
            frames: [],
            summary: {}
        };
        
        // Normalize each frame
        frames.forEach((frame, index) => {
            const normalizedFrame = {
                frameNumber: index,
                timestamp: (index / normalized.metadata.frameRate) * 1000, // ms
                joints: this.normalizeJoints(frame, deviceType),
                angles: this.extractAngles(frame, deviceType)
            };
            
            normalized.frames.push(normalizedFrame);
        });
        
        // Calculate summary statistics
        normalized.summary = this.calculateSummary(normalized.frames);
        
        return normalized;
    }

    /**
     * Normalize joint data to standard format
     */
    normalizeJoints(frame, deviceType) {
        const joints = {};
        
        // Device-specific joint mapping
        const jointMappings = {
            'kinetisense': {
                'Head': 'head',
                'Neck': 'neck',
                'Spine': 'spine_mid',
                'ShoulderLeft': 'shoulder_left',
                'ShoulderRight': 'shoulder_right',
                'HipLeft': 'hip_left',
                'HipRight': 'hip_right',
                'KneeLeft': 'knee_left',
                'KneeRight': 'knee_right',
                'AnkleLeft': 'ankle_left',
                'AnkleRight': 'ankle_right'
            },
            'vicon': {
                'LFHD': 'head',
                'C7': 'neck',
                'LSHO': 'shoulder_left',
                'RSHO': 'shoulder_right',
                'LASI': 'hip_left',
                'RASI': 'hip_right',
                'LKNE': 'knee_left',
                'RKNE': 'knee_right',
                'LANK': 'ankle_left',
                'RANK': 'ankle_right'
            }
        };
        
        const mapping = jointMappings[deviceType] || {};
        
        // Map joints
        for (const [originalName, standardName] of Object.entries(mapping)) {
            if (frame[originalName]) {
                joints[standardName] = frame[originalName];
            }
        }
        
        // If no mapping found, use frame data as-is
        if (Object.keys(joints).length === 0) {
            return frame;
        }
        
        return joints;
    }

    /**
     * Extract angles from frame data
     */
    extractAngles(frame, deviceType) {
        const angles = {};
        
        // Common angle fields across devices
        const angleFields = [
            'hip_flexion_left', 'hip_flexion_right',
            'hip_abduction_left', 'hip_abduction_right',
            'knee_flexion_left', 'knee_flexion_right',
            'ankle_dorsiflexion_left', 'ankle_dorsiflexion_right',
            'lumbar_flexion', 'lumbar_extension',
            'shoulder_flexion_left', 'shoulder_flexion_right'
        ];
        
        angleFields.forEach(field => {
            if (frame[field] !== undefined) {
                angles[field] = parseFloat(frame[field]);
            }
        });
        
        return angles;
    }

    /**
     * Calculate summary statistics
     */
    calculateSummary(frames) {
        if (frames.length === 0) return {};
        
        const summary = {
            avgAngles: {},
            minAngles: {},
            maxAngles: {},
            rangeOfMotion: {}
        };
        
        // Collect all angle keys
        const angleKeys = new Set();
        frames.forEach(frame => {
            Object.keys(frame.angles || {}).forEach(key => angleKeys.add(key));
        });
        
        // Calculate statistics for each angle
        angleKeys.forEach(angleKey => {
            const values = frames
                .map(f => f.angles[angleKey])
                .filter(v => v !== undefined && !isNaN(v));
            
            if (values.length > 0) {
                summary.avgAngles[angleKey] = values.reduce((a, b) => a + b, 0) / values.length;
                summary.minAngles[angleKey] = Math.min(...values);
                summary.maxAngles[angleKey] = Math.max(...values);
                summary.rangeOfMotion[angleKey] = summary.maxAngles[angleKey] - summary.minAngles[angleKey];
            }
        });
        
        return summary;
    }

    /**
     * Validate normalized data
     */
    validateData(data) {
        const warnings = [];
        const errors = [];
        
        // Check frame count
        if (data.frames.length === 0) {
            errors.push({ severity: 'error', message: 'No frames found in data' });
        } else if (data.frames.length < 10) {
            warnings.push({ severity: 'warning', message: `Low frame count: ${data.frames.length} frames` });
        }
        
        // Check for missing angles
        const firstFrame = data.frames[0];
        const angleCount = Object.keys(firstFrame.angles || {}).length;
        
        if (angleCount === 0) {
            warnings.push({ severity: 'warning', message: 'No joint angles detected in data' });
        }
        
        // Check data quality
        const avgAngleCount = data.frames.reduce((sum, f) => sum + Object.keys(f.angles || {}).length, 0) / data.frames.length;
        
        if (avgAngleCount < angleCount * 0.8) {
            warnings.push({ severity: 'warning', message: 'Inconsistent data - some frames missing joint angles' });
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            quality: this.calculateDataQuality(data)
        };
    }

    /**
     * Calculate data quality score (0-100)
     */
    calculateDataQuality(data) {
        let score = 100;
        
        // Penalize low frame count
        if (data.frames.length < 30) score -= 20;
        else if (data.frames.length < 60) score -= 10;
        
        // Penalize missing angles
        const avgAngleCount = data.frames.reduce((sum, f) => sum + Object.keys(f.angles || {}).length, 0) / data.frames.length;
        if (avgAngleCount < 5) score -= 30;
        else if (avgAngleCount < 10) score -= 15;
        
        // Penalize inconsistent data
        const angleCountVariance = this.calculateVariance(data.frames.map(f => Object.keys(f.angles || {}).length));
        if (angleCountVariance > 5) score -= 15;
        
        return Math.max(0, score);
    }

    /**
     * Calculate variance
     */
    calculateVariance(values) {
        if (values.length === 0) return 0;
        
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
        return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length);
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.DeviceDataParser = DeviceDataParser;
}
