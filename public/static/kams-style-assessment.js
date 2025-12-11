/**
 * KAMS-Style Clinical Assessment System
 * Inspired by professional gait analysis and functional movement screening
 * 
 * Features:
 * - 3D skeleton visualization with color-coded joint issues
 * - Multi-metric scoring system (Dynamic Posture, Power, Asymmetry, Injury Risk)
 * - Dysfunction region mapping (Upper Body, Lower Body, Spinal)
 * - Plane-specific analysis (Frontal, Transverse, Sagittal)
 * - Center of mass tracking
 * - Alignment grid with measurements
 * - Treatment protocol generation
 */

class KAMSStyleAssessment {
  constructor() {
    this.metrics = {
      dynamicPostureIndex: 0,
      lowerExtremityPowerScore: 0,
      functionalAsymmetryIndex: 0,
      susceptibilityToInjuryIndex: 0
    };
    
    this.dysfunctionRegions = {
      upperBody: [],
      lowerBody: [],
      spinal: []
    };
    
    this.overallScore = 0;
    this.planeAnalysis = {
      frontal: {},    // FP - Front view analysis
      transverse: {}, // TP - Top-down view analysis
      sagittal: {}    // SP - Side view analysis
    };
  }

  /**
   * Analyze pose data and generate KAMS-style assessment
   */
  analyzePoseData(landmarks, previousFrames = []) {
    // 1. Calculate Dynamic Posture Index
    this.metrics.dynamicPostureIndex = this.calculateDynamicPostureIndex(landmarks);
    
    // 2. Calculate Lower Extremity Power Score
    this.metrics.lowerExtremityPowerScore = this.calculatePowerScore(landmarks, previousFrames);
    
    // 3. Calculate Functional Asymmetry Index
    this.metrics.functionalAsymmetryIndex = this.calculateAsymmetryIndex(landmarks);
    
    // 4. Calculate Susceptibility to Injury Index
    this.metrics.susceptibilityToInjuryIndex = this.calculateInjuryRisk(landmarks);
    
    // 5. Identify dysfunction regions
    this.identifyDysfunctionRegions(landmarks);
    
    // 6. Calculate overall KAMS score (0-100%)
    this.overallScore = this.calculateOverallScore();
    
    return this.generateReport();
  }

