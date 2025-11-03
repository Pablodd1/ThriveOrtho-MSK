/**
 * Smart Exercise Library with AI Matching
 * 
 * Comprehensive exercise database with intelligent matching to patient deficiencies
 * Automatically generates personalized Home Exercise Programs (HEP)
 * Includes progression paths and evidence-based recommendations
 */

class SmartExerciseLibrary {
    constructor() {
        this.exercises = this.initializeExerciseDatabase();
        this.matchedExercises = [];
    }

    /**
     * Initialize comprehensive exercise database
     */
    initializeExerciseDatabase() {
        return [
            // HIP EXERCISES
            {
                id: 'hip_flexor_stretch',
                name: 'Hip Flexor Stretch',
                category: 'Mobility',
                targetAreas: ['hip_flexion', 'hip_extension'],
                muscleGroups: ['hip_flexors', 'psoas', 'iliacus'],
                deficiencyTags: ['limited_hip_rom', 'hip_flexion_deficit', 'anterior_pelvic_tilt'],
                difficulty: 1,
                evidenceLevel: 'Strong',
                description: 'Kneeling lunge position, push hips forward to stretch front of hip',
                sets: 3,
                reps: '30 seconds hold',
                frequency: '2x daily',
                progressionPath: ['hip_flexor_stretch', 'standing_hip_flexor_stretch', 'dynamic_hip_flexor_stretch'],
                videoUrl: '/videos/hip-flexor-stretch.mp4',
                imageUrl: '/images/hip-flexor-stretch.jpg',
                contraindications: ['acute_hip_pain', 'hip_replacement_recent'],
                benefits: ['Improves hip extension ROM', 'Reduces anterior pelvic tilt', 'Enhances squat depth']
            },
            {
                id: 'clamshells',
                name: 'Clamshell Exercise',
                category: 'Strengthening',
                targetAreas: ['hip_abduction', 'hip_external_rotation'],
                muscleGroups: ['gluteus_medius', 'gluteus_minimus', 'hip_rotators'],
                deficiencyTags: ['hip_weakness', 'knee_valgus', 'glute_weakness', 'lateral_hip_instability'],
                difficulty: 1,
                evidenceLevel: 'Strong',
                description: 'Side-lying with knees bent, lift top knee while keeping feet together',
                sets: 3,
                reps: 15,
                frequency: 'Daily',
                progressionPath: ['clamshells', 'banded_clamshells', 'standing_hip_abduction', 'single_leg_stance'],
                videoUrl: '/videos/clamshells.mp4',
                imageUrl: '/images/clamshells.jpg',
                contraindications: ['acute_hip_pain'],
                benefits: ['Strengthens hip abductors', 'Reduces knee valgus', 'Improves pelvic stability']
            },
            {
                id: 'glute_bridges',
                name: 'Glute Bridge',
                category: 'Strengthening',
                targetAreas: ['hip_extension', 'pelvic_stability'],
                muscleGroups: ['gluteus_maximus', 'hamstrings', 'core'],
                deficiencyTags: ['hip_extension_weakness', 'glute_weakness', 'pelvic_instability', 'lumbar_compensation'],
                difficulty: 1,
                evidenceLevel: 'Strong',
                description: 'Lying on back, knees bent, lift hips to create straight line from knees to shoulders',
                sets: 3,
                reps: 15,
                frequency: 'Daily',
                progressionPath: ['glute_bridges', 'single_leg_glute_bridge', 'elevated_glute_bridge', 'weighted_hip_thrust'],
                videoUrl: '/videos/glute-bridges.mp4',
                imageUrl: '/images/glute-bridges.jpg',
                contraindications: ['acute_low_back_pain'],
                benefits: ['Strengthens glutes and hamstrings', 'Improves hip extension power', 'Reduces low back strain']
            },

            // KNEE EXERCISES
            {
                id: 'quad_sets',
                name: 'Quadriceps Sets',
                category: 'Strengthening',
                targetAreas: ['knee_extension', 'quad_activation'],
                muscleGroups: ['quadriceps', 'vastus_medialis'],
                deficiencyTags: ['quad_weakness', 'knee_extension_deficit', 'post_surgery_knee'],
                difficulty: 1,
                evidenceLevel: 'Strong',
                description: 'Sitting or lying, tighten thigh muscle and push knee down into surface',
                sets: 3,
                reps: 20,
                frequency: '3x daily',
                progressionPath: ['quad_sets', 'straight_leg_raises', 'terminal_knee_extension', 'squats'],
                videoUrl: '/videos/quad-sets.mp4',
                imageUrl: '/images/quad-sets.jpg',
                contraindications: ['acute_knee_pain'],
                benefits: ['Activates quadriceps', 'Prevents muscle atrophy', 'Improves knee extension']
            },
            {
                id: 'wall_squats',
                name: 'Wall Squats',
                category: 'Strengthening',
                targetAreas: ['knee_flexion', 'hip_flexion', 'quad_strength'],
                muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
                deficiencyTags: ['knee_weakness', 'squat_deficit', 'functional_limitation'],
                difficulty: 2,
                evidenceLevel: 'Strong',
                description: 'Back against wall, slide down to 90-degree knee bend, hold position',
                sets: 3,
                reps: '30-60 seconds hold',
                frequency: 'Daily',
                progressionPath: ['wall_squats', 'bodyweight_squats', 'goblet_squats', 'barbell_squats'],
                videoUrl: '/videos/wall-squats.mp4',
                imageUrl: '/images/wall-squats.jpg',
                contraindications: ['acute_knee_pain', 'patellofemoral_syndrome_severe'],
                benefits: ['Builds quad strength', 'Improves squat mechanics', 'Functional carry-over']
            },

            // ANKLE EXERCISES
            {
                id: 'ankle_pumps',
                name: 'Ankle Pumps',
                category: 'Mobility',
                targetAreas: ['ankle_dorsiflexion', 'ankle_plantarflexion'],
                muscleGroups: ['tibialis_anterior', 'gastrocnemius', 'soleus'],
                deficiencyTags: ['limited_ankle_rom', 'ankle_stiffness', 'calf_tightness'],
                difficulty: 1,
                evidenceLevel: 'Moderate',
                description: 'Point toes down then pull toes up toward shin, repeat in controlled motion',
                sets: 3,
                reps: 20,
                frequency: '3x daily',
                progressionPath: ['ankle_pumps', 'ankle_circles', 'calf_raises', 'single_leg_calf_raises'],
                videoUrl: '/videos/ankle-pumps.mp4',
                imageUrl: '/images/ankle-pumps.jpg',
                contraindications: ['acute_ankle_sprain'],
                benefits: ['Improves ankle ROM', 'Reduces swelling', 'Maintains ankle mobility']
            },
            {
                id: 'calf_stretch',
                name: 'Standing Calf Stretch',
                category: 'Mobility',
                targetAreas: ['ankle_dorsiflexion', 'calf_flexibility'],
                muscleGroups: ['gastrocnemius', 'soleus', 'achilles'],
                deficiencyTags: ['limited_ankle_dorsiflexion', 'calf_tightness', 'squat_depth_limitation'],
                difficulty: 1,
                evidenceLevel: 'Strong',
                description: 'Step forward, keep back leg straight, lean into wall to stretch calf',
                sets: 3,
                reps: '30 seconds hold',
                frequency: '2x daily',
                progressionPath: ['calf_stretch', 'bent_knee_calf_stretch', 'loaded_ankle_mobility', 'dynamic_ankle_mobility'],
                videoUrl: '/videos/calf-stretch.mp4',
                imageUrl: '/images/calf-stretch.jpg',
                contraindications: ['achilles_tendonitis_acute'],
                benefits: ['Improves ankle dorsiflexion', 'Enhances squat depth', 'Reduces calf tightness']
            },

            // BALANCE EXERCISES
            {
                id: 'single_leg_stance',
                name: 'Single Leg Stance',
                category: 'Balance',
                targetAreas: ['balance', 'proprioception', 'ankle_stability'],
                muscleGroups: ['ankle_stabilizers', 'hip_abductors', 'core'],
                deficiencyTags: ['poor_balance', 'fall_risk', 'ankle_instability', 'proprioception_deficit'],
                difficulty: 2,
                evidenceLevel: 'Strong',
                description: 'Stand on one leg, maintain balance for 30 seconds, use wall for support if needed',
                sets: 3,
                reps: '30-60 seconds',
                frequency: 'Daily',
                progressionPath: ['single_leg_stance', 'single_leg_eyes_closed', 'single_leg_unstable_surface', 'single_leg_reaches'],
                videoUrl: '/videos/single-leg-stance.mp4',
                imageUrl: '/images/single-leg-stance.jpg',
                contraindications: ['severe_balance_deficit', 'recent_fall'],
                benefits: ['Improves balance', 'Reduces fall risk', 'Enhances proprioception']
            },
            {
                id: 'heel_toe_walk',
                name: 'Heel-to-Toe Walking',
                category: 'Balance',
                targetAreas: ['balance', 'coordination', 'gait'],
                muscleGroups: ['ankle_stabilizers', 'core', 'hip_stabilizers'],
                deficiencyTags: ['poor_balance', 'gait_instability', 'fall_risk'],
                difficulty: 2,
                evidenceLevel: 'Moderate',
                description: 'Walk in straight line placing heel directly in front of toe with each step',
                sets: 3,
                reps: '10 steps forward',
                frequency: 'Daily',
                progressionPath: ['heel_toe_walk', 'heel_toe_walk_eyes_closed', 'heel_toe_walk_unstable', 'tandem_stance'],
                videoUrl: '/videos/heel-toe-walk.mp4',
                imageUrl: '/images/heel-toe-walk.jpg',
                contraindications: ['severe_balance_deficit'],
                benefits: ['Improves dynamic balance', 'Enhances coordination', 'Reduces fall risk']
            },

            // FUNCTIONAL EXERCISES
            {
                id: 'sit_to_stand',
                name: 'Sit to Stand',
                category: 'Functional',
                targetAreas: ['functional_strength', 'hip_extension', 'knee_extension'],
                muscleGroups: ['quadriceps', 'glutes', 'core'],
                deficiencyTags: ['functional_limitation', 'sit_to_stand_deficit', 'quad_weakness'],
                difficulty: 1,
                evidenceLevel: 'Strong',
                description: 'Stand up from chair without using hands, sit back down with control',
                sets: 3,
                reps: 10,
                frequency: 'Daily',
                progressionPath: ['sit_to_stand', 'sit_to_stand_slow_tempo', 'single_leg_sit_to_stand', 'jump_squats'],
                videoUrl: '/videos/sit-to-stand.mp4',
                imageUrl: '/images/sit-to-stand.jpg',
                contraindications: ['severe_weakness', 'fall_risk_high'],
                benefits: ['Improves functional independence', 'Builds lower body strength', 'ADL carryover']
            },
            {
                id: 'step_ups',
                name: 'Step Ups',
                category: 'Functional',
                targetAreas: ['functional_strength', 'hip_extension', 'knee_extension'],
                muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
                deficiencyTags: ['stair_climbing_difficulty', 'functional_limitation', 'unilateral_weakness'],
                difficulty: 2,
                evidenceLevel: 'Strong',
                description: 'Step up onto platform leading with one leg, return to start position',
                sets: 3,
                reps: 10,
                frequency: 'Daily',
                progressionPath: ['step_ups', 'lateral_step_ups', 'weighted_step_ups', 'box_jumps'],
                videoUrl: '/videos/step-ups.mp4',
                imageUrl: '/images/step-ups.jpg',
                contraindications: ['acute_knee_pain', 'severe_balance_deficit'],
                benefits: ['Improves stair climbing ability', 'Builds unilateral strength', 'Functional carryover']
            },

            // CORE EXERCISES
            {
                id: 'dead_bug',
                name: 'Dead Bug',
                category: 'Core',
                targetAreas: ['core_stability', 'coordination'],
                muscleGroups: ['transverse_abdominis', 'rectus_abdominis', 'obliques'],
                deficiencyTags: ['core_weakness', 'lumbar_instability', 'coordination_deficit'],
                difficulty: 2,
                evidenceLevel: 'Strong',
                description: 'Lying on back, alternate extending opposite arm and leg while maintaining neutral spine',
                sets: 3,
                reps: 10,
                frequency: 'Daily',
                progressionPath: ['dead_bug', 'bird_dog', 'plank', 'side_plank'],
                videoUrl: '/videos/dead-bug.mp4',
                imageUrl: '/images/dead-bug.jpg',
                contraindications: ['acute_low_back_pain'],
                benefits: ['Improves core stability', 'Enhances coordination', 'Protects spine']
            },

            // SHOULDER EXERCISES
            {
                id: 'shoulder_flexion_stretch',
                name: 'Shoulder Flexion Stretch',
                category: 'Mobility',
                targetAreas: ['shoulder_flexion', 'shoulder_mobility'],
                muscleGroups: ['deltoids', 'rotator_cuff', 'pectorals'],
                deficiencyTags: ['limited_shoulder_rom', 'shoulder_flexion_deficit', 'overhead_limitation'],
                difficulty: 1,
                evidenceLevel: 'Strong',
                description: 'Standing facing wall, walk fingers up wall to stretch shoulder overhead',
                sets: 3,
                reps: '30 seconds hold',
                frequency: '2x daily',
                progressionPath: ['shoulder_flexion_stretch', 'overhead_reach', 'overhead_press', 'overhead_squat'],
                videoUrl: '/videos/shoulder-flexion-stretch.mp4',
                imageUrl: '/images/shoulder-flexion-stretch.jpg',
                contraindications: ['acute_shoulder_pain', 'shoulder_impingement_severe'],
                benefits: ['Improves overhead mobility', 'Reduces shoulder stiffness', 'Enhances functional reach']
            }
        ];
    }

