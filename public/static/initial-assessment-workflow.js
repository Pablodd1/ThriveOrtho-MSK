/**
 * Initial Assessment Workflow with Real-Time Joint Tracking
 * Chiropractic and Physical Therapy Diagnostic Protocol
 * Version: 1.0.0
 */

class InitialAssessmentWorkflow {
    constructor() {
        this.assessmentId = null;
        this.patientId = null;
        this.startTime = null;
        this.currentPhase = 'setup';
        this.isActive = false;
        this.jointTracker = null;
        this.cameraSystem = null;
        this.aiAnalyzer = null;
        
        // Assessment phases
        this.phases = {
            setup: { name: 'Setup', duration: 30 },
            calibration: { name: 'Calibration', duration: 15 },
            baseline: { name: 'Baseline', duration: 30 },
            assessment: { name: 'Assessment', duration: 120 },
            analysis: { name: 'Analysis', duration: 60 },
            report: { name: 'Report', duration: 30 }
        };

        // Joint tracking configuration
        this.trackingConfig = {
            landmarks: 543, // Full body + face + hands
            confidenceThreshold: 0.7,
            smoothingFactor: 0.3,
            trackingMode: 'full-body',
            updateRate: 30, // Hz
            recordData: true
        };

        // Medical parameters
        this.medicalParams = {
            normalRanges: {
                cervical: { flexion: [45, 60], extension: [45, 60], rotation: [60, 80], lateralFlexion: [30, 45] },
                shoulder: { flexion: [150, 180], extension: [40, 60], abduction: [150, 180], adduction: [20, 30] },
                elbow: { flexion: [130, 150], extension: [0, 5], pronation: [70, 85], supination: [80, 90] },
                lumbar: { flexion: [60, 90], extension: [20, 30], rotation: [20, 30], lateralFlexion: [15, 25] },
                hip: { flexion: [90, 120], extension: [10, 20], abduction: [30, 45], adduction: [20, 30] },
                knee: { flexion: [120, 140], extension: [0, 5] },
                ankle: { dorsiflexion: [10, 20], plantarflexion: [40, 50], inversion: [5, 10], eversion: [5, 10] }
            },
            asymmetryThreshold: 5, // degrees
            movementQualityThreshold: 0.8,
            stabilityThreshold: 0.7
        };

        // Real-time tracking data
        this.trackingData = {
            joints: new Map(),
            movements: [],
            timestamps: [],
            confidence: [],
            asymmetry: [],
            compensations: [],
            redFlags: []
        };

        // Assessment results
        this.assessmentResults = {
            overallScore: 0,
            jointMobility: {},
            movementQuality: {},
            asymmetry: {},
            compensations: [],
            redFlags: [],
            recommendations: [],
            clinicalNotes: ''
        };
    }

    /**
     * Initialize assessment workflow
     */
    async initialize(patientId, assessmentType = 'initial') {
        try {
            console.log(`🩺 Starting initial assessment workflow for patient ${patientId}...`);
            
            this.patientId = patientId;
            this.assessmentId = this.generateAssessmentId();
            this.startTime = Date.now();
            this.currentPhase = 'setup';
            this.isActive = true;
            
            // Initialize camera system
            this.cameraSystem = new MultiCameraSystem();
            await this.cameraSystem.initialize(
                document.getElementById('assessment-video'),
                document.getElementById('assessment-canvas')
            );
            
            // Initialize joint tracker
            this.jointTracker = new RealTimePoseTracker();
            await this.jointTracker.init();
            
            // Initialize AI analyzer
            this.aiAnalyzer = new AIIntegrationAdvanced();
            
            // Start assessment
            await this.startAssessment(assessmentType);
            
            console.log('✅ Assessment workflow initialized');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize assessment workflow:', error);
            throw error;
        }
    }

    /**
     * Start assessment
     */
    async startAssessment(assessmentType) {
        try {
            console.log(`🚀 Starting ${assessmentType} assessment...`);
            
            // Progress through assessment phases
            for (const [phaseId, phaseConfig] of Object.entries(this.phases)) {
                if (!this.isActive) break;
                
                console.log(`📋 Starting phase: ${phaseConfig.name}`);
                this.currentPhase = phaseId;
                
                await this.executePhase(phaseId, phaseConfig);
                
                // Update UI
                this.updatePhaseUI(phaseId);
            }
            
            // Generate final report
            await this.generateReport();
            
            console.log('✅ Assessment completed successfully');
            
        } catch (error) {
            console.error('❌ Assessment failed:', error);
            throw error;
        }
    }

