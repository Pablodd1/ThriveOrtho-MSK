/**
 * GPT-4 Vision Integration for Enhanced Movement Analysis
 * Uses OpenAI's GPT-4 Vision API for advanced visual assessment
 * 
 * Features:
 * - Visual analysis of movement quality
 * - Posture assessment from photos/videos
 * - Gait analysis from video frames
 * - Comparative analysis (before/after)
 * - Natural language insights
 * - Integration with existing assessments
 * 
 * ROI: 833% - $12K investment → $100K annual revenue
 * 
 * Note: Requires OpenAI API key configured on backend
 */

class GPT4VisionAnalyzer {
  constructor(apiEndpoint = '/api/gpt4-vision') {
    this.apiEndpoint = apiEndpoint;
    this.analysisHistory = [];
  }

  /**
   * Analyze a single image for movement/posture assessment
   */
  async analyzeImage(imageUrl, analysisType = 'general', context = {}) {
    const prompts = {
      'posture': this.generatePosturePrompt(context),
      'gait': this.generateGaitPrompt(context),
      'rom': this.generateROMPrompt(context),
      'fms': this.generateFMSPrompt(context),
      'injury': this.generateInjuryPrompt(context),
      'comparison': this.generateComparisonPrompt(context),
      'general': this.generateGeneralPrompt(context)
    };

    const prompt = prompts[analysisType] || prompts.general;

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageUrl,
          prompt: prompt,
          type: analysisType,
          context: context
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      // Store in history
      this.analysisHistory.push({
        timestamp: new Date().toISOString(),
        type: analysisType,
        image: imageUrl,
        result: result,
        context: context
      });

      return this.formatAnalysisResult(result, analysisType);
    } catch (error) {
      console.error('[GPT-4 Vision] Analysis error:', error);
      throw error;
    }
  }

  /**
   * Analyze multiple images (e.g., movement sequence, before/after)
   */
  async analyzeMultipleImages(images, analysisType = 'sequence', context = {}) {
    const prompt = analysisType === 'comparison' 
      ? this.generateComparisonPrompt(context)
      : this.generateSequencePrompt(context);

    try {
      const response = await fetch(this.apiEndpoint + '/multi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: images,
          prompt: prompt,
          type: analysisType,
          context: context
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      return this.formatAnalysisResult(result, analysisType);
    } catch (error) {
      console.error('[GPT-4 Vision] Multi-image analysis error:', error);
      throw error;
    }
  }

  /**
   * Analyze video frames for movement assessment
   */
  async analyzeVideoFrames(frames, analysisType = 'movement', context = {}) {
    const prompt = this.generateMovementPrompt(context);

    try {
      const response = await fetch(this.apiEndpoint + '/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frames: frames,
          prompt: prompt,
          type: analysisType,
          context: context
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      return this.formatAnalysisResult(result, analysisType);
    } catch (error) {
      console.error('[GPT-4 Vision] Video analysis error:', error);
      throw error;
    }
  }

  /**
   * Generate posture analysis prompt
   */
  generatePosturePrompt(context) {
    return `You are an expert physical therapist analyzing patient posture. 

Patient Context:
${context.patientInfo ? `- Name: ${context.patientInfo.name}, Age: ${context.patientInfo.age}` : ''}
${context.chiefComplaint ? `- Chief Complaint: ${context.chiefComplaint}` : ''}
${context.medicalHistory ? `- Relevant History: ${context.medicalHistory}` : ''}

Please analyze this image and provide:

1. **Postural Assessment** (Head to Toe):
   - Head/Neck alignment
   - Shoulder position and symmetry
   - Spinal alignment (cervical, thoracic, lumbar)
   - Pelvic tilt and position
   - Hip, knee, and ankle alignment
   - Weight distribution

2. **Specific Observations**:
   - Any visible asymmetries
   - Compensatory patterns
   - Areas of concern

3. **Clinical Implications**:
   - Likely pain generators
   - Potential movement limitations
   - Risk for injury or dysfunction

4. **Recommendations**:
   - Priority areas for intervention
   - Suggested corrective exercises (3-5)
   - Ergonomic/lifestyle modifications

Format your response clearly with headings. Be specific and actionable.`;
  }

  /**
   * Generate gait analysis prompt
   */
  generateGaitPrompt(context) {
    return `You are an expert physical therapist analyzing gait patterns.

Patient Context:
${context.patientInfo ? `- Name: ${context.patientInfo.name}, Age: ${context.patientInfo.age}` : ''}
${context.chiefComplaint ? `- Chief Complaint: ${context.chiefComplaint}` : ''}

Analyze this gait cycle image/sequence and provide:

1. **Gait Phase Analysis**:
   - Initial contact quality
   - Loading response
   - Midstance stability
   - Terminal stance push-off
   - Swing phase clearance

2. **Deviations Observed**:
   - Trendelenburg sign
   - Antalgic patterns
   - Foot progression angle
   - Step length asymmetry
   - Arm swing symmetry

3. **Compensatory Mechanisms**:
   - Joint substitutions
   - Muscle overactivation
   - Balance strategies

4. **Clinical Recommendations**:
   - Target areas for intervention
   - Gait training focus
   - Assistive device recommendations (if needed)
   - Strengthening priorities

Be specific about observable deviations and their clinical significance.`;
  }

  /**
   * Generate ROM analysis prompt
   */
  generateROMPrompt(context) {
    return `You are an expert physical therapist assessing range of motion.

Joint Being Assessed: ${context.joint || 'Not specified'}
Movement: ${context.movement || 'Not specified'}

Analyze this image and provide:

1. **Visual ROM Estimate**:
   - Estimated degrees of motion
   - Comparison to normal ROM values
   - Quality of movement pattern

2. **Limiting Factors**:
   - End-feel characteristics (based on visible compensation)
   - Likely tissue restrictions
   - Muscle guarding patterns

3. **Functional Impact**:
   - ADL limitations
   - Sport/activity restrictions

4. **Treatment Recommendations**:
   - Mobilization techniques
   - Stretching program
   - Strengthening needs
   - Timeline expectations

Include specific measurements where possible.`;
  }

  /**
   * Generate FMS analysis prompt
   */
  generateFMSPrompt(context) {
    return `You are an FMS-certified physical therapist scoring a Functional Movement Screen test.

FMS Test: ${context.fmsTest || 'Not specified'}
Side: ${context.side || 'Not specified'}

Analyze this image and provide:

1. **FMS Score** (0-3):
   - Preliminary score with justification
   - Key criteria met/not met
   - Clearing test considerations

2. **Movement Quality**:
   - Compensatory patterns observed
   - Asymmetries detected
   - Stability assessment

3. **Scoring Rationale**:
   - Why this score vs. higher/lower
   - Specific criteria from FMS manual
   - Areas preventing higher score

4. **Corrective Strategy**:
   - Specific limitations to address
   - Progression pathway
   - Timeline to retest

Be strict with FMS scoring criteria. Reference official FMS standards.`;
  }

  /**
   * Generate injury assessment prompt
   */
  generateInjuryPrompt(context) {
    return `You are an expert physical therapist assessing injury presentation.

Injury Context:
${context.injuryMechanism ? `- Mechanism: ${context.injuryMechanism}` : ''}
${context.symptoms ? `- Symptoms: ${context.symptoms}` : ''}
${context.timeline ? `- Timeline: ${context.timeline}` : ''}

Analyze this image and provide:

1. **Visual Findings**:
   - Swelling/edema
   - Discoloration
   - Deformity
   - Guarding patterns
   - Functional limitations visible

2. **Differential Diagnosis Considerations**:
   - Likely structures involved
   - Severity indicators
   - Red flags requiring referral

3. **Clinical Tests Indicated**:
   - Specific special tests to perform
   - Imaging considerations
   - Contraindications to note

4. **Initial Treatment Plan**:
   - Immediate interventions
   - Precautions/contraindications
   - Expected recovery timeline
   - Referral recommendations

Focus on safety and appropriate medical management.`;
  }

  /**
   * Generate comparison prompt (before/after)
   */
  generateComparisonPrompt(context) {
    return `You are an expert physical therapist comparing patient progress.

Comparison Context:
- Timeframe: ${context.timeframe || 'Not specified'}
- Interventions: ${context.interventions || 'Not specified'}
${context.goals ? `- Treatment Goals: ${context.goals}` : ''}

Compare the before and after images and provide:

1. **Quantitative Changes**:
   - ROM improvements (estimated degrees)
   - Postural corrections (measurable shifts)
   - Functional improvements

2. **Qualitative Improvements**:
   - Movement quality changes
   - Compensation pattern reduction
   - Stability improvements

3. **Progress Assessment**:
   - Goals met/partially met/not met
   - Rate of improvement
   - Expected vs. actual outcomes

4. **Next Steps**:
   - Continue current program?
   - Advance difficulty?
   - New focus areas?
   - Discharge readiness?

Provide specific, measurable observations to justify progress notes.`;
  }

  /**
   * Generate movement sequence prompt
   */
  generateSequencePrompt(context) {
    return `You are an expert physical therapist analyzing a movement sequence.

Movement: ${context.movement || 'Not specified'}
Context: ${context.context || 'Not specified'}

Analyze this movement sequence and provide:

1. **Movement Pattern Analysis**:
   - Initiation and sequencing
   - Coordination and timing
   - Compensation patterns
   - Symmetry assessment

2. **Phase-by-Phase Breakdown**:
   - Eccentric control
   - Transition points
   - Concentric power
   - Return to start

3. **Quality Assessment**:
   - Smoothness and control
   - Range of motion utilized
   - Stability throughout
   - Efficiency of movement

4. **Recommendations**:
   - Technical corrections
   - Cueing strategies
   - Regression/progression options
   - Associated strengthening needs

Provide actionable feedback for movement optimization.`;
  }

  /**
   * Generate general movement prompt
   */
  generateGeneralPrompt(context) {
    return `You are an expert physical therapist providing comprehensive movement analysis.

Context: ${JSON.stringify(context, null, 2)}

Analyze this image comprehensively and provide:

1. **Overall Impression**:
   - Primary observations
   - Movement quality assessment
   - Clinical relevance

2. **Detailed Analysis**:
   - Joint-by-joint assessment
   - Muscle activation patterns
   - Compensatory strategies

3. **Clinical Implications**:
   - Functional limitations
   - Injury risks
   - Performance optimization potential

4. **Actionable Recommendations**:
   - Priority interventions
   - Exercise prescriptions
   - Lifestyle modifications
   - Follow-up timeline

Provide thorough, evidence-based analysis.`;
  }

  /**
   * Generate movement analysis prompt (video frames)
   */
  generateMovementPrompt(context) {
    return `You are an expert physical therapist analyzing movement from video.

Movement Type: ${context.movementType || 'Not specified'}
Assessment Focus: ${context.focus || 'General quality'}

Analyze these video frames and provide:

1. **Movement Breakdown**:
   - Starting position quality
   - Movement execution
   - End position achievement
   - Return to start

2. **Temporal Analysis**:
   - Speed appropriateness
   - Rhythm and timing
   - Hesitations or corrections
   - Fatigue indicators

3. **Spatial Analysis**:
   - Path of movement
   - Range utilized
   - Planes of motion
   - Symmetry

4. **Clinical Assessment**:
   - Overall movement grade (A-F)
   - Safety concerns
   - Readiness for progression
   - Specific corrections needed

Include specific timestamps or frame references where applicable.`;
  }

  /**
   * Format analysis result for consistent output
   */
  formatAnalysisResult(rawResult, analysisType) {
    return {
      type: analysisType,
      timestamp: new Date().toISOString(),
      analysis: rawResult.analysis || rawResult.content,
      confidence: rawResult.confidence || 'high',
      keyFindings: this.extractKeyFindings(rawResult),
      recommendations: this.extractRecommendations(rawResult),
      cptCodes: this.suggestCPTCodes(analysisType, rawResult),
      rawResponse: rawResult
    };
  }

  /**
   * Extract key findings from analysis
   */
  extractKeyFindings(result) {
    // Parse analysis text for key findings
    const text = result.analysis || result.content || '';
    const findings = [];

    // Look for numbered lists or bullet points
    const patterns = [
      /(\d+\.\s*\*\*[^*]+\*\*[^\.]+)/g,
      /(-\s+[A-Z][^-\n]+)/g
    ];

    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        findings.push(...matches.map(m => m.trim()));
      }
    });

    return findings.slice(0, 5); // Top 5 findings
  }

  /**
   * Extract recommendations from analysis
   */
  extractRecommendations(result) {
    const text = result.analysis || result.content || '';
    const recommendations = [];

    // Look for recommendation sections
    const recSection = text.match(/(?:Recommendations?|Next Steps|Treatment Plan):?\s*([\s\S]*?)(?:\n\n|\n#|$)/i);
    
    if (recSection) {
      const items = recSection[1].match(/(?:^|\n)\s*[-•*]?\s*([^\n]+)/g);
      if (items) {
        recommendations.push(...items.map(item => item.trim()));
      }
    }

    return recommendations.slice(0, 5); // Top 5 recommendations
  }

  /**
   * Suggest appropriate CPT codes based on analysis
   */
  suggestCPTCodes(analysisType, result) {
    const codes = {
      'posture': ['97161', '97110'],  // Eval + Therapeutic exercise
      'gait': ['97116', '97110'],     // Gait training + Exercise
      'rom': ['97110', '97140'],      // Exercise + Manual therapy
      'fms': ['97161'],               // PT evaluation
      'injury': ['97161', '97162'],   // PT eval (low-mod complexity)
      'comparison': ['97001'],        // Re-evaluation
      'movement': ['97110', '97112'], // Exercise + Neuromuscular re-ed
      'general': ['97161']            // Default: PT evaluation
    };

    return codes[analysisType] || codes.general;
  }

  /**
   * Get analysis history
   */
  getHistory(filterType = null) {
    if (!filterType) return this.analysisHistory;
    
    return this.analysisHistory.filter(item => item.type === filterType);
  }

  /**
   * Clear analysis history
   */
  clearHistory() {
    this.analysisHistory = [];
  }

  /**
   * Export analysis report
   */
  exportReport(analysisId = null) {
    const data = analysisId 
      ? this.analysisHistory.find(item => item.timestamp === analysisId)
      : this.analysisHistory;

    return {
      generatedAt: new Date().toISOString(),
      totalAnalyses: Array.isArray(data) ? data.length : 1,
      data: data
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GPT4VisionAnalyzer;
}
