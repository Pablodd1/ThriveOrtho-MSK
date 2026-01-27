/**
 * Angle Visualization Graphics for Assessment Reports
 * Creates SVG-based visualizations showing joint angles with stick figures
 */

class AngleVisualizer {
    constructor(canvasId, width = 400, height = 500) {
        this.canvas = document.getElementById(canvasId);
        this.width = width;
        this.height = height;
        
        if (this.canvas) {
            this.svg = this.createSVG();
        }
    }
    
    createSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', this.width);
        svg.setAttribute('height', this.height);
        svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
        svg.style.display = 'block';
        svg.style.margin = '0 auto';
        this.canvas.appendChild(svg);
        return svg;
    }
    
    /**
     * Draw a stick figure with angle markers
     * @param {Object} angles - Object with joint angles (hip_left, hip_right, knee_left, knee_right, etc.)
     * @param {String} exerciseType - Type of exercise (squat, lunge, etc.)
     */
    drawStickFigure(angles, exerciseType = 'squat') {
        if (!this.svg) return;
        
        // Clear previous content
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
        
        const centerX = this.width / 2;
        const headY = 60;
        const neckY = 90;
        const hipY = 200;
        const kneeY = 320;
        const ankleY = 460;
        
        // Draw background grid
        this.drawGrid();
        
        // Draw title
        this.drawText(centerX, 30, exerciseType.toUpperCase() + ' - Joint Angle Analysis', 'bold 16px Arial', '#333', 'middle');
        
        // Draw stick figure
        // Head
        this.drawCircle(centerX, headY, 20, '#ffd4a3', '#cc9966', 2);
        
        // Body line (neck to hip)
        this.drawLine(centerX, neckY, centerX, hipY, '#666', 4);
        
        // Left leg
        const leftKneeX = centerX - 40;
        const leftAnkleX = centerX - 50;
        
        // Hip to knee
        this.drawLine(centerX, hipY, leftKneeX, kneeY, '#666', 4);
        
        // Knee to ankle
        this.drawLine(leftKneeX, kneeY, leftAnkleX, ankleY, '#666', 4);
        
        // Right leg
        const rightKneeX = centerX + 40;
        const rightAnkleX = centerX + 50;
        
        // Hip to knee
        this.drawLine(centerX, hipY, rightKneeX, kneeY, '#666', 4);
        
        // Knee to ankle
        this.drawLine(rightKneeX, kneeY, rightAnkleX, ankleY, '#666', 4);
        
        // Arms
        const shoulderY = neckY + 20;
        const elbowY = shoulderY + 60;
        const wristY = elbowY + 60;
        
        // Left arm
        this.drawLine(centerX, shoulderY, centerX - 30, elbowY, '#666', 3);
        this.drawLine(centerX - 30, elbowY, centerX - 20, wristY, '#666', 3);
        
        // Right arm
        this.drawLine(centerX, shoulderY, centerX + 30, elbowY, '#666', 3);
        this.drawLine(centerX + 30, elbowY, centerX + 20, wristY, '#666', 3);
        
        // Draw joint markers
        this.drawCircle(centerX, hipY, 6, '#ff6b6b', '#cc0000', 2);
        this.drawCircle(leftKneeX, kneeY, 6, '#ff6b6b', '#cc0000', 2);
        this.drawCircle(rightKneeX, kneeY, 6, '#ff6b6b', '#cc0000', 2);
        this.drawCircle(leftAnkleX, ankleY, 6, '#ff6b6b', '#cc0000', 2);
        this.drawCircle(rightAnkleX, ankleY, 6, '#ff6b6b', '#cc0000', 2);
        
        // Draw angle arcs and labels
        if (angles.hip_left !== undefined) {
            this.drawAngleArc(centerX, hipY, 50, 180 - angles.hip_left, 180, '#4CAF50');
            this.drawText(centerX - 80, hipY, `L Hip: ${Math.round(angles.hip_left)}°`, 'bold 12px Arial', this.getAngleColor(angles.hip_left, 90), 'end');
        }
        
        if (angles.hip_right !== undefined) {
            this.drawAngleArc(centerX, hipY, 50, 0, angles.hip_right, '#4CAF50');
            this.drawText(centerX + 80, hipY, `R Hip: ${Math.round(angles.hip_right)}°`, 'bold 12px Arial', this.getAngleColor(angles.hip_right, 90), 'start');
        }
        
        if (angles.knee_left !== undefined) {
            this.drawAngleArc(leftKneeX, kneeY, 40, 180 - angles.knee_left, 180, '#2196F3');
            this.drawText(leftKneeX - 70, kneeY, `L Knee: ${Math.round(angles.knee_left)}°`, 'bold 12px Arial', this.getAngleColor(angles.knee_left, 90), 'end');
        }
        
        if (angles.knee_right !== undefined) {
            this.drawAngleArc(rightKneeX, kneeY, 40, 0, angles.knee_right, '#2196F3');
            this.drawText(rightKneeX + 70, kneeY, `R Knee: ${Math.round(angles.knee_right)}°`, 'bold 12px Arial', this.getAngleColor(angles.knee_right, 90), 'start');
        }
        
        // Add legend
        this.drawLegend();
    }
    
    /**
     * Draw multiple phases of movement (start, mid, end)
     * @param {Array} anglePhases - Array of angle objects for different phases
     * @param {String} exerciseType - Type of exercise
     */
    drawMovementPhases(anglePhases, exerciseType = 'squat') {
        if (!this.svg || !anglePhases || anglePhases.length === 0) return;
        
        // Clear previous content
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
        
        const phaseLabels = ['Start Position', 'Mid-Range', 'End Position'];
        const phaseWidth = this.width / anglePhases.length;
        
        // Draw title
        this.drawText(this.width / 2, 30, exerciseType.toUpperCase() + ' - Movement Phases', 'bold 16px Arial', '#333', 'middle');
        
        anglePhases.forEach((angles, idx) => {
            if (idx >= 3) return; // Limit to 3 phases
            
            const offsetX = idx * phaseWidth;
            const centerX = offsetX + phaseWidth / 2;
            
            // Phase divider
            if (idx > 0) {
                this.drawLine(offsetX, 50, offsetX, this.height - 20, '#ddd', 1);
            }
            
            // Phase label
            this.drawText(centerX, 55, phaseLabels[idx] || `Phase ${idx + 1}`, '14px Arial', '#666', 'middle');
            
            // Draw mini stick figure for this phase
            this.drawMiniStickFigure(centerX, 80, angles, 0.6);
        });
    }
    
    drawMiniStickFigure(centerX, startY, angles, scale = 1) {
        const headY = startY + 20 * scale;
        const neckY = startY + 40 * scale;
        const hipY = startY + 100 * scale;
        const kneeY = startY + 180 * scale;
        const ankleY = startY + 260 * scale;
        
        // Head
        this.drawCircle(centerX, headY, 15 * scale, '#ffd4a3', '#cc9966', 2);
        
        // Body
        this.drawLine(centerX, neckY, centerX, hipY, '#666', 3 * scale);
        
        // Legs
        const kneeOffset = 25 * scale;
        const ankleOffset = 30 * scale;
        
        // Left leg
        this.drawLine(centerX, hipY, centerX - kneeOffset, kneeY, '#666', 3 * scale);
        this.drawLine(centerX - kneeOffset, kneeY, centerX - ankleOffset, ankleY, '#666', 3 * scale);
        
        // Right leg
        this.drawLine(centerX, hipY, centerX + kneeOffset, kneeY, '#666', 3 * scale);
        this.drawLine(centerX + kneeOffset, kneeY, centerX + ankleOffset, ankleY, '#666', 3 * scale);
        
        // Joints
        this.drawCircle(centerX, hipY, 4 * scale, '#ff6b6b', '#cc0000', 1);
        this.drawCircle(centerX - kneeOffset, kneeY, 4 * scale, '#ff6b6b', '#cc0000', 1);
        this.drawCircle(centerX + kneeOffset, kneeY, 4 * scale, '#ff6b6b', '#cc0000', 1);
        
        // Angle labels below figure
        let labelY = ankleY + 30 * scale;
        if (angles.hip_left !== undefined) {
            const color = this.getAngleColor(angles.hip_left, 90);
            this.drawText(centerX, labelY, `Hip: ${Math.round(angles.hip_left)}°`, 'bold 10px Arial', color, 'middle');
            labelY += 15 * scale;
        }
        if (angles.knee_left !== undefined) {
            const color = this.getAngleColor(angles.knee_left, 90);
            this.drawText(centerX, labelY, `Knee: ${Math.round(angles.knee_left)}°`, 'bold 10px Arial', color, 'middle');
        }
    }
    
    // SVG drawing primitives
    drawLine(x1, y1, x2, y2, stroke, strokeWidth) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', stroke);
        line.setAttribute('stroke-width', strokeWidth);
        this.svg.appendChild(line);
    }
    
    drawCircle(cx, cy, r, fill, stroke, strokeWidth) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', fill);
        circle.setAttribute('stroke', stroke);
        circle.setAttribute('stroke-width', strokeWidth);
        this.svg.appendChild(circle);
    }
    
    drawText(x, y, text, font, fill, anchor = 'start') {
        const textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElem.setAttribute('x', x);
        textElem.setAttribute('y', y);
        textElem.setAttribute('font', font);
        textElem.setAttribute('fill', fill);
        textElem.setAttribute('text-anchor', anchor);
        textElem.textContent = text;
        this.svg.appendChild(textElem);
    }
    
    drawAngleArc(cx, cy, radius, startAngle, endAngle, stroke) {
        const start = this.polarToCartesian(cx, cy, radius, endAngle);
        const end = this.polarToCartesian(cx, cy, radius, startAngle);
        const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
        
        const d = [
            "M", start.x, start.y, 
            "A", radius, radius, 0, largeArc, 0, end.x, end.y
        ].join(" ");
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('stroke', stroke);
        path.setAttribute('stroke-width', 2);
        path.setAttribute('fill', 'none');
        path.setAttribute('opacity', 0.7);
        this.svg.appendChild(path);
    }
    
    polarToCartesian(cx, cy, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: cx + (radius * Math.cos(angleInRadians)),
            y: cy + (radius * Math.sin(angleInRadians))
        };
    }
    
    drawGrid() {
        // Light background grid
        for (let i = 0; i < this.height; i += 50) {
            this.drawLine(0, i, this.width, i, '#f0f0f0', 0.5);
        }
        for (let i = 0; i < this.width; i += 50) {
            this.drawLine(i, 0, i, this.height, '#f0f0f0', 0.5);
        }
    }
    
    drawLegend() {
        const legendY = this.height - 50;
        const legendX = 20;
        
        // Background
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', legendX);
        rect.setAttribute('y', legendY);
        rect.setAttribute('width', this.width - 40);
        rect.setAttribute('height', 40);
        rect.setAttribute('fill', '#f9f9f9');
        rect.setAttribute('stroke', '#ddd');
        rect.setAttribute('stroke-width', 1);
        rect.setAttribute('rx', 5);
        this.svg.appendChild(rect);
        
        this.drawText(legendX + 10, legendY + 20, '● Excellent (>80°)', '12px Arial', '#059669', 'start');
        this.drawText(legendX + 140, legendY + 20, '● Good (60-80°)', '12px Arial', '#F97316', 'start');
        this.drawText(legendX + 270, legendY + 20, '● Poor (<60°)', '12px Arial', '#DC2626', 'start');
    }
    
    getAngleColor(angle, target = 90) {
        const percentage = (angle / target) * 100;
        if (percentage >= 80) return '#059669'; // Green
        if (percentage >= 60) return '#F97316'; // Orange
        return '#DC2626'; // Red
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AngleVisualizer;
}