  /**
   * Calculate Dynamic Posture Index (alignment and balance)
   */
  calculateDynamicPostureIndex(landmarks) {
    let score = 100;
    
    // Check head-neck alignment
    const noseY = landmarks[0].y;
    const leftShoulderY = landmarks[11].y;
    const rightShoulderY = landmarks[12].y;
    const shoulderMidY = (leftShoulderY + rightShoulderY) / 2;
    
    const headTilt = Math.abs(noseY - shoulderMidY);
    if (headTilt > 0.05) score -= 10;
    
    // Check shoulder level
    const shoulderLevelDiff = Math.abs(leftShoulderY - rightShoulderY);
    if (shoulderLevelDiff > 0.03) score -= 10;
    
    // Check hip level
    const leftHipY = landmarks[23].y;
    const rightHipY = landmarks[24].y;
    const hipLevelDiff = Math.abs(leftHipY - rightHipY);
    if (hipLevelDiff > 0.03) score -= 10;
    
    // Check torso alignment
    const shoulderMidX = (landmarks[11].x + landmarks[12].x) / 2;
    const hipMidX = (landmarks[23].x + landmarks[24].x) / 2;
    const torsoLean = Math.abs(shoulderMidX - hipMidX);
    if (torsoLean > 0.05) score -= 15;
    
    // Check knee alignment
    const leftKneeX = landmarks[25].x;
    const rightKneeX = landmarks[26].x;
    const leftAnkleX = landmarks[27].x;
    const rightAnkleX = landmarks[28].x;
    
    const leftKneeAlignment = Math.abs(leftKneeX - leftAnkleX);
    const rightKneeAlignment = Math.abs(rightKneeX - rightAnkleX);
    if (leftKneeAlignment > 0.05 || rightKneeAlignment > 0.05) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate Lower Extremity Power Score (ROM and strength indicators)
   */
  calculatePowerScore(landmarks, previousFrames) {
    let score = 100;
    
    if (previousFrames.length < 10) return 50; // Need movement data
    
    // Analyze hip ROM
    const hipROM = this.calculateJointROM(landmarks, previousFrames, 'hip');
    if (hipROM < 70) score -= 20;
    else if (hipROM < 90) score -= 10;
    
    // Analyze knee ROM
    const kneeROM = this.calculateJointROM(landmarks, previousFrames, 'knee');
    if (kneeROM < 100) score -= 20;
    else if (kneeROM < 120) score -= 10;
    
    // Analyze ankle ROM
    const ankleROM = this.calculateJointROM(landmarks, previousFrames, 'ankle');
    if (ankleROM < 15) score -= 15;
    else if (ankleROM < 20) score -= 8;
    
    // Check for explosive movement patterns (if available)
    const movementSpeed = this.calculateMovementSpeed(previousFrames);
    if (movementSpeed < 0.3) score -= 15; // Slow movement
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate Functional Asymmetry Index (left-right balance)
   */
  calculateAsymmetryIndex(landmarks) {
    let totalAsymmetry = 0;
    let asymmetryCount = 0;
    
    // Shoulder height asymmetry
    const shoulderAsym = Math.abs(landmarks[11].y - landmarks[12].y);
    totalAsymmetry += shoulderAsym * 100;
    asymmetryCount++;
    
    // Hip height asymmetry
    const hipAsym = Math.abs(landmarks[23].y - landmarks[24].y);
    totalAsymmetry += hipAsym * 100;
    asymmetryCount++;
    
    // Knee position asymmetry
    const leftKneeX = landmarks[25].x;
    const rightKneeX = landmarks[26].x;
    const leftAnkleX = landmarks[27].x;
    const rightAnkleX = landmarks[28].x;
    
    const leftKneeOffset = leftKneeX - leftAnkleX;
    const rightKneeOffset = rightKneeX - rightAnkleX;
    const kneeAsym = Math.abs(leftKneeOffset - rightKneeOffset);
    totalAsymmetry += kneeAsym * 100;
    asymmetryCount++;
    
    // Elbow position asymmetry
    const leftElbowY = landmarks[13].y;
    const rightElbowY = landmarks[14].y;
    const elbowAsym = Math.abs(leftElbowY - rightElbowY);
    totalAsymmetry += elbowAsym * 80;
    asymmetryCount++;
    
    const avgAsymmetry = totalAsymmetry / asymmetryCount;
    
    // Convert to score (less asymmetry = higher score)
    const score = Math.max(0, Math.min(100, 100 - (avgAsymmetry * 20)));
    
    return score;
  }

  /**
   * Calculate Susceptibility to Injury Index
   */
  calculateInjuryRisk(landmarks) {
    let riskScore = 0;
    
    // Knee valgus/varus (ACL injury risk)
    const kneeValgus = this.detectKneeValgus(landmarks);
    if (kneeValgus.left > 10 || kneeValgus.right > 10) riskScore += 25;
    else if (kneeValgus.left > 5 || kneeValgus.right > 5) riskScore += 15;
    
    // Forward head posture (neck/shoulder injury risk)
    const headPosture = this.detectForwardHeadPosture(landmarks);
    if (headPosture > 0.08) riskScore += 20;
    else if (headPosture > 0.05) riskScore += 10;
    
    // Pelvic tilt (lower back injury risk)
    const pelvicTilt = this.detectPelvicTilt(landmarks);
    if (Math.abs(pelvicTilt) > 15) riskScore += 20;
    else if (Math.abs(pelvicTilt) > 10) riskScore += 10;
    
    // Shoulder internal rotation (shoulder impingement risk)
    const shoulderRotation = this.detectShoulderRotation(landmarks);
    if (shoulderRotation.internal > 20) riskScore += 15;
    
    // Ankle stability (ankle sprain risk)
    const ankleStability = this.assessAnkleStability(landmarks);
    if (ankleStability < 60) riskScore += 10;
    
    return Math.max(0, Math.min(100, riskScore));
  }

  /**
   * Identify specific dysfunction regions with plane analysis
   */
  identifyDysfunctionRegions(landmarks) {
    this.dysfunctionRegions = {
      upperBody: [],
      lowerBody: [],
      spinal: []
    };
    
    // Upper Body Analysis
    const shoulderIssues = this.analyzeShoulders(landmarks);
    if (shoulderIssues.right.severity !== 'none') {
      this.dysfunctionRegions.upperBody.push({
        location: 'Right Shoulder',
        plane: shoulderIssues.right.plane,
        severity: shoulderIssues.right.severity,
        issue: shoulderIssues.right.issue
      });
    }
    if (shoulderIssues.left.severity !== 'none') {
      this.dysfunctionRegions.upperBody.push({
        location: 'Left Shoulder',
        plane: shoulderIssues.left.plane,
        severity: shoulderIssues.left.severity,
        issue: shoulderIssues.left.issue
      });
    }
    
    // Lower Body Analysis
    const hipIssues = this.analyzeHips(landmarks);
    if (hipIssues.right.severity !== 'none') {
      this.dysfunctionRegions.lowerBody.push({
        location: 'Right Hip',
        plane: hipIssues.right.plane,
        severity: hipIssues.right.severity,
        issue: hipIssues.right.issue
      });
    }
    if (hipIssues.left.severity !== 'none') {
      this.dysfunctionRegions.lowerBody.push({
        location: 'Left Hip',
        plane: hipIssues.left.plane,
        severity: hipIssues.left.severity,
        issue: hipIssues.left.issue
      });
    }
    
    const ankleIssues = this.analyzeAnkles(landmarks);
    if (ankleIssues.right.severity !== 'none') {
      this.dysfunctionRegions.lowerBody.push({
        location: 'Right Ankle',
        plane: ankleIssues.right.plane,
        severity: ankleIssues.right.severity,
        issue: ankleIssues.right.issue
      });
    }
    if (ankleIssues.left.severity !== 'none') {
      this.dysfunctionRegions.lowerBody.push({
        location: 'Left Ankle',
        plane: ankleIssues.left.plane,
        severity: ankleIssues.left.severity,
        issue: ankleIssues.left.issue
      });
    }
    
    // Spinal Analysis
    const spinalIssues = this.analyzeSpine(landmarks);
    spinalIssues.forEach(issue => {
      if (issue.severity !== 'none') {
        this.dysfunctionRegions.spinal.push(issue);
      }
    });
  }

  /**
   * Analyze shoulders for dysfunction
   */
  analyzeShoulders(landmarks) {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];
    
    const result = {
      left: { severity: 'none', plane: 'TP', issue: 'mobility' },
      right: { severity: 'none', plane: 'TP', issue: 'mobility' }
    };
    
    // Check shoulder elevation
    const shoulderLevelDiff = Math.abs(leftShoulder.y - rightShoulder.y);
    if (shoulderLevelDiff > 0.05) {
      const higherSide = leftShoulder.y < rightShoulder.y ? 'left' : 'right';
      result[higherSide].severity = 'High';
      result[higherSide].issue = 'elevation';
      result[higherSide].plane = 'FP';
    }
    
    // Check shoulder internal rotation (simplified)
    const leftShoulderWidth = Math.abs(leftShoulder.x - leftElbow.x);
    const rightShoulderWidth = Math.abs(rightShoulder.x - rightElbow.x);
    
    if (leftShoulderWidth < 0.08) {
      result.left.severity = 'Moderate';
      result.left.issue = 'internal rotation';
      result.left.plane = 'TP';
    }
    if (rightShoulderWidth < 0.08) {
      result.right.severity = 'Moderate';
      result.right.issue = 'internal rotation';
      result.right.plane = 'TP';
    }
    
    return result;
  }

  /**
   * Analyze hips for dysfunction
   */
  analyzeHips(landmarks) {
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    
    const result = {
      left: { severity: 'none', plane: 'SP', issue: 'mobility' },
      right: { severity: 'none', plane: 'SP', issue: 'mobility' }
    };
    
    // Check for hip drop
    const hipLevelDiff = Math.abs(leftHip.y - rightHip.y);
    if (hipLevelDiff > 0.04) {
      const droppedSide = leftHip.y > rightHip.y ? 'left' : 'right';
      result[droppedSide].severity = 'High';
      result[droppedSide].issue = 'weakness/drop';
      result[droppedSide].plane = 'FP';
    }
    
    // Check for hip adduction (knees caving in)
    const leftKneeOffset = Math.abs(leftKnee.x - leftHip.x);
    const rightKneeOffset = Math.abs(rightKnee.x - rightHip.x);
    
    if (leftKneeOffset < 0.03) {
      result.left.severity = 'Moderate';
      result.left.issue = 'adduction/valgus';
      result.left.plane = 'FP';
    }
    if (rightKneeOffset < 0.03) {
      result.right.severity = 'Moderate';
      result.right.issue = 'adduction/valgus';
      result.right.plane = 'FP';
    }
    
    return result;
  }

  /**
   * Analyze ankles for dysfunction
   */
  analyzeAnkles(landmarks) {
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    
    const result = {
      left: { severity: 'none', plane: 'TP', issue: 'mobility' },
      right: { severity: 'none', plane: 'TP', issue: 'mobility' }
    };
    
    // Check ankle alignment (pronation/supination)
    const leftAnkleAlignment = this.calculateAnkleAlignment(leftKnee, leftAnkle);
    const rightAnkleAlignment = this.calculateAnkleAlignment(rightKnee, rightAnkle);
    
    if (Math.abs(leftAnkleAlignment) > 8) {
      result.left.severity = 'Moderate';
      result.left.issue = leftAnkleAlignment > 0 ? 'pronation' : 'supination';
      result.left.plane = 'FP';
    }
    
    if (Math.abs(rightAnkleAlignment) > 8) {
      result.right.severity = 'Moderate';
      result.right.issue = rightAnkleAlignment > 0 ? 'pronation' : 'supination';
      result.right.plane = 'FP';
    }
    
    return result;
  }

  /**
   * Analyze spine for dysfunction
   */
  analyzeSpine(landmarks) {
    const issues = [];
    
    // Thoracic spine (mid-back)
    const thoracicCurvature = this.assessThoracicCurvature(landmarks);
    if (thoracicCurvature > 15) {
      issues.push({
        location: 'Thoracic',
        plane: 'SP',
        severity: 'Moderate',
        issue: 'increased kyphosis'
      });
    }
    
    // Lumbar spine (low back)
    const lumbarCurvature = this.assessLumbarCurvature(landmarks);
    if (lumbarCurvature > 20) {
      issues.push({
        location: 'Lumbar',
        plane: 'SP',
        severity: 'Low',
        issue: 'increased lordosis'
      });
    } else if (lumbarCurvature < 5) {
      issues.push({
        location: 'Lumbar',
        plane: 'SP',
        severity: 'Moderate',
        issue: 'flat back'
      });
    }
    
    // SI Joint (sacroiliac)
    const pelvicTilt = this.detectPelvicTilt(landmarks);
    if (Math.abs(pelvicTilt) > 12) {
      issues.push({
        location: pelvicTilt > 0 ? 'Right SI Joint' : 'Left SI Joint',
        plane: 'SP',
        severity: 'Low',
        issue: 'pelvic tilt'
      });
    }
    
    return issues;
  }

  /**
   * Helper: Calculate joint ROM from frame history
   */
  calculateJointROM(landmarks, previousFrames, joint) {
    // Simplified ROM calculation
    let minAngle = 180;
    let maxAngle = 0;
    
    previousFrames.forEach(frame => {
      let angle = 0;
      
      if (joint === 'hip') {
        angle = this.calculateAngle(
          frame.landmarks[23], // hip
          frame.landmarks[25], // knee
          frame.landmarks[27]  // ankle
        );
      } else if (joint === 'knee') {
        angle = this.calculateAngle(
          frame.landmarks[23], // hip
          frame.landmarks[25], // knee
          frame.landmarks[27]  // ankle
        );
      } else if (joint === 'ankle') {
        angle = this.calculateAngle(
          frame.landmarks[25], // knee
          frame.landmarks[27], // ankle
          frame.landmarks[31]  // foot
        );
      }
      
      minAngle = Math.min(minAngle, angle);
      maxAngle = Math.max(maxAngle, angle);
    });
    
    return maxAngle - minAngle;
  }

  /**
   * Helper: Calculate angle between three points
   */
  calculateAngle(point1, point2, point3) {
    const radians = Math.atan2(point3.y - point2.y, point3.x - point2.x) -
                    Math.atan2(point1.y - point2.y, point1.x - point2.x);
    let angle = Math.abs(radians * 180 / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
  }

  /**
   * Helper: Calculate movement speed
   */
  calculateMovementSpeed(previousFrames) {
    if (previousFrames.length < 5) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < previousFrames.length; i++) {
      const prev = previousFrames[i - 1].landmarks[0]; // nose
      const curr = previousFrames[i].landmarks[0];
      const dist = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
      totalDistance += dist;
    }
    
    return totalDistance / previousFrames.length;
  }

  /**
   * Helper: Detect knee valgus
   */
  detectKneeValgus(landmarks) {
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    
    // Calculate valgus angle (simplified)
    const leftValgus = Math.atan2(
      leftKnee.x - leftHip.x,
      leftKnee.y - leftHip.y
    ) * 180 / Math.PI;
    
    const rightValgus = Math.atan2(
      rightKnee.x - rightHip.x,
      rightKnee.y - rightHip.y
    ) * 180 / Math.PI;
    
    return {
      left: Math.abs(leftValgus),
      right: Math.abs(rightValgus)
    };
  }

  /**
   * Helper: Detect forward head posture
   */
  detectForwardHeadPosture(landmarks) {
    const nose = landmarks[0];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
    
    return Math.abs(nose.x - shoulderMidX);
  }

  /**
   * Helper: Detect pelvic tilt
   */
  detectPelvicTilt(landmarks) {
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    
    const tiltAngle = Math.atan2(
      rightHip.y - leftHip.y,
      rightHip.x - leftHip.x
    ) * 180 / Math.PI;
    
    return tiltAngle;
  }

  /**
   * Helper: Detect shoulder internal rotation
   */
  detectShoulderRotation(landmarks) {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];
    
    // Simplified rotation detection
    const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
    const elbowWidth = Math.abs(rightElbow.x - leftElbow.x);
    
    const rotationRatio = elbowWidth / shoulderWidth;
    
    return {
      internal: rotationRatio < 0.8 ? (1 - rotationRatio) * 100 : 0,
      external: rotationRatio > 1.2 ? (rotationRatio - 1) * 100 : 0
    };
  }

