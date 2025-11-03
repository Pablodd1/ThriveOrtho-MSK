/**
 * Real-Time Exercise Form Correction AI
 * Provides voice and visual feedback during exercise execution
 */

class FormCorrectionAI {
    constructor(options = {}) {
        this.enabled = options.enabled !== false;
        this.voiceEnabled = options.voiceEnabled !== false;
        this.visualEnabled = options.visualEnabled !== false;
        this.feedbackDelay = options.feedbackDelay || 2000; // 2 seconds between feedback
        this.lastFeedbackTime = 0;
        this.currentExercise = null;
        this.feedbackHistory = [];
        
        // Initialize speech synthesis
        this.speech = window.speechSynthesis;
        this.voiceQueue = [];
        
        // Correction rules database
        this.correctionRules = this.initializeCorrectionRules();
        
        // Performance metrics
        this.sessionMetrics = {
            totalCorrections: 0,
            formErrors: [],
            improvementRate: 0
        };
    }
    
    initializeCorrectionRules() {
        return {
            'Bodyweight Squat': {
                hip_angle: {
                    min: 70,
                    max: 110,
                    optimal: 90,
                    error_low: "Go deeper! Aim for 90 degrees at the hips.",
                    error_high: "Don't squat too shallow. Get your hips lower.",
                    good: "Perfect depth! Great form!"
                },
                knee_angle: {
                    min: 70,
                    max: 110,
                    optimal: 90,
                    error_low: "Excellent depth on those knees!",
                    error_high: "Try to bend your knees more.",
                    good: "Perfect knee bend!"
                },
                knee_alignment: {
                    max_valgus: 10, // degrees of inward collapse allowed
                    error: "Watch your knee alignment - keep your knees tracking over your toes!",
                    good: "Great knee alignment!"
                },
                symmetry: {
                    max_difference: 15, // degrees
                    error: "You're favoring one side. Try to keep both legs even.",
                    good: "Nice symmetry between left and right!"
                },
                speed: {
                    min_frames_per_rep: 40, // ~1.3 seconds minimum
                    error_too_fast: "Slow down! Control the movement.",
                    error_too_slow: "You can move a bit faster. Maintain steady tempo.",
                    good: "Perfect tempo!"
                }
            },
            'Hip Flexor Stretch': {
                hip_angle: {
                    min: 100,
                    max: 150,
                    optimal: 130,
                    error_low: "Great stretch! Hold this position.",
                    error_high: "Stretch deeper for better hip flexor engagement.",
                    good: "Perfect stretch depth!"
                },
                back_alignment: {
                    max_arch: 20,
                    error: "Keep your back straight - avoid arching too much!",
                    good: "Excellent spinal alignment!"
                }
            },
            'Single Leg Balance': {
                hip_stability: {
                    max_sway: 15,
                    error: "Try to minimize hip movement. Engage your core!",
                    good: "Rock solid stability!"
                },
                duration: {
                    target: 30, // seconds
                    feedback_intervals: [10, 20, 30],
                    messages: ["10 seconds down, keep it up!", "20 seconds - halfway there!", "30 seconds - excellent!"]
                }
            },
            'Shoulder Flexion Test': {
                shoulder_angle: {
                    min: 140,
                    max: 180,
                    optimal: 170,
                    error_low: "Raise your arms higher!",
                    error_high: "Full range achieved!",
                    good: "Perfect shoulder flexion!"
                },
                shoulder_symmetry: {
                    max_difference: 15,
                    error: "Keep both arms at the same height.",
                    good: "Nice even shoulders!"
                }
            }
        };
    }
    
    /**
     * Analyze form in real-time based on skeleton data
     * @param {Object} skeletonData - Current frame skeleton data with joint angles
     * @param {String} exerciseName - Name of current exercise
     * @returns {Object} Feedback object with corrections and praise
     */
    analyzeForm(skeletonData, exerciseName) {
        if (!this.enabled || !skeletonData || !exerciseName) return null;
        
        const now = Date.now();
        if (now - this.lastFeedbackTime < this.feedbackDelay) {
            return null; // Too soon for new feedback
        }
        
        const rules = this.correctionRules[exerciseName];
        if (!rules) return null;
        
        const feedback = {
            timestamp: now,
            exercise: exerciseName,
            corrections: [],
            praise: [],
            severity: 'none', // none, low, medium, high
            speak: true
        };
        
        // Analyze based on exercise type
        if (exerciseName === 'Bodyweight Squat') {
            feedback = this.analyzeSquat(skeletonData, rules, feedback);
        } else if (exerciseName === 'Hip Flexor Stretch') {
            feedback = this.analyzeHipFlexor(skeletonData, rules, feedback);
        } else if (exerciseName === 'Single Leg Balance') {
            feedback = this.analyzeBalance(skeletonData, rules, feedback);
        } else if (exerciseName === 'Shoulder Flexion Test') {
            feedback = this.analyzeShoulder(skeletonData, rules, feedback);
        }
        
        // Only provide feedback if there's something to say
        if (feedback.corrections.length > 0 || feedback.praise.length > 0) {
            this.lastFeedbackTime = now;
            this.sessionMetrics.totalCorrections += feedback.corrections.length;
            this.feedbackHistory.push(feedback);
            
            // Provide voice feedback
            if (this.voiceEnabled && feedback.speak) {
                this.provideFeedback(feedback);
            }
            
            return feedback;
        }
        
        return null;
    }
    
