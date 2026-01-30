/**
 * Medical Assessment Workflow Engine
 * Initial patient assessment for chiropractic and physical therapy
 * Determines minimum exercises needed for diagnosis
 * Integrates with Orbecc Femto Mega for 3D analysis
 */

class MedicalAssessmentWorkflow {
    constructor() {
        this.currentPhase = 'preparation';
        this.assessmentData = {
            patient: null,
            movements: [],
            measurements: {},
            findings: {},
            recommendations: {},
            riskFactors: [],
            redFlags: []
        };
        
        // Minimum assessment protocol for chiropractic/PT diagnosis
        this.assessmentProtocol = {
            phases: [
                {
                    id: 'static-posture',
                    name: 'Static Posture Analysis',
                    duration: 30,
                    movements: ['neutral-stance'],
                    measurements: ['head-position', 'shoulder-level', 'pelvic-tilt', 'knee-alignment'],
                    required: true
                },
                {
                    id: 'range-of-motion',
                    name: 'Active Range of Motion',
                    duration: 120,
                    movements: [
                        'cervical-flexion', 'cervical-extension', 'cervical-rotation',
                        'shoulder-flexion', 'shoulder-abduction', 'shoulder-extension',
                        'lumbar-flexion', 'lumbar-extension', 'lumbar-rotation',
                        'hip-flexion', 'hip-extension', 'hip-abduction'
                    ],
                    measurements: ['angle-range', 'smoothness', 'compensations', 'pain-response'],
                    required: true
                },
                {
                    id: 'functional-movements',
                    name: 'Functional Movement Patterns',
                    duration: 180,
                    movements: [
                        'overhead-reach', 'forward-bend', 'squat', 'single-leg-stand',
                        'heel-rise', 'toe-walk', 'heel-walk', 'tandem-walk'
                    ],
                    measurements: ['quality-score', 'balance', 'coordination', 'stability'],
                    required: true
                },
                {
                    id: 'special-tests',
                    name: 'Special Clinical Tests',
                    duration: 90,
                    movements: [
                        'spurling-test', 'shoulder-impingement', 'patrick-test',
                        'thomas-test', 'ober-test', 'valgus-stress', 'varus-stress'
                    ],
                    measurements: ['pain-provocation', 'range-limitation', 'end-feel'],
                    required: false // Based on findings
                }
            ],
            minimumRequired: 3, // First 3 phases minimum
            totalDuration: 420 // 7 minutes minimum
        };
        
        // Clinical thresholds for automated assessment
        this.clinicalThresholds = {
            posture: {
                headForward: 25, // mm forward head posture
                shoulderAsymmetry: 10, // mm difference
                pelvicTilt: 5, // degrees
                kneeValgus: 15 // degrees
            },
            rangeOfMotion: {
                cervical: { flexion: 45, extension: 45, rotation: 60 },
                shoulder: { flexion: 150, abduction: 170, extension: 40 },
                lumbar: { flexion: 60, extension: 25, rotation: 30 },
                hip: { flexion: 110, extension: 20, abduction: 45 }
            },
            functional: {
                overheadReach: 160, // degrees
                forwardBend: 'mid-tibia', // anatomical landmark
                squatDepth: 90, // degrees knee flexion
                singleLegStand: 30, // seconds
                heelRise: 20 // repetitions
            }
        };
        
        this.cameraIntegration = null;
        this.aiAnalyzer = null;
        this.currentMovementIndex = 0;
        this.assessmentStartTime = null;
    }

