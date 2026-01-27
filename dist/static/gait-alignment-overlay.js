/**
 * Gait Assessment with Alignment Overlay
 * Inspired by professional clinical gait analysis systems
 * 
 * Features:
 * - Center of Mass (COM) tracking with crosshair
 * - Alignment grid with dotted lines
 * - Distance measurements (from core, shoulders, stance)
 * - Circular position indicators (L/R with degree measurements)
 * - Body tilt measurements (shoulder, pelvic, torso, hip rotation)
 * - LCP (Lateral Center Position) markers
 * - Real-time metrics panel
 */

class GaitAlignmentOverlay {
  constructor(canvas, videoElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.video = videoElement;
    this.metrics = {
      centerOfMass: { x: 0, y: 0 },
      distanceFromCore: 0,
      shoulderDistance: 0,
      stanceDistance: 0,
      shoulderTilt: 0,
      pelvicTilt: 0,
      torsoTilt: 0,
      hipRotation: 0,
      leftPosition: { angle: 0, distance: 0 },
      rightPosition: { angle: 0, distance: 0 }
    };
  }

  /**
   * Calculate and draw complete gait alignment overlay
   */
  drawAlignmentOverlay(landmarks) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Calculate all metrics
    this.calculateMetrics(landmarks);
    
    // Draw alignment grid
    this.drawAlignmentGrid();
    
    // Draw center of mass crosshair
    this.drawCenterOfMassCrosshair();
    
    // Draw circular position indicators (L/R)
    this.drawCircularIndicators();
    
    // Draw LCP markers (corner markers)
    this.drawLCPMarkers();
    
    // Draw distance measurements
    this.drawDistanceMeasurements();
    
