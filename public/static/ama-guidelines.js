/**
 * AMA Guidelines Module
 * American Medical Association (AMA) guidelines for physical therapy assessments
 * Includes CPT codes, documentation requirements, and evaluation standards
 */

class AMAGuidelinesSystem {
    constructor() {
        // AMA CPT Codes for Physical Therapy Evaluation
        this.cptCodes = {
            // Evaluation Codes
            '97161': {
                code: '97161',
                title: 'PT Evaluation - Low Complexity',
                description: 'Physical therapy evaluation of low complexity',
                requirements: [
                    'History: Brief or no personal or medical history',
                    'Examination: 1-2 body regions or systems',
                    'Clinical Presentation: Stable with minimal functional deficits',
                    'Clinical Decision Making: Low complexity'
                ],
                timeEstimate: '20-30 minutes',
                documentation: ['Body region examined', 'Functional limitations', 'Treatment goals']
            },
            '97162': {
                code: '97162',
                title: 'PT Evaluation - Moderate Complexity',
                description: 'Physical therapy evaluation of moderate complexity',
                requirements: [
                    'History: Focused personal and medical history',
                    'Examination: 3+ body regions or systems',
                    'Clinical Presentation: Evolving clinical presentation, moderate functional deficits',
                    'Clinical Decision Making: Moderate complexity',
                    'Modification of plan of care may be necessary'
                ],
                timeEstimate: '30-45 minutes',
                documentation: ['Detailed examination findings', 'Functional outcome measures', 'Progress indicators', 'Treatment plan']
            },
            '97163': {
                code: '97163',
                title: 'PT Evaluation - High Complexity',
                description: 'Physical therapy evaluation of high complexity',
                requirements: [
                    'History: Comprehensive personal and medical history',
                    'Examination: 4+ body regions or systems',
                    'Clinical Presentation: Unstable, acute or chronic illness with severe functional deficits',
                    'Clinical Decision Making: High complexity',
                    'Requires complex or interdisciplinary plan of care'
                ],
                timeEstimate: '45-60 minutes',
                documentation: ['Comprehensive examination', 'Multiple outcome measures', 'Risk assessment', 'Detailed treatment plan', 'Coordination with other providers']
            },
            '97164': {
                code: '97164',
                title: 'PT Re-evaluation',
                description: 'Physical therapy re-evaluation',
                requirements: [
                    'Assessment of progress toward goals',
                    'Modification of plan of care',
                    'Outcome measure reassessment',
                    'Documentation of functional changes'
                ],
                timeEstimate: '20-30 minutes',
                documentation: ['Progress notes', 'Updated functional status', 'Modified goals', 'Treatment adjustments']
            }
        };

        // AMA Documentation Guidelines
        this.documentationGuidelines = {
            required: [
                'Patient identification and demographics',
                'Date of service',
                'Reason for referral/chief complaint',
                'Relevant medical history',
                'Examination findings with objective measurements',
                'Assessment/clinical impression',
                'Plan of care with specific interventions',
                'Functional goals (SMART format)',
                'Patient education provided',
                'Therapist signature and credentials'
            ],
            soapNoteComponents: {
                subjective: [
                    'Chief complaint in patient\'s own words',
                    'History of present illness',
                    'Past medical/surgical history (relevant)',
                    'Medications affecting therapy',
                    'Social history (occupation, living situation)',
                    'Patient goals and expectations'
                ],
                objective: [
                    'Vital signs (if relevant)',
                    'Observation (posture, gait, assistive devices)',
                    'Palpation findings',
                    'Range of Motion (measured with goniometer)',
                    'Strength testing (MMT 0-5 scale)',
                    'Special tests (with results)',
                    'Functional tests (with standardized measures)',
                    'Balance assessment (Berg, Tinetti, etc.)',
                    'Pain assessment (VAS, NPRS)'
                ],
                assessment: [
                    'Primary diagnosis (ICD-10 code)',
                    'Contributing factors',
                    'Impairments identified',
                    'Functional limitations',
                    'Participation restrictions',
                    'Prognosis (Good/Fair/Poor with timeframe)',
                    'Rehabilitation potential'
                ],
                plan: [
                    'Frequency and duration of treatment',
                    'Specific interventions planned',
                    'Short-term goals (2-4 weeks, SMART format)',
                    'Long-term goals (6-8 weeks, SMART format)',
                    'Patient/caregiver education',
                    'Home exercise program',
                    'Referrals to other providers if needed',
                    'Re-evaluation timeline'
                ]
            }
        };

        // Functional Outcome Measures (AMA Recommended)
        this.outcomesMeasures = {
            lowerExtremity: [
                {
                    name: 'Lower Extremity Functional Scale (LEFS)',
                    range: '0-80',
                    mcid: '9 points',
                    description: 'Self-reported measure of lower extremity function',
                    use: 'General lower extremity conditions'
                },
                {
                    name: 'Oswestry Disability Index (ODI)',
                    range: '0-100%',
                    mcid: '10%',
                    description: 'Low back pain disability',
                    use: 'Lumbar spine conditions'
                },
                {
                    name: 'Timed Up and Go (TUG)',
                    range: 'Seconds',
                    cutoff: '>12 sec = fall risk',
                    description: 'Mobility and fall risk assessment',
                    use: 'Balance and mobility disorders'
                }
            ],
            upperExtremity: [
                {
                    name: 'QuickDASH',
                    range: '0-100',
                    mcid: '10 points',
                    description: 'Upper extremity disability',
                    use: 'Shoulder, elbow, wrist, hand conditions'
                }
            ],
            balance: [
                {
                    name: 'Berg Balance Scale',
                    range: '0-56',
                    cutoff: '<45 = high fall risk',
                    description: 'Static and dynamic balance assessment',
                    use: 'Fall risk and balance deficits'
                },
                {
                    name: 'Functional Gait Assessment (FGA)',
                    range: '0-30',
                    cutoff: '<22 = high fall risk',
                    description: 'Gait-related balance',
                    use: 'Gait disorders and fall prevention'
                }
            ],
            general: [
                {
                    name: 'Patient Specific Functional Scale (PSFS)',
                    range: '0-10 per activity',
                    mcid: '2 points',
                    description: 'Patient-identified functional activities',
                    use: 'Any musculoskeletal condition'
                }
            ]
        };

        // ICD-10 Codes (Common PT Diagnoses)
        this.icd10Codes = {
            'M54.5': 'Low back pain',
            'M25.511': 'Pain in right shoulder',
            'M25.512': 'Pain in left shoulder',
            'M25.561': 'Pain in right knee',
            'M25.562': 'Pain in left knee',
            'M62.81': 'Muscle weakness (generalized)',
            'M62.838': 'Other muscle spasm',
            'R26.81': 'Unsteadiness on feet',
            'R26.2': 'Difficulty in walking, not elsewhere classified',
            'R29.6': 'Repeated falls',
            'M79.3': 'Panniculitis (soft tissue disorders)',
            'S93.401A': 'Sprain of unspecified ligament of right ankle, initial encounter',
            'M17.11': 'Unilateral primary osteoarthritis, right knee',
            'M19.071': 'Primary osteoarthritis, right ankle and foot'
        };

        // SMART Goals Template
        this.smartGoalsTemplate = {
            specific: 'Clearly defined action or ability',
            measurable: 'Quantifiable metric (degrees, repetitions, distance, time)',
            achievable: 'Realistic given patient\'s current status',
            relevant: 'Meaningful to patient\'s functional needs',
            timeBound: 'Specific timeframe (2 weeks, 4 weeks, 8 weeks)'
        };
    }