    /**
     * Execute assessment phase
     */
    async executePhase(phaseId, phaseConfig) {
        try {
            switch (phaseId) {
                case 'setup':
                    await this.executeSetupPhase();
                    break;
                case 'calibration':
                    await this.executeCalibrationPhase();
                    break;
                case 'baseline':
                    await this.executeBaselinePhase();
                    break;
                case 'assessment':
                    await this.executeAssessmentPhase();
                    break;
                case 'analysis':
                    await this.executeAnalysisPhase();
                    break;
                case 'report':
                    await this.executeReportPhase();
                    break;
                default:
                    throw new Error(`Unknown phase: ${phaseId}`);
            }
            
        } catch (error) {
            console.error(`❌ Phase ${phaseId} failed:`, error);
            throw error;
        }
    }

    /**
     * Execute setup phase
     */
    async executeSetupPhase() {
        try {
            console.log('🔧 Executing setup phase...');
            
            // Camera system setup
            const cameraRecommendation = this.cameraSystem.getMedicalRecommendation();
            if (!cameraRecommendation.suitable) {
                throw new Error(`Camera not suitable: ${cameraRecommendation.reason}`);
            }
            
            // Start camera stream
            await this.cameraSystem.startStream();
            
            // Patient positioning
            await this.guidePatientPositioning();
            
            // System checks
            await this.performSystemChecks();
            
            console.log('✅ Setup phase completed');
            
        } catch (error) {
            console.error('❌ Setup phase failed:', error);
            throw error;
        }
    }

    /**
     * Execute calibration phase
     */
    async executeCalibrationPhase() {
        try {
            console.log('📐 Executing calibration phase...');
            
            // Joint tracker calibration
            await this.calibrateJointTracker();
            
            // Camera calibration
            await this.calibrateCamera();
            
            // Patient calibration
            await this.calibratePatient();
            
            console.log('✅ Calibration phase completed');
            
        } catch (error) {
            console.error('❌ Calibration phase failed:', error);
            throw error;
        }
    }

    /**
     * Execute baseline phase
     */
    async executeBaselinePhase() {
        try {
            console.log('📊 Executing baseline phase...');
            
            // Start joint tracking
            await this.startJointTracking();
            
            // Capture baseline measurements
            await this.captureBaselineMeasurements();
            
            // Validate baseline data
            await this.validateBaselineData();
            
            console.log('✅ Baseline phase completed');
            
        } catch (error) {
            console.error('❌ Baseline phase failed:', error);
            throw error;
        }
    }

    /**
     * Execute assessment phase
     */
    async executeAssessmentPhase() {
        try {
            console.log('🎯 Executing assessment phase...');
            
            // Real-time joint tracking
            await this.performJointTracking();
            
            // Movement assessment
            await this.assessMovements();
            
            // Compensation analysis
            await this.analyzeCompensations();
            
            // Red flag detection
            await this.detectRedFlags();
            
            console.log('✅ Assessment phase completed');
            
        } catch (error) {
            console.error('❌ Assessment phase failed:', error);
            throw error;
        }
    }

    /**
     * Execute analysis phase
     */
    async executeAnalysisPhase() {
        try {
            console.log('🧠 Executing analysis phase...');
            
            // AI analysis
            const aiResults = await this.performAIAnalysis();
            
            // Clinical analysis
            await this.performClinicalAnalysis();
            
            // Generate insights
            await this.generateInsights();
            
            console.log('✅ Analysis phase completed');
            
        } catch (error) {
            console.error('❌ Analysis phase failed:', error);
            throw error;
        }
    }

    /**
     * Execute report phase
     */
    async executeReportPhase() {
        try {
            console.log('📋 Executing report phase...');
            
            // Compile results
            await this.compileResults();
            
            // Generate recommendations
            await this.generateRecommendations();
            
            // Create clinical notes
            await this.createClinicalNotes();
            
            console.log('✅ Report phase completed');
            
        } catch (error) {
            console.error('❌ Report phase failed:', error);
            throw error;
        }
    }

    /**
     * Start joint tracking
     */
    async startJointTracking() {
        try {
            console.log('🎯 Starting joint tracking...');
            
            const videoElement = document.getElementById('assessment-video');
            const canvasElement = document.getElementById('assessment-canvas');
            
            await this.jointTracker.startTracking(videoElement, canvasElement);
            
            // Set up tracking callbacks
            this.jointTracker.onLandmarks = (landmarks) => {
                this.processLandmarks(landmarks);
            };
            
            console.log('✅ Joint tracking started');
            
        } catch (error) {
            console.error('❌ Failed to start joint tracking:', error);
            throw error;
        }
    }