  /**
   * Helper: Assess ankle stability
   */
  assessAnkleStability(landmarks) {
    // Simplified stability assessment
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    
    const leftAlignment = Math.abs(leftAnkle.x - leftKnee.x);
    const rightAlignment = Math.abs(rightAnkle.x - rightKnee.x);
    
    const avgAlignment = (leftAlignment + rightAlignment) / 2;
    
    return Math.max(0, 100 - (avgAlignment * 1000));
  }

  /**
   * Helper: Calculate ankle alignment
   */
  calculateAnkleAlignment(knee, ankle) {
    const offset = (ankle.x - knee.x) * 100;
    return offset; // Positive = pronation, Negative = supination
  }

  /**
   * Helper: Assess thoracic curvature
   */
  assessThoracicCurvature(landmarks) {
    const nose = landmarks[0];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
    
    // Simplified curvature assessment
    const curvature = (nose.y - shoulderMidY) * 100;
    return Math.abs(curvature);
  }

  /**
   * Helper: Assess lumbar curvature
   */
  assessLumbarCurvature(landmarks) {
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    
    const hipMidX = (leftHip.x + rightHip.x) / 2;
    const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
    
    const curvature = (shoulderMidX - hipMidX) * 100;
    return Math.abs(curvature);
  }

  /**
   * Calculate overall KAMS score
   */
  calculateOverallScore() {
    const weights = {
      dynamicPostureIndex: 0.3,
      lowerExtremityPowerScore: 0.25,
      functionalAsymmetryIndex: 0.25,
      susceptibilityToInjuryIndex: -0.2 // Negative weight (higher injury risk = lower score)
    };
    
    const weightedScore = 
      (this.metrics.dynamicPostureIndex * weights.dynamicPostureIndex) +
      (this.metrics.lowerExtremityPowerScore * weights.lowerExtremityPowerScore) +
      (this.metrics.functionalAsymmetryIndex * weights.functionalAsymmetryIndex) -
      (this.metrics.susceptibilityToInjuryIndex * Math.abs(weights.susceptibilityToInjuryIndex));
    
    return Math.max(0, Math.min(100, weightedScore));
  }

