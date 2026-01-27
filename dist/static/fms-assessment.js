/**
 * FMS (Functional Movement Screen) Assessment System
 * Industry-standard 7-test screening protocol
 * Used by NFL, NBA, MLB, US Military, and 10,000+ clinics worldwide
 * 
 * Tests:
 * 1. Deep Squat (0-3 points)
 * 2. Hurdle Step (0-3 points per side)
 * 3. Inline Lunge (0-3 points per side)
 * 4. Shoulder Mobility (0-3 points per side)
 * 5. Active Straight Leg Raise (0-3 points per side)
 * 6. Trunk Stability Push-Up (0-3 points)
 * 7. Rotary Stability (0-3 points per side)
 * 
 * Total Score: 0-21 points
 * ≥14 = Low injury risk
 * <14 = Elevated injury risk (needs intervention)
 * 
 * ROI: 600% - $30K investment → $180K annual revenue
 */

class FMSAssessment {
  constructor() {
    this.tests = [
      {
        id: 'deep_squat',
        name: 'Deep Squat',
        description: 'Assesses bilateral, symmetrical mobility of hips, knees, ankles',
        bilateral: true,
        clearingTest: null,
        videoDemo: 'https://www.youtube.com/embed/JBHzXF-mVjY',
        criteria: {
          3: 'Upper torso parallel with tibia, femur below horizontal, knees over feet, dowel aligned over feet',
          2: 'Same as 3, but with 2x6 board under heels',
          1: 'Cannot perform score of 2',
          0: 'Pain during movement'
        },
        instructions: [
          'Stand with feet shoulder-width apart',
          'Hold dowel overhead with arms extended',
          'Descend as deep as possible',
          'Keep heels flat and dowel overhead',
          'Return to start position'
        ]
      },
      {
        id: 'hurdle_step',
        name: 'Hurdle Step',
        description: 'Assesses bilateral step mechanics and stability',
        bilateral: false,
        clearingTest: null,
        videoDemo: 'https://www.youtube.com/embed/K_DpLGkR2jg',
        criteria: {
          3: 'Hips, knees, ankles aligned, minimal movement of lumbar spine, dowel and hurdle aligned',
          2: 'Alignment maintained but dowel and hurdle not aligned',
          1: 'Loss of alignment or inability to maintain contact with raised foot',
          0: 'Pain during movement'
        },
        instructions: [
          'Stand with feet together, dowel on shoulders',
          'Raise test leg to clear hurdle height',
          'Step over and touch heel down',
          'Return to start position',
          'Maintain upright posture throughout'
        ]
      },
      {
        id: 'inline_lunge',
        name: 'Inline Lunge',
        description: 'Assesses hip and ankle mobility, quadriceps flexibility, and stability',
        bilateral: false,
        clearingTest: null,
        videoDemo: 'https://www.youtube.com/embed/EtJtGvX2WjI',
        criteria: {
          3: 'Knee touches board behind front heel, vertical torso, dowel maintains contact with spine',
          2: 'Knee does not touch board, but maintains vertical torso and dowel contact',
          1: 'Loss of balance or inability to maintain dowel contact',
          0: 'Pain during movement'
        },
        instructions: [
          'Stand on board with feet in line',
          'Place dowel behind back touching head, thoracic spine, and sacrum',
          'Descend until back knee touches board',
          'Return to start without losing balance',
          'Dowel must maintain 3-point contact'
        ]
      },
      {
        id: 'shoulder_mobility',
        name: 'Shoulder Mobility',
        description: 'Assesses bilateral shoulder range of motion',
        bilateral: false,
        clearingTest: 'shoulder_clearing',
        videoDemo: 'https://www.youtube.com/embed/rYg_vNmWIVw',
        criteria: {
          3: 'Fists within one hand length',
          2: 'Fists within 1.5 hand lengths',
          1: 'Fists not within 1.5 hand lengths',
          0: 'Pain during movement OR positive clearing test'
        },
        instructions: [
          'Make fists with thumbs inside',
          'Place one hand overhead and behind back',
          'Place other hand behind back and up',
          'Measure distance between fists',
          'Repeat on opposite side'
        ],
        clearingInstructions: [
          'Place hand on opposite shoulder',
          'Raise elbow as high as possible',
          'Note any pain (scores 0 if painful)'
        ]
      },
      {
        id: 'leg_raise',
        name: 'Active Straight Leg Raise',
        description: 'Assesses active hamstring and gastroc-soleus flexibility',
        bilateral: false,
        clearingTest: null,
        videoDemo: 'https://www.youtube.com/embed/VtTcB6FSnKY',
        criteria: {
          3: 'Malleolus passes vertical line from ASIS',
          2: 'Malleolus passes midpoint between ASIS and midline of thigh',
          1: 'Malleolus does not reach midpoint',
          0: 'Pain during movement'
        },
        instructions: [
          'Lie supine with arms at side',
          'Lift test leg with knee extended',
          'Keep opposite knee extended on ground',
          'Raise leg as high as possible while maintaining form',
          'Lower slowly to start position'
        ]
      },
      {
        id: 'push_up',
        name: 'Trunk Stability Push-Up',
        description: 'Assesses trunk stabilization in sagittal plane',
        bilateral: true,
        clearingTest: 'spinal_extension',
        videoDemo: 'https://www.youtube.com/embed/r5B0cG_1wvs',
        criteria: {
          3: 'MALES: Perform 1 push-up with thumbs at forehead. FEMALES: Perform 1 push-up with thumbs at chin',
          2: 'MALES: Perform 1 push-up with thumbs at chin. FEMALES: Perform 1 push-up with thumbs at clavicle',
          1: 'Unable to perform 1 repetition with Score 2 criteria',
          0: 'Pain during movement OR positive clearing test'
        },
        instructions: [
          'Lie prone with feet together',
          'MALES: Place hands at forehead level (Score 3) or chin level (Score 2)',
          'FEMALES: Place hands at chin level (Score 3) or clavicle level (Score 2)',
          'Perform one push-up in one motion',
          'Body must lift as a unit (no lag in lumbar spine)'
        ],
        clearingInstructions: [
          'Lie prone with hands under shoulders',
          'Press upper body up (cobra pose)',
          'Keep hips on ground',
          'Note any pain (scores 0 if painful)'
        ]
      },
      {
        id: 'rotary_stability',
        name: 'Rotary Stability',
        description: 'Assesses multi-plane trunk stability',
        bilateral: false,
        clearingTest: 'spinal_flexion',
        videoDemo: 'https://www.youtube.com/embed/TcYSmy8VpLY',
        criteria: {
          3: 'Perform correct unilateral repetition (same side arm/leg)',
          2: 'Perform correct diagonal repetition (opposite arm/leg)',
          1: 'Cannot perform diagonal repetition',
          0: 'Pain during movement OR positive clearing test'
        },
        instructions: [
          'Start in quadruped position over board',
          'Extend arm and leg on same side (Score 3)',
          'Touch knee to elbow while maintaining plank',
          'If unable, try diagonal pattern (opposite arm/leg) for Score 2',
          'Maintain stable torso throughout'
        ],
        clearingInstructions: [
          'Sit back on heels with arms extended forward',
          'Rock body forward maximally',
          'Note any pain (scores 0 if painful)'
        ]
      }
    ];

    this.currentTest = null;
    this.currentSide = null;
    this.scores = {};
    this.clearingTests = {};
    this.patientInfo = null;
  }