    /**
     * Determine appropriate CPT code based on assessment complexity
     */
    determineCPTCode(assessment) {
        const { riskScore, deficiencies, romAnalysis, functionalMovement } = assessment;
        
        // Calculate complexity factors
        const bodyRegions = this.countBodyRegions(romAnalysis);
        const severityLevel = this.calculateSeverityLevel(deficiencies);
        const functionalDeficits = this.assessFunctionalDeficits(functionalMovement);
        
        // High Complexity (97163)
        if (riskScore >= 70 || bodyRegions >= 4 || severityLevel === 'high' || 
            functionalDeficits === 'severe') {
            return this.cptCodes['97163'];
        }
        
        // Moderate Complexity (97162)
        if (riskScore >= 40 || bodyRegions >= 3 || severityLevel === 'moderate' ||
            functionalDeficits === 'moderate') {
            return this.cptCodes['97162'];
        }
        
        // Low Complexity (97161)
        return this.cptCodes['97161'];
    }

    /**
     * Count affected body regions
     */
    countBodyRegions(romAnalysis) {
        const regions = new Set();
        
        for (const joint in romAnalysis) {
            if (romAnalysis[joint].status !== 'Normal') {
                if (joint.includes('lumbar') || joint.includes('spine')) regions.add('spine');
                else if (joint.includes('shoulder')) regions.add('shoulder');
                else if (joint.includes('hip')) regions.add('hip');
                else if (joint.includes('knee')) regions.add('knee');
                else if (joint.includes('ankle')) regions.add('ankle');
            }
        }
        
        return regions.size;
    }

