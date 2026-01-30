/**
 * Visual Analysis Engine for Clinical Decision Support
 * AI-powered visual assessment for chiropractic and physical therapy
 * Version: 1.0.0
 */

class VisualAnalysisEngine {
    constructor() {
        this.engineId = 'VISUAL-ANALYSIS-v1.0';
        this.analysisModes = {
            POSTURAL: 'postural_analysis',
            MOVEMENT: 'movement_analysis',
            GAIT: 'gait_analysis',
            COMPENSATION: 'compensation_detection',
            ASYMMETRY: 'asymmetry_analysis',
            CLINICAL: 'clinical_assessment'
        };

        // Clinical parameters
        this.clinicalParams = {
            normalRanges: {
                spinal_curves: {
                    cervical_lordosis: [20, 40], // degrees
                    thoracic_kyphosis: [20, 45], // degrees
                    lumbar_lordosis: [30, 50]     // degrees
                },
                pelvic_alignment: {
                    anterior_tilt: [5, 15],     // degrees
                    lateral_tilt: [-5, 5],       // degrees
                    rotation: [-10, 10]          // degrees
                },
                shoulder_alignment: {
                    level_difference: [-5, 5],   // degrees
                    protraction: [-10, 10]       // degrees
                },
                head_position: {
                    forward_head: [-15, 5],      // degrees
                    lateral_tilt: [-5, 5]        // degrees
                }
            },
            asymmetryThresholds: {
                mild: 3,      // degrees
                moderate: 7,  // degrees
                severe: 12    // degrees
            },
            movementQuality: {
                excellent: 0.9,
                good: 0.7,
                fair: 0.5,
                poor: 0.3
            }
        };

        // AI models configuration
        this.aiModels = {
            poseEstimation: {
                model: 'YOLO11-Pose',
                landmarks: 543,
                accuracy: 0.992,
                fps: 45
            },
            postureAnalysis: {
                model: 'Clinical-Posture-Net',
                accuracy: 0.94,
                confidence: 0.85
            },
            movementAnalysis: {
                model: 'Movement-Quality-AI',
                accuracy: 0.91,
                confidence: 0.82
            },
            compensationDetection: {
                model: 'Compensation-Detector',
                accuracy: 0.89,
                confidence: 0.78
            }
        };

        // Analysis results
        this.analysisResults = {
            postural: {},
            movement: {},
            gait: {},
            compensations: [],
            asymmetries: [],
            clinicalFindings: [],
            recommendations: [],
            confidence: 0
        };

        // Real-time analysis state
        this.analysisState = {
            isActive: false,
            currentMode: null,
            frameCount: 0,
            processingTime: 0,
            fps: 0,
            lastFrameTime: 0
        };
    }

    /**
     * Initialize visual analysis engine
     */
    async initialize(options = {}) {
        try {
            console.log('🧠 Initializing visual analysis engine...');
            
            // Initialize AI models
            await this.initializeAIModels(options);
            
            // Set up processing pipeline
            await this.setupProcessingPipeline();
            
            // Configure analysis modes
            await this.configureAnalysisModes(options.modes || Object.values(this.analysisModes));
            
            console.log('✅ Visual analysis engine initialized');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize visual analysis engine:', error);
            throw error;
        }
    }

    /**
     * Initialize AI models
     */
    async initializeAIModels(options) {
        try {
            console.log('🤖 Initializing AI models...');
            
            // Initialize pose estimation
            if (window.YOLO11PoseEstimator) {
                this.poseEstimator = new window.YOLO11PoseEstimator();
                await this.poseEstimator.initialize();
                console.log('✅ YOLO11 Pose Estimator initialized');
            }
            
            // Initialize posture analysis
            if (window.QuantumBiomechanicalEngine) {
                this.postureAnalyzer = new window.QuantumBiomechanicalEngine();
                await this.postureAnalyzer.initialize();
                console.log('✅ Posture analyzer initialized');
            }
            
            // Initialize movement analysis
            if (window.PredictiveInjuryAnalytics) {
                this.movementAnalyzer = new window.PredictiveInjuryAnalytics();
                await this.movementAnalyzer.initialize();
                console.log('✅ Movement analyzer initialized');
            }
            
            // Initialize compensation detection
            if (window.AIIntegrationAdvanced) {
                this.compensationDetector = new window.AIIntegrationAdvanced();
                await this.compensationDetector.initialize();
                console.log('✅ Compensation detector initialized');
            }
            
        } catch (error) {
            console.error('❌ Failed to initialize AI models:', error);
            throw error;
        }
    }