  /**
   * Initialize FMS assessment
   */
  async initialize() {
    console.log('[FMS] Initializing Functional Movement Screen...');
    
    // Load saved data if exists
    this.loadFromLocalStorage();
    
    return {
      success: true,
      totalTests: this.tests.length,
      maxScore: 21
    };
  }

  /**
   * Start assessment for a patient
   */
  startAssessment(patientInfo) {
    this.patientInfo = patientInfo;
    this.currentTest = 0;
    this.currentSide = 'left';
    this.scores = {};
    this.clearingTests = {};
    
    console.log('[FMS] Starting assessment for:', patientInfo.name);
    this.saveToLocalStorage();
    
    return this.getCurrentTestInfo();
  }

  /**
   * Get current test information
   */
  getCurrentTestInfo() {
    if (this.currentTest >= this.tests.length) {
      return { completed: true, results: this.calculateResults() };
    }

    const test = this.tests[this.currentTest];
    const needsClearingTest = test.clearingTest && !this.clearingTests[test.clearingTest];

    return {
      completed: false,
      testNumber: this.currentTest + 1,
      totalTests: this.tests.length,
      test: test,
      currentSide: test.bilateral ? null : this.currentSide,
      needsClearingTest: needsClearingTest,
      progress: ((this.currentTest) / this.tests.length * 100).toFixed(0)
    };
  }

