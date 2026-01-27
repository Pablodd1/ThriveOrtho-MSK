/**
 * Biomechanical Analysis Engine
 * Analyzes normalized motion capture data to calculate:
 * - Risk scores
 * - Range of Motion (ROM) measurements
 * - Movement deficiencies
 * - Injury predictions
 * - Functional assessments
 */

class BiomechanicalAnalyzer {
    constructor() {
        // Normal ROM ranges (degrees) - clinical standards
        this.normalRanges = {
            hip_flexion: { min: 115, max: 125, optimal: 120 },
            hip_extension: { min: 15, max: 25, optimal: 20 },
            hip_abduction: { min: 40, max: 50, optimal: 45 },
            hip_adduction: { min: 25, max: 35, optimal: 30 },
            knee_flexion: { min: 130, max: 145, optimal: 135 },
            knee_extension: { min: 0, max: 5, optimal: 0 },
            ankle_dorsiflexion: { min: 15, max: 25, optimal: 20 },
            ankle_plantarflexion: { min: 40, max: 55, optimal: 50 },
            lumbar_flexion: { min: 75, max: 85, optimal: 80 },
            lumbar_extension: { min: 20, max: 30, optimal: 25 },
            shoulder_flexion: { min: 170, max: 180, optimal: 175 },
            shoulder_abduction: { min: 170, max: 180, optimal: 175 }
        };

        // Functional movement thresholds
        this.functionalThresholds = {
            squat_depth_angle: 90, // Hip angle at bottom of squat
            single_leg_stance_time: 20, // seconds
            balance_sway_area: 3.5, // cm²
            trunk_lean_max: 20, // degrees
            knee_valgus_max: 10 // degrees
        };

        // Risk weights for different factors
        this.riskWeights = {
            rom_limitation: 0.25,
            strength_deficit: 0.20,
            balance_impairment: 0.20,
            movement_quality: 0.20,
            age_factor: 0.10,
            previous_injury: 0.05
        };
    }

    /**
     * Main analysis function - analyzes all aspects of movement data
     */
    async analyze(normalizedData, patientInfo = {}) {
        console.log('Starting biomechanical analysis...', normalizedData);
        
        const analysis = {
            timestamp: new Date().toISOString(),
            patient: patientInfo,
            rawData: normalizedData,
            
            // Core analyses
            romAnalysis: this.analyzeROM(normalizedData),
            functionalMovement: this.analyzeFunctionalMovement(normalizedData),
            balanceAssessment: this.analyzeBalance(normalizedData),
            movementQuality: this.analyzeMovementQuality(normalizedData),
            
            // Derived assessments
            riskScore: 0,
            deficiencies: [],
            injuryPredictions: [],
            recommendations: []
        };
        
        // Calculate overall risk score
        analysis.riskScore = this.calculateRiskScore(analysis, patientInfo);
        
        // Identify movement deficiencies
        analysis.deficiencies = this.identifyDeficiencies(analysis);
        
        // Predict injury risks
        analysis.injuryPredictions = this.predictInjuries(analysis, patientInfo);
        
        // Generate recommendations
        analysis.recommendations = this.generateRecommendations(analysis);
        
        console.log('Analysis complete:', analysis);
        return analysis;
    }

    /**
     * Analyze Range of Motion
     */
    analyzeROM(data) {
        const { summary } = data;
        const rom = {};
        
        // Analyze each joint
        for (const [angleName, avgValue] of Object.entries(summary.avgAngles || {})) {
            const normalRange = this.normalRanges[angleName];
            
            if (normalRange) {
                const range = summary.rangeOfMotion[angleName] || 0;
                const percentOfNormal = (avgValue / normalRange.optimal) * 100;
                
                let status = 'Normal';
                let limitation = 0;
                
                if (avgValue < normalRange.min * 0.7) {
                    status = 'Severely Limited';
                    limitation = ((normalRange.min - avgValue) / normalRange.min) * 100;
                } else if (avgValue < normalRange.min) {
                    status = 'Limited';
                    limitation = ((normalRange.min - avgValue) / normalRange.min) * 100;
                } else if (avgValue > normalRange.max * 1.2) {
                    status = 'Hypermobile';
                    limitation = ((avgValue - normalRange.max) / normalRange.max) * 100;
                }
                
                rom[angleName] = {
                    avgValue: Math.round(avgValue),
                    range,
                    normalMin: normalRange.min,
                    normalMax: normalRange.max,
                    percentOfNormal: Math.round(percentOfNormal),
                    status,
                    limitation: Math.round(limitation)
                };
            }
        }
        
        return rom;
    }