    /**
     * Calculate overall severity level
     */
    calculateSeverityLevel(deficiencies) {
        const criticalCount = deficiencies.filter(d => d.severity === 'Critical').length;
        const moderateCount = deficiencies.filter(d => d.severity === 'Moderate').length;
        
        if (criticalCount >= 2) return 'high';
        if (criticalCount >= 1 || moderateCount >= 3) return 'moderate';
        return 'low';
    }

    /**
     * Assess functional deficits severity
     */
    assessFunctionalDeficits(functionalMovement) {
        const { squat, gait } = functionalMovement;
        
        if (squat.quality === 'Poor' && gait.status === 'Significant Asymmetry') {
            return 'severe';
        }
        if (squat.quality === 'Fair' || gait.status === 'Mild Asymmetry') {
            return 'moderate';
        }
        return 'mild';
    }

    /**
     * Generate SMART goals based on deficiencies
     */
    generateSMARTGoals(deficiencies, timeframe = 'short') {
        const goals = [];
        const weeks = timeframe === 'short' ? 4 : 8;
        
        deficiencies.slice(0, 3).forEach((deficiency, index) => {
            let goal = {};
            
            if (deficiency.type === 'ROM Limitation') {
                const joint = deficiency.joint.toLowerCase();
                const currentValue = parseInt(deficiency.value);
                const targetImprovement = timeframe === 'short' ? 15 : 30;
                
                goal = {
                    id: index + 1,
                    type: 'Short-term' + (timeframe === 'long' ? ' / Long-term' : ''),
                    goal: `Patient will increase ${joint} by ${targetImprovement}° from ${currentValue}° to ${currentValue + targetImprovement}° to improve functional mobility within ${weeks} weeks.`,
                    specific: `Increase ${joint}`,
                    measurable: `${targetImprovement}° improvement`,
                    achievable: 'Gradual progression with daily HEP',
                    relevant: 'Required for functional ADLs',
                    timeBound: `${weeks} weeks`
                };
            } else if (deficiency.type === 'Balance Asymmetry') {
                goal = {
                    id: index + 1,
                    type: 'Short-term' + (timeframe === 'long' ? ' / Long-term' : ''),
                    goal: `Patient will demonstrate single leg stance for 30 seconds bilaterally with <10% asymmetry to reduce fall risk within ${weeks} weeks.`,
                    specific: 'Improve single leg balance',
                    measurable: '30 sec hold, <10% asymmetry',
                    achievable: 'Progressive balance training',
                    relevant: 'Fall prevention',
                    timeBound: `${weeks} weeks`
                };
            } else if (deficiency.type === 'Functional Movement') {
                goal = {
                    id: index + 1,
                    type: 'Short-term' + (timeframe === 'long' ? ' / Long-term' : ''),
                    goal: `Patient will perform functional squat to 90° hip flexion with proper form and no compensatory patterns within ${weeks} weeks.`,
                    specific: 'Improve squat mechanics',
                    measurable: '90° hip flexion, proper alignment',
                    achievable: 'Neuromuscular re-education',
                    relevant: 'Essential for ADLs (sit-to-stand)',
                    timeBound: `${weeks} weeks`
                };
            }
            
            goals.push(goal);
        });
        
        return goals;
    }

