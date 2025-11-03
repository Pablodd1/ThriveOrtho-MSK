/**
 * Patient Education AI - Medical Jargon Translator
 * 
 * Translates complex medical terminology into patient-friendly language
 * Provides educational tooltips and explanations throughout the platform
 * Uses Gemini AI for contextual explanations
 */

class PatientEducationAI {
    constructor(apiKey = null) {
        this.apiKey = apiKey;
        this.jargonDictionary = this.initializeJargonDictionary();
        this.educationalContent = this.initializeEducationalContent();
    }

    /**
     * Initialize medical jargon dictionary with patient-friendly translations
     */
    initializeJargonDictionary() {
        return {
            // Anatomical Terms
            'ROM': {
                full: 'Range of Motion',
                simple: 'How far you can move a joint',
                icon: '🔄'
            },
            'bilateral': {
                full: 'Bilateral',
                simple: 'Both sides of your body',
                icon: '⚖️'
            },
            'unilateral': {
                full: 'Unilateral',
                simple: 'One side of your body',
                icon: '↔️'
            },
            'anterior': {
                full: 'Anterior',
                simple: 'Front of the body',
                icon: '👉'
            },
            'posterior': {
                full: 'Posterior',
                simple: 'Back of the body',
                icon: '👈'
            },
            'medial': {
                full: 'Medial',
                simple: 'Toward the middle of the body',
                icon: '⬅️'
            },
            'lateral': {
                full: 'Lateral',
                simple: 'Away from the middle of the body',
                icon: '➡️'
            },
            'proximal': {
                full: 'Proximal',
                simple: 'Closer to the center of the body',
                icon: '⬆️'
            },
            'distal': {
                full: 'Distal',
                simple: 'Further from the center of the body',
                icon: '⬇️'
            },

            // Movement Terms
            'flexion': {
                full: 'Flexion',
                simple: 'Bending movement',
                icon: '🔽'
            },
            'extension': {
                full: 'Extension',
                simple: 'Straightening movement',
                icon: '🔼'
            },
            'abduction': {
                full: 'Abduction',
                simple: 'Moving away from the body',
                icon: '↗️'
            },
            'adduction': {
                full: 'Adduction',
                simple: 'Moving toward the body',
                icon: '↙️'
            },
            'rotation': {
                full: 'Rotation',
                simple: 'Twisting movement',
                icon: '🔄'
            },
            'dorsiflexion': {
                full: 'Dorsiflexion',
                simple: 'Pulling toes up toward shin',
                icon: '⬆️'
            },
            'plantarflexion': {
                full: 'Plantarflexion',
                simple: 'Pointing toes down',
                icon: '⬇️'
            },

            // Clinical Terms
            'SOAP note': {
                full: 'SOAP Note',
                simple: 'Medical record with: Subjective (what you said), Objective (what we measured), Assessment (diagnosis), Plan (treatment)',
                icon: '📋'
            },
            'deficiency': {
                full: 'Deficiency',
                simple: 'Area where movement or strength is limited',
                icon: '⚠️'
            },
            'asymmetry': {
                full: 'Asymmetry',
                simple: 'When left and right sides move differently',
                icon: '⚖️'
            },
            'compensation': {
                full: 'Compensation',
                simple: 'When your body uses other muscles to make up for weakness',
                icon: '🔄'
            },
            'proprioception': {
                full: 'Proprioception',
                simple: 'Your body\'s awareness of where it is in space',
                icon: '🎯'
            },
            'gait': {
                full: 'Gait',
                simple: 'Your walking pattern',
                icon: '🚶'
            },
            'ADL': {
                full: 'Activities of Daily Living (ADL)',
                simple: 'Everyday tasks like bathing, dressing, walking',
                icon: '🏠'
            },
            'HEP': {
                full: 'Home Exercise Program (HEP)',
                simple: 'Exercises to do at home between therapy sessions',
                icon: '🏋️'
            },

            // Muscle Groups
            'quadriceps': {
                full: 'Quadriceps',
                simple: 'Front thigh muscles (used to straighten knee)',
                icon: '🦵'
            },
            'hamstrings': {
                full: 'Hamstrings',
                simple: 'Back thigh muscles (used to bend knee)',
                icon: '🦵'
            },
            'glutes': {
                full: 'Gluteal Muscles (Glutes)',
                simple: 'Buttock muscles (used for standing, stairs, running)',
                icon: '🍑'
            },
            'hip flexors': {
                full: 'Hip Flexors',
                simple: 'Muscles that lift your knee toward chest',
                icon: '🦵'
            },
            'rotator cuff': {
                full: 'Rotator Cuff',
                simple: 'Four muscles that stabilize your shoulder',
                icon: '💪'
            },
            'core': {
                full: 'Core Muscles',
                simple: 'Abdominal and back muscles that stabilize your spine',
                icon: '💪'
            },

            // Conditions
            'osteoarthritis': {
                full: 'Osteoarthritis (OA)',
                simple: 'Wear and tear of joint cartilage causing pain and stiffness',
                icon: '🦴'
            },
            'ACL': {
                full: 'Anterior Cruciate Ligament (ACL)',
                simple: 'Knee ligament that prevents forward sliding of shin bone',
                icon: '🦵'
            },
            'IT band syndrome': {
                full: 'Iliotibial (IT) Band Syndrome',
                simple: 'Outer knee pain from tight band of tissue',
                icon: '⚠️'
            },
            'patellofemoral syndrome': {
                full: 'Patellofemoral Pain Syndrome',
                simple: 'Kneecap pain, often from tracking issues',
                icon: '🦵'
            },
            'tendinitis': {
                full: 'Tendinitis',
                simple: 'Inflammation of a tendon (connects muscle to bone)',
                icon: '🔴'
            },
            'sprain': {
                full: 'Sprain',
                simple: 'Stretched or torn ligament (connects bone to bone)',
                icon: '⚠️'
            },
            'strain': {
                full: 'Strain',
                simple: 'Stretched or torn muscle or tendon',
                icon: '⚠️'
            },

            // Assessment Terms
            'baseline': {
                full: 'Baseline Assessment',
                simple: 'Your first test - what we compare future tests against',
                icon: '📊'
            },
            'progress tracking': {
                full: 'Progress Tracking',
                simple: 'Comparing your tests over time to see improvement',
                icon: '📈'
            },
            'functional test': {
                full: 'Functional Test',
                simple: 'Test of real-world movements like squatting or standing',
                icon: '🏃'
            },
            'biomechanical analysis': {
                full: 'Biomechanical Analysis',
                simple: 'Study of how your body moves using technology',
                icon: '🔬'
            }
        };
    }