    /**
     * Analyze functional movement patterns
     */
    analyzeFunctionalMovement(data) {
        const { frames, summary } = data;
        
        const functional = {
            squat: this.analyzeSquatPattern(frames, summary),
            gait: this.analyzeGaitPattern(frames, summary),
            reach: this.analyzeReachPattern(frames, summary)
        };
        
        return functional;
    }

    /**
     * Analyze squat pattern
     */
    analyzeSquatPattern(frames, summary) {
        const hipFlexionAvg = summary.avgAngles.hip_flexion_left || summary.avgAngles.hip_flexion_right || 0;
        const kneeFlexionAvg = summary.avgAngles.knee_flexion_left || summary.avgAngles.knee_flexion_right || 0;
        
        const squat = {
            hipAngle: Math.round(hipFlexionAvg),
            kneeAngle: Math.round(kneeFlexionAvg),
            depth: hipFlexionAvg >= this.functionalThresholds.squat_depth_angle ? 'Adequate' : 'Limited',
            kneeAlignment: 'Good', // Simplified - would need lateral data
            trunkLean: 15, // Simplified - would calculate from spine angles
            quality: 'Fair'
        };
        
        // Assess quality
        if (hipFlexionAvg >= 90 && kneeFlexionAvg >= 90) {
            squat.quality = 'Good';
        } else if (hipFlexionAvg < 70 || kneeFlexionAvg < 70) {
            squat.quality = 'Poor';
        }
        
        return squat;
    }

    /**
     * Analyze gait pattern
     */
    analyzeGaitPattern(frames, summary) {
        const hipFlexionLeft = summary.avgAngles.hip_flexion_left || 0;
        const hipFlexionRight = summary.avgAngles.hip_flexion_right || 0;
        const asymmetry = Math.abs(hipFlexionLeft - hipFlexionRight);
        
        return {
            leftHipFlexion: Math.round(hipFlexionLeft),
            rightHipFlexion: Math.round(hipFlexionRight),
            asymmetry: Math.round(asymmetry),
            asymmetryPercent: hipFlexionRight > 0 ? Math.round((asymmetry / hipFlexionRight) * 100) : 0,
            status: asymmetry < 5 ? 'Symmetric' : asymmetry < 15 ? 'Mild Asymmetry' : 'Significant Asymmetry'
        };
    }

    /**
     * Analyze reach pattern
     */
    analyzeReachPattern(frames, summary) {
        const shoulderFlexionAvg = (summary.avgAngles.shoulder_flexion_left || 0 + summary.avgAngles.shoulder_flexion_right || 0) / 2;
        
        return {
            shoulderFlexion: Math.round(shoulderFlexionAvg),
            range: shoulderFlexionAvg >= 170 ? 'Full' : shoulderFlexionAvg >= 140 ? 'Functional' : 'Limited',
            quality: shoulderFlexionAvg >= 160 ? 'Good' : 'Fair'
        };
    }

    /**
     * Analyze balance
     */
    analyzeBalance(data) {
        const { frames, summary } = data;
        
        // Simplified balance analysis (would need actual COP/sway data)
        const hipFlexionLeft = summary.avgAngles.hip_flexion_left || 0;
        const hipFlexionRight = summary.avgAngles.hip_flexion_right || 0;
        const asymmetry = Math.abs(hipFlexionLeft - hipFlexionRight);
        
        const balance = {
            singleLegStance: {
                left: {
                    holdTime: asymmetry < 10 ? 24.3 : 18.5,
                    swayArea: asymmetry < 10 ? 2.8 : 3.9,
                    status: asymmetry < 10 ? 'Good' : 'Fair'
                },
                right: {
                    holdTime: asymmetry < 10 ? 22.1 : 16.2,
                    swayArea: asymmetry < 10 ? 3.1 : 4.8,
                    status: asymmetry < 10 ? 'Good' : 'Poor'
                }
            },
            asymmetry: Math.round(asymmetry),
            fallRisk: asymmetry > 20 ? 'Elevated' : asymmetry > 10 ? 'Moderate' : 'Low'
        };
        
        return balance;
    }

    /**
     * Analyze movement quality
     */
    analyzeMovementQuality(data) {
        const { frames, summary } = data;
        
        // Calculate smoothness (variance in angles)
        const angleVariances = {};
        for (const angleKey of Object.keys(summary.avgAngles || {})) {
            const values = frames.map(f => f.angles[angleKey]).filter(v => v !== undefined);
            angleVariances[angleKey] = this.calculateVariance(values);
        }
        
        const avgVariance = Object.values(angleVariances).reduce((a, b) => a + b, 0) / Object.values(angleVariances).length;
        
        return {
            smoothness: avgVariance < 10 ? 'Smooth' : avgVariance < 20 ? 'Moderate' : 'Jerky',
            consistency: avgVariance < 15 ? 'High' : 'Low',
            coordinationScore: Math.max(0, 100 - avgVariance),
            compensatoryPatterns: avgVariance > 20 ? ['Detected'] : []
        };
    }

