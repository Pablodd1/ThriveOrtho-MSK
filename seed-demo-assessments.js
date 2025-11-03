/**
 * Seed Demo Assessments for Sample Patients
 * Populates Sarah Johnson, Robert Martinez, and Linda Chen with realistic assessment data
 */

// Sample assessment data generator
function generateRealisticAssessmentData(patientProfile) {
    const { quality, deficiencyLevel, exerciseName } = patientProfile;
    
    // Generate realistic joint angle data (120 frames ~= 4 seconds)
    const frames = 120;
    const angles = {
        hip_left: [],
        hip_right: [],
        knee_left: [],
        knee_right: [],
        shoulder_left: [],
        shoulder_right: []
    };
    
    // Generate movement pattern based on quality
    for (let i = 0; i < frames; i++) {
        const progress = i / frames;
        const phase = Math.sin(progress * Math.PI * 2); // Oscillating movement
        
        // Hip angles (flexion during squat/lunge)
        const hipBase = 180 - (90 * Math.abs(phase)); // 180° to 90°
        const hipVariation = quality === 'excellent' ? 5 : quality === 'good' ? 15 : 25;
        angles.hip_left.push(hipBase + (Math.random() - 0.5) * hipVariation);
        angles.hip_right.push(hipBase + (Math.random() - 0.5) * hipVariation + (quality === 'poor' ? 10 : 0)); // Asymmetry for poor quality
        
        // Knee angles
        const kneeBase = 180 - (85 * Math.abs(phase)); // 180° to 95°
        const kneeVariation = quality === 'excellent' ? 5 : quality === 'good' ? 12 : 20;
        angles.knee_left.push(kneeBase + (Math.random() - 0.5) * kneeVariation);
        angles.knee_right.push(kneeBase + (Math.random() - 0.5) * kneeVariation + (quality === 'poor' ? 8 : 0));
        
        // Shoulder angles (if applicable)
        const shoulderBase = 30 + (140 * Math.abs(phase)); // 30° to 170°
        angles.shoulder_left.push(shoulderBase + (Math.random() - 0.5) * 10);
        angles.shoulder_right.push(shoulderBase + (Math.random() - 0.5) * 10);
    }
    
    // Calculate symmetry indices
    const symmetry = {
        hip: angles.hip_left.map((left, i) => ((left - angles.hip_right[i]) / left) * 100),
        knee: angles.knee_left.map((left, i) => ((left - angles.knee_right[i]) / left) * 100)
    };
    
    // Calculate angular velocity
    const angularVelocity = angles.hip_left.map((angle, i) => {
        if (i === 0) return 0;
        return Math.abs(angle - angles.hip_left[i - 1]) * 30; // degrees/second
    });
    
    // Generate analysis based on quality level
    const analysis = generateAnalysis(quality, deficiencyLevel);
    
    // Generate compensations based on deficiency level
    const compensations = generateCompensations(deficiencyLevel);
    
    return {
        test_name: exerciseName,
        camera_angle: 'side',
        duration_seconds: 4,
        reps_completed: quality === 'excellent' ? 10 : quality === 'good' ? 8 : 5,
        target_reps: 10,
        skeleton_data: JSON.stringify({
            angles: angles.hip_left.map((_, i) => ({
                hip_left: angles.hip_left[i],
                hip_right: angles.hip_right[i],
                knee_left: angles.knee_left[i],
                knee_right: angles.knee_right[i],
                shoulder_left: angles.shoulder_left[i],
                shoulder_right: angles.shoulder_right[i]
            })),
            analysis: analysis
        }),
        fms_score: quality === 'excellent' ? 3 : quality === 'good' ? 2 : 1,
        joint_angles: angles,
        symmetry_indices: symmetry,
        angular_velocity: angularVelocity,
        compensations: compensations,
        clinical_notes: generateClinicalNotes(quality, deficiencyLevel)
    };
}

function generateAnalysis(quality, deficiencyLevel) {
    const scores = {
        excellent: { rom: 95, form: 92, balance: 90 },
        good: { rom: 75, form: 72, balance: 70 },
        poor: { rom: 55, form: 50, balance: 48 }
    };
    
    const deficiencies = deficiencyLevel === 'none' ? [] :
        deficiencyLevel === 'minor' ? [
            { severity: 'low', area: 'Hip Flexion ROM', description: 'Slightly limited hip flexion range of motion bilaterally' }
        ] :
        [
            { severity: 'high', area: 'Hip Flexion ROM', description: 'Significantly limited hip flexion, compensating with excessive lumbar flexion' },
            { severity: 'moderate', area: 'Knee Stability', description: 'Medial knee collapse noted during descent phase, indicates weak hip abductors' },
            { severity: 'moderate', area: 'Ankle Mobility', description: 'Limited ankle dorsiflexion causing early heel lift' }
        ];
    
    return {
        rom_score: scores[quality].rom,
        form_quality: scores[quality].form,
        balance_score: scores[quality].balance,
        deficiencies: deficiencies
    };
}

function generateCompensations(deficiencyLevel) {
    if (deficiencyLevel === 'none') return [];
    if (deficiencyLevel === 'minor') return [
        {
            pattern: 'Minor Forward Lean',
            severity: 'low',
            implication: 'May indicate tight hip flexors or weak core stabilizers'
        }
    ];
    
    return [
        {
            pattern: 'Excessive Forward Trunk Lean',
            severity: 'high',
            implication: 'Compensating for limited hip mobility and/or weak quadriceps. Increases lumbar spine stress.'
        },
        {
            pattern: 'Medial Knee Collapse (Valgus)',
            severity: 'high',
            implication: 'Weak hip abductors (gluteus medius). Increases ACL injury risk and patellofemoral stress.'
        }
    ];
}