    /**
     * Initialize educational content library
     */
    initializeEducationalContent() {
        return {
            'why_rom_matters': {
                title: 'Why Range of Motion Matters',
                content: `Range of motion (ROM) is how far you can move a joint. Good ROM is important because:
                
• **Daily Activities**: You need good hip/knee ROM to sit, stand, walk stairs
• **Injury Prevention**: Limited ROM can lead to compensations and injuries
• **Pain Reduction**: Stiff joints often cause pain and inflammation
• **Quality of Life**: Better movement means easier daily tasks`,
                icon: '🔄'
            },
            'understanding_deficiencies': {
                title: 'Understanding Your Movement Deficiencies',
                content: `A "deficiency" means an area where your movement is limited. Common causes:

• **Weakness**: Muscles aren't strong enough
• **Tightness**: Muscles or joints are too stiff
• **Pain**: Hurts to move a certain way
• **Compensation**: Using wrong muscles to avoid pain

Don't worry - these can almost always be improved with exercises!`,
                icon: '⚠️'
            },
            'asymmetry_explained': {
                title: 'What Does Asymmetry Mean?',
                content: `Asymmetry means your left and right sides move differently. For example:

• Right knee bends 90° but left only bends 70°
• Right hip is strong but left hip is weak
• Better balance on one leg than the other

**Why it matters**: Asymmetry can lead to overuse injuries on one side. We want to balance both sides.`,
                icon: '⚖️'
            },
            'reading_your_report': {
                title: 'How to Read Your Assessment Report',
                content: `Your report has several sections:

**📊 Test Results**: Your scores (1 = needs work, 3 = excellent)
**📈 Angle Analysis**: How far joints moved during exercises
**⚠️ Deficiencies**: Areas to improve
**💡 Recommendations**: Exercises to fix problems
**📋 SOAP Note**: Medical summary for your doctor

Focus on the "Recommendations" section - that's your action plan!`,
                icon: '📋'
            },
            'score_meaning': {
                title: 'What Your Scores Mean',
                content: `Tests are scored 1-3:

**Score 3 (Green) ✅**: 
Excellent! No significant issues found.

**Score 2 (Yellow) ⚠️**: 
Minor deficiencies. Needs some attention with exercises.

**Score 1 (Red) 🚨**: 
Major deficiencies. Priority area for treatment.

Remember: Lower scores don't mean failure - they show where to focus your efforts!`,
                icon: '🎯'
            },
            'exercise_progression': {
                title: 'Exercise Progression Explained',
                content: `Exercises get harder over time through "progression":

**Level 1**: Bodyweight (just using your own weight)
**Level 2**: Resistance bands (adding light resistance)
**Level 3**: Weights (dumbbells, barbells)
**Level 4**: Advanced variations

Start at Level 1 and progress only when it becomes easy (15+ reps without struggle).`,
                icon: '📈'
            }
        };
    }

