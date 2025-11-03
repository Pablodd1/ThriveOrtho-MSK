/**
 * Simplified Demo Data Seeding - Works with Current Database Schema
 * Creates assessments and tests using the proper two-step API flow
 */

// Simplified realistic angle data generator
function generateSimpleAngles(quality) {
    const frames = 120; // 4 seconds at 30fps
    const angles = [];
    
    for (let i = 0; i < frames; i++) {
        const progress = i / frames;
        const phase = Math.sin(progress * Math.PI * 2); // Oscillating movement
        
        // Hip angles based on quality
        const hipBase = 180 - (90 * Math.abs(phase)); // 180° to 90°
        const hipNoise = quality === 'excellent' ? 3 : quality === 'good' ? 10 : 20;
        const asymmetry = quality === 'poor' ? 15 : quality === 'good' ? 5 : 2;
        
        // Knee angles
        const kneeBase = 180 - (85 * Math.abs(phase)); // 180° to 95°
        const kneeNoise = quality === 'excellent' ? 3 : quality === 'good' ? 10 : 18;
        
        angles.push({
            hip_left: hipBase + (Math.random() - 0.5) * hipNoise,
            hip_right: hipBase + (Math.random() - 0.5) * hipNoise + asymmetry,
            knee_left: kneeBase + (Math.random() - 0.5) * kneeNoise,
            knee_right: kneeBase + (Math.random() - 0.5) * kneeNoise + (asymmetry * 0.5),
            shoulder_left: 45 + (Math.random() - 0.5) * 10,
            shoulder_right: 45 + (Math.random() - 0.5) * 10
        });
    }
    
    return angles;
}

// Generate analysis data
function generateAnalysis(quality) {
    const scores = {
        excellent: { rom: 95, form: 92, balance: 90 },
        good: { rom: 75, form: 72, balance: 70 },
        poor: { rom: 55, form: 50, balance: 48 }
    };
    
    const deficiencies = quality === 'excellent' ? [] :
        quality === 'good' ? [
            { 
                severity: 'low', 
                area: 'Hip Flexion ROM', 
                description: 'Slightly limited hip flexion range of motion bilaterally' 
            }
        ] : [
            { 
                severity: 'high', 
                area: 'Hip Flexion ROM', 
                description: 'Significantly limited hip flexion, compensating with excessive lumbar flexion' 
            },
            { 
                severity: 'moderate', 
                area: 'Knee Stability', 
                description: 'Medial knee collapse noted during descent phase' 
            }
        ];
    
    return {
        rom_score: scores[quality].rom,
        form_quality: scores[quality].form,
        balance_score: scores[quality].balance,
        deficiencies: deficiencies
    };
}

// Demo patient test configurations
const demoConfigs = [
    {
        patient_id: 2,
        patient_name: 'Sarah Johnson',
        score: 2,
        tests: [
            { name: 'Bodyweight Squat', category: 'Lower Body', quality: 'good' },
            { name: 'Single Leg Balance', category: 'Balance', quality: 'excellent' },
            { name: 'Hip Flexor Stretch', category: 'Flexibility', quality: 'good' }
        ]
    },
    {
        patient_id: 3,
        patient_name: 'Robert Martinez',
        score: 1,
        tests: [
            { name: 'Bodyweight Squat', category: 'Lower Body', quality: 'poor' },
            { name: 'Single Leg Balance', category: 'Balance', quality: 'poor' },
            { name: 'Shoulder Flexion Test', category: 'Upper Body', quality: 'good' }
        ]
    },
    {
        patient_id: 4,
        patient_name: 'Linda Chen',
        score: 3,
        tests: [
            { name: 'Bodyweight Squat', category: 'Lower Body', quality: 'excellent' },
            { name: 'Single Leg Balance', category: 'Balance', quality: 'excellent' },
            { name: 'Hip Flexor Stretch', category: 'Flexibility', quality: 'excellent' }
        ]
    }
];

