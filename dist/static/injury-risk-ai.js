/**
 * Predictive Injury Risk Assessment AI
 * Analyzes movement patterns to predict injury risk
 */

class InjuryRiskAI {
    constructor() {
        this.riskFactors = [];
        this.riskScore = 0; // 0-100 (higher = more risk)
        this.injuryPredictions = [];
    }
    
    /**
     * Analyze assessment data for injury risk
     * @param {Object} assessmentData - Complete assessment with all tests
     * @param {Object} patientData - Patient demographics
     * @returns {Object} Risk assessment with predictions and recommendations
     */
    async analyzeInjuryRisk(assessmentData, patientData) {
        this.riskFactors = [];
        this.injuryPredictions = [];
        
        const tests = assessmentData.tests || [];
        const age = this.calculateAge(patientData.date_of_birth);
        const bmi = this.calculateBMI(patientData.height_cm, patientData.weight_kg);
        
        // Risk Factor 1: Age
        this.assessAgeRisk(age);
        
        // Risk Factor 2: BMI
        this.assessBMIRisk(bmi);
        
        // Risk Factor 3: Movement Asymmetries
        this.assessAsymmetryRisk(tests);
        
        // Risk Factor 4: ROM Deficits
        this.assessROMRisk(tests);
        
        // Risk Factor 5: Balance/Stability
        this.assessBalanceRisk(tests);
        
        // Risk Factor 6: Compensation Patterns
        this.assessCompensationRisk(tests);
        
        // Risk Factor 7: Previous Injury Indicators
        this.assessPreviousInjuryRisk(patientData);
        
        // Calculate overall risk score
        this.calculateOverallRisk();
        
        // Generate injury predictions
        this.generateInjuryPredictions(tests, patientData);
        
        // Generate recommendations
        const recommendations = this.generateRecommendations();
        
        return {
            riskScore: this.riskScore,
            riskLevel: this.getRiskLevel(),
            riskFactors: this.riskFactors,
            injuryPredictions: this.injuryPredictions,
            recommendations: recommendations,
            summary: this.generateSummary()
        };
    }
    
    assessAgeRisk(age) {
        if (age > 65) {
            this.riskFactors.push({
                category: 'Age',
                factor: 'Advanced Age',
                points: 15,
                description: `Age ${age} - Increased risk of falls, fractures, and musculoskeletal injuries`,
                severity: 'medium'
            });
        } else if (age > 50) {
            this.riskFactors.push({
                category: 'Age',
                factor: 'Middle Age',
                points: 8,
                description: `Age ${age} - Moderate risk, tissue healing slower than younger patients`,
                severity: 'low'
            });
        } else if (age < 25) {
            this.riskFactors.push({
                category: 'Age',
                factor: 'Young Adult',
                points: 5,
                description: `Age ${age} - Higher activity level may increase injury risk`,
                severity: 'low'
            });
        }
    }
    
    assessBMIRisk(bmi) {
        if (bmi > 30) {
            this.riskFactors.push({
                category: 'BMI',
                factor: 'Obesity',
                points: 20,
                description: `BMI ${bmi.toFixed(1)} - Significantly increased stress on joints, especially knees, hips, and ankles`,
                severity: 'high'
            });
        } else if (bmi > 25) {
            this.riskFactors.push({
                category: 'BMI',
                factor: 'Overweight',
                points: 10,
                description: `BMI ${bmi.toFixed(1)} - Increased joint loading, moderate injury risk`,
                severity: 'medium'
            });
        } else if (bmi < 18.5) {
            this.riskFactors.push({
                category: 'BMI',
                factor: 'Underweight',
                points: 8,
                description: `BMI ${bmi.toFixed(1)} - Potential muscle weakness, reduced shock absorption`,
                severity: 'low'
            });
        }
    }
    