    /**
     * Suggest appropriate ICD-10 code based on assessment
     */
    suggestICD10Code(assessment, chiefComplaint) {
        const suggestions = [];
        
        // Based on ROM limitations
        for (const joint in assessment.romAnalysis) {
            if (assessment.romAnalysis[joint].status !== 'Normal') {
                if (joint.includes('lumbar')) {
                    suggestions.push({ code: 'M54.5', description: 'Low back pain', confidence: 'high' });
                }
                if (joint.includes('shoulder_right')) {
                    suggestions.push({ code: 'M25.511', description: 'Pain in right shoulder', confidence: 'high' });
                }
                if (joint.includes('shoulder_left')) {
                    suggestions.push({ code: 'M25.512', description: 'Pain in left shoulder', confidence: 'high' });
                }
                if (joint.includes('knee_right')) {
                    suggestions.push({ code: 'M25.561', description: 'Pain in right knee', confidence: 'moderate' });
                }
                if (joint.includes('knee_left')) {
                    suggestions.push({ code: 'M25.562', description: 'Pain in left knee', confidence: 'moderate' });
                }
            }
        }
        
        // Based on balance issues
        if (assessment.balanceAssessment.fallRisk === 'Elevated') {
            suggestions.push({ code: 'R26.81', description: 'Unsteadiness on feet', confidence: 'high' });
            suggestions.push({ code: 'R29.6', description: 'Repeated falls', confidence: 'moderate' });
        }
        
        // Based on gait abnormality
        if (assessment.functionalMovement.gait.status !== 'Symmetric') {
            suggestions.push({ code: 'R26.2', description: 'Difficulty in walking', confidence: 'moderate' });
        }
        
        // Remove duplicates
        const uniqueSuggestions = suggestions.filter((item, index, self) =>
            index === self.findIndex(t => t.code === item.code)
        );
        
        return uniqueSuggestions;
    }

    /**
     * Generate comprehensive AMA-compliant assessment
     */
    generateAMACompliantAssessment(analysis, patientInfo, chiefComplaint) {
        // Determine CPT code
        const cptCode = this.determineCPTCode(analysis);
        
        // Generate SMART goals
        const shortTermGoals = this.generateSMARTGoals(analysis.deficiencies, 'short');
        const longTermGoals = this.generateSMARTGoals(analysis.deficiencies, 'long');
        
        // Suggest ICD-10 codes
        const icd10Suggestions = this.suggestICD10Code(analysis, chiefComplaint);
        
        // Recommend outcome measures
        const recommendedMeasures = this.recommendOutcomeMeasures(analysis);
        
        return {
            cptCode: cptCode,
            icd10Codes: icd10Suggestions,
            smartGoals: {
                shortTerm: shortTermGoals,
                longTerm: longTermGoals
            },
            outcomeMeasures: recommendedMeasures,
            documentationRequirements: cptCode.requirements,
            estimatedTime: cptCode.timeEstimate,
            complianceChecklist: this.generateComplianceChecklist(analysis, patientInfo)
        };
    }

    /**
     * Recommend appropriate outcome measures
     */
    recommendOutcomeMeasures(analysis) {
        const recommended = [];
        
        // Check for lower extremity issues
        const hasLowerExtremity = Object.keys(analysis.romAnalysis).some(joint => 
            joint.includes('hip') || joint.includes('knee') || joint.includes('ankle') || joint.includes('lumbar')
        );
        
        if (hasLowerExtremity) {
            if (Object.keys(analysis.romAnalysis).some(j => j.includes('lumbar'))) {
                recommended.push(this.outcomesMeasures.lowerExtremity[1]); // ODI
            }
            recommended.push(this.outcomesMeasures.lowerExtremity[0]); // LEFS
        }
        
        // Check for balance issues
        if (analysis.balanceAssessment.fallRisk !== 'Low') {
            recommended.push(this.outcomesMeasures.balance[0]); // Berg
            recommended.push(this.outcomesMeasures.lowerExtremity[2]); // TUG
        }
        
        // Always recommend PSFS
        recommended.push(this.outcomesMeasures.general[0]); // PSFS
        
        return recommended;
    }