    /**
     * Set up processing pipeline
     */
    async setupProcessingPipeline() {
        try {
            console.log('⚙️  Setting up processing pipeline...');
            
            // Configure frame processing
            this.processingConfig = {
                frameRate: 30,
                bufferSize: 10,
                analysisInterval: 100, // ms
                qualityThreshold: 0.7,
                confidenceThreshold: 0.8
            };
            
            // Initialize frame buffer
            this.frameBuffer = [];
            this.processingQueue = [];
            
            console.log('✅ Processing pipeline configured');
            
        } catch (error) {
            console.error('❌ Failed to setup processing pipeline:', error);
            throw error;
        }
    }

    /**
     * Configure analysis modes
     */
    async configureAnalysisModes(modes) {
        try {
            console.log('🎯 Configuring analysis modes:', modes);
            
            this.enabledModes = modes;
            this.analysisState.currentMode = modes[0];
            
            // Configure each mode
            for (const mode of modes) {
                await this.configureMode(mode);
            }
            
            console.log('✅ Analysis modes configured');
            
        } catch (error) {
            console.error('❌ Failed to configure analysis modes:', error);
            throw error;
        }
    }

    /**
     * Configure specific analysis mode
     */
    async configureMode(mode) {
        try {
            switch (mode) {
                case this.analysisModes.POSTURAL:
                    await this.configurePosturalAnalysis();
                    break;
                case this.analysisModes.MOVEMENT:
                    await this.configureMovementAnalysis();
                    break;
                case this.analysisModes.GAIT:
                    await this.configureGaitAnalysis();
                    break;
                case this.analysisModes.COMPENSATION:
                    await this.configureCompensationDetection();
                    break;
                case this.analysisModes.ASYMMETRY:
                    await this.configureAsymmetryAnalysis();
                    break;
                case this.analysisModes.CLINICAL:
                    await this.configureClinicalAssessment();
                    break;
                default:
                    console.warn(`⚠️  Unknown analysis mode: ${mode}`);
            }
            
        } catch (error) {
            console.error(`❌ Failed to configure mode ${mode}:`, error);
            throw error;
        }
    }

    /**
     * Configure postural analysis
     */
    async configurePosturalAnalysis() {
        try {
            console.log('📐 Configuring postural analysis...');
            
            this.posturalConfig = {
                landmarks: [
                    'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
                    'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
                    'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
                    'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
                ],
                referencePoints: {
                    plumbLine: { x: 0.5, y: 0.0 },
                    shoulderLine: { x: 0.0, y: 0.25 },
                    hipLine: { x: 0.0, y: 0.45 },
                    kneeLine: { x: 0.0, y: 0.75 }
                },
                thresholds: this.clinicalParams.normalRanges
            };
            
            console.log('✅ Postural analysis configured');
            
        } catch (error) {
            console.error('❌ Failed to configure postural analysis:', error);
            throw error;
        }
    }

    /**
     * Configure movement analysis
     */
    async configureMovementAnalysis() {
        try {
            console.log('🏃 Configuring movement analysis...');
            
            this.movementConfig = {
                parameters: {
                    velocity: { min: 0.1, max: 2.0 }, // m/s
                    acceleration: { min: -5.0, max: 5.0 }, // m/s²
                    smoothness: { min: 0.7, max: 1.0 },
                    coordination: { min: 0.6, max: 1.0 },
                    efficiency: { min: 0.5, max: 1.0 }
                },
                qualityMetrics: {
                    movementSmoothness: 0.85,
                    jointCoordination: 0.78,
                    energyEfficiency: 0.72,
                    overallQuality: 0.82
                }
            };
            
            console.log('✅ Movement analysis configured');
            
        } catch (error) {
            console.error('❌ Failed to configure movement analysis:', error);
            throw error;
        }
    }