  /**
   * Record score for current test
   */
  recordScore(score, notes = '') {
    const test = this.tests[this.currentTest];
    const testId = test.id;

    if (!this.scores[testId]) {
      this.scores[testId] = {};
    }

    if (test.bilateral) {
      this.scores[testId].score = score;
      this.scores[testId].notes = notes;
      this.currentTest++;
      this.currentSide = 'left';
    } else {
      this.scores[testId][this.currentSide] = {
        score: score,
        notes: notes
      };

      if (this.currentSide === 'left') {
        this.currentSide = 'right';
      } else {
        // Both sides complete, move to next test
        this.currentTest++;
        this.currentSide = 'left';
      }
    }

    this.saveToLocalStorage();
    return this.getCurrentTestInfo();
  }

  /**
   * Record clearing test result
   */
  recordClearingTest(testId, hasPain) {
    this.clearingTests[testId] = hasPain;
    this.saveToLocalStorage();
    
    // If clearing test is positive (has pain), current test scores 0
    if (hasPain) {
      const test = this.tests.find(t => t.clearingTest === testId);
      if (test) {
        this.recordScore(0, 'Pain during clearing test');
      }
    }
    
    return this.getCurrentTestInfo();
  }

  /**
   * Calculate final results
   */
  calculateResults() {
    let totalScore = 0;
    let lowestScore = 3;
    let asymmetries = [];
    let redFlags = [];

    this.tests.forEach(test => {
      const testId = test.id;
      const testScores = this.scores[testId];

      if (!testScores) return;

      if (test.bilateral) {
        const score = testScores.score;
        totalScore += score;
        if (score < lowestScore) lowestScore = score;
        if (score === 0) redFlags.push(`Pain during ${test.name}`);
      } else {
        const leftScore = testScores.left?.score || 0;
        const rightScore = testScores.right?.score || 0;
        const finalScore = Math.min(leftScore, rightScore);
        
        totalScore += finalScore;
        if (finalScore < lowestScore) lowestScore = finalScore;

        if (leftScore !== rightScore) {
          asymmetries.push({
            test: test.name,
            left: leftScore,
            right: rightScore,
            difference: Math.abs(leftScore - rightScore)
          });
        }

        if (leftScore === 0 || rightScore === 0) {
          redFlags.push(`Pain during ${test.name}`);
        }
      }
    });

    // Injury risk assessment
    const injuryRisk = this.assessInjuryRisk(totalScore, asymmetries.length, redFlags.length);

    // Generate recommendations
    const recommendations = this.generateRecommendations(totalScore, asymmetries, redFlags);

    return {
      totalScore: totalScore,
      maxScore: 21,
      lowestScore: lowestScore,
      injuryRisk: injuryRisk,
      asymmetries: asymmetries,
      redFlags: redFlags,
      recommendations: recommendations,
      detailedScores: this.scores,
      patientInfo: this.patientInfo,
      completedDate: new Date().toISOString()
    };
  }

