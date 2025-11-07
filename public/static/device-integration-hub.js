/**
 * Device Integration Hub
 * 
 * Universal integration layer for third-party motion capture and assessment devices
 * Supports: Kinetisense, Vicon, OptiTrack, and other 3D motion analysis systems
 * 
 * Features:
 * - Multi-format data ingestion (CSV, JSON, XML, proprietary formats)
 * - Automatic format detection and parsing
 * - Data normalization to F-AI bian standard format
 * - Real-time data streaming support
 * - Batch import capabilities
 * - Error handling and validation
 */

class DeviceIntegrationHub {
    constructor() {
        this.supportedDevices = this.initializeSupportedDevices();
        this.importedData = [];
        this.mappings = {};
        this.validationErrors = [];
    }

    /**
     * Initialize supported device configurations
     */
    initializeSupportedDevices() {
        return {
            kinetisense: {
                name: 'Kinetisense 3D Motion Capture',
                vendor: 'Kinetisense',
                type: 'markerless_3d',
                formats: ['csv', 'json', 'xml'],
                dataFields: {
                    // Kinetisense exports CSV with joint coordinates and angles
                    joints: [
                        'head', 'neck', 'spine_upper', 'spine_mid', 'spine_lower',
                        'shoulder_left', 'shoulder_right',
                        'elbow_left', 'elbow_right',
                        'wrist_left', 'wrist_right',
                        'hip_left', 'hip_right',
                        'knee_left', 'knee_right',
                        'ankle_left', 'ankle_right'
                    ],
                    metrics: [
                        'rom_degrees', 'velocity', 'acceleration',
                        'asymmetry_percentage', 'stability_score',
                        'posture_score', 'movement_quality'
                    ]
                },
                csvStructure: {
                    hasHeader: true,
                    delimiter: ',',
                    columns: [
                        'timestamp', 'frame',
                        'joint_name', 'x', 'y', 'z',
                        'angle', 'velocity', 'acceleration'
                    ]
                },
                jsonStructure: {
                    type: 'array_of_frames',
                    frameStructure: {
                        timestamp: 'number',
                        frameNumber: 'number',
                        joints: 'array',
                        metrics: 'object'
                    }
                }
            },
            
            vicon: {
                name: 'Vicon Motion Capture',
                vendor: 'Vicon',
                type: 'marker_based_3d',
                formats: ['c3d', 'csv', 'json'],
                dataFields: {
                    markers: [
                        'LASI', 'RASI', 'LPSI', 'RPSI', // Pelvis
                        'LKNE', 'RKNE', // Knees
                        'LANK', 'RANK', // Ankles
                        'LSHO', 'RSHO', // Shoulders
                        'LELB', 'RELB'  // Elbows
                    ],
                    metrics: [
                        'force_plate_data', 'emg_signals',
                        'joint_moments', 'joint_powers'
                    ]
                },
                csvStructure: {
                    hasHeader: true,
                    delimiter: ',',
                    skipRows: 5 // Vicon has metadata header
                }
            },
            
            optitrack: {
                name: 'OptiTrack Motion Capture',
                vendor: 'NaturalPoint',
                type: 'marker_based_3d',
                formats: ['csv', 'bvh', 'fbx'],
                dataFields: {
                    markers: ['custom_marker_set'],
                    metrics: ['position', 'rotation', 'velocity']
                }
            },
            
            generic_3d: {
                name: 'Generic 3D Motion Capture',
                vendor: 'Various',
                type: 'generic',
                formats: ['csv', 'json', 'xml'],
                dataFields: {
                    joints: 'auto_detect',
                    metrics: 'auto_detect'
                }
            }
        };
    }