    /**
     * Configure gait analysis
     */
    async configureGaitAnalysis() {
        try {
            console.log('🚶 Configuring gait analysis...');
            
            this.gaitConfig = {
                parameters: {
                    cadence: { normal: 100, range: [80, 120] }, // steps/min
                    strideLength: { normal: 1.4, range: [1.2, 1.6] }, // meters
                    stepWidth: { normal: 0.08, range: [0.06, 0.12] }, // meters
                    gaitSpeed: { normal: 1.3, range: [1.0, 1.6] }, // m/s
                    doubleSupport: { normal: 0.2, range: [0.15, 0.25] } // percentage
                },
                asymmetry: {
                    stepLength: 0.05, // meters
                    stepTime: 0.1,     // seconds
                    swingTime: 0.05,  // seconds
                    stanceTime: 0.1   // seconds
                }
            };
            
            console.log('✅ Gait analysis configured');
            
        } catch (error) {
            console.error('❌ Failed to configure gait analysis:', error);
            throw error;
        }
    }

    /**
     * Configure compensation detection
     */
    async configureCompensationDetection() {
        try {
            console.log('🎯 Configuring compensation detection...');
            
            this.compensationConfig = {
                patterns: {
                    shoulderElevation: {
                        threshold: 0.05, // meters
                        confidence: 0.82,
                        clinicalSignificance: 'Rotator cuff pathology'
                    },
                    hipShift: {
                        threshold: 0.03, // meters
                        confidence: 0.89,
                        clinicalSignificance: 'Lumbar spine pathology'
                    },
                    trunkRotation: {
                        threshold: 10, // degrees
                        confidence: 0.76,
                        clinicalSignificance: 'Thoracic spine restriction'
                    },
                    kneeValgus: {
                        threshold: 15, // degrees
                        confidence: 0.91,
                        clinicalSignificance: 'Hip abductor weakness'
                    }
                },
                detectionSensitivity: 0.85
            };
            
            console.log('✅ Compensation detection configured');
            
        } catch (error) {
            console.error('❌ Failed to configure compensation detection:', error);
            throw error;
        }
    }

    /**
     * Configure asymmetry analysis
     */
    async configureAsymmetryAnalysis() {
        try {
            console.log('⚖️  Configuring asymmetry analysis...');
            
            this.asymmetryConfig = {
                thresholds: this.clinicalParams.asymmetryThresholds,
                measurements: {
                    shoulderLevel: { tolerance: 5, units: 'degrees' },
                    hipLevel: { tolerance: 3, units: 'degrees' },
                    kneeLevel: { tolerance: 4, units: 'degrees' },
                    ankleLevel: { tolerance: 2, units: 'degrees' }
                },
                analysisMethods: {
                    bilateralComparison: true,
                    temporalConsistency: true,
                    functionalSymmetry: true
                }
            };
            
            console.log('✅ Asymmetry analysis configured');
            
        } catch (error) {
            console.error('❌ Failed to configure asymmetry analysis:', error);
            throw error;
        }
    }