    analyzeSquat(data, rules, feedback) {
        const avgHip = (data.hip_left + data.hip_right) / 2;
        const avgKnee = (data.knee_left + data.knee_right) / 2;
        const hipDiff = Math.abs(data.hip_left - data.hip_right);
        const kneeDiff = Math.abs(data.knee_left - data.knee_right);
        
        // Check hip angle
        if (avgHip < rules.hip_angle.min) {
            feedback.corrections.push({
                type: 'hip_depth',
                message: rules.hip_angle.error_low,
                severity: 'medium'
            });
            feedback.severity = 'medium';
        } else if (avgHip > rules.hip_angle.max) {
            feedback.corrections.push({
                type: 'hip_depth',
                message: rules.hip_angle.error_high,
                severity: 'low'
            });
            feedback.severity = 'low';
        } else if (Math.abs(avgHip - rules.hip_angle.optimal) < 10) {
            feedback.praise.push(rules.hip_angle.good);
        }
        
        // Check knee angle
        if (avgKnee > rules.knee_angle.max) {
            feedback.corrections.push({
                type: 'knee_depth',
                message: rules.knee_angle.error_high,
                severity: 'medium'
            });
            feedback.severity = 'medium';
        } else if (Math.abs(avgKnee - rules.knee_angle.optimal) < 10) {
            feedback.praise.push(rules.knee_angle.good);
        }
        
        // Check symmetry
        if (hipDiff > rules.symmetry.max_difference || kneeDiff > rules.symmetry.max_difference) {
            feedback.corrections.push({
                type: 'symmetry',
                message: rules.symmetry.error,
                severity: 'high'
            });
            feedback.severity = 'high';
        } else if (hipDiff < 5 && kneeDiff < 5) {
            feedback.praise.push(rules.symmetry.good);
        }
        
        return feedback;
    }
    
    analyzeHipFlexor(data, rules, feedback) {
        const avgHip = (data.hip_left + data.hip_right) / 2;
        
        if (avgHip < rules.hip_angle.min) {
            feedback.praise.push(rules.hip_angle.error_low);
        } else if (avgHip > rules.hip_angle.max) {
            feedback.corrections.push({
                type: 'stretch_depth',
                message: rules.hip_angle.error_high,
                severity: 'low'
            });
            feedback.severity = 'low';
        } else if (Math.abs(avgHip - rules.hip_angle.optimal) < 10) {
            feedback.praise.push(rules.hip_angle.good);
        }
        
        return feedback;
    }
    
    analyzeBalance(data, rules, feedback) {
        // Check hip stability (sway detection)
        const hipSway = Math.abs(data.hip_left - 180) + Math.abs(data.hip_right - 180);
        
        if (hipSway > rules.hip_stability.max_sway) {
            feedback.corrections.push({
                type: 'stability',
                message: rules.hip_stability.error,
                severity: 'medium'
            });
            feedback.severity = 'medium';
        } else if (hipSway < 5) {
            feedback.praise.push(rules.hip_stability.good);
        }
        
        return feedback;
    }
    
    analyzeShoulder(data, rules, feedback) {
        const avgShoulder = (data.shoulder_left + data.shoulder_right) / 2;
        const shoulderDiff = Math.abs(data.shoulder_left - data.shoulder_right);
        
        if (avgShoulder < rules.shoulder_angle.min) {
            feedback.corrections.push({
                type: 'shoulder_height',
                message: rules.shoulder_angle.error_low,
                severity: 'medium'
            });
            feedback.severity = 'medium';
        } else if (avgShoulder >= rules.shoulder_angle.min && avgShoulder < rules.shoulder_angle.optimal) {
            feedback.praise.push(rules.shoulder_angle.good);
        }
        
        if (shoulderDiff > rules.shoulder_symmetry.max_difference) {
            feedback.corrections.push({
                type: 'shoulder_symmetry',
                message: rules.shoulder_symmetry.error,
                severity: 'medium'
            });
            feedback.severity = 'medium';
        } else if (shoulderDiff < 5) {
            feedback.praise.push(rules.shoulder_symmetry.good);
        }
        
        return feedback;
    }
    