    // Draw metrics panel
    this.drawMetricsPanel();
  }

  /**
   * Calculate all gait metrics
   */
  calculateMetrics(landmarks) {
    // 1. Center of Mass (approximate using hip midpoint)
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    this.metrics.centerOfMass = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2
    };
    
    // 2. Shoulder distance
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    this.metrics.shoulderDistance = Math.sqrt(
      Math.pow((rightShoulder.x - leftShoulder.x) * this.canvas.width, 2) +
      Math.pow((rightShoulder.y - leftShoulder.y) * this.canvas.height, 2)
    );
    
    // 3. Stance distance (ankle width)
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    this.metrics.stanceDistance = Math.abs(
      (rightAnkle.x - leftAnkle.x) * this.canvas.width
    );
    
    // 4. Distance from core (COM to center of frame)
    const centerX = 0.5;
    const centerY = 0.5;
    this.metrics.distanceFromCore = Math.sqrt(
      Math.pow((this.metrics.centerOfMass.x - centerX) * this.canvas.width, 2) +
      Math.pow((this.metrics.centerOfMass.y - centerY) * this.canvas.height, 2)
    );
    
    // 5. Shoulder tilt
    this.metrics.shoulderTilt = Math.atan2(
      rightShoulder.y - leftShoulder.y,
      rightShoulder.x - leftShoulder.x
    ) * 180 / Math.PI;
    
    // 6. Pelvic tilt
    this.metrics.pelvicTilt = Math.atan2(
      rightHip.y - leftHip.y,
      rightHip.x - leftHip.x
    ) * 180 / Math.PI;
    
    // 7. Torso tilt (shoulder to hip alignment)
    const shoulderMid = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2
    };
    const hipMid = this.metrics.centerOfMass;
    this.metrics.torsoTilt = Math.atan2(
      shoulderMid.x - hipMid.x,
      shoulderMid.y - hipMid.y
    ) * 180 / Math.PI;
    
    // 8. Hip rotation (estimated from hip-to-ankle angles)
    const leftHipAngle = Math.atan2(
      leftAnkle.y - leftHip.y,
      leftAnkle.x - leftHip.x
    ) * 180 / Math.PI;
    const rightHipAngle = Math.atan2(
      rightAnkle.y - rightHip.y,
      rightAnkle.x - rightHip.x
    ) * 180 / Math.PI;
    this.metrics.hipRotation = leftHipAngle - rightHipAngle;
    
    // 9. Left/Right position angles and distances
    this.metrics.leftPosition = {
      angle: Math.atan2(
        leftAnkle.y - this.metrics.centerOfMass.y,
        leftAnkle.x - this.metrics.centerOfMass.x
      ) * 180 / Math.PI,
      distance: Math.sqrt(
        Math.pow((leftAnkle.x - this.metrics.centerOfMass.x) * this.canvas.width, 2) +
        Math.pow((leftAnkle.y - this.metrics.centerOfMass.y) * this.canvas.height, 2)
      )
    };
    
    this.metrics.rightPosition = {
      angle: Math.atan2(
        rightAnkle.y - this.metrics.centerOfMass.y,
        rightAnkle.x - this.metrics.centerOfMass.x
      ) * 180 / Math.PI,
      distance: Math.sqrt(
        Math.pow((rightAnkle.x - this.metrics.centerOfMass.x) * this.canvas.width, 2) +
        Math.pow((rightAnkle.y - this.metrics.centerOfMass.y) * this.canvas.height, 2)
      )
    };
  }

  /**
   * Draw alignment grid with dotted lines
   */
  drawAlignmentGrid() {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.setLineDash([5, 5]);
    this.ctx.lineWidth = 1;
    
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    // Vertical center line
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, 0);
    this.ctx.lineTo(centerX, this.canvas.height);
    this.ctx.stroke();
    
    // Horizontal center line
    this.ctx.beginPath();
    this.ctx.moveTo(0, centerY);
    this.ctx.lineTo(this.canvas.width, centerY);
    this.ctx.stroke();
    
    // Diagonal lines (X pattern)
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.canvas.width, this.canvas.height);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width, 0);
    this.ctx.lineTo(0, this.canvas.height);
    this.ctx.stroke();
    
    // Additional quarter lines
    const quarterX = this.canvas.width / 4;
    const quarterY = this.canvas.height / 4;
    
    // Vertical quarter lines
    this.ctx.beginPath();
    this.ctx.moveTo(quarterX, 0);
    this.ctx.lineTo(quarterX, this.canvas.height);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(quarterX * 3, 0);
    this.ctx.lineTo(quarterX * 3, this.canvas.height);
    this.ctx.stroke();
    
    // Horizontal quarter lines
    this.ctx.beginPath();
    this.ctx.moveTo(0, quarterY);
    this.ctx.lineTo(this.canvas.width, quarterY);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(0, quarterY * 3);
    this.ctx.lineTo(this.canvas.width, quarterY * 3);
    this.ctx.stroke();
    
    this.ctx.setLineDash([]);
  }

  /**
   * Draw center of mass crosshair (green)
   */
  drawCenterOfMassCrosshair() {
    const comX = this.metrics.centerOfMass.x * this.canvas.width;
    const comY = this.metrics.centerOfMass.y * this.canvas.height;
    const crosshairSize = 40;
    
    this.ctx.strokeStyle = '#00FF00';
    this.ctx.lineWidth = 2;
    
    // Horizontal line
    this.ctx.beginPath();
    this.ctx.moveTo(comX - crosshairSize, comY);
    this.ctx.lineTo(comX + crosshairSize, comY);
    this.ctx.stroke();
    
    // Vertical line
    this.ctx.beginPath();
    this.ctx.moveTo(comX, comY - crosshairSize);
    this.ctx.lineTo(comX, comY + crosshairSize);
    this.ctx.stroke();
    
    // Center circle
    this.ctx.beginPath();
    this.ctx.arc(comX, comY, 5, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#00FF00';
    this.ctx.fill();
    
    // Label
    this.ctx.fillStyle = '#00FF00';
    this.ctx.font = '12px Arial';
    this.ctx.fillText('Center of Mass', comX + 50, comY);
  }

  /**
   * Draw circular position indicators (like in screenshot)
   */
  drawCircularIndicators() {
    const leftX = 80;
    const rightX = this.canvas.width - 80;
    const centerY = this.canvas.height / 2;
    const radius = 60;
    
    // Left indicator
    this.drawCircularGauge(leftX, centerY, radius, this.metrics.leftPosition.angle, 'L', 'left');
    
    // Right indicator
    this.drawCircularGauge(rightX, centerY, radius, this.metrics.rightPosition.angle, 'R', 'right');
  }

  /**
   * Draw individual circular gauge
   */
  drawCircularGauge(x, y, radius, angle, label, side) {
    // Outer circle
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    
    // Tick marks (every 15 degrees)
    for (let i = 0; i < 360; i += 15) {
      const tickAngle = (i - 90) * Math.PI / 180;
      const innerRadius = i % 90 === 0 ? radius - 10 : radius - 5;
      
      this.ctx.beginPath();
      this.ctx.moveTo(
        x + innerRadius * Math.cos(tickAngle),
        y + innerRadius * Math.sin(tickAngle)
      );
      this.ctx.lineTo(
        x + radius * Math.cos(tickAngle),
        y + radius * Math.sin(tickAngle)
      );
      this.ctx.stroke();
    }
    
    // Center crosshair
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(x - 15, y);
    this.ctx.lineTo(x + 15, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - 15);
    this.ctx.lineTo(x, y + 15);
    this.ctx.stroke();
    
    // Angle indicator needle
    const needleAngle = (angle - 90) * Math.PI / 180;
    this.ctx.strokeStyle = side === 'left' ? '#00FFFF' : '#FF00FF';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(
      x + (radius - 15) * Math.cos(needleAngle),
      y + (radius - 15) * Math.sin(needleAngle)
    );
    this.ctx.stroke();
    
    // Angle text
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`${Math.round(angle)}°`, x, y + radius + 25);
    
    // Label
    this.ctx.font = 'bold 16px Arial';
    this.ctx.fillText(label, x, y);
  }

  /**
   * Draw LCP (Lateral Center Position) corner markers
   */
  drawLCPMarkers() {
    const markerSize = 30;
    const offset = 20;
    const positions = [
      { x: offset, y: offset, label: 'LCP' },
      { x: this.canvas.width - offset - markerSize, y: offset, label: 'LCP' },
      { x: offset, y: this.canvas.height - offset - markerSize, label: 'LCP' },
      { x: this.canvas.width - offset - markerSize, y: this.canvas.height - offset - markerSize, label: 'LCP' }
    ];
    
    positions.forEach(pos => {
      // Corner bracket
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      this.ctx.lineWidth = 2;
      
      // Top-left style bracket
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x + markerSize, pos.y);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.lineTo(pos.x, pos.y + markerSize);
      this.ctx.stroke();
      
      // Label
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      this.ctx.font = '10px Arial';
      this.ctx.fillText(pos.label, pos.x + 5, pos.y + 15);
    });
  }

  /**
   * Draw distance measurements
   */
  drawDistanceMeasurements() {
    const startX = 20;
    const startY = this.canvas.height / 2 - 100;
    const lineHeight = 25;
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'left';
    
    // Distance from core
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.fillText('● DISTANCE FROM CORE', startX, startY);
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 18px Arial';
    this.ctx.fillText(`${Math.round(this.metrics.distanceFromCore)} px`, startX, startY + 20);
    
    // Shoulder distance
    this.ctx.fillStyle = 'rgba(255, 100, 100, 0.9)';
    this.ctx.font = '14px Arial';
    this.ctx.fillText('● SHOULDER DISTANCE', startX, startY + lineHeight * 2);
    this.ctx.fillStyle = '#FF6464';
    this.ctx.font = 'bold 18px Arial';
    this.ctx.fillText(`${Math.round(this.metrics.shoulderDistance)} px`, startX, startY + lineHeight * 2 + 20);
    
    // Stance distance
    this.ctx.fillStyle = 'rgba(100, 200, 255, 0.9)';
    this.ctx.font = '14px Arial';
    this.ctx.fillText('● STANCE DISTANCE', startX, startY + lineHeight * 4);
    this.ctx.fillStyle = '#64C8FF';
    this.ctx.font = 'bold 18px Arial';
    this.ctx.fillText(`${Math.round(this.metrics.stanceDistance)} px`, startX, startY + lineHeight * 4 + 20);
  }

  /**
   * Draw comprehensive metrics panel
   */
  drawMetricsPanel() {
    const startX = 20;
    const startY = this.canvas.height - 200;
    const lineHeight = 22;
    
    // Panel title
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(startX - 10, startY - 30, 220, 180);
    
    this.ctx.fillStyle = '#FFD700';
    this.ctx.font = 'bold 16px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('ANALYSIS', startX, startY - 10);
    
    // Metrics
    const metrics = [
      { label: 'SHOULDER TILT', value: `${Math.abs(this.metrics.shoulderTilt).toFixed(1)}°`, color: '#FFD700' },
      { label: 'PELVIC TILT', value: `${Math.abs(this.metrics.pelvicTilt).toFixed(1)}°`, color: '#00FFFF' },
      { label: 'TORSO ROTATION', value: `${Math.abs(this.metrics.torsoTilt).toFixed(1)}°`, color: '#FF69B4' },
      { label: 'HIP ROTATION', value: `${Math.abs(this.metrics.hipRotation).toFixed(1)}°`, color: '#FFA500' },
      { label: 'L POSITION', value: `${Math.round(this.metrics.leftPosition.distance)} px`, color: '#00FFFF' },
      { label: 'R POSITION', value: `${Math.round(this.metrics.rightPosition.distance)} px`, color: '#FF00FF' }
    ];
    
    metrics.forEach((metric, index) => {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      this.ctx.font = '12px Arial';
      this.ctx.fillText(metric.label, startX, startY + (index * lineHeight) + 10);
      
      this.ctx.fillStyle = metric.color;
      this.ctx.font = 'bold 14px Arial';
      this.ctx.fillText(metric.value, startX + 140, startY + (index * lineHeight) + 10);
    });
  }

  /**
   * Get current metrics for export/analysis
   */
  getMetrics() {
    return {
      ...this.metrics,
      timestamp: Date.now()
    };
  }

  /**
   * Export metrics as CSV
   */
  exportMetricsCSV(metricsHistory) {
    const headers = [
      'Timestamp',
      'COM_X', 'COM_Y',
      'Distance_Core', 'Shoulder_Dist', 'Stance_Dist',
      'Shoulder_Tilt', 'Pelvic_Tilt', 'Torso_Tilt', 'Hip_Rotation',
      'Left_Angle', 'Left_Distance', 'Right_Angle', 'Right_Distance'
    ];
    
    let csv = headers.join(',') + '\n';
    
    metricsHistory.forEach(m => {
      const row = [
        m.timestamp,
        m.centerOfMass.x.toFixed(4), m.centerOfMass.y.toFixed(4),
        m.distanceFromCore.toFixed(2), m.shoulderDistance.toFixed(2), m.stanceDistance.toFixed(2),
        m.shoulderTilt.toFixed(2), m.pelvicTilt.toFixed(2), m.torsoTilt.toFixed(2), m.hipRotation.toFixed(2),
        m.leftPosition.angle.toFixed(2), m.leftPosition.distance.toFixed(2),
        m.rightPosition.angle.toFixed(2), m.rightPosition.distance.toFixed(2)
      ];
      csv += row.join(',') + '\n';
    });
    
    return csv;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GaitAlignmentOverlay;
}