    /**
     * Main matching function - matches exercises to patient deficiencies
     */
    matchExercisesToDeficiencies(assessmentData, patientData) {
        console.log('🎯 SmartExerciseLibrary: Matching exercises to deficiencies...');
        
        // Extract all deficiencies from assessment
        const allDeficiencies = this.extractDeficiencies(assessmentData);
        
        // Match exercises
        const matched = [];
        
        allDeficiencies.forEach(deficiency => {
            // Find exercises that target this deficiency
            const relevantExercises = this.exercises.filter(exercise => {
                // Check if any deficiency tag matches
                return exercise.deficiencyTags.some(tag => 
                    this.isTagRelevant(tag, deficiency.description)
                );
            });
            
            // Score and rank exercises
            relevantExercises.forEach(exercise => {
                const score = this.scoreExerciseMatch(exercise, deficiency, patientData);
                
                // Only include if score is above threshold
                if (score > 50) {
                    matched.push({
                        exercise: exercise,
                        deficiency: deficiency,
                        matchScore: score,
                        rationale: this.generateMatchRationale(exercise, deficiency)
                    });
                }
            });
        });
        
        // Remove duplicates and sort by score
        const uniqueMatches = this.deduplicateExercises(matched);
        const sortedMatches = uniqueMatches.sort((a, b) => b.matchScore - a.matchScore);
        
        // Take top exercises (max 8-10 for HEP)
        this.matchedExercises = sortedMatches.slice(0, 10);
        
        return this.matchedExercises;
    }