  /**
   * Generate comprehensive KAMS-style report
   */
  generateReport() {
    return {
      overallScore: Math.round(this.overallScore),
      scoreRating: this.getScoreRating(this.overallScore),
      metrics: {
        dynamicPostureIndex: {
          score: Math.round(this.metrics.dynamicPostureIndex),
          rating: this.getMetricRating(this.metrics.dynamicPostureIndex),
          description: 'Static and dynamic alignment quality'
        },
        lowerExtremityPowerScore: {
          score: Math.round(this.metrics.lowerExtremityPowerScore),
          rating: this.getMetricRating(this.metrics.lowerExtremityPowerScore),
          description: 'Lower body strength and ROM'
        },
        functionalAsymmetryIndex: {
          score: Math.round(this.metrics.functionalAsymmetryIndex),
          rating: this.getMetricRating(this.metrics.functionalAsymmetryIndex),
          description: 'Left-right movement balance'
        },
        susceptibilityToInjuryIndex: {
          score: Math.round(this.metrics.susceptibilityToInjuryIndex),
          rating: this.getInjuryRating(this.metrics.susceptibilityToInjuryIndex),
          description: 'Risk of injury based on movement patterns'
        }
      },
      dysfunctionRegions: this.dysfunctionRegions,
      recommendations: this.generateRecommendations(),
      treatmentProtocol: this.generateTreatmentProtocol()
    };
  }