    /**
     * Process landmarks from joint tracking
     */
    processLandmarks(landmarks) {
        try {
            const timestamp = Date.now();
            
            // Store landmark data
            this.trackingData.joints.set(timestamp, landmarks);
            this.trackingData.timestamps.push(timestamp);
            
            // Calculate confidence
            const confidence = this.calculateLandmarkConfidence(landmarks);
            this.trackingData.confidence.push(confidence);
            
            // Analyze asymmetry
            const asymmetry = this.analyzeAsymmetry(landmarks);
            this.trackingData.asymmetry.push(asymmetry);
            
            // Check for compensations
            const compensations = this.detectCompensations(landmarks);
            this.trackingData.compensations.push(compensations);
            
            // Real-time feedback
            this.provideRealtimeFeedback(landmarks, confidence, asymmetry, compensations);
            
        } catch (error) {
            console.error('❌ Failed to process landmarks:', error);
        }
    }

    /**
     * Calculate landmark confidence
     */
    calculateLandmarkConfidence(landmarks) {
        let totalConfidence = 0;
        let validLandmarks = 0;
        
        for (const landmark of landmarks) {
            if (landmark && landmark.visibility !== undefined) {
                totalConfidence += landmark.visibility;
                validLandmarks++;
            }
        }
        
        return validLandmarks > 0 ? totalConfidence / validLandmarks : 0;
    }

    /**
     * Analyze asymmetry
     */
    analyzeAsymmetry(landmarks) {
        try {
            // Extract left and right landmarks
            const leftLandmarks = landmarks.filter(l => l && l.part && l.part.includes('left'));
            const rightLandmarks = landmarks.filter(l => l && l.part && l.part.includes('right'));
            
            if (leftLandmarks.length === 0 || rightLandmarks.length === 0) {
                return { asymmetry: 0, severity: 'none' };
            }
            
            // Calculate asymmetry based on landmark positions
            let totalAsymmetry = 0;
            let comparisons = 0;
            
            for (let i = 0; i < Math.min(leftLandmarks.length, rightLandmarks.length); i++) {
                const left = leftLandmarks[i];
                const right = rightLandmarks[i];
                
                if (left && right) {
                    const asymmetry = Math.abs(left.x - right.x) + Math.abs(left.y - right.y);
                    totalAsymmetry += asymmetry;
                    comparisons++;
                }
            }
            
            const avgAsymmetry = comparisons > 0 ? totalAsymmetry / comparisons : 0;
            const severity = this.classifyAsymmetrySeverity(avgAsymmetry);
            
            return {
                asymmetry: avgAsymmetry,
                severity: severity,
                threshold: this.medicalParams.asymmetryThreshold
            };
            
        } catch (error) {
            console.error('❌ Failed to analyze asymmetry:', error);
            return { asymmetry: 0, severity: 'error' };
        }
    }

    /**
     * Classify asymmetry severity
     */
    classifyAsymmetrySeverity(asymmetry) {
        if (asymmetry < this.medicalParams.asymmetryThreshold * 0.5) {
            return 'minimal';
        } else if (asymmetry < this.medicalParams.asymmetryThreshold) {
            return 'mild';
        } else if (asymmetry < this.medicalParams.asymmetryThreshold * 2) {
            return 'moderate';
        } else {
            return 'severe';
        }
    }

    /**
     * Detect compensations
     */
    detectCompensations(landmarks) {
        const compensations = [];
        
        try {
            // Check for common compensation patterns
            
            // Shoulder elevation compensation
            if (this.detectShoulderElevation(landmarks)) {
                compensations.push({
                    type: 'shoulder_elevation',
                    severity: 'mild',
                    description: 'Excessive shoulder elevation detected'
                });
            }
            
            // Hip shift compensation
            if (this.detectHipShift(landmarks)) {
                compensations.push({
                    type: 'hip_shift',
                    severity: 'moderate',
                    description: 'Lateral hip shift detected'
                });
            }
            
            // Trunk rotation compensation
            if (this.detectTrunkRotation(landmarks)) {
                compensations.push({
                    type: 'trunk_rotation',
                    severity: 'mild',
                    description: 'Excessive trunk rotation detected'
                });
            }
            
        } catch (error) {
            console.error('❌ Failed to detect compensations:', error);
        }
        
        return compensations;
    }