    /**
     * Calculate overall risk score (0-100, higher = more risk)
     */
    calculateRiskScore(analysis, patientInfo) {
        let score = 0;
        
        // ROM limitations (0-25 points)
        const romLimitations = Object.values(analysis.romAnalysis).filter(r => r.status !== 'Normal').length;
        const totalRomTests = Object.keys(analysis.romAnalysis).length;
        score += (romLimitations / Math.max(totalRomTests, 1)) * 25 * (1 / this.riskWeights.rom_limitation);
        
        // Balance impairment (0-20 points)
        const fallRisk = analysis.balanceAssessment.fallRisk;
        if (fallRisk === 'Elevated') score += 20;
        else if (fallRisk === 'Moderate') score += 12;
        else score += 5;
        
        // Movement quality (0-20 points)
        const quality = analysis.movementQuality;
        if (quality.smoothness === 'Jerky') score += 15;
        else if (quality.smoothness === 'Moderate') score += 8;
        
        // Functional movement (0-20 points)
        if (analysis.functionalMovement.squat.quality === 'Poor') score += 15;
        else if (analysis.functionalMovement.squat.quality === 'Fair') score += 8;
        
        // Age factor (0-10 points)
        const age = patientInfo.age || 30;
        if (age > 65) score += 10;
        else if (age > 50) score += 6;
        else if (age > 35) score += 3;
        
        // Previous injury (0-5 points)
        if (patientInfo.previousInjury) score += 5;
        
        return Math.min(100, Math.round(score));
    }

    /**
     * Identify movement deficiencies
     */
    identifyDeficiencies(analysis) {
        const deficiencies = [];
        
        // Check ROM limitations
        for (const [joint, data] of Object.entries(analysis.romAnalysis)) {
            if (data.status === 'Severely Limited' || data.status === 'Limited') {
                deficiencies.push({
                    type: 'ROM Limitation',
                    joint: joint.replace(/_/g, ' ').toUpperCase(),
                    severity: data.status === 'Severely Limited' ? 'Critical' : 'Moderate',
                    value: `${data.avgValue}° (Normal: ${data.normalMin}-${data.normalMax}°)`,
                    impact: `${data.limitation}% below normal`,
                    recommendation: `Improve ${joint.replace(/_/g, ' ')} flexibility through targeted stretching and mobility exercises`
                });
            }
        }
        
        // Check balance asymmetry
        const balanceAsymmetry = analysis.balanceAssessment.asymmetry;
        if (balanceAsymmetry > 15) {
            const side = analysis.balanceAssessment.singleLegStance.left.holdTime > 
                         analysis.balanceAssessment.singleLegStance.right.holdTime ? 'RIGHT' : 'LEFT';
            
            deficiencies.push({
                type: 'Balance Asymmetry',
                joint: `${side} Leg Balance`,
                severity: balanceAsymmetry > 25 ? 'Critical' : 'Moderate',
                value: `${balanceAsymmetry}% asymmetry`,
                impact: `Fall risk elevated`,
                recommendation: `Single leg balance training focusing on ${side.toLowerCase()} side, proprioceptive exercises`
            });
        }
        
        // Check squat quality
        if (analysis.functionalMovement.squat.quality === 'Poor') {
            deficiencies.push({
                type: 'Functional Movement',
                joint: 'Squat Pattern',
                severity: 'Moderate',
                value: `Hip: ${analysis.functionalMovement.squat.hipAngle}° (Target: 90°+)`,
                impact: 'Limited functional capacity',
                recommendation: 'Progressive squat training with focus on depth and control'
            });
        }
        
        // Check movement quality
        if (analysis.movementQuality.smoothness === 'Jerky') {
            deficiencies.push({
                type: 'Movement Quality',
                joint: 'Overall Coordination',
                severity: 'Mild',
                value: `Coordination score: ${Math.round(analysis.movementQuality.coordinationScore)}/100`,
                impact: 'Increased injury risk, reduced performance',
                recommendation: 'Motor control exercises, slow controlled movements, neuromuscular training'
            });
        }
        
        // Sort by severity
        const severityOrder = { 'Critical': 0, 'Moderate': 1, 'Mild': 2 };
        deficiencies.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
        
        return deficiencies;
    }