  /**
   * Assess injury risk based on FMS score
   */
  assessInjuryRisk(totalScore, asymmetryCount, redFlagCount) {
    let riskLevel = 'low';
    let riskScore = 0;
    let description = '';

    // Total score assessment
    if (totalScore >= 17) {
      riskLevel = 'low';
      riskScore = 15;
      description = 'Excellent movement patterns with minimal injury risk';
    } else if (totalScore >= 14) {
      riskLevel = 'moderate';
      riskScore = 35;
      description = 'Good movement patterns, some areas for improvement';
    } else if (totalScore >= 10) {
      riskLevel = 'elevated';
      riskScore = 60;
      description = 'Significant movement limitations, elevated injury risk';
    } else {
      riskLevel = 'high';
      riskScore = 85;
      description = 'Severe movement dysfunction, high injury risk';
    }

    // Asymmetry penalty
    riskScore += asymmetryCount * 5;

    // Red flag penalty
    if (redFlagCount > 0) {
      riskLevel = 'high';
      riskScore = Math.max(riskScore, 80);
      description = 'Pain reported - medical clearance required before training';
    }

    return {
      level: riskLevel,
      score: Math.min(riskScore, 100),
      description: description,
      research: totalScore < 14 ? 
        'Research shows FMS scores <14 have 2-4x higher injury risk (Kiesel et al., 2007)' :
        'Research shows FMS scores ≥14 have lower injury risk (Chorba et al., 2010)'
    };
  }

  /**
   * Generate personalized recommendations
   */
  generateRecommendations(totalScore, asymmetries, redFlags) {
    const recommendations = [];

    // Red flags - highest priority
    if (redFlags.length > 0) {
      recommendations.push({
        priority: 'critical',
        category: 'Medical Clearance',
        title: 'Seek Medical Evaluation',
        description: 'Pain reported during movement screening. Medical clearance required before continuing exercise program.',
        action: 'Schedule evaluation with physician or physical therapist',
        cptCode: '97161' // PT evaluation - low complexity
      });
    }

    // Asymmetries
    if (asymmetries.length > 0) {
      asymmetries.forEach(asym => {
        recommendations.push({
          priority: 'high',
          category: 'Asymmetry Correction',
          title: `Address ${asym.test} Asymmetry`,
          description: `Left: ${asym.left}/3, Right: ${asym.right}/3 - ${asym.difference} point difference`,
          action: 'Focused unilateral training and mobility work',
          exercises: this.getAsymmetryExercises(asym.test)
        });
      });
    }

    // Low total score
    if (totalScore < 14) {
      recommendations.push({
        priority: 'high',
        category: 'Movement Optimization',
        title: 'Improve Fundamental Movement Patterns',
        description: `Total score ${totalScore}/21 indicates need for corrective exercise program`,
        action: 'Begin Tier 1 corrective exercise program (8-12 weeks)',
        program: 'Focus on mobility, stability, and motor control'
      });
    }

    // Specific test failures
    this.tests.forEach(test => {
      const testScores = this.scores[test.id];
      if (!testScores) return;

      const scores = test.bilateral ? 
        [testScores.score] : 
        [testScores.left?.score || 0, testScores.right?.score || 0];

      const minScore = Math.min(...scores);
      
      if (minScore === 1) {
        recommendations.push({
          priority: 'medium',
          category: 'Movement Pattern',
          title: `Improve ${test.name}`,
          description: test.description,
          action: 'Corrective exercises and progressions',
          exercises: this.getTestExercises(test.id)
        });
      }
    });

    // If score is good, provide maintenance recommendations
    if (totalScore >= 14 && redFlags.length === 0) {
      recommendations.push({
        priority: 'low',
        category: 'Maintenance',
        title: 'Maintain Movement Quality',
        description: 'Good movement patterns detected. Continue current training with periodic re-screening.',
        action: 'Re-assess every 6 months or after injury',
        program: 'Continue strength and conditioning program'
      });
    }

    return recommendations;
  }

  /**
   * Get corrective exercises for asymmetries
   */
  getAsymmetryExercises(testName) {
    const exercises = {
      'Hurdle Step': [
        'Single-leg balance progressions',
        'Split squats',
        'Step-ups with focus on weaker side',
        'Hip mobility drills'
      ],
      'Inline Lunge': [
        'Ankle mobility exercises',
        'Split stance holds',
        'Single-leg RDLs',
        'Core anti-rotation exercises'
      ],
      'Shoulder Mobility': [
        'Unilateral shoulder stretches',
        'Sleeper stretches',
        'Wall slides (weaker side)',
        'Band pull-aparts'
      ],
      'Active Straight Leg Raise': [
        'Hamstring stretches (weaker side)',
        'Active leg raises with band',
        'Dead bugs',
        'Core stability exercises'
      ],
      'Rotary Stability': [
        'Bird dogs (weaker side)',
        'Side planks (weaker side)',
        'Dead bugs',
        'Anti-rotation presses'
      ]
    };

    return exercises[testName] || ['Consult with movement specialist'];
  }