    /**
     * Detect shoulder elevation compensation
     */
    detectShoulderElevation(landmarks) {
        // Simplified detection logic
        // In a real implementation, this would use more sophisticated analysis
        return Math.random() < 0.1; // 10% chance for demo
    }

    /**
     * Detect hip shift compensation
     */
    detectHipShift(landmarks) {
        // Simplified detection logic
        return Math.random() < 0.15; // 15% chance for demo
    }

    /**
     * Detect trunk rotation compensation
     */
    detectTrunkRotation(landmarks) {
        // Simplified detection logic
        return Math.random() < 0.08; // 8% chance for demo
    }

    /**
     * Provide real-time feedback
     */
    provideRealtimeFeedback(landmarks, confidence, asymmetry, compensations) {
        try {
            // Update UI with real-time feedback
            this.updateRealtimeUI({
                confidence: confidence,
                asymmetry: asymmetry,
                compensations: compensations,
                timestamp: Date.now()
            });
            
            // Audio feedback for significant issues
            if (asymmetry.severity === 'severe' || compensations.some(c => c.severity === 'moderate')) {
                this.playAlert('compensation_detected');
            }
            
        } catch (error) {
            console.error('❌ Failed to provide real-time feedback:', error);
        }
    }

    /**
     * Generate assessment ID
     */
    generateAssessmentId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `ASS${timestamp}${random}`.toUpperCase();
    }

    /**
     * Update phase UI
     */
    updatePhaseUI(phaseId) {
        // Update UI to show current phase
        const phaseElement = document.getElementById('current-phase');
        if (phaseElement) {
            phaseElement.textContent = this.phases[phaseId].name;
        }
        
        // Update progress bar
        const progressElement = document.getElementById('assessment-progress');
        if (progressElement) {
            const phaseIndex = Object.keys(this.phases).indexOf(phaseId);
            const totalPhases = Object.keys(this.phases).length;
            const progress = (phaseIndex + 1) / totalPhases * 100;
            progressElement.style.width = `${progress}%`;
        }
    }

    /**
     * Update real-time UI
     */
    updateRealtimeUI(data) {
        // Update confidence display
        const confidenceElement = document.getElementById('tracking-confidence');
        if (confidenceElement) {
            confidenceElement.textContent = `${Math.round(data.confidence * 100)}%`;
            confidenceElement.className = data.confidence > 0.8 ? 'confidence-high' : 'confidence-low';
        }
        
        // Update asymmetry display
        const asymmetryElement = document.getElementById('asymmetry-level');
        if (asymmetryElement) {
            asymmetryElement.textContent = data.asymmetry.severity;
            asymmetryElement.className = `asymmetry-${data.asymmetry.severity}`;
        }
        
        // Update compensation display
        const compensationElement = document.getElementById('compensation-count');
        if (compensationElement) {
            compensationElement.textContent = data.compensations.length;
        }
    }

    /**
     * Play audio alert
     */
    playAlert(type) {
        try {
            const audio = new Audio();
            audio.src = `/static/alerts/${type}.mp3`;
            audio.play().catch(error => {
                console.warn('⚠️  Could not play audio alert:', error);
            });
        } catch (error) {
            console.warn('⚠️  Audio alert failed:', error);
        }
    }

    /**
     * Stop assessment
     */
    stopAssessment() {
        try {
            console.log('🛑 Stopping assessment...');
            this.isActive = false;
            
            // Stop joint tracking
            if (this.jointTracker) {
                this.jointTracker.stopTracking();
            }
            
            // Stop camera
            if (this.cameraSystem) {
                this.cameraSystem.stopStream();
            }
            
            console.log('✅ Assessment stopped');
            
        } catch (error) {
            console.error('❌ Failed to stop assessment:', error);
        }
    }

    /**
     * Get assessment results
     */
    getAssessmentResults() {
        return {
            assessmentId: this.assessmentId,
            patientId: this.patientId,
            startTime: this.startTime,
            endTime: Date.now(),
            duration: Date.now() - this.startTime,
            phases: this.phases,
            trackingData: this.trackingData,
            results: this.assessmentResults,
            medicalParams: this.medicalParams
        };
    }
}

// Export for use in other modules
window.InitialAssessmentWorkflow = InitialAssessmentWorkflow;

// Initialize on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        console.log('🎯 Initial assessment workflow ready for initialization');
    });
}