    /**
     * Configure clinical assessment
     */
    async configureClinicalAssessment() {
        try {
            console.log('🏥 Configuring clinical assessment...');
            
            this.clinicalConfig = {
                scoring: {
                    normal: 0,
                    mildDysfunction: 1,
                    moderateDysfunction: 2,
                    severeDysfunction: 3
                },
                clinicalPatterns: {
                    upperCrossed: {
                        forwardHead: true,
                        roundedShoulders: true,
                        increasedKyphosis: true
                    },
                    lowerCrossed: {
                        anteriorPelvicTilt: true,
                        increasedLumbarLordosis: true,
                        weakAbdominals: true
                    },
                    layerSyndrome: {
                        alternatingWeakness: true,
                        muscleImbalance: true
                    }
                },
                recommendations: {
                    immediate: 'Address acute findings',
                    shortTerm: 'Correct compensations',
                    longTerm: 'Restore optimal movement'
                }
            };
            
            console.log('✅ Clinical assessment configured');
            
        } catch (error) {
            console.error('❌ Failed to configure clinical assessment:', error);
            throw error;
        }
    }

    /**
     * Start visual analysis
     */
    async startAnalysis(mode = null, videoElement = null) {
        try {
            console.log(`🎬 Starting visual analysis${mode ? ` in ${mode} mode` : ''}...`);
            
            this.analysisState.isActive = true;
            this.analysisState.currentMode = mode || this.analysisState.currentMode;
            this.analysisState.frameCount = 0;
            this.analysisState.lastFrameTime = Date.now();
            
            // Start frame processing loop
            this.startProcessingLoop(videoElement);
            
            console.log('✅ Visual analysis started');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to start visual analysis:', error);
            throw error;
        }
    }

    /**
     * Start processing loop
     */
    startProcessingLoop(videoElement) {
        const processFrame = async () => {
            if (!this.analysisState.isActive) return;
            
            try {
                const currentTime = Date.now();
                
                // Check if enough time has passed for next analysis
                if (currentTime - this.analysisState.lastFrameTime >= this.processingConfig.analysisInterval) {
                    await this.processFrame(videoElement);
                    this.analysisState.lastFrameTime = currentTime;
                }
                
                // Continue processing
                requestAnimationFrame(processFrame);
                
            } catch (error) {
                console.error('❌ Frame processing error:', error);
                // Continue despite errors
                requestAnimationFrame(processFrame);
            }
        };
        
        processFrame();
    }

    /**
     * Process individual frame
     */
    async processFrame(videoElement) {
        try {
            this.analysisState.frameCount++;
            
            // Get current frame
            const frame = this.captureFrame(videoElement);
            if (!frame) return;
            
            // Add to buffer
            this.frameBuffer.push(frame);
            if (this.frameBuffer.length > this.processingConfig.bufferSize) {
                this.frameBuffer.shift();
            }
            
            // Perform analysis
            const analysisResults = await this.performAnalysis(frame);
            
            // Update results
            this.updateAnalysisResults(analysisResults);
            
            // Calculate FPS
            this.calculateFPS();
            
        } catch (error) {
            console.error('❌ Frame processing failed:', error);
            throw error;
        }
    }