    /**
     * Provide voice feedback using speech synthesis
     */
    provideFeedback(feedback) {
        if (!this.speech) return;
        
        // Cancel any ongoing speech
        this.speech.cancel();
        
        let message = '';
        
        // Prioritize corrections over praise
        if (feedback.corrections.length > 0) {
            // Take the highest severity correction
            const sortedCorrections = feedback.corrections.sort((a, b) => {
                const severity = { high: 3, medium: 2, low: 1 };
                return severity[b.severity] - severity[a.severity];
            });
            message = sortedCorrections[0].message;
        } else if (feedback.praise.length > 0) {
            message = feedback.praise[Math.floor(Math.random() * feedback.praise.length)];
        }
        
        if (message) {
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.rate = 0.9; // Slightly slower for clarity
            utterance.pitch = 1.0;
            utterance.volume = 0.8;
            
            this.speech.speak(utterance);
        }
    }
    
    /**
     * Get visual feedback overlay (returns HTML for display)
     */
    getVisualFeedback(feedback) {
        if (!feedback || !this.visualEnabled) return '';
        
        const severityColors = {
            high: '#EF4444',    // Red
            medium: '#F59E0B',  // Orange
            low: '#3B82F6',     // Blue
            none: '#10B981'     // Green
        };
        
        const color = severityColors[feedback.severity] || severityColors.none;
        
        let html = '<div class="form-feedback-overlay" style="position: fixed; top: 100px; right: 20px; max-width: 300px; z-index: 1000;">';
        
        // Corrections
        if (feedback.corrections.length > 0) {
            html += '<div class="feedback-corrections" style="background: white; border-left: 4px solid ' + color + '; padding: 15px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 10px;">';
            html += '<div style="font-weight: bold; color: ' + color + '; margin-bottom: 8px; display: flex; align-items: center;"><i class="fas fa-exclamation-circle" style="margin-right: 8px;"></i>Form Correction:</div>';
            feedback.corrections.forEach(c => {
                html += '<div style="color: #374151; font-size: 14px; line-height: 1.5;">' + c.message + '</div>';
            });
            html += '</div>';
        }
        
        // Praise
        if (feedback.praise.length > 0 && feedback.corrections.length === 0) {
            html += '<div class="feedback-praise" style="background: white; border-left: 4px solid #10B981; padding: 15px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">';
            html += '<div style="font-weight: bold; color: #10B981; margin-bottom: 8px; display: flex; align-items: center;"><i class="fas fa-check-circle" style="margin-right: 8px;"></i>Great Form!</div>';
            feedback.praise.forEach(p => {
                html += '<div style="color: #374151; font-size: 14px; line-height: 1.5;">' + p + '</div>';
            });
            html += '</div>';
        }
        
        html += '</div>';
        
        return html;
    }
    
    /**
     * Get session summary
     */
    getSessionSummary() {
        const totalFeedback = this.feedbackHistory.length;
        const corrections = this.sessionMetrics.totalCorrections;
        const praise = this.feedbackHistory.filter(f => f.praise.length > 0 && f.corrections.length === 0).length;
        
        // Calculate improvement rate (later feedback has fewer corrections = improvement)
        const firstHalf = this.feedbackHistory.slice(0, Math.floor(totalFeedback / 2));
        const secondHalf = this.feedbackHistory.slice(Math.floor(totalFeedback / 2));
        
        const firstHalfCorrections = firstHalf.reduce((sum, f) => sum + f.corrections.length, 0);
        const secondHalfCorrections = secondHalf.reduce((sum, f) => sum + f.corrections.length, 0);
        
        const improvementRate = firstHalf.length > 0 ? 
            ((firstHalfCorrections - secondHalfCorrections) / firstHalfCorrections * 100) : 0;
        
        return {
            totalFeedback,
            corrections,
            praise,
            improvementRate: Math.round(improvementRate),
            formQuality: corrections === 0 ? 'Excellent' : 
                        corrections <= 3 ? 'Good' : 
                        corrections <= 6 ? 'Fair' : 'Needs Improvement'
        };
    }
    
    /**
     * Reset session
     */
    reset() {
        this.feedbackHistory = [];
        this.sessionMetrics = {
            totalCorrections: 0,
            formErrors: [],
            improvementRate: 0
        };
        this.lastFeedbackTime = 0;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormCorrectionAI;
}