    assessAsymmetryRisk(tests) {
        tests.forEach(test => {
            const data = test.skeleton_data ? JSON.parse(test.skeleton_data) : {};
            const angles = data.angles || [];
            
            if (angles.length === 0) return;
            
            // Calculate average asymmetry
            let totalHipAsymmetry = 0;
            let totalKneeAsymmetry = 0;
            
            angles.forEach(frame => {
                totalHipAsymmetry += Math.abs(frame.hip_left - frame.hip_right);
                totalKneeAsymmetry += Math.abs(frame.knee_left - frame.knee_right);
            });
            
            const avgHipAsymmetry = totalHipAsymmetry / angles.length;
            const avgKneeAsymmetry = totalKneeAsymmetry / angles.length;
            
            if (avgHipAsymmetry > 20) {
                this.riskFactors.push({
                    category: 'Asymmetry',
                    factor: 'Severe Hip Asymmetry',
                    points: 25,
                    description: `${avgHipAsymmetry.toFixed(1)}° hip asymmetry in ${test.test_name} - High risk for compensatory injuries`,
                    severity: 'high',
                    test: test.test_name
                });
            } else if (avgHipAsymmetry > 15) {
                this.riskFactors.push({
                    category: 'Asymmetry',
                    factor: 'Moderate Hip Asymmetry',
                    points: 15,
                    description: `${avgHipAsymmetry.toFixed(1)}° hip asymmetry in ${test.test_name}`,
                    severity: 'medium',
                    test: test.test_name
                });
            }
            
            if (avgKneeAsymmetry > 15) {
                this.riskFactors.push({
                    category: 'Asymmetry',
                    factor: 'Knee Asymmetry',
                    points: 20,
                    description: `${avgKneeAsymmetry.toFixed(1)}° knee asymmetry in ${test.test_name} - ACL/MCL injury risk`,
                    severity: 'high',
                    test: test.test_name
                });
            }
        });
    }
    
    assessROMRisk(tests) {
        tests.forEach(test => {
            const data = test.skeleton_data ? JSON.parse(test.skeleton_data) : {};
            const analysis = data.analysis || {};
            
            if (analysis.rom_score !== undefined) {
                if (analysis.rom_score < 60) {
                    this.riskFactors.push({
                        category: 'ROM Deficit',
                        factor: 'Severe ROM Limitation',
                        points: 25,
                        description: `ROM score ${analysis.rom_score.toFixed(0)}% in ${test.test_name} - Compensatory movement patterns likely`,
                        severity: 'high',
                        test: test.test_name
                    });
                } else if (analysis.rom_score < 75) {
                    this.riskFactors.push({
                        category: 'ROM Deficit',
                        factor: 'Moderate ROM Limitation',
                        points: 12,
                        description: `ROM score ${analysis.rom_score.toFixed(0)}% in ${test.test_name}`,
                        severity: 'medium',
                        test: test.test_name
                    });
                }
            }
        });
    }
    
    assessBalanceRisk(tests) {
        tests.forEach(test => {
            const data = test.skeleton_data ? JSON.parse(test.skeleton_data) : {};
            const analysis = data.analysis || {};
            
            if (analysis.balance_score !== undefined && analysis.balance_score < 65) {
                this.riskFactors.push({
                    category: 'Balance',
                    factor: 'Poor Balance/Stability',
                    points: 20,
                    description: `Balance score ${analysis.balance_score.toFixed(0)}% in ${test.test_name} - Fall risk elevated`,
                    severity: 'high',
                    test: test.test_name
                });
            }
        });
    }
    
    assessCompensationRisk(tests) {
        tests.forEach(test => {
            const data = test.skeleton_data ? JSON.parse(test.skeleton_data) : {};
            const analysis = data.analysis || {};
            const deficiencies = analysis.deficiencies || [];
            
            deficiencies.forEach(def => {
                if (def.severity === 'high') {
                    this.riskFactors.push({
                        category: 'Compensation',
                        factor: def.area,
                        points: 18,
                        description: `${def.description} - Compensation pattern detected`,
                        severity: 'high',
                        test: test.test_name
                    });
                } else if (def.severity === 'moderate') {
                    this.riskFactors.push({
                        category: 'Compensation',
                        factor: def.area,
                        points: 10,
                        description: def.description,
                        severity: 'medium',
                        test: test.test_name
                    });
                }
            });
        });
    }
    