    /**
     * Generate AMA compliance checklist
     */
    generateComplianceChecklist(analysis, patientInfo) {
        return {
            required: [
                { item: 'Patient demographics documented', completed: !!patientInfo.name },
                { item: 'Chief complaint in patient words', completed: false, note: 'Required' },
                { item: 'Relevant medical history obtained', completed: false, note: 'Required' },
                { item: 'Objective measurements recorded', completed: true },
                { item: 'ROM measured with goniometer', completed: true },
                { item: 'Strength tested with MMT', completed: false, note: 'Recommended' },
                { item: 'Functional tests performed', completed: true },
                { item: 'ICD-10 code assigned', completed: false, note: 'Required for billing' },
                { item: 'CPT code determined', completed: true },
                { item: 'SMART goals established', completed: true },
                { item: 'Treatment plan documented', completed: false, note: 'Required' },
                { item: 'Patient education provided', completed: false, note: 'Required' },
                { item: 'Home exercise program prescribed', completed: true },
                { item: 'Outcome measure selected', completed: true },
                { item: 'Re-evaluation timeline set', completed: false, note: 'Recommended' }
            ],
            optional: [
                { item: 'Special tests performed', completed: false },
                { item: 'Imaging reviewed', completed: false },
                { item: 'Interdisciplinary coordination', completed: false },
                { item: 'Caregiver education', completed: false }
            ]
        };
    }

    /**
     * Format assessment for AMA-compliant documentation
     */
    formatAMADocumentation(assessment, patientInfo, amaCompliance) {
        return {
            header: {
                patientName: patientInfo.name,
                dateOfBirth: patientInfo.dob,
                dateOfService: new Date().toISOString().split('T')[0],
                referringPhysician: patientInfo.referringMD || 'N/A',
                cptCode: amaCompliance.cptCode.code,
                icd10Codes: amaCompliance.icd10Codes.map(c => c.code).join(', ')
            },
            soap: {
                subjective: {
                    chiefComplaint: 'To be documented by clinician',
                    historyOfPresentIllness: 'To be documented by clinician',
                    patientGoals: 'To be documented by clinician',
                    relevantMedicalHistory: patientInfo.medicalHistory || 'To be documented'
                },
                objective: {
                    observation: 'To be documented by clinician',
                    rangeOfMotion: assessment.romAnalysis,
                    strengthTesting: 'To be documented (MMT 0-5 scale)',
                    functionalTesting: assessment.functionalMovement,
                    balanceAssessment: assessment.balanceAssessment,
                    specialTests: 'To be documented',
                    outcomeMeasures: amaCompliance.outcomeMeasures
                },
                assessment: {
                    primaryDiagnosis: amaCompliance.icd10Codes[0],
                    impairments: assessment.deficiencies,
                    functionalLimitations: 'Based on objective findings',
                    prognosis: this.determinePrognosis(assessment),
                    rehabilitationPotential: 'Good to Excellent'
                },
                plan: {
                    frequency: '2-3x/week for 6-8 weeks',
                    duration: '45-60 minutes per session',
                    interventions: assessment.recommendations,
                    shortTermGoals: amaCompliance.smartGoals.shortTerm,
                    longTermGoals: amaCompliance.smartGoals.longTerm,
                    homeExerciseProgram: 'Prescribed (see HEP)',
                    patientEducation: 'To be documented',
                    reevaluationDate: this.calculateReEvalDate()
                }
            },
            compliance: amaCompliance.complianceChecklist
        };
    }

    /**
     * Determine prognosis based on analysis
     */
    determinePrognosis(assessment) {
        if (assessment.riskScore < 40) {
            return {
                level: 'Good',
                timeframe: '4-6 weeks',
                expectedImprovement: '80-90%'
            };
        } else if (assessment.riskScore < 70) {
            return {
                level: 'Fair',
                timeframe: '6-8 weeks',
                expectedImprovement: '60-75%'
            };
        } else {
            return {
                level: 'Guarded',
                timeframe: '8-12 weeks',
                expectedImprovement: '40-60%'
            };
        }
    }

    /**
     * Calculate re-evaluation date (typically 4 weeks)
     */
    calculateReEvalDate() {
        const today = new Date();
        const reEval = new Date(today.setDate(today.getDate() + 28)); // 4 weeks
        return reEval.toISOString().split('T')[0];
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.AMAGuidelinesSystem = AMAGuidelinesSystem;
}