    /**
     * Extract deficiencies from assessment data
     */
    extractDeficiencies(assessmentData) {
        const deficiencies = [];
        
        if (assessmentData.tests && Array.isArray(assessmentData.tests)) {
            assessmentData.tests.forEach(test => {
                const analysis = test.analysis_result ? JSON.parse(test.analysis_result) : null;
                
                if (analysis && analysis.deficiencies && Array.isArray(analysis.deficiencies)) {
                    analysis.deficiencies.forEach(def => {
                        deficiencies.push({
                            testName: test.test_name,
                            description: def,
                            severity: this.assessDeficiencySeverity(test.score)
                        });
                    });
                }
            });
        }
        
        return deficiencies;
    }

    /**
     * Check if exercise tag is relevant to deficiency
     */
    isTagRelevant(tag, deficiencyDescription) {
        // Convert to lowercase for comparison
        const tagLower = tag.toLowerCase().replace(/_/g, ' ');
        const defLower = deficiencyDescription.toLowerCase();
        
        // Direct keyword matching
        const keywords = tagLower.split(' ');
        return keywords.some(keyword => defLower.includes(keyword));
    }

    /**
     * Score how well an exercise matches a deficiency
     */
    scoreExerciseMatch(exercise, deficiency, patientData) {
        let score = 50; // Base score
        
        // Evidence level bonus
        if (exercise.evidenceLevel === 'Strong') score += 20;
        else if (exercise.evidenceLevel === 'Moderate') score += 10;
        
        // Difficulty appropriateness
        const patientAge = patientData.age || 50;
        if (patientAge > 65 && exercise.difficulty === 1) score += 15; // Easier exercises for older patients
        if (patientAge < 50 && exercise.difficulty >= 2) score += 10; // More challenging for younger
        
        // Severity matching
        if (deficiency.severity === 'high' && exercise.category === 'Strengthening') score += 15;
        if (deficiency.severity === 'medium' && exercise.category === 'Mobility') score += 10;
        
        // Multiple target areas bonus
        if (exercise.targetAreas.length > 2) score += 5;
        
        // Functional carryover
        if (exercise.category === 'Functional') score += 10;
        
        return Math.min(100, score);
    }