    assessPreviousInjuryRisk(patientData) {
        // Check pain scale
        if (patientData.pain_scale >= 7) {
            this.riskFactors.push({
                category: 'Pain',
                factor: 'Severe Current Pain',
                points: 22,
                description: `Pain level ${patientData.pain_scale}/10 - Movement altered by pain, guarding likely`,
                severity: 'high'
            });
        } else if (patientData.pain_scale >= 4) {
            this.riskFactors.push({
                category: 'Pain',
                factor: 'Moderate Pain',
                points: 12,
                description: `Pain level ${patientData.pain_scale}/10 - May affect movement patterns`,
                severity: 'medium'
            });
        }
    }
    
    calculateOverallRisk() {
        const totalPoints = this.riskFactors.reduce((sum, factor) => sum + factor.points, 0);
        // Cap at 100
        this.riskScore = Math.min(100, totalPoints);
    }
    
    getRiskLevel() {
        if (this.riskScore >= 75) return 'High Risk';
        if (this.riskScore >= 50) return 'Moderate Risk';
        if (this.riskScore >= 25) return 'Low-Moderate Risk';
        return 'Low Risk';
    }
    
    generateInjuryPredictions(tests, patientData) {
        // Analyze patterns to predict specific injuries
        const hasKneeAsymmetry = this.riskFactors.some(f => f.factor.includes('Knee Asymmetry'));
        const hasHipROMDeficit = this.riskFactors.some(f => f.category === 'ROM Deficit' && f.description.includes('hip'));
        const hasPoorBalance = this.riskFactors.some(f => f.category === 'Balance');
        const hasHighBMI = this.riskFactors.some(f => f.factor === 'Obesity');
        const age = this.calculateAge(patientData.date_of_birth);
        
        // ACL Injury Risk
        if (hasKneeAsymmetry || hasPoorBalance) {
            this.injuryPredictions.push({
                injury: 'ACL Tear / Knee Ligament Injury',
                probability: hasKneeAsymmetry && hasPoorBalance ? 'High' : 'Moderate',
                timeframe: '6-12 months',
                mechanism: 'Medial knee collapse during cutting/landing movements',
                prevention: [
                    'Strengthen hip abductors (gluteus medius)',
                    'Neuromuscular control training',
                    'Plyometric exercises with proper landing mechanics'
                ],
                icon: '🦵'
            });
        }
        
        // IT Band Syndrome
        if (hasHipROMDeficit || hasKneeAsymmetry) {
            this.injuryPredictions.push({
                injury: 'IT Band Syndrome',
                probability: 'Moderate',
                timeframe: '3-6 months',
                mechanism: 'Hip weakness and tightness causing friction at knee',
                prevention: [
                    'Hip flexor stretching',
                    'Glute strengthening',
                    'Foam rolling IT band and TFL'
                ],
                icon: '🏃'
            });
        }
        
        // Fall Risk
        if (hasPoorBalance && age > 60) {
            this.injuryPredictions.push({
                injury: 'Fall with Potential Fracture',
                probability: 'High',
                timeframe: 'Immediate concern',
                mechanism: 'Poor balance stability, especially on uneven surfaces',
                prevention: [
                    'Daily balance exercises',
                    'Strength training for lower extremities',
                    'Home safety assessment',
                    'Consider assistive device'
                ],
                icon: '⚠️'
            });
        }
        
        // Knee OA Progression
        if (hasHighBMI || hasKneeAsymmetry) {
            this.injuryPredictions.push({
                injury: 'Knee Osteoarthritis Progression',
                probability: hasHighBMI ? 'High' : 'Moderate',
                timeframe: '1-2 years',
                mechanism: 'Excessive joint loading and abnormal stress distribution',
                prevention: [
                    'Weight management (if BMI elevated)',
                    'Quadriceps strengthening',
                    'Low-impact aerobic exercise',
                    'Joint protection strategies'
                ],
                icon: '🦴'
            });
        }
        
        // Lower Back Pain
        if (hasHipROMDeficit) {
            this.injuryPredictions.push({
                injury: 'Lower Back Pain / Lumbar Strain',
                probability: 'Moderate',
                timeframe: '3-9 months',
                mechanism: 'Hip inflexibility causing compensatory lumbar movement',
                prevention: [
                    'Hip flexor stretching program',
                    'Core stabilization exercises',
                    'Postural awareness training',
                    'Avoid prolonged sitting'
                ],
                icon: '🔙'
            });
        }
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        // Prioritize by risk score
        if (this.riskScore >= 75) {
            recommendations.push({
                priority: 'URGENT',
                action: 'Immediate Intervention Required',
                description: 'High injury risk detected. Recommend comprehensive physical therapy program starting within 1 week.',
                color: '#EF4444'
            });
        }
        
        // Address specific risk factors
        const asymmetryFactors = this.riskFactors.filter(f => f.category === 'Asymmetry');
        if (asymmetryFactors.length > 0) {
            recommendations.push({
                priority: 'HIGH',
                action: 'Correct Movement Asymmetries',
                description: 'Unilateral strengthening program focusing on weaker side. Single-leg exercises 3x/week.',
                exercises: ['Single-leg Romanian deadlifts', 'Step-ups (weaker side)', 'Single-leg balance'],
                color: '#F59E0B'
            });
        }
        
        const romFactors = this.riskFactors.filter(f => f.category === 'ROM Deficit');
        if (romFactors.length > 0) {
            recommendations.push({
                priority: 'HIGH',
                action: 'Improve Range of Motion',
                description: 'Daily stretching routine targeting limited joints. Hold stretches 30-60 seconds.',
                exercises: ['Hip flexor stretches', 'Hamstring stretches', 'Ankle mobility drills'],
                color: '#F59E0B'
            });
        }
        
        const balanceFactors = this.riskFactors.filter(f => f.category === 'Balance');
        if (balanceFactors.length > 0) {
            recommendations.push({
                priority: 'HIGH',
                action: 'Balance Training Program',
                description: 'Progressive balance exercises 5x/week. Start with eyes open, progress to eyes closed.',
                exercises: ['Single-leg stance (30-60 sec)', 'Tandem standing', 'Balance board exercises'],
                color: '#F59E0B'
            });
        }
        
        // General recommendations
        recommendations.push({
            priority: 'MEDIUM',
            action: 'Re-assessment Schedule',
            description: this.riskScore >= 75 ? 'Re-assess in 2 weeks' : 
                        this.riskScore >= 50 ? 'Re-assess in 4 weeks' : 'Re-assess in 8 weeks',
            color: '#3B82F6'
        });
        
        return recommendations;
    }
    
    generateSummary() {
        const level = this.getRiskLevel();
        const topFactors = this.riskFactors
            .sort((a, b) => b.points - a.points)
            .slice(0, 3)
            .map(f => f.factor);
        
        const topPredictions = this.injuryPredictions
            .filter(p => p.probability === 'High')
            .map(p => p.injury);
        
        return {
            riskLevel: level,
            riskScore: this.riskScore,
            topRiskFactors: topFactors,
            highProbabilityInjuries: topPredictions,
            totalRiskFactors: this.riskFactors.length,
            urgentAction: this.riskScore >= 75
        };
    }
    
    // Helper functions
    calculateAge(dob) {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    }
    
    calculateBMI(heightCm, weightKg) {
        const heightM = heightCm / 100;
        return weightKg / (heightM * heightM);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InjuryRiskAI;
}