    /**
     * Initialize assessment workflow
     */
    async initialize(patientId, cameraType = 'auto') {
        try {
            console.log('🏥 Initializing medical assessment workflow...');
            
            // Initialize camera integration
            this.cameraIntegration = new OrbeccFemtoMegaIntegration();
            
            // Set up camera callbacks
            this.setupCameraCallbacks();
            
            // Connect to camera
            const cameraResult = await this.cameraIntegration.initialize(cameraType);
            
            if (!cameraResult.success) {
                throw new Error(`Camera initialization failed: ${cameraResult.error}`);
            }
            
            console.log(`✅ Camera connected: ${cameraResult.device} (${cameraResult.mode})`);
            
            // Initialize AI analyzer
            this.aiAnalyzer = new MedicalAIAnalyzer();
            await this.aiAnalyzer.initialize();
            
            // Load patient data
            await this.loadPatientData(patientId);
            
            this.assessmentStartTime = Date.now();
            
            return {
                success: true,
                patient: this.assessmentData.patient,
                camera: cameraResult,
                protocol: this.assessmentProtocol
            };
            
        } catch (error) {
            console.error('❌ Assessment initialization failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Set up camera integration callbacks
     */
    setupCameraCallbacks() {
        this.cameraIntegration.setCallback('onFrame', (frameData) => {
            this.processFrame(frameData);
        });
        
        this.cameraIntegration.setCallback('onDepthData', (depthData) => {
            this.processDepthData(depthData);
        });
        
        this.cameraIntegration.setCallback('onError', (error) => {
            this.handleError(error);
        });
    }

    /**
     * Process incoming frame data
     */
    async processFrame(frameData) {
        try {
            const currentPhase = this.assessmentProtocol.phases.find(p => p.id === this.currentPhase);
            
            if (!currentPhase || !this.aiAnalyzer) return;
            
            // Analyze current movement
            const analysis = await this.aiAnalyzer.analyzeMovement(frameData, currentPhase);
            
            // Store measurement
            this.storeMeasurement(analysis);
            
            // Check if movement is complete
            if (this.isMovementComplete(analysis)) {
                await this.completeCurrentMovement();
            }
            
        } catch (error) {
            console.warn('Frame processing error:', error);
        }
    }

    /**
     * Process depth data from 3D camera
     */
    processDepthData(depthData) {
        // Store depth information for 3D analysis
        this.assessmentData.measurements.depth = {
            timestamp: depthData.timestamp,
            dimensions: { width: depthData.width, height: depthData.height },
            minDepth: depthData.minDepth,
            maxDepth: depthData.maxDepth,
            data: depthData.data // Float32Array
        };
        
        // Calculate 3D measurements
        this.calculate3DMeasurements(depthData);
    }

    /**
     * Start assessment phase
     */
    async startPhase(phaseId) {
        try {
            const phase = this.assessmentProtocol.phases.find(p => p.id === phaseId);
            
            if (!phase) {
                throw new Error(`Unknown phase: ${phaseId}`);
            }
            
            console.log(`🎯 Starting phase: ${phase.name}`);
            this.currentPhase = phaseId;
            this.currentMovementIndex = 0;
            
            // Start camera tracking
            this.cameraIntegration.isTracking = true;
            
            // Start AI analysis
            if (this.aiAnalyzer) {
                await this.aiAnalyzer.startPhaseAnalysis(phase);
            }
            
            // Set phase timeout
            this.setPhaseTimeout(phase);
            
            return {
                success: true,
                phase: phase,
                instructions: this.getPhaseInstructions(phase)
            };
            
        } catch (error) {
            console.error('❌ Phase start failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get phase-specific instructions
     */
    getPhaseInstructions(phase) {
        const instructions = {
            'static-posture': {
                patient: 'Stand naturally with feet shoulder-width apart, arms relaxed at sides. Look straight ahead.',
                clinician: 'Observe from front, side, and posterior views. Note asymmetries.',
                duration: '30 seconds'
            },
            'range-of-motion': {
                patient: 'Move each joint through full range as instructed. Stop if painful.',
                clinician: 'Measure active range, note limitations and compensations.',
                duration: '2 minutes'
            },
            'functional-movements': {
                patient: 'Perform movements naturally, as if doing daily activities.',
                clinician: 'Assess quality, balance, and coordination.',
                duration: '3 minutes'
            },
            'special-tests': {
                patient: 'Follow specific test instructions carefully. Report any pain.',
                clinician: 'Perform clinical special tests based on findings.',
                duration: '90 seconds'
            }
        };
        
        return instructions[phase.id] || { patient: 'Follow instructions', clinician: 'Observe carefully', duration: 'Variable' };
    }

    /**
     * Store measurement data
     */
    storeMeasurement(analysis) {
        const currentPhase = this.currentPhase;
        
        if (!this.assessmentData.measurements[currentPhase]) {
            this.assessmentData.measurements[currentPhase] = [];
        }
        
        this.assessmentData.measurements[currentPhase].push({
            timestamp: Date.now(),
            movement: analysis.movement,
            data: analysis.measurements,
            confidence: analysis.confidence,
            quality: analysis.quality
        });
    }

    /**
     * Check if current movement is complete
     */
    isMovementComplete(analysis) {
        const currentPhase = this.assessmentProtocol.phases.find(p => p.id === this.currentPhase);
        
        if (!currentPhase) return false;
        
        // Simple completion criteria based on phase type
        switch (this.currentPhase) {
            case 'static-posture':
                return analysis.timestamp > 30000; // 30 seconds
            
            case 'range-of-motion':
                // Check if all required movements have been captured
                const capturedMovements = this.assessmentData.measurements[this.currentPhase] || [];
                const uniqueMovements = new Set(capturedMovements.map(m => m.movement));
                return uniqueMovements.size >= currentPhase.movements.length;
            
            case 'functional-movements':
                const functionalData = this.assessmentData.measurements[this.currentPhase] || [];
                return functionalData.length >= 5 && analysis.quality > 0.8;
            
            default:
                return false;
        }
    }

    /**
     * Complete current movement and advance
     */
    async completeCurrentMovement() {
        const currentPhase = this.assessmentProtocol.phases.find(p => p.id === this.currentPhase);
        
        console.log(`✅ Phase ${currentPhase.name} completed`);
        
        // Stop camera tracking
        this.cameraIntegration.isTracking = false;
        
        // Analyze phase results
        const phaseResults = await this.analyzePhaseResults(currentPhase);
        
        // Store findings
        this.assessmentData.findings[this.currentPhase] = phaseResults;
        
        // Generate recommendations
        const recommendations = await this.generateRecommendations(phaseResults);
        this.assessmentData.recommendations[this.currentPhase] = recommendations;
        
        // Check for red flags
        const redFlags = await this.checkRedFlags(phaseResults);
        this.assessmentData.redFlags.push(...redFlags);
        
        // Move to next phase or complete assessment
        const nextPhase = this.getNextPhase();
        
        if (nextPhase) {
            return {
                success: true,
                completed: currentPhase,
                next: nextPhase,
                results: phaseResults,
                recommendations: recommendations
            };
        } else {
            // Assessment complete
            return await this.completeAssessment();
        }
    }

    /**
     * Analyze phase results
     */
    async analyzePhaseResults(phase) {
        const measurements = this.assessmentData.measurements[phase.id] || [];
        
        if (!this.aiAnalyzer) {
            return { phase: phase.id, measurements, analysis: 'AI analyzer not available' };
        }
        
        return await this.aiAnalyzer.analyzePhase(phase, measurements);
    }

    /**
     * Generate clinical recommendations
     */
    async generateRecommendations(phaseResults) {
        if (!this.aiAnalyzer) {
            return { recommendations: [], confidence: 0 };
        }
        
        return await this.aiAnalyzer.generateRecommendations(phaseResults);
    }

    /**
     * Check for red flags
     */
    async checkRedFlags(phaseResults) {
        const redFlags = [];
        
        // Automated red flag detection
        if (phaseResults.severePain) {
            redFlags.push({
                type: 'severe_pain',
                severity: 'high',
                description: 'Severe pain reported during movement',
                recommendation: 'Consider immediate medical evaluation'
            });
        }
        
        if (phaseResults.neurologicalSymptoms) {
            redFlags.push({
                type: 'neurological',
                severity: 'high',
                description: 'Neurological symptoms detected',
                recommendation: 'Refer for neurological evaluation'
            });
        }
        
        if (phaseResults.severeLimitation) {
            redFlags.push({
                type: 'severe_limitation',
                severity: 'moderate',
                description: 'Severe range of motion limitation',
                recommendation: 'Consider imaging studies'
            });
        }
        
        return redFlags;
    }

    /**
     * Get next assessment phase
     */
    getNextPhase() {
        const currentIndex = this.assessmentProtocol.phases.findIndex(p => p.id === this.currentPhase);
        const nextIndex = currentIndex + 1;
        
        if (nextIndex < this.assessmentProtocol.phases.length) {
            const nextPhase = this.assessmentProtocol.phases[nextIndex];
            
            // Check if special tests are needed based on findings
            if (nextPhase.id === 'special-tests' && !this.shouldPerformSpecialTests()) {
                return null; // Skip special tests
            }
            
            return nextPhase;
        }
        
        return null; // No more phases
    }

    /**
     * Determine if special tests should be performed
     */
    shouldPerformSpecialTests() {
        // Check if any findings warrant special tests
        const findings = Object.values(this.assessmentData.findings);
        
        return findings.some(finding => 
            finding.pain || 
            finding.limitation || 
            finding.positiveTest ||
            finding.needsFurtherEvaluation
        );
    }

    /**
     * Complete assessment and generate report
     */
    async completeAssessment() {
        try {
            console.log('🏁 Completing medical assessment...');
            
            const assessmentTime = Date.now() - this.assessmentStartTime;
            
            // Generate comprehensive report
            const report = await this.generateAssessmentReport();
            
            // Store assessment data
            const assessmentData = {
                patientId: this.assessmentData.patient?.id,
                startTime: new Date(this.assessmentStartTime),
                endTime: new Date(),
                duration: assessmentTime,
                findings: this.assessmentData.findings,
                recommendations: this.assessmentData.recommendations,
                redFlags: this.assessmentData.redFlags,
                measurements: this.assessmentData.measurements,
                report: report
            };
            
            // Save to database (would be implemented)
            await this.saveAssessment(assessmentData);
            
            return {
                success: true,
                completed: true,
                duration: assessmentTime,
                report: report,
                redFlags: this.assessmentData.redFlags,
                nextSteps: this.generateNextSteps()
            };
            
        } catch (error) {
            console.error('❌ Assessment completion failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate assessment report
     */
    async generateAssessmentReport() {
        if (!this.aiAnalyzer) {
            return { error: 'AI analyzer not available' };
        }
        
        return await this.aiAnalyzer.generateReport(this.assessmentData);
    }

    /**
     * Generate next steps
     */
    generateNextSteps() {
        const nextSteps = [];
        
        if (this.assessmentData.redFlags.length > 0) {
            nextSteps.push({
                priority: 'urgent',
                action: 'Medical consultation',
                timeframe: 'Within 24 hours',
                reason: 'Red flags identified'
            });
        }
        
        if (Object.keys(this.assessmentData.recommendations).length > 0) {
            nextSteps.push({
                priority: 'high',
                action: 'Begin treatment plan',
                timeframe: 'Within 1 week',
                reason: 'Assessment completed with recommendations'
            });
        }
        
        nextSteps.push({
            priority: 'medium',
            action: 'Follow-up assessment',
            timeframe: '2-4 weeks',
            reason: 'Monitor progress and adjust treatment'
        });
        
        return nextSteps;
    }

    /**
     * Load patient data
     */
    async loadPatientData(patientId) {
        // Mock patient data - would be from database
        this.assessmentData.patient = {
            id: patientId,
            name: 'Patient Demo',
            age: 35,
            gender: 'female',
            height: 165, // cm
            weight: 65, // kg
            bmi: 23.9,
            chiefComplaint: 'Lower back pain',
            history: '2 weeks of pain, worse with bending'
        };
    }

    /**
     * Save assessment to database
     */
    async saveAssessment(assessmentData) {
        // Mock save - would implement database save
        console.log('💾 Saving assessment data:', assessmentData);
        return { success: true, id: 'assessment_' + Date.now() };
    }

    /**
     * Handle errors
     */
    handleError(error) {
        console.error('Assessment workflow error:', error);
    }

    /**
     * Get assessment status
     */
    getStatus() {
        return {
            phase: this.currentPhase,
            phaseIndex: this.assessmentProtocol.phases.findIndex(p => p.id === this.currentPhase),
            totalPhases: this.assessmentProtocol.phases.length,
            tracking: this.cameraIntegration?.isTracking || false,
            connected: this.cameraIntegration?.isConnected || false,
            duration: this.assessmentStartTime ? Date.now() - this.assessmentStartTime : 0
        };
    }
}

// Export for use in other modules
window.MedicalAssessmentWorkflow = MedicalAssessmentWorkflow;