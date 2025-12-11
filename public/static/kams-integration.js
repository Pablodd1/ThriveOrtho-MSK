/**
 * KAMS Integration Module
 * Integrates KAMS assessment into the visual assessment workflow
 * 
 * This module:
 * 1. Processes recorded pose data to generate KAMS scores
 * 2. Creates dysfunction region maps
 * 3. Generates treatment protocols
 * 4. Provides UI updates for real-time KAMS scoring
 */

class KAMSIntegration {
  constructor() {
    this.kamsAssessor = new KAMSStyleAssessment();
    this.gaitOverlay = null;
    this.currentKAMSData = null;
  }

  /**
   * Process recorded assessment data and generate KAMS scores
   * @param {Object} recordedData - The recorded pose tracking data
   * @returns {Object} Complete KAMS assessment results
   */
  async processAssessmentData(recordedData) {
    console.log('🔍 Processing assessment data for KAMS analysis...');
    
    if (!recordedData || !recordedData.frames || recordedData.frames.length === 0) {
      throw new Error('No valid assessment data to process');
    }

    // Extract the most representative frame (middle of assessment)
    const midFrameIndex = Math.floor(recordedData.frames.length / 2);
    const representativeFrame = recordedData.frames[midFrameIndex];
    
    // Get previous frames for movement analysis
    const previousFrames = recordedData.frames.slice(
      Math.max(0, midFrameIndex - 30),
      midFrameIndex
    );

    // Run KAMS analysis
    const kamsResult = this.kamsAssessor.analyzePoseData(
      representativeFrame.landmarks,
      previousFrames
    );

    // Add patient context if available
    const patientId = recordedData.patientId || null;
    const patientName = recordedData.patientName || 'Unknown Patient';

    // Create comprehensive KAMS data structure
    this.currentKAMSData = {
      patient: {
        id: patientId,
        name: patientName,
        age: recordedData.patientAge || null,
        diagnosis: recordedData.diagnosis || 'Assessment'
      },
      assessment: {
        date: new Date().toISOString().split('T')[0],
        type: 'KAMS Movement Analysis',
        assessor: 'AI-Powered System',
        duration: recordedData.duration,
        totalFrames: recordedData.frames.length
      },
      ...kamsResult
    };

    console.log('✅ KAMS Analysis Complete:', this.currentKAMSData);
    return this.currentKAMSData;
  }

  /**
   * Initialize gait alignment overlay for real-time visualization
   * @param {HTMLCanvasElement} canvas - Canvas element for overlay
   * @param {HTMLVideoElement} video - Video element
   */
  initGaitOverlay(canvas, video) {
    if (!window.GaitAlignmentOverlay) {
      console.warn('⚠️ GaitAlignmentOverlay not loaded');
      return false;
    }

    this.gaitOverlay = new GaitAlignmentOverlay(canvas, video);
    console.log('✅ Gait alignment overlay initialized');
    return true;
  }

  /**
   * Update gait overlay with current landmarks
   * @param {Array} landmarks - MediaPipe pose landmarks
   */
  updateGaitOverlay(landmarks) {
    if (this.gaitOverlay && landmarks) {
      this.gaitOverlay.drawAlignmentOverlay(landmarks);
    }
  }

  /**
   * Get current gait metrics
   * @returns {Object} Current gait metrics
   */
  getGaitMetrics() {
    return this.gaitOverlay ? this.gaitOverlay.getMetrics() : null;
  }