    /**
     * Translate medical text to patient-friendly language
     */
    translateText(medicalText) {
        let translatedText = medicalText;
        let translations = [];
        
        // Find and replace medical jargon
        Object.keys(this.jargonDictionary).forEach(term => {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            const matches = medicalText.match(regex);
            
            if (matches) {
                const translation = this.jargonDictionary[term];
                translations.push({
                    original: term,
                    simple: translation.simple,
                    icon: translation.icon
                });
                
                // Add tooltip to text
                translatedText = translatedText.replace(
                    regex,
                    `<span class="medical-term" data-tooltip="${translation.simple}" title="${translation.simple}">${term}</span>`
                );
            }
        });
        
        return {
            translatedText: translatedText,
            translations: translations
        };
    }

    /**
     * Generate tooltip HTML for medical term
     */
    generateTooltip(term) {
        const translation = this.jargonDictionary[term.toLowerCase()];
        
        if (!translation) return null;
        
        return `
            <div class="medical-tooltip">
                <div class="flex items-start gap-2">
                    <span class="text-2xl">${translation.icon}</span>
                    <div>
                        <div class="font-bold text-sm">${translation.full}</div>
                        <div class="text-gray-700">${translation.simple}</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get educational content by topic
     */
    getEducationalContent(topic) {
        return this.educationalContent[topic] || null;
    }

    /**
     * Generate educational sidebar for a medical report
     */
    generateEducationalSidebar(reportContext) {
        const relevantTopics = [];
        
        // Determine relevant topics based on report content
        if (reportContext.hasDeficiencies) {
            relevantTopics.push('understanding_deficiencies');
        }
        if (reportContext.hasAsymmetry) {
            relevantTopics.push('asymmetry_explained');
        }
        if (reportContext.hasScores) {
            relevantTopics.push('score_meaning');
        }
        if (reportContext.hasROM) {
            relevantTopics.push('why_rom_matters');
        }
        
        // Always include "how to read report"
        relevantTopics.push('reading_your_report');
        
        let html = `
            <div class="educational-sidebar bg-blue-50 p-6 rounded-lg">
                <h3 class="text-lg font-bold text-blue-900 mb-4">
                    <i class="fas fa-graduation-cap mr-2"></i>
                    Understanding Your Report
                </h3>
                
                <div class="space-y-4">
                    ${relevantTopics.map(topic => {
                        const content = this.educationalContent[topic];
                        return `
                            <div class="bg-white p-4 rounded shadow-sm">
                                <h4 class="font-semibold text-blue-900 mb-2">
                                    ${content.icon} ${content.title}
                                </h4>
                                <div class="text-sm text-gray-700 whitespace-pre-line">
                                    ${content.content}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="mt-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                    <h4 class="font-semibold text-purple-900 mb-2">
                        <i class="fas fa-question-circle mr-2"></i>
                        Have Questions?
                    </h4>
                    <p class="text-sm text-gray-700">
                        Don't understand something? Click the "Ask AI" button to get a simple explanation of any part of your report!
                    </p>
                </div>
            </div>
        `;
        
        return html;
    }

    /**
     * Use Gemini AI to explain medical concept in simple terms
     */
    async explainWithAI(medicalConcept, patientContext = {}) {
        if (!this.apiKey) {
            return 'AI explanation requires API key. Please configure Gemini API key.';
        }
        
        try {
            const prompt = `You are explaining a medical concept to a patient in simple, friendly language.

Patient Context:
- Age: ${patientContext.age || 'Adult'}
- Medical literacy: Basic (explain like talking to a friend)

Medical Concept to Explain:
"${medicalConcept}"

Provide a simple, jargon-free explanation that:
1. Uses everyday language (avoid medical terms when possible)
2. Includes a relevant analogy or example
3. Explains why it matters to the patient
4. Is 2-3 sentences maximum
5. Is encouraging and positive in tone

Do not use phrases like "In simple terms" or "Let me explain" - just give the explanation directly.`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 200
                    }
                })
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                console.error('Unexpected Gemini API response:', data);
                return 'Unable to generate explanation. Please try again.';
            }
        } catch (error) {
            console.error('Error generating AI explanation:', error);
            return 'Error connecting to AI service. Please try again later.';
        }
    }

    /**
     * Generate glossary of all terms found in a report
     */
    generateGlossary(reportText) {
        const foundTerms = [];
        
        Object.keys(this.jargonDictionary).forEach(term => {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            if (reportText.match(regex)) {
                foundTerms.push({
                    term: term,
                    ...this.jargonDictionary[term]
                });
            }
        });
        
        // Sort alphabetically
        foundTerms.sort((a, b) => a.term.localeCompare(b.term));
        
        let html = `
            <div class="glossary">
                <h3 class="text-xl font-bold mb-4">
                    <i class="fas fa-book mr-2"></i>
                    Medical Terms Glossary
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${foundTerms.map(item => `
                        <div class="bg-white border border-gray-200 rounded-lg p-4">
                            <div class="flex items-start gap-3">
                                <span class="text-2xl">${item.icon}</span>
                                <div>
                                    <div class="font-bold text-gray-900">${item.full}</div>
                                    <div class="text-sm text-gray-600 mt-1">${item.simple}</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        return html;
    }

    /**
     * Create interactive "Ask AI" button for explaining report sections
     */
    createAskAIButton(sectionContent, sectionTitle) {
        return `
            <button 
                onclick="askAIAboutSection('${sectionTitle}', \`${sectionContent.replace(/`/g, '\\`')}\`)"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
                <i class="fas fa-brain"></i>
                Explain This in Simple Terms
            </button>
        `;
    }

    /**
     * Simplify entire report for patient viewing
     */
    simplifyReport(reportData) {
        const simplified = {
            overview: '',
            yourScores: [],
            whatThisMeans: '',
            nextSteps: [],
            exercises: []
        };
        
        // Generate overview
        const totalTests = reportData.tests.length;
        const passedTests = reportData.tests.filter(t => t.score === 3).length;
        const needsWork = reportData.tests.filter(t => t.score === 1).length;
        
        simplified.overview = `You completed ${totalTests} movement tests. ${passedTests} tests showed excellent movement, and ${needsWork} tests show areas where we can help you improve.`;
        
        // Simplify scores
        reportData.tests.forEach(test => {
            let scoreExplanation = '';
            if (test.score === 3) scoreExplanation = 'Great job! No issues found.';
            else if (test.score === 2) scoreExplanation = 'Good, but some areas to work on.';
            else scoreExplanation = 'This is a priority area for improvement.';
            
            simplified.yourScores.push({
                testName: test.test_name.replace(/_/g, ' '),
                score: test.score,
                explanation: scoreExplanation,
                emoji: test.score === 3 ? '✅' : test.score === 2 ? '⚠️' : '🚨'
            });
        });
        
        // What this means
        if (needsWork > 0) {
            simplified.whatThisMeans = `The tests with lower scores show movements that are currently difficult for you. This is common and nothing to worry about! With the right exercises, these areas will improve.`;
        } else {
            simplified.whatThisMeans = `Your movement quality is excellent! Continue with maintenance exercises to keep your body strong and mobile.`;
        }
        
        // Next steps
        simplified.nextSteps = [
            'Do your home exercises daily (takes about 15-20 minutes)',
            'Track your progress - you should notice improvement in 2-3 weeks',
            'Contact your therapist if you experience pain during exercises',
            'Return for re-assessment in 4-6 weeks to measure improvement'
        ];
        
        return simplified;
    }

    /**
     * Format simplified report as HTML
     */
    formatSimplifiedReport(simplified) {
        let html = `
            <div class="simplified-report max-w-4xl mx-auto">
                <!-- Header -->
                <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-t-lg">
                    <h1 class="text-3xl font-bold mb-2">
                        <i class="fas fa-heart mr-2"></i>
                        Your Movement Assessment - Simple Summary
                    </h1>
                    <p class="text-purple-100">Easy-to-understand version of your results</p>
                </div>

                <!-- Overview -->
                <div class="bg-white p-6 border-b">
                    <h2 class="text-2xl font-bold mb-4 text-gray-900">
                        <i class="fas fa-clipboard-check mr-2 text-blue-600"></i>
                        Overview
                    </h2>
                    <p class="text-lg text-gray-700 leading-relaxed">${simplified.overview}</p>
                </div>

                <!-- Your Scores -->
                <div class="bg-gray-50 p-6 border-b">
                    <h2 class="text-2xl font-bold mb-4 text-gray-900">
                        <i class="fas fa-trophy mr-2 text-yellow-600"></i>
                        Your Scores
                    </h2>
                    <div class="space-y-3">
                        ${simplified.yourScores.map(score => `
                            <div class="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
                                <span class="text-3xl">${score.emoji}</span>
                                <div class="flex-1">
                                    <div class="font-bold text-gray-900">${score.testName}</div>
                                    <div class="text-gray-600">${score.explanation}</div>
                                </div>
                                <div class="text-2xl font-bold ${score.score === 3 ? 'text-green-600' : score.score === 2 ? 'text-yellow-600' : 'text-red-600'}">
                                    ${score.score}/3
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- What This Means -->
                <div class="bg-blue-50 p-6 border-b">
                    <h2 class="text-2xl font-bold mb-4 text-blue-900">
                        <i class="fas fa-lightbulb mr-2 text-yellow-500"></i>
                        What This Means for You
                    </h2>
                    <p class="text-lg text-gray-700 leading-relaxed">${simplified.whatThisMeans}</p>
                </div>

                <!-- Next Steps -->
                <div class="bg-white p-6 rounded-b-lg">
                    <h2 class="text-2xl font-bold mb-4 text-gray-900">
                        <i class="fas fa-walking mr-2 text-green-600"></i>
                        Your Next Steps
                    </h2>
                    <ul class="space-y-3">
                        ${simplified.nextSteps.map((step, index) => `
                            <li class="flex items-start gap-3">
                                <span class="flex-shrink-0 w-8 h-8 bg-brand-green text-white rounded-full flex items-center justify-center font-bold">
                                    ${index + 1}
                                </span>
                                <span class="text-lg text-gray-700 pt-1">${step}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        return html;
    }

    /**
     * Initialize tooltip functionality on page
     */
    initializeTooltips() {
        const style = `
            <style>
                .medical-term {
                    border-bottom: 2px dotted #8B5CF6;
                    cursor: help;
                    color: #8B5CF6;
                    font-weight: 500;
                }
                
                .medical-term:hover {
                    background-color: #F3E8FF;
                }
            </style>
        `;
        
        if (!document.getElementById('medical-tooltip-styles')) {
            const styleEl = document.createElement('div');
            styleEl.id = 'medical-tooltip-styles';
            styleEl.innerHTML = style;
            document.head.appendChild(styleEl);
        }
    }
}

// Global function for "Ask AI" button
async function askAIAboutSection(sectionTitle, sectionContent) {
    const educationAI = new PatientEducationAI(window.GEMINI_API_KEY);
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-2xl w-full p-6">
            <div class="flex items-start gap-3 mb-4">
                <i class="fas fa-brain text-3xl text-purple-600"></i>
                <div>
                    <h3 class="text-xl font-bold text-gray-900">AI Explanation</h3>
                    <p class="text-gray-600">Explaining: ${sectionTitle}</p>
                </div>
            </div>
            
            <div class="bg-gray-100 p-4 rounded mb-4">
                <div class="animate-pulse">Generating simple explanation...</div>
            </div>
            
            <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Get AI explanation
    const explanation = await educationAI.explainWithAI(sectionContent);
    
    // Update modal with explanation
    modal.querySelector('.bg-gray-100').innerHTML = `
        <div class="text-gray-700 leading-relaxed">${explanation}</div>
    `;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PatientEducationAI;
}