  /**
   * Get overall score rating
   */
  getScoreRating(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  }

  /**
   * Get metric rating
   */
  getMetricRating(score) {
    if (score >= 75) return 'Great';
    if (score >= 60) return 'Good';
    if (score >= 45) return 'Moderate';
    return 'Low';
  }

  /**
   * Get injury risk rating
   */
  getInjuryRating(score) {
    if (score >= 70) return 'High';
    if (score >= 50) return 'Moderate';
    if (score >= 30) return 'Mild';
    return 'Low';
  }

  /**
   * Generate personalized recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    
    // Dynamic Posture recommendations
    if (this.metrics.dynamicPostureIndex < 70) {
      recommendations.push({
        category: 'Posture Correction',
        priority: 'High',
        interventions: [
          'Postural awareness training',
          'Core stabilization exercises',
          'Ergonomic assessment',
          'Manual therapy for tight structures'
        ]
      });
    }
    
    // Power Score recommendations
    if (this.metrics.lowerExtremityPowerScore < 60) {
      recommendations.push({
        category: 'Strength & Power',
        priority: 'High',
        interventions: [
          'Progressive resistance training',
          'Plyometric exercises (when appropriate)',
          'Functional movement training',
          'ROM optimization'
        ]
      });
    }
    
    // Asymmetry recommendations
    if (this.metrics.functionalAsymmetryIndex < 85) {
      recommendations.push({
        category: 'Asymmetry Correction',
        priority: 'High',
        interventions: [
          'Unilateral strengthening (weaker side)',
          'Proprioceptive training',
          'Movement pattern re-training',
          'Address structural/mobility limitations'
        ]
      });
    }
    
    // Injury Risk recommendations
    if (this.metrics.susceptibilityToInjuryIndex > 50) {
      recommendations.push({
        category: 'Injury Prevention',
        priority: 'Critical',
        interventions: [
          'Corrective exercise program',
          'Movement screening and modification',
          'Gradual return to activity',
          'Regular reassessment'
        ]
      });
    }
    
    // Specific region recommendations
    if (this.dysfunctionRegions.upperBody.length > 0) {
      recommendations.push({
        category: 'Upper Body Dysfunction',
        priority: 'Medium',
        interventions: [
          'Shoulder mobility exercises',
          'Scapular stabilization',
          'Thoracic spine mobility',
          'Posture correction'
        ]
      });
    }
    
    if (this.dysfunctionRegions.lowerBody.length > 0) {
      recommendations.push({
        category: 'Lower Body Dysfunction',
        priority: 'High',
        interventions: [
          'Hip strengthening (glute med/max)',
          'Ankle mobility and stability',
          'Knee alignment training',
          'Single-leg balance progression'
        ]
      });
    }
    
    if (this.dysfunctionRegions.spinal.length > 0) {
      recommendations.push({
        category: 'Spinal Dysfunction',
        priority: 'High',
        interventions: [
          'Core stabilization program',
          'Spinal mobility exercises',
          'Postural re-education',
          'Manual therapy as indicated'
        ]
      });
    }
    
    return recommendations;
  }

  /**
   * Generate treatment protocol
   */
  generateTreatmentProtocol() {
    const protocol = {
      phase1: {
        name: 'Foundation & Correction (Weeks 1-4)',
        frequency: '2-3x/week',
        focus: [],
        exercises: []
      },
      phase2: {
        name: 'Strengthening & Integration (Weeks 5-8)',
        frequency: '2x/week',
        focus: [],
        exercises: []
      },
      phase3: {
        name: 'Functional & Return to Activity (Weeks 9-12)',
        frequency: '1-2x/week',
        focus: [],
        exercises: []
      }
    };
    
    // Phase 1 - Address highest priority issues
    if (this.metrics.susceptibilityToInjuryIndex > 50) {
      protocol.phase1.focus.push('Injury risk reduction');
      protocol.phase1.exercises.push('Corrective movement patterns', 'Mobility work', 'Basic strengthening');
    }
    
    if (this.metrics.dynamicPostureIndex < 70) {
      protocol.phase1.focus.push('Postural correction');
      protocol.phase1.exercises.push('Core activation', 'Postural awareness', 'Ergonomic training');
    }
    
    // Phase 2 - Build strength and reduce asymmetries
    if (this.metrics.lowerExtremityPowerScore < 60) {
      protocol.phase2.focus.push('Strength development');
      protocol.phase2.exercises.push('Progressive resistance training', 'Functional exercises', 'ROM optimization');
    }
    
    if (this.metrics.functionalAsymmetryIndex < 85) {
      protocol.phase2.focus.push('Asymmetry correction');
      protocol.phase2.exercises.push('Unilateral training', 'Balance work', 'Proprioception');
    }
    
    // Phase 3 - Return to function
    protocol.phase3.focus.push('Functional integration', 'Sport/activity-specific training');
    protocol.phase3.exercises.push('Advanced movements', 'Plyometrics (if appropriate)', 'Return to sport drills');
    
    return protocol;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KAMSStyleAssessment;
}