function generateClinicalNotes(quality, deficiencyLevel) {
    const notes = [];
    
    if (quality === 'excellent') {
        notes.push('Excellent movement quality with full ROM and proper biomechanics');
        notes.push('No significant compensatory patterns identified');
        notes.push('Patient demonstrates good body awareness and control');
    } else if (quality === 'good') {
        notes.push('Good overall movement pattern with minor limitations');
        notes.push('Recommend targeted stretching and strengthening program');
        notes.push('Re-assess in 4 weeks to track progress');
    } else {
        notes.push('Significant movement dysfunction noted - requires intervention');
        notes.push('Multiple compensatory patterns suggest underlying weakness/tightness');
        notes.push('High priority for corrective exercise program');
        notes.push('Consider referral to orthopedic specialist if no improvement in 6 weeks');
    }
    
    return notes;
}

// Demo patient profiles
const demoPatients = [
    {
        id: 2,
        name: 'Sarah Johnson',
        profile: {
            quality: 'good',
            deficiencyLevel: 'minor',
            exerciseName: 'Bodyweight Squat',
            tests: [
                { exercise: 'Bodyweight Squat', quality: 'good', deficiencyLevel: 'minor' },
                { exercise: 'Single Leg Balance', quality: 'excellent', deficiencyLevel: 'none' },
                { exercise: 'Hip Flexor Stretch', quality: 'good', deficiencyLevel: 'minor' }
            ]
        }
    },
    {
        id: 3,
        name: 'Robert Martinez',
        profile: {
            quality: 'poor',
            deficiencyLevel: 'major',
            exerciseName: 'Bodyweight Squat',
            tests: [
                { exercise: 'Bodyweight Squat', quality: 'poor', deficiencyLevel: 'major' },
                { exercise: 'Single Leg Balance', quality: 'poor', deficiencyLevel: 'major' },
                { exercise: 'Shoulder Flexion Test', quality: 'good', deficiencyLevel: 'minor' }
            ]
        }
    },
    {
        id: 4,
        name: 'Linda Chen',
        profile: {
            quality: 'excellent',
            deficiencyLevel: 'none',
            exerciseName: 'Bodyweight Squat',
            tests: [
                { exercise: 'Bodyweight Squat', quality: 'excellent', deficiencyLevel: 'none' },
                { exercise: 'Single Leg Balance', quality: 'excellent', deficiencyLevel: 'none' },
                { exercise: 'Hip Flexor Stretch', quality: 'excellent', deficiencyLevel: 'none' }
            ]
        }
    }
];

// Main seeding function
async function seedDemoAssessments() {
    console.log('🌱 Starting demo assessment seeding...\n');
    
    for (const patient of demoPatients) {
        console.log(`📊 Creating assessment for ${patient.name} (ID: ${patient.id})...`);
        
        // Create assessment
        const assessmentData = {
            patient_id: patient.id,
            assessment_date: new Date().toISOString(),
            overall_score: patient.profile.quality === 'excellent' ? 3 : patient.profile.quality === 'good' ? 2 : 1,
            notes: `Demo assessment for ${patient.name}. Quality: ${patient.profile.quality}.`
        };
        
        try {
            const assessmentResponse = await fetch('http://localhost:3000/api/assessments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(assessmentData)
            });
            
            const assessmentResult = await assessmentResponse.json();
            
            if (!assessmentResult.success) {
                console.error(`❌ Failed to create assessment for ${patient.name}:`, assessmentResult.error);
                continue;
            }
            
            const assessmentId = assessmentResult.data.id;
            console.log(`   ✅ Assessment created (ID: ${assessmentId})`);
            
            // Create tests for this assessment
            for (const testProfile of patient.profile.tests) {
                const testData = generateRealisticAssessmentData({
                    quality: testProfile.quality,
                    deficiencyLevel: testProfile.deficiencyLevel,
                    exerciseName: testProfile.exercise
                });
                
                testData.assessment_id = assessmentId;
                
                const testResponse = await fetch(`http://localhost:3000/api/assessments/${assessmentId}/tests`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(testData)
                });
                
                const testResult = await testResponse.json();
                
                if (testResult.success) {
                    console.log(`   ✅ Test added: ${testProfile.exercise}`);
                } else {
                    console.error(`   ❌ Failed to add test:`, testResult.error);
                }
            }
            
            console.log(`✨ Completed assessment for ${patient.name}\n`);
            
        } catch (error) {
            console.error(`❌ Error creating assessment for ${patient.name}:`, error.message);
        }
    }
    
    console.log('🎉 Demo assessment seeding complete!\n');
    console.log('📋 Summary:');
    console.log('   - Sarah Johnson (PT002): Score 2/3 - Good quality, minor deficiencies');
    console.log('   - Robert Martinez (PT003): Score 1/3 - Poor quality, major deficiencies');
    console.log('   - Linda Chen (PT004): Score 3/3 - Excellent quality, no deficiencies');
    console.log('\n🔗 View reports at: http://localhost:3000/static/dashboard.html');
}

// Run the seeding
seedDemoAssessments().catch(console.error);