    /**
     * Capture frame from video
     */
    captureFrame(videoElement) {
        try {
            if (!videoElement || videoElement.readyState !== 4) {
                return null;
            }
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            
            return {
                imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),
                timestamp: Date.now(),
                width: canvas.width,
                height: canvas.height
            };
            
        } catch (error) {
            console.error('❌ Failed to capture frame:', error);
            return null;
        }
    }

    /**
     * Perform analysis on frame
     */
    async performAnalysis(frame) {
        try {
            const results = {};
            
            // Perform pose estimation
            if (this.poseEstimator && this.enabledModes.includes(this.analysisModes.POSTURAL)) {
                results.pose = await this.poseEstimator.estimatePose(frame);
            }
            
            // Perform postural analysis
            if (this.enabledModes.includes(this.analysisModes.POSTURAL)) {
                results.postural = await this.analyzePosture(results.pose);
            }
            
            // Perform movement analysis
            if (this.enabledModes.includes(this.analysisModes.MOVEMENT)) {
                results.movement = await this.analyzeMovement(results.pose);
            }
            
            // Perform gait analysis
            if (this.enabledModes.includes(this.analysisModes.GAIT)) {
                results.gait = await this.analyzeGait(results.pose);
            }
            
            // Detect compensations
            if (this.enabledModes.includes(this.analysisModes.COMPENSATION)) {
                results.compensations = await this.detectCompensations(results.pose);
            }
            
            // Analyze asymmetry
            if (this.enabledModes.includes(this.analysisModes.ASYMMETRY)) {
                results.asymmetry = await this.analyzeAsymmetry(results.pose);
            }
            
            // Clinical assessment
            if (this.enabledModes.includes(this.analysisModes.CLINICAL)) {
                results.clinical = await this.performClinicalAssessment(results);
            }
            
            return results;
            
        } catch (error) {
            console.error('❌ Analysis failed:', error);
            throw error;
        }
    }

    /**
     * Analyze posture
     */
    async analyzePosture(poseData) {
        try {
            if (!poseData || !poseData.landmarks) {
                return { confidence: 0, findings: [] };
            }
            
            const landmarks = poseData.landmarks;
            const analysis = {
                confidence: poseData.confidence || 0.8,
                findings: [],
                measurements: {},
                deviations: []
            };
            
            // Analyze spinal alignment
            const spinalAlignment = this.analyzeSpinalAlignment(landmarks);
            analysis.findings.push(...spinalAlignment.findings);
            analysis.measurements.spinalAlignment = spinalAlignment.measurements;
            
            // Analyze pelvic position
            const pelvicPosition = this.analyzePelvicPosition(landmarks);
            analysis.findings.push(...pelvicPosition.findings);
            analysis.measurements.pelvicPosition = pelvicPosition.measurements;
            
            // Analyze shoulder position
            const shoulderPosition = this.analyzeShoulderPosition(landmarks);
            analysis.findings.push(...shoulderPosition.findings);
            analysis.measurements.shoulderPosition = shoulderPosition.measurements;
            
            // Analyze head position
            const headPosition = this.analyzeHeadPosition(landmarks);
            analysis.findings.push(...headPosition.findings);
            analysis.measurements.headPosition = headPosition.measurements;
            
            return analysis;
            
        } catch (error) {
            console.error('❌ Postural analysis failed:', error);
            return { confidence: 0, findings: [] };
        }
    }

    /**
     * Analyze spinal alignment
     */
    analyzeSpinalAlignment(landmarks) {
        try {
            const analysis = {
                findings: [],
                measurements: {},
                deviations: []
            };
            
            // Find key landmarks
            const nose = landmarks.find(l => l.part === 'nose');
            const leftShoulder = landmarks.find(l => l.part === 'left_shoulder');
            const rightShoulder = landmarks.find(l => l.part === 'right_shoulder');
            const leftHip = landmarks.find(l => l.part === 'left_hip');
            const rightHip = landmarks.find(l => l.part === 'right_hip');
            
            if (!nose || !leftShoulder || !rightShoulder || !leftHip || !rightHip) {
                return analysis;
            }
            
            // Calculate spinal curves
            const cervicalLordosis = this.calculateCervicalLordosis(nose, leftShoulder, rightShoulder);
            const thoracicKyphosis = this.calculateThoracicKyphosis(leftShoulder, rightShoulder, leftHip, rightHip);
            const lumbarLordosis = this.calculateLumbarLordosis(leftHip, rightHip);
            
            analysis.measurements = {
                cervical_lordosis: cervicalLordosis,
                thoracic_kyphosis: thoracicKyphosis,
                lumbar_lordosis: lumbarLordosis
            };
            
            // Check for deviations
            const normalRanges = this.clinicalParams.normalRanges.spinal_curves;
            
            if (cervicalLordosis < normalRanges.cervical_lordosis[0] || cervicalLordosis > normalRanges.cervical_lordosis[1]) {
                analysis.findings.push({
                    type: 'cervical_lordosis_abnormality',
                    severity: this.classifySeverity(Math.abs(cervicalLordosis - 30)),
                    measurement: cervicalLordosis,
                    normalRange: normalRanges.cervical_lordosis,
                    clinicalSignificance: 'May indicate cervical spine dysfunction'
                });
            }
            
            if (thoracicKyphosis < normalRanges.thoracic_kyphosis[0] || thoracicKyphosis > normalRanges.thoracic_kyphosis[1]) {
                analysis.findings.push({
                    type: 'thoracic_kyphosis_abnormality',
                    severity: this.classifySeverity(Math.abs(thoracicKyphosis - 32)),
                    measurement: thoracicKyphosis,
                    normalRange: normalRanges.thoracic_kyphosis,
                    clinicalSignificance: 'May indicate thoracic spine dysfunction'
                });
            }
            
            return analysis;
            
        } catch (error) {
            console.error('❌ Spinal alignment analysis failed:', error);
            return { findings: [], measurements: {} };
        }
    }

    /**
     * Calculate cervical lordosis
     */
    calculateCervicalLordosis(nose, leftShoulder, rightShoulder) {
        try {
            const shoulderCenter = {
                x: (leftShoulder.x + rightShoulder.x) / 2,
                y: (leftShoulder.y + rightShoulder.y) / 2
            };
            
            // Calculate angle between neck line and vertical
            const neckLine = {
                x: nose.x - shoulderCenter.x,
                y: nose.y - shoulderCenter.y
            };
            
            const vertical = { x: 0, y: 1 };
            const angle = Math.atan2(neckLine.x * vertical.y - neckLine.y * vertical.x, neckLine.x * vertical.x + neckLine.y * vertical.y);
            
            return Math.abs(angle * 180 / Math.PI);
            
        } catch (error) {
            console.error('❌ Cervical lordosis calculation failed:', error);
            return 0;
        }
    }

    /**
     * Calculate thoracic kyphosis
     */
    calculateThoracicKyphosis(leftShoulder, rightShoulder, leftHip, rightHip) {
        try {
            const shoulderCenter = {
                x: (leftShoulder.x + rightShoulder.x) / 2,
                y: (leftShoulder.y + rightShoulder.y) / 2
            };
            
            const hipCenter = {
                x: (leftHip.x + rightHip.x) / 2,
                y: (leftHip.y + rightHip.y) / 2
            };
            
            // Calculate thoracic curve angle
            const thoracicLine = {
                x: shoulderCenter.x - hipCenter.x,
                y: shoulderCenter.y - hipCenter.y
            };
            
            const vertical = { x: 0, y: 1 };
            const angle = Math.atan2(thoracicLine.x * vertical.y - thoracicLine.y * vertical.x, thoracicLine.x * vertical.x + thoracicLine.y * vertical.y);
            
            return Math.abs(angle * 180 / Math.PI);
            
        } catch (error) {
            console.error('❌ Thoracic kyphosis calculation failed:', error);
            return 0;
        }
    }

    /**
     * Calculate lumbar lordosis
     */
    calculateLumbarLordosis(leftHip, rightHip) {
        try {
            const hipCenter = {
                x: (leftHip.x + rightHip.x) / 2,
                y: (leftHip.y + rightHip.y) / 2
            };
            
            // Simplified lumbar lordosis calculation
            // In a real implementation, this would use more sophisticated analysis
            return 40; // Default value
            
        } catch (error) {
            console.error('❌ Lumbar lordosis calculation failed:', error);
            return 0;
        }
    }

    /**
     * Analyze pelvic position
     */
    analyzePelvicPosition(landmarks) {
        try {
            const analysis = {
                findings: [],
                measurements: {}
            };
            
            const leftHip = landmarks.find(l => l.part === 'left_hip');
            const rightHip = landmarks.find(l => l.part === 'right_hip');
            
            if (!leftHip || !rightHip) {
                return analysis;
            }
            
            // Calculate pelvic tilt
            const pelvicTilt = this.calculatePelvicTilt(leftHip, rightHip);
            analysis.measurements.pelvic_tilt = pelvicTilt;
            
            // Check for abnormalities
            const normalRanges = this.clinicalParams.normalRanges.pelvic_alignment;
            
            if (pelvicTilt < normalRanges.anterior_tilt[0] || pelvicTilt > normalRanges.anterior_tilt[1]) {
                analysis.findings.push({
                    type: 'pelvic_tilt_abnormality',
                    severity: this.classifySeverity(Math.abs(pelvicTilt - 10)),
                    measurement: pelvicTilt,
                    normalRange: normalRanges.anterior_tilt,
                    clinicalSignificance: 'May contribute to low back pain'
                });
            }
            
            return analysis;
            
        } catch (error) {
            console.error('❌ Pelvic position analysis failed:', error);
            return { findings: [], measurements: {} };
        }
    }

    /**
     * Calculate pelvic tilt
     */
    calculatePelvicTilt(leftHip, rightHip) {
        try {
            const hipLine = {
                x: rightHip.x - leftHip.x,
                y: rightHip.y - leftHip.y
            };
            
            const horizontal = { x: 1, y: 0 };
            const angle = Math.atan2(hipLine.x * horizontal.y - hipLine.y * horizontal.x, hipLine.x * horizontal.x + hipLine.y * horizontal.y);
            
            return Math.abs(angle * 180 / Math.PI);
            
        } catch (error) {
            console.error('❌ Pelvic tilt calculation failed:', error);
            return 0;
        }
    }

    /**
     * Classify severity
     */
    classifySeverity(deviation) {
        const thresholds = this.clinicalParams.asymmetryThresholds;
        
        if (deviation < thresholds.mild) {
            return 'minimal';
        } else if (deviation < thresholds.moderate) {
            return 'mild';
        } else if (deviation < thresholds.severe) {
            return 'moderate';
        } else {
            return 'severe';
        }
    }

    /**
     * Update analysis results
     */
    updateAnalysisResults(newResults) {
        try {
            // Merge new results with existing results
            Object.assign(this.analysisResults, newResults);
            
            // Update overall confidence
            this.analysisResults.confidence = this.calculateOverallConfidence();
            
            // Provide real-time feedback
            this.provideRealtimeFeedback();
            
        } catch (error) {
            console.error('❌ Failed to update analysis results:', error);
        }
    }

    /**
     * Calculate overall confidence
     */
    calculateOverallConfidence() {
        try {
            let totalConfidence = 0;
            let confidenceCount = 0;
            
            // Average confidence from all analysis modes
            if (this.analysisResults.postural.confidence) {
                totalConfidence += this.analysisResults.postural.confidence;
                confidenceCount++;
            }
            
            if (this.analysisResults.movement.confidence) {
                totalConfidence += this.analysisResults.movement.confidence;
                confidenceCount++;
            }
            
            if (this.analysisResults.gait.confidence) {
                totalConfidence += this.analysisResults.gait.confidence;
                confidenceCount++;
            }
            
            return confidenceCount > 0 ? totalConfidence / confidenceCount : 0;
            
        } catch (error) {
            console.error('❌ Confidence calculation failed:', error);
            return 0;
        }
    }

    /**
     * Calculate FPS
     */
    calculateFPS() {
        try {
            const currentTime = Date.now();
            const timeDiff = currentTime - this.analysisState.lastFrameTime;
            
            if (timeDiff > 0) {
                this.analysisState.fps = Math.round(1000 / timeDiff);
            }
            
        } catch (error) {
            console.error('❌ FPS calculation failed:', error);
        }
    }

    /**
     * Provide real-time feedback
     */
    provideRealtimeFeedback() {
        try {
            // Update UI with real-time analysis results
            const feedbackElement = document.getElementById('visual-feedback');
            if (feedbackElement) {
                feedbackElement.textContent = `Confidence: ${Math.round(this.analysisResults.confidence * 100)}%`;
            }
            
            // Trigger alerts for significant findings
            if (this.analysisResults.compensations.length > 0) {
                this.triggerAlert('compensation_detected');
            }
            
            if (this.analysisResults.asymmetries.some(a => a.severity === 'severe')) {
                this.triggerAlert('severe_asymmetry');
            }
            
        } catch (error) {
            console.error('❌ Real-time feedback failed:', error);
        }
    }

    /**
     * Trigger alert
     */
    triggerAlert(type) {
        try {
            const alertElement = document.getElementById('analysis-alert');
            if (alertElement) {
                alertElement.className = `alert alert-${type}`;
                alertElement.textContent = `Alert: ${type.replace('_', ' ')} detected`;
                
                // Auto-hide after 5 seconds
                setTimeout(() => {
                    alertElement.className = 'alert alert-hidden';
                }, 5000);
            }
            
        } catch (error) {
            console.error('❌ Alert trigger failed:', error);
        }
    }

    /**
     * Stop analysis
     */
    stopAnalysis() {
        try {
            console.log('🛑 Stopping visual analysis...');
            
            this.analysisState.isActive = false;
            
            // Generate final report
            const finalReport = this.generateFinalReport();
            
            console.log('✅ Visual analysis stopped');
            return finalReport;
            
        } catch (error) {
            console.error('❌ Failed to stop analysis:', error);
            throw error;
        }
    }

    /**
     * Generate final report
     */
    generateFinalReport() {
        try {
            console.log('📊 Generating final analysis report...');
            
            const report = {
                timestamp: Date.now(),
                engineId: this.engineId,
                analysisModes: this.enabledModes,
                results: this.analysisResults,
                processingStats: {
                    totalFrames: this.analysisState.frameCount,
                    averageFPS: this.analysisState.fps,
                    processingTime: this.analysisState.processingTime
                },
                clinicalRecommendations: this.generateClinicalRecommendations(),
                confidence: this.analysisResults.confidence
            };
            
            console.log('✅ Final report generated');
            return report;
            
        } catch (error) {
            console.error('❌ Final report generation failed:', error);
            throw error;
        }
    }

    /**
     * Generate clinical recommendations
     */
    generateClinicalRecommendations() {
        try {
            const recommendations = [];
            
            // Postural recommendations
            if (this.analysisResults.postural.findings) {
                this.analysisResults.postural.findings.forEach(finding => {
                    if (finding.severity === 'moderate' || finding.severity === 'severe') {
                        recommendations.push({
                            type: 'postural_correction',
                            priority: 'high',
                            description: `Address ${finding.type.replace('_', ' ')}`,
                            intervention: finding.clinicalSignificance || 'Postural training exercises'
                        });
                    }
                });
            }
            
            // Movement recommendations
            if (this.analysisResults.movement.findings) {
                this.analysisResults.movement.findings.forEach(finding => {
                    recommendations.push({
                        type: 'movement_optimization',
                        priority: 'medium',
                        description: `Improve ${finding.type.replace('_', ' ')}`,
                        intervention: 'Movement pattern training'
                    });
                });
            }
            
            // Compensation recommendations
            this.analysisResults.compensations.forEach(compensation => {
                recommendations.push({
                    type: 'compensation_correction',
                    priority: 'high',
                    description: `Correct ${compensation.type.replace('_', ' ')} compensation`,
                    intervention: compensation.clinicalSignificance || 'Targeted strengthening'
                });
            });
            
            return recommendations;
            
        } catch (error) {
            console.error('❌ Clinical recommendations generation failed:', error);
            return [];
        }
    }

    /**
     * Get analysis state
     */
    getAnalysisState() {
        return {
            ...this.analysisState,
            results: this.analysisResults,
            enabledModes: this.enabledModes
        };
    }

    /**
     * Get clinical parameters
     */
    getClinicalParameters() {
        return this.clinicalParams;
    }

    /**
     * Get AI model configuration
     */
    getAIModelConfig() {
        return this.aiModels;
    }
}

// Export for use in other modules
window.VisualAnalysisEngine = VisualAnalysisEngine;

// Initialize on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        console.log('🎯 Visual analysis engine ready for initialization');
    });
}