    /**
     * Predict injury risks
     */
    predictInjuries(analysis, patientInfo) {
        const predictions = [];
        
        // Lower back injury risk
        const lumbarFlexion = analysis.romAnalysis.lumbar_flexion;
        const lumbarExtension = analysis.romAnalysis.lumbar_extension;
        
        if ((lumbarFlexion && lumbarFlexion.status !== 'Normal') || 
            (lumbarExtension && lumbarExtension.status !== 'Normal')) {
            
            let probability = 0.45;
            if (lumbarFlexion && lumbarFlexion.status === 'Severely Limited') probability += 0.20;
            if (patientInfo.age > 50) probability += 0.10;
            
            predictions.push({
                injury: 'Lower Back Strain/Injury',
                probability: Math.min(0.95, probability),
                riskFactors: [
                    lumbarFlexion?.status !== 'Normal' ? 'Limited lumbar flexion' : null,
                    lumbarExtension?.status !== 'Normal' ? 'Limited lumbar extension' : null,
                    analysis.functionalMovement.squat.quality === 'Poor' ? 'Poor squat mechanics' : null,
                    patientInfo.age > 50 ? 'Age-related tissue changes' : null
                ].filter(Boolean),
                prevention: [
                    'Core strengthening exercises',
                    'Lumbar mobility work',
                    'Proper body mechanics training',
                    'Gradual load progression'
                ]
            });
        }
        
        // Fall/hip fracture risk
        if (analysis.balanceAssessment.fallRisk !== 'Low') {
            let probability = 0.25;
            if (analysis.balanceAssessment.fallRisk === 'Elevated') probability += 0.20;
            if (patientInfo.age > 65) probability += 0.15;
            
            predictions.push({
                injury: 'Fall Risk / Hip Fracture',
                probability: Math.min(0.95, probability),
                riskFactors: [
                    `${analysis.balanceAssessment.fallRisk} fall risk`,
                    `Balance asymmetry: ${analysis.balanceAssessment.asymmetry}%`,
                    patientInfo.age > 65 ? 'Age > 65 years' : null
                ].filter(Boolean),
                prevention: [
                    'Balance training exercises',
                    'Strength training (especially lower body)',
                    'Home safety modifications',
                    'Vision and medication review'
                ]
            });
        }
        
        // Knee injury risk
        const kneeFlexionLeft = analysis.romAnalysis.knee_flexion_left;
        const kneeFlexionRight = analysis.romAnalysis.knee_flexion_right;
        
        if ((kneeFlexionLeft && kneeFlexionLeft.status !== 'Normal') ||
            (kneeFlexionRight && kneeFlexionRight.status !== 'Normal')) {
            
            predictions.push({
                injury: 'Knee Injury (Meniscus/Ligament)',
                probability: 0.30,
                riskFactors: [
                    'Limited knee ROM',
                    analysis.functionalMovement.squat.kneeAlignment !== 'Good' ? 'Poor knee alignment' : null,
                    'Compensatory movement patterns'
                ].filter(Boolean),
                prevention: [
                    'Quadriceps strengthening',
                    'Hamstring flexibility work',
                    'Neuromuscular control training',
                    'Proper movement mechanics'
                ]
            });
        }
        
        // Sort by probability (highest first)
        predictions.sort((a, b) => b.probability - a.probability);
        
        return predictions;
    }

    /**
     * Generate recommendations
     */
    generateRecommendations(analysis) {
        const recommendations = [];
        
        // ROM recommendations
        const limitedJoints = Object.entries(analysis.romAnalysis)
            .filter(([_, data]) => data.status !== 'Normal')
            .map(([joint, _]) => joint);
        
        if (limitedJoints.length > 0) {
            recommendations.push({
                category: 'Mobility',
                priority: 'High',
                description: 'Address ROM limitations through targeted stretching and mobility work',
                exercises: [
                    'Daily stretching routine (10-15 minutes)',
                    'Foam rolling for tight muscles',
                    'Dynamic warm-up before activity'
                ]
            });
        }
        
        // Balance recommendations
        if (analysis.balanceAssessment.fallRisk !== 'Low') {
            recommendations.push({
                category: 'Balance',
                priority: 'High',
                description: 'Improve balance and reduce fall risk',
                exercises: [
                    'Single leg stance exercises (30 sec holds, 3x/day)',
                    'Tandem walking',
                    'Balance board training',
                    'Tai Chi or yoga'
                ]
            });
        }
        
        // Strength recommendations
        const deficiencies = analysis.deficiencies.filter(d => d.type === 'ROM Limitation' || d.type === 'Balance Asymmetry');
        
        if (deficiencies.length > 0) {
            recommendations.push({
                category: 'Strength',
                priority: 'Moderate',
                description: 'Build strength to support movement patterns',
                exercises: [
                    'Progressive resistance training (2-3x/week)',
                    'Core strengthening exercises',
                    'Functional movement patterns (squats, lunges, step-ups)'
                ]
            });
        }
        
        return recommendations;
    }

    /**
     * Calculate variance helper function
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
    window.BiomechanicalAnalyzer = BiomechanicalAnalyzer;
}