  /**
   * Display KAMS results in UI
   * @param {string} containerId - ID of container element
   */
  displayKAMSResults(containerId = 'kams-results-container') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('KAMS results container not found');
      return;
    }

    if (!this.currentKAMSData) {
      container.innerHTML = '<p class="text-gray-500">No KAMS data available</p>';
      return;
    }

    const data = this.currentKAMSData;

    container.innerHTML = `
      <!-- KAMS Score Card -->
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              <i class="fas fa-chart-line text-blue-600 mr-2"></i>
              KAMS Assessment Score
            </h3>
            <p class="text-gray-600 text-sm">Kinetic Analysis & Movement Screen</p>
          </div>
          <div class="text-center">
            <div class="text-5xl font-bold ${this.getScoreColorClass(data.overallScore)}">
              ${data.overallScore}%
            </div>
            <div class="inline-block mt-2 px-4 py-1 rounded-full font-semibold text-sm ${this.getRatingBadgeClass(data.scoreRating)}">
              ${data.scoreRating}
            </div>
          </div>
        </div>
      </div>

      <!-- Core Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        ${this.renderMetricCard('Dynamic Posture Index', data.metrics.dynamicPostureIndex, 'balance-scale', 'blue')}
        ${this.renderMetricCard('Lower Extremity Power', data.metrics.lowerExtremityPowerScore, 'bolt', 'purple')}
        ${this.renderMetricCard('Functional Asymmetry', data.metrics.functionalAsymmetryIndex, 'equals', 'green')}
        ${this.renderMetricCard('Injury Susceptibility', data.metrics.susceptibilityToInjuryIndex, 'exclamation-triangle', 'red')}
      </div>

      <!-- Dysfunction Regions Summary -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          <i class="fas fa-map-marker-alt text-red-600 mr-2"></i>
          Identified Dysfunction Regions
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${this.renderDysfunctionSummary('Upper Body', data.dysfunctionRegions.upperBody, 'user')}
          ${this.renderDysfunctionSummary('Lower Body', data.dysfunctionRegions.lowerBody, 'running')}
          ${this.renderDysfunctionSummary('Spinal', data.dysfunctionRegions.spinal, 'spine')}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-center gap-4">
        <button onclick="viewFullKAMSReport()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
          <i class="fas fa-file-medical mr-2"></i>
          View Full KAMS Report
        </button>
        <button onclick="exportKAMSData()" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">
          <i class="fas fa-download mr-2"></i>
          Export KAMS Data
        </button>
      </div>
    `;
  }

  /**
   * Render individual metric card
   */
  renderMetricCard(title, metric, icon, color) {
    return `
      <div class="bg-${color}-50 rounded-lg p-4 border border-${color}-200">
        <div class="flex items-center justify-between mb-2">
          <i class="fas fa-${icon} text-${color}-600 text-xl"></i>
          <span class="text-2xl font-bold text-${color}-900">${metric.score}</span>
        </div>
        <h4 class="text-sm font-semibold text-${color}-900 mb-1">${title}</h4>
        <p class="text-xs text-${color}-700">${metric.rating}</p>
      </div>
    `;
  }

  /**
   * Render dysfunction summary
   */
  renderDysfunctionSummary(region, issues, icon) {
    const count = issues.length;
    const hasIssues = count > 0;

    return `
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <i class="fas fa-${icon} text-gray-600"></i>
            <h4 class="font-semibold text-gray-900">${region}</h4>
          </div>
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-full ${hasIssues ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} font-bold text-sm">
            ${count}
          </span>
        </div>
        ${hasIssues ? `
          <div class="space-y-1">
            ${issues.slice(0, 2).map(issue => `
              <div class="text-xs text-gray-600 flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-${this.getSeverityColor(issue.severity)}"></span>
                ${issue.location}
              </div>
            `).join('')}
            ${count > 2 ? `<div class="text-xs text-gray-500 italic">+${count - 2} more</div>` : ''}
          </div>
        ` : '<p class="text-xs text-green-600">No issues detected</p>'}
      </div>
    `;
  }

  /**
   * Get score color class
   */
  getScoreColorClass(score) {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  }

  /**
   * Get rating badge class
   */
  getRatingBadgeClass(rating) {
    const classes = {
      'Excellent': 'bg-green-100 text-green-800',
      'Good': 'bg-blue-100 text-blue-800',
      'Fair': 'bg-yellow-100 text-yellow-800',
      'Poor': 'bg-red-100 text-red-800'
    };
    return classes[rating] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Get severity color
   */
  getSeverityColor(severity) {
    const colors = {
      'High': 'red-500',
      'Moderate': 'yellow-500',
      'Low': 'blue-500'
    };
    return colors[severity] || 'gray-500';
  }

  /**
   * Save KAMS assessment to database
   * @param {number} patientId - Patient ID
   * @returns {Promise<Object>} Save result
   */
  async saveKAMSAssessment(patientId) {
    if (!this.currentKAMSData) {
      throw new Error('No KAMS data to save');
    }

    try {
      const response = await fetch('/api/kams/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientId,
          kamsData: this.currentKAMSData,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save KAMS assessment');
      }

      const result = await response.json();
      console.log('✅ KAMS assessment saved:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to save KAMS assessment:', error);
      throw error;
    }
  }

  /**
   * Get current KAMS data
   * @returns {Object} Current KAMS assessment data
   */
  getCurrentKAMSData() {
    return this.currentKAMSData;
  }

  /**
   * Open full KAMS report in new window
   */
  openFullReport() {
    if (!this.currentKAMSData) {
      alert('No KAMS data available');
      return;
    }

    // Store KAMS data in sessionStorage
    sessionStorage.setItem('kamsData', JSON.stringify(this.currentKAMSData));

    // Open KAMS viewer
    window.open('/static/kams-results-viewer.html', '_blank');
  }

  /**
   * Export KAMS data as JSON
   */
  exportAsJSON() {
    if (!this.currentKAMSData) {
      alert('No KAMS data available');
      return;
    }

    const dataStr = JSON.stringify(this.currentKAMSData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `kams-assessment-${this.currentKAMSData.patient.id || 'unknown'}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }
}

// Global instance
let kamsIntegration = null;

/**
 * Initialize KAMS integration
 */
function initKAMSIntegration() {
  kamsIntegration = new KAMSIntegration();
  console.log('✅ KAMS Integration initialized');
  return kamsIntegration;
}

/**
 * Process assessment and generate KAMS scores
 * @param {Object} recordedData - Recorded assessment data
 */
async function processKAMSAssessment(recordedData) {
  if (!kamsIntegration) {
    initKAMSIntegration();
  }

  return await kamsIntegration.processAssessmentData(recordedData);
}

/**
 * View full KAMS report (called from UI)
 */
function viewFullKAMSReport() {
  if (kamsIntegration) {
    kamsIntegration.openFullReport();
  }
}

/**
 * Export KAMS data (called from UI)
 */
function exportKAMSData() {
  if (kamsIntegration) {
    kamsIntegration.exportAsJSON();
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { KAMSIntegration, initKAMSIntegration, processKAMSAssessment };
}