// Main seeding function
async function seedDemoData() {
    console.log('🌱 Seeding demo assessment data...\n');
    
    for (const config of demoConfigs) {
        console.log(`📊 Creating assessment for ${config.patient_name} (Patient ID: ${config.patient_id})...`);
        
        try {
            // Step 1: Create Assessment
            const assessmentResponse = await fetch('http://localhost:3000/api/assessments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient_id: config.patient_id,
                    assessment_date: new Date().toISOString(),
                    overall_score: config.score,
                    notes: `Demo assessment - Quality: ${config.score}/3`
                })
            });
            
            const assessmentResult = await assessmentResponse.json();
            
            if (!assessmentResult.success) {
                console.error(`   ❌ Failed to create assessment: ${assessmentResult.error}`);
                continue;
            }
            
            const assessmentId = assessmentResult.data.id;
            console.log(`   ✅ Assessment created (ID: ${assessmentId})`);
            
            // Step 2: Create Tests for this Assessment
            for (let i = 0; i < config.tests.length; i++) {
                const testConfig = config.tests[i];
                
                // Create the test (without skeleton data)
                const createTestResponse = await fetch(`http://localhost:3000/api/assessments/${assessmentId}/tests`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        test_name: testConfig.name,
                        test_category: testConfig.category,
                        test_order: i + 1,
                        instructions: `Perform ${testConfig.name} movement`
                    })
                });
                
                const createTestResult = await createTestResponse.json();
                
                if (!createTestResult.success) {
                    console.error(`   ❌ Failed to create test "${testConfig.name}": ${createTestResult.error}`);
                    continue;
                }
                
                const testId = createTestResult.data.id;
                console.log(`   ✅ Test created: ${testConfig.name} (ID: ${testId})`);
                
                // Step 3: Update test with skeleton data and analysis
                const angles = generateSimpleAngles(testConfig.quality);
                const analysis = generateAnalysis(testConfig.quality);
                
                const skeletonData = {
                    angles: angles,
                    analysis: analysis,
                    timestamp: new Date().toISOString()
                };
                
                const updateTestResponse = await fetch(`http://localhost:3000/api/tests/${testId}/analyze`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        skeleton_data: skeletonData,
                        camera_type: 'demo'
                    })
                });
                
                const updateTestResult = await updateTestResponse.json();
                
                if (updateTestResult.success) {
                    console.log(`   ✅ Analysis data added to ${testConfig.name}`);
                } else {
                    console.error(`   ❌ Failed to add analysis: ${updateTestResult.error}`);
                }
                
                // Small delay to avoid overwhelming the database
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            console.log(`✨ Completed ${config.patient_name}\n`);
            
        } catch (error) {
            console.error(`❌ Error processing ${config.patient_name}:`, error.message);
        }
    }
    
    console.log('\n🎉 Demo data seeding complete!\n');
    console.log('📋 Summary:');
    console.log('   • Sarah Johnson (Patient #2): Score 2/3 - Good quality');
    console.log('     - 3 tests completed with minor deficiencies');
    console.log('   • Robert Martinez (Patient #3): Score 1/3 - Poor quality');
    console.log('     - 3 tests completed with major deficiencies');
    console.log('   • Linda Chen (Patient #4): Score 3/3 - Excellent quality');
    console.log('     - 3 tests completed with no deficiencies');
    console.log('\n🔗 View dashboard: http://localhost:3000/static/dashboard.html');
    console.log('🔗 Sarah Johnson reports: http://localhost:3000/static/dashboard.html (click on Patient #2)');
    console.log('🔗 Robert Martinez reports: http://localhost:3000/static/dashboard.html (click on Patient #3)');
    console.log('🔗 Linda Chen reports: http://localhost:3000/static/dashboard.html (click on Patient #4)');
}

// Run the seeding
seedDemoData().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