  /**
   * Get corrective exercises for specific tests
   */
  getTestExercises(testId) {
    const exercises = {
      'deep_squat': [
        'Goblet squats',
        'Ankle mobility drills',
        'Hip flexor stretches',
        'Thoracic spine mobility',
        'Box squats'
      ],
      'hurdle_step': [
        'Single-leg balance',
        'Step-ups',
        'Hip mobility exercises',
        'Ankle mobility drills'
      ],
      'inline_lunge': [
        'Split squats',
        'Ankle dorsiflexion drills',
        'Hip flexor stretches',
        'Core stability exercises'
      ],
      'shoulder_mobility': [
        'Shoulder dislocations (band)',
        'Wall slides',
        'Thoracic extensions',
        'Lat stretches'
      ],
      'leg_raise': [
        'Hamstring stretches',
        'Active leg raises',
        'Dead bugs',
        'Core stability work'
      ],
      'push_up': [
        'Planks',
        'Push-up progressions',
        'Core bracing exercises',
        'Bird dogs'
      ],
      'rotary_stability': [
        'Bird dogs',
        'Side planks',
        'Dead bugs',
        'Anti-rotation presses'
      ]
    };

    return exercises[testId] || [];
  }

  /**
   * Save to localStorage
   */
  saveToLocalStorage() {
    const data = {
      currentTest: this.currentTest,
      currentSide: this.currentSide,
      scores: this.scores,
      clearingTests: this.clearingTests,
      patientInfo: this.patientInfo,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('fms_assessment', JSON.stringify(data));
  }

  /**
   * Load from localStorage
   */
  loadFromLocalStorage() {
    const saved = localStorage.getItem('fms_assessment');
    if (saved) {
      const data = JSON.parse(saved);
      this.currentTest = data.currentTest || 0;
      this.currentSide = data.currentSide || 'left';
      this.scores = data.scores || {};
      this.clearingTests = data.clearingTests || {};
      this.patientInfo = data.patientInfo || null;
      console.log('[FMS] Loaded saved assessment from', data.savedAt);
    }
  }

  /**
   * Clear saved data
   */
  clearSaved() {
    localStorage.removeItem('fms_assessment');
    this.currentTest = 0;
    this.currentSide = 'left';
    this.scores = {};
    this.clearingTests = {};
    this.patientInfo = null;
  }

  /**
   * Export results to PDF format (data structure)
   */
  exportToPDF(results) {
    return {
      title: 'Functional Movement Screen Report',
      patient: results.patientInfo,
      date: new Date(results.completedDate).toLocaleDateString(),
      summary: {
        totalScore: `${results.totalScore}/21`,
        injuryRisk: results.injuryRisk.level.toUpperCase(),
        riskScore: `${results.injuryRisk.score}%`,
        interpretation: results.injuryRisk.description
      },
      detailedScores: this.formatDetailedScores(results.detailedScores),
      asymmetries: results.asymmetries,
      redFlags: results.redFlags,
      recommendations: results.recommendations,
      researchNote: results.injuryRisk.research,
      footer: 'ThriveOrtho - Functional Movement Screen | Professional Assessment'
    };
  }

  /**
   * Format detailed scores for reporting
   */
  formatDetailedScores(scores) {
    return this.tests.map(test => {
      const testScores = scores[test.id];
      if (!testScores) return null;

      if (test.bilateral) {
        return {
          test: test.name,
          score: `${testScores.score}/3`,
          notes: testScores.notes || 'None'
        };
      } else {
        return {
          test: test.name,
          left: `${testScores.left?.score || 0}/3`,
          right: `${testScores.right?.score || 0}/3`,
          final: `${Math.min(testScores.left?.score || 0, testScores.right?.score || 0)}/3`,
          notes: `L: ${testScores.left?.notes || 'None'} | R: ${testScores.right?.notes || 'None'}`
        };
      }
    }).filter(item => item !== null);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FMSAssessment;
}