    /**
     * Assess deficiency severity based on test score
     */
    assessDeficiencySeverity(score) {
        if (score === 1) return 'high';
        if (score === 2) return 'medium';
        return 'low';
    }

    /**
     * Generate rationale for exercise match
     */
    generateMatchRationale(exercise, deficiency) {
        return `Addresses "${deficiency.description}" from ${deficiency.testName} test. ${exercise.benefits[0]}.`;
    }

    /**
     * Deduplicate exercises (take highest scoring match for each exercise)
     */
    deduplicateExercises(matches) {
        const exerciseMap = new Map();
        
        matches.forEach(match => {
            const existingMatch = exerciseMap.get(match.exercise.id);
            
            if (!existingMatch || match.matchScore > existingMatch.matchScore) {
                exerciseMap.set(match.exercise.id, match);
            }
        });
        
        return Array.from(exerciseMap.values());
    }

    /**
     * Generate Home Exercise Program (HEP)
     */
    generateHEP(matchedExercises, patientData) {
        console.log('📋 SmartExerciseLibrary: Generating HEP...');
        
        // Group exercises by category
        const byCategory = {
            Mobility: [],
            Strengthening: [],
            Balance: [],
            Functional: [],
            Core: []
        };
        
        matchedExercises.forEach(match => {
            const category = match.exercise.category;
            if (byCategory[category]) {
                byCategory[category].push(match);
            }
        });
        
        // Create balanced HEP (2-3 from each category)
        const hep = {
            patientName: patientData.name,
            generatedDate: new Date().toLocaleDateString(),
            exercises: [],
            totalDuration: 0,
            frequency: 'Daily (or as prescribed)',
            instructions: 'Perform exercises in order listed. Stop if you experience pain beyond mild discomfort.'
        };
        
        // Add mobility exercises first
        if (byCategory.Mobility.length > 0) {
            hep.exercises.push(...byCategory.Mobility.slice(0, 3).map(m => m.exercise));
        }
        
        // Add strengthening
        if (byCategory.Strengthening.length > 0) {
            hep.exercises.push(...byCategory.Strengthening.slice(0, 3).map(m => m.exercise));
        }
        
        // Add balance
        if (byCategory.Balance.length > 0) {
            hep.exercises.push(...byCategory.Balance.slice(0, 2).map(m => m.exercise));
        }
        
        // Add functional
        if (byCategory.Functional.length > 0) {
            hep.exercises.push(...byCategory.Functional.slice(0, 2).map(m => m.exercise));
        }
        
        // Calculate total duration (estimate 2 minutes per exercise)
        hep.totalDuration = hep.exercises.length * 2;
        
        return hep;
    }