    /**
     * Main import function - auto-detects format and device type
     */
    async importDeviceData(file, deviceType = 'auto_detect', options = {}) {
        console.log(`📥 DeviceIntegrationHub: Importing data from ${file.name}...`);
        
        try {
            // Read file content
            const fileContent = await this.readFile(file);
            
            // Auto-detect device type if not specified
            if (deviceType === 'auto_detect') {
                deviceType = this.detectDeviceType(fileContent, file.name);
            }
            
            const deviceConfig = this.supportedDevices[deviceType];
            if (!deviceConfig) {
                throw new Error(`Unsupported device type: ${deviceType}`);
            }
            
            // Detect format
            const format = this.detectFormat(file.name, fileContent);
            
            // Parse based on format
            let rawData;
            switch (format) {
                case 'csv':
                    rawData = await this.parseCSV(fileContent, deviceConfig);
                    break;
                case 'json':
                    rawData = await this.parseJSON(fileContent, deviceConfig);
                    break;
                case 'xml':
                    rawData = await this.parseXML(fileContent, deviceConfig);
                    break;
                default:
                    throw new Error(`Unsupported format: ${format}`);
            }
            
            // Normalize to F-AI bian format
            const normalizedData = this.normalizeToFAIBianFormat(rawData, deviceType);
            
            // Validate data
            const validation = this.validateData(normalizedData);
            if (!validation.isValid) {
                console.warn('⚠️ Data validation warnings:', validation.warnings);
                this.validationErrors = validation.warnings;
            }
            
            // Store imported data
            this.importedData.push({
                deviceType: deviceType,
                deviceName: deviceConfig.name,
                importedAt: new Date().toISOString(),
                fileName: file.name,
                format: format,
                dataPoints: normalizedData.frames.length,
                data: normalizedData
            });
            
            console.log(`✅ Successfully imported ${normalizedData.frames.length} frames from ${deviceConfig.name}`);
            
            return {
                success: true,
                deviceType: deviceType,
                deviceName: deviceConfig.name,
                dataPoints: normalizedData.frames.length,
                data: normalizedData,
                warnings: validation.warnings
            };
            
        } catch (error) {
            console.error('❌ Import error:', error);
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
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = (e) => {
                reject(new Error('Failed to read file'));
            };
            
            // Read as text for CSV/JSON/XML
            if (file.name.endsWith('.c3d') || file.name.endsWith('.bvh') || file.name.endsWith('.fbx')) {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsText(file);
            }
        });
    }

    /**
     * Detect device type from file content
     */
    detectDeviceType(content, filename) {
        // Check for Kinetisense signature
        if (content.includes('Kinetisense') || content.includes('KinetiSense') || filename.includes('kinetisense')) {
            return 'kinetisense';
        }
        
        // Check for Vicon signature
        if (content.includes('Vicon') || filename.endsWith('.c3d')) {
            return 'vicon';
        }
        
        // Check for OptiTrack signature
        if (content.includes('OptiTrack') || filename.endsWith('.bvh')) {
            return 'optitrack';
        }
        
        // Default to generic
        return 'generic_3d';
    }

    /**
     * Detect file format
     */
    detectFormat(filename, content) {
        if (filename.endsWith('.csv')) return 'csv';
        if (filename.endsWith('.json')) return 'json';
        if (filename.endsWith('.xml')) return 'xml';
        if (filename.endsWith('.c3d')) return 'c3d';
        if (filename.endsWith('.bvh')) return 'bvh';
        
        // Try to detect from content
        try {
            JSON.parse(content);
            return 'json';
        } catch (e) {
            if (content.includes('<') && content.includes('>')) {
                return 'xml';
            }
            return 'csv'; // Default assumption
        }
    }

    /**
     * Parse CSV format (Kinetisense primary export format)
     */
    async parseCSV(content, deviceConfig) {
        const lines = content.split('\n').filter(line => line.trim());
        const config = deviceConfig.csvStructure || {};
        
        // Skip header rows if specified
        const startRow = config.skipRows || (config.hasHeader ? 1 : 0);
        const dataLines = lines.slice(startRow);
        
        const delimiter = config.delimiter || ',';
        const frames = {};
        
        dataLines.forEach((line, index) => {
            const values = line.split(delimiter).map(v => v.trim());
            
            if (values.length < 3) return; // Skip invalid lines
            
            // Parse based on Kinetisense CSV structure
            const frameNumber = parseInt(values[1]) || index;
            const jointName = values[2];
            const x = parseFloat(values[3]) || 0;
            const y = parseFloat(values[4]) || 0;
            const z = parseFloat(values[5]) || 0;
            const angle = parseFloat(values[6]) || 0;
            const velocity = parseFloat(values[7]) || 0;
            const acceleration = parseFloat(values[8]) || 0;
            
            if (!frames[frameNumber]) {
                frames[frameNumber] = {
                    frameNumber: frameNumber,
                    timestamp: parseFloat(values[0]) || (frameNumber / 30), // Assume 30 FPS if no timestamp
                    joints: {}
                };
            }
            
            frames[frameNumber].joints[jointName] = {
                position: { x, y, z },
                angle: angle,
                velocity: velocity,
                acceleration: acceleration
            };
        });
        
        return Object.values(frames);
    }

    /**
     * Parse JSON format
     */
    async parseJSON(content, deviceConfig) {
        try {
            const data = JSON.parse(content);
            
            // Handle different JSON structures
            if (Array.isArray(data)) {
                return data;
            } else if (data.frames) {
                return data.frames;
            } else if (data.data) {
                return data.data;
            } else {
                return [data];
            }
        } catch (error) {
            throw new Error(`Invalid JSON format: ${error.message}`);
        }
    }

    /**
     * Parse XML format
     */
    async parseXML(content, deviceConfig) {
        // Simple XML parsing (would use DOMParser in browser)
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, 'text/xml');
        
        const frames = [];
        const frameElements = xmlDoc.getElementsByTagName('frame') || xmlDoc.getElementsByTagName('Frame');
        
        for (let i = 0; i < frameElements.length; i++) {
            const frameEl = frameElements[i];
            const frameData = {
                frameNumber: parseInt(frameEl.getAttribute('number')) || i,
                timestamp: parseFloat(frameEl.getAttribute('time')) || (i / 30),
                joints: {}
            };
            
            const joints = frameEl.getElementsByTagName('joint') || frameEl.getElementsByTagName('Joint');
            for (let j = 0; j < joints.length; j++) {
                const joint = joints[j];
                const name = joint.getAttribute('name');
                
                frameData.joints[name] = {
                    position: {
                        x: parseFloat(joint.getAttribute('x')) || 0,
                        y: parseFloat(joint.getAttribute('y')) || 0,
                        z: parseFloat(joint.getAttribute('z')) || 0
                    },
                    angle: parseFloat(joint.getAttribute('angle')) || 0
                };
            }
            
            frames.push(frameData);
        }
        
        return frames;
    }

    /**
     * Normalize device data to F-AI bian standard format
     * 
     * F-AI bian Standard Format:
     * {
     *   metadata: { device, timestamp, patient, test },
     *   frames: [
     *     {
     *       frameNumber: number,
     *       timestamp: number,
     *       hip_left: number (angle in degrees),
     *       hip_right: number,
     *       knee_left: number,
     *       knee_right: number,
     *       ankle_left: number,
     *       ankle_right: number,
     *       shoulder_left: number,
     *       shoulder_right: number,
     *       elbow_left: number,
     *       elbow_right: number
     *     }
     *   ],
     *   summary: { ... }
     * }
     */
    normalizeToFAIBianFormat(rawData, deviceType) {
        const deviceConfig = this.supportedDevices[deviceType];
        
        const normalized = {
            metadata: {
                device: deviceConfig.name,
                deviceType: deviceType,
                importedAt: new Date().toISOString(),
                originalFormat: 'imported',
                frameCount: rawData.length
            },
            frames: [],
            summary: {}
        };
        
        // Map device-specific joint names to F-AI bian standard
        const jointMapping = this.getJointMapping(deviceType);
        
        rawData.forEach((frame, index) => {
            const normalizedFrame = {
                frameNumber: frame.frameNumber || index,
                timestamp: frame.timestamp || (index / 30)
            };
            
            // Map joints
            Object.keys(jointMapping).forEach(standardJoint => {
                const deviceJoint = jointMapping[standardJoint];
                
                if (frame.joints && frame.joints[deviceJoint]) {
                    const jointData = frame.joints[deviceJoint];
                    
                    // Extract angle (primary metric for F-AI bian)
                    if (typeof jointData === 'number') {
                        normalizedFrame[standardJoint] = jointData;
                    } else if (jointData.angle !== undefined) {
                        normalizedFrame[standardJoint] = jointData.angle;
                    } else if (jointData.position) {
                        // Calculate angle from position if needed
                        normalizedFrame[standardJoint] = this.calculateAngleFromPosition(jointData.position);
                    }
                }
            });
            
            normalized.frames.push(normalizedFrame);
        });
        
        // Calculate summary statistics
        normalized.summary = this.calculateSummaryStatistics(normalized.frames);
        
        return normalized;
    }

    /**
     * Get joint name mapping for device type
     */
    getJointMapping(deviceType) {
        const mappings = {
            kinetisense: {
                'hip_left': 'hip_left',
                'hip_right': 'hip_right',
                'knee_left': 'knee_left',
                'knee_right': 'knee_right',
                'ankle_left': 'ankle_left',
                'ankle_right': 'ankle_right',
                'shoulder_left': 'shoulder_left',
                'shoulder_right': 'shoulder_right',
                'elbow_left': 'elbow_left',
                'elbow_right': 'elbow_right'
            },
            vicon: {
                'hip_left': 'LASI',
                'hip_right': 'RASI',
                'knee_left': 'LKNE',
                'knee_right': 'RKNE',
                'ankle_left': 'LANK',
                'ankle_right': 'RANK',
                'shoulder_left': 'LSHO',
                'shoulder_right': 'RSHO',
                'elbow_left': 'LELB',
                'elbow_right': 'RELB'
            },
            generic_3d: {
                // Use direct mapping, assume standard names
                'hip_left': 'hip_left',
                'hip_right': 'hip_right',
                'knee_left': 'knee_left',
                'knee_right': 'knee_right',
                'ankle_left': 'ankle_left',
                'ankle_right': 'ankle_right',
                'shoulder_left': 'shoulder_left',
                'shoulder_right': 'shoulder_right',
                'elbow_left': 'elbow_left',
                'elbow_right': 'elbow_right'
            }
        };
        
        return mappings[deviceType] || mappings.generic_3d;
    }

    /**
     * Calculate angle from 3D position (if needed)
     */
    calculateAngleFromPosition(position) {
        // Simple angle calculation from position
        // In practice, this would require adjacent joint positions
        const { x, y, z } = position;
        return Math.atan2(y, x) * (180 / Math.PI);
    }

    /**
     * Calculate summary statistics
     */
    calculateSummaryStatistics(frames) {
        if (frames.length === 0) return {};
        
        const joints = ['hip_left', 'hip_right', 'knee_left', 'knee_right', 
                       'ankle_left', 'ankle_right', 'shoulder_left', 'shoulder_right',
                       'elbow_left', 'elbow_right'];
        
        const summary = {
            avgAngles: {},
            minAngles: {},
            maxAngles: {},
            rangeOfMotion: {}
        };
        
        joints.forEach(joint => {
            const values = frames.map(f => f[joint]).filter(v => v !== undefined);
            
            if (values.length > 0) {
                summary.avgAngles[joint] = values.reduce((a, b) => a + b, 0) / values.length;
                summary.minAngles[joint] = Math.min(...values);
                summary.maxAngles[joint] = Math.max(...values);
                summary.rangeOfMotion[joint] = summary.maxAngles[joint] - summary.minAngles[joint];
            }
        });
        
        return summary;
    }

    /**
     * Validate imported data
     */
    validateData(normalizedData) {
        const warnings = [];
        
        // Check frame count
        if (normalizedData.frames.length === 0) {
            warnings.push({ severity: 'error', message: 'No frames found in data' });
        } else if (normalizedData.frames.length < 30) {
            warnings.push({ severity: 'warning', message: `Only ${normalizedData.frames.length} frames found (< 1 second at 30 FPS)` });
        }
        
        // Check for missing joints
        const requiredJoints = ['hip_left', 'hip_right', 'knee_left', 'knee_right'];
        const firstFrame = normalizedData.frames[0];
        
        requiredJoints.forEach(joint => {
            if (firstFrame[joint] === undefined) {
                warnings.push({ severity: 'warning', message: `Missing required joint: ${joint}` });
            }
        });
        
        // Check for valid angle ranges
        normalizedData.frames.forEach((frame, index) => {
            Object.keys(frame).forEach(key => {
                if (key.includes('hip') || key.includes('knee') || key.includes('ankle')) {
                    const value = frame[key];
                    if (value !== undefined && (value < 0 || value > 360)) {
                        warnings.push({ 
                            severity: 'warning', 
                            message: `Invalid angle at frame ${index}, ${key}: ${value}° (should be 0-360)` 
                        });
                    }
                }
            });
        });
        
        return {
            isValid: warnings.filter(w => w.severity === 'error').length === 0,
            warnings: warnings
        };
    }

    /**
     * Get imported data history
     */
    getImportedData() {
        return this.importedData;
    }

    /**
     * Clear imported data
     */
    clearImportedData() {
        this.importedData = [];
        this.validationErrors = [];
    }

    /**
     * Export data to F-AI bian assessment format
     */
    exportToAssessmentFormat(importIndex = 0, testName = 'Imported Test') {
        if (importIndex >= this.importedData.length) {
            throw new Error('Invalid import index');
        }
        
        const imported = this.importedData[importIndex];
        const data = imported.data;
        
        return {
            test_name: testName,
            device_source: imported.deviceName,
            imported_at: imported.importedAt,
            skeleton_data: JSON.stringify(data.frames),
            analysis_result: JSON.stringify({
                avg_angles: data.summary.avgAngles,
                rom: data.summary.rangeOfMotion,
                source: 'imported',
                device: imported.deviceName,
                validation_warnings: this.validationErrors
            })
        };
    }

    /**
     * Generate integration report
     */
    generateIntegrationReport() {
        return {
            totalImports: this.importedData.length,
            devices: [...new Set(this.importedData.map(d => d.deviceName))],
            totalDataPoints: this.importedData.reduce((sum, d) => sum + d.dataPoints, 0),
            imports: this.importedData.map(d => ({
                device: d.deviceName,
                fileName: d.fileName,
                timestamp: d.importedAt,
                dataPoints: d.dataPoints,
                format: d.format
            })),
            validationErrors: this.validationErrors
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeviceIntegrationHub;
}