    /**
     * Format HEP as HTML for display/printing
     */
    formatHEPHTML(hep) {
        let html = `
            <div class="hep-document">
                <!-- Header -->
                <div class="bg-brand-green text-white p-6 rounded-t-lg">
                    <h1 class="text-2xl font-bold mb-2">
                        <i class="fas fa-dumbbell mr-2"></i>
                        Home Exercise Program
                    </h1>
                    <p class="text-green-100">Patient: ${hep.patientName}</p>
                    <p class="text-green-100">Generated: ${hep.generatedDate}</p>
                </div>

                <!-- Instructions -->
                <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                    <h3 class="font-semibold mb-2">
                        <i class="fas fa-info-circle mr-2"></i>
                        Instructions
                    </h3>
                    <p class="text-gray-700">${hep.instructions}</p>
                    <p class="text-gray-700 mt-2">
                        <strong>Frequency:</strong> ${hep.frequency}<br>
                        <strong>Estimated Duration:</strong> ${hep.totalDuration} minutes
                    </p>
                </div>

                <!-- Exercise List -->
                <div class="space-y-6">
                    ${hep.exercises.map((exercise, index) => `
                        <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div class="flex items-start gap-4">
                                <div class="flex-shrink-0 w-12 h-12 bg-brand-green text-white rounded-full flex items-center justify-center text-xl font-bold">
                                    ${index + 1}
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-xl font-bold text-gray-900 mb-2">${exercise.name}</h3>
                                    
                                    <div class="flex gap-2 mb-3">
                                        <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                            ${exercise.category}
                                        </span>
                                        <span class="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                                            Level ${exercise.difficulty}
                                        </span>
                                        <span class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                            ${exercise.evidenceLevel} Evidence
                                        </span>
                                    </div>
                                    
                                    <p class="text-gray-700 mb-4">${exercise.description}</p>
                                    
                                    <div class="grid grid-cols-3 gap-4 mb-4">
                                        <div class="bg-gray-50 p-3 rounded">
                                            <div class="text-sm text-gray-600">Sets</div>
                                            <div class="text-lg font-bold text-gray-900">${exercise.sets}</div>
                                        </div>
                                        <div class="bg-gray-50 p-3 rounded">
                                            <div class="text-sm text-gray-600">Reps</div>
                                            <div class="text-lg font-bold text-gray-900">${exercise.reps}</div>
                                        </div>
                                        <div class="bg-gray-50 p-3 rounded">
                                            <div class="text-sm text-gray-600">Frequency</div>
                                            <div class="text-lg font-bold text-gray-900">${exercise.frequency}</div>
                                        </div>
                                    </div>
                                    
                                    <div class="mb-4">
                                        <h4 class="font-semibold text-gray-900 mb-2">
                                            <i class="fas fa-bullseye mr-2 text-brand-green"></i>
                                            Target Areas
                                        </h4>
                                        <div class="flex flex-wrap gap-2">
                                            ${exercise.targetAreas.map(area => `
                                                <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                    ${area.replace(/_/g, ' ')}
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                    
                                    <div class="mb-4">
                                        <h4 class="font-semibold text-gray-900 mb-2">
                                            <i class="fas fa-check-circle mr-2 text-green-600"></i>
                                            Benefits
                                        </h4>
                                        <ul class="list-disc list-inside text-gray-700 space-y-1">
                                            ${exercise.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                                        </ul>
                                    </div>
                                    
                                    ${exercise.contraindications.length > 0 ? `
                                    <div class="bg-red-50 border-l-4 border-red-500 p-3">
                                        <h4 class="font-semibold text-red-900 mb-1">
                                            <i class="fas fa-exclamation-triangle mr-2"></i>
                                            Contraindications
                                        </h4>
                                        <ul class="list-disc list-inside text-red-800 text-sm space-y-1">
                                            ${exercise.contraindications.map(contra => `
                                                <li>${contra.replace(/_/g, ' ')}</li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                    ` : ''}
                                    
                                    <div class="mt-4 pt-4 border-t">
                                        <h4 class="font-semibold text-gray-900 mb-2">
                                            <i class="fas fa-level-up-alt mr-2 text-purple-600"></i>
                                            Progression Path
                                        </h4>
                                        <div class="flex items-center gap-2 text-sm text-gray-600">
                                            ${exercise.progressionPath.map((step, i) => `
                                                <span class="${step === exercise.id ? 'font-bold text-brand-green' : ''}">
                                                    ${step.replace(/_/g, ' ')}
                                                </span>
                                                ${i < exercise.progressionPath.length - 1 ? '<i class="fas fa-arrow-right text-gray-400"></i>' : ''}
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Footer -->
                <div class="mt-8 p-6 bg-gray-100 rounded-lg">
                    <h3 class="font-semibold mb-2">
                        <i class="fas fa-stethoscope mr-2"></i>
                        Clinical Notes
                    </h3>
                    <p class="text-gray-700 text-sm">
                        This exercise program has been automatically generated based on your assessment results.
                        Exercises are evidence-based and matched to your specific movement deficiencies.
                        Progress through exercises as tolerated. Contact your physical therapist if you have questions or experience increased pain.
                    </p>
                </div>
            </div>
        `;
        
        return html;
    }

    /**
     * Search exercises by keyword
     */
    searchExercises(keyword) {
        const keywordLower = keyword.toLowerCase();
        
        return this.exercises.filter(exercise => {
            return exercise.name.toLowerCase().includes(keywordLower) ||
                   exercise.description.toLowerCase().includes(keywordLower) ||
                   exercise.category.toLowerCase().includes(keywordLower) ||
                   exercise.muscleGroups.some(mg => mg.toLowerCase().includes(keywordLower));
        });
    }

    /**
     * Get exercises by category
     */
    getExercisesByCategory(category) {
        return this.exercises.filter(exercise => exercise.category === category);
    }

    /**
     * Get exercises by difficulty
     */
    getExercisesByDifficulty(difficulty) {
        return this.exercises.filter(exercise => exercise.difficulty === difficulty);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartExerciseLibrary;
}
