/**
 * Real-Time Pose Tracker with Center-of-Body Alignment
 * Uses MediaPipe Pose for live video tracking and alignment guidance
 * Medical-grade positioning assistance for visual assessments
 */

class RealtimePoseTracker {
    constructor(videoElement, canvasElement) {
        this.video = videoElement;
        this.canvas = canvasElement;
        this.ctx = canvasElement.canvas.getContext('2d');
        
        this.isTracking = false;
        this.pose = null;
        this.landmarks = null;
        
        // Alignment thresholds (in pixels from center)
        this.alignmentThresholds = {
            centerTolerance: 50, // pixels
            shoulderLevelTolerance: 20, // pixels vertical difference
            hipLevelTolerance: 20
        };
        
        // Tracking state
        this.alignmentState = {
            centered: false,
            shouldersLevel: false,
            hipsLevel: false,
            facingCamera: false,
            distanceOk: false,
            ready: false
        };
        
        // Visual guides
        this.guides = {
            showCenterLine: true,
            showAlignmentGrid: true,
            showSkeletonOverlay: true,
            showDistanceIndicator: true
        };
        
        // Recording
        this.recordedFrames = [];
        this.isRecording = false;
    }

    /**
     * Initialize MediaPipe Pose
     */
    async init() {
        console.log('Initializing MediaPipe Pose tracker...');
        
        try {
            // Load MediaPipe Pose (using CDN version)
            // Note: In production, load from CDN in HTML:
            // <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"></script>
            // <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"></script>
            // <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"></script>
            
            if (typeof Pose === 'undefined') {
                throw new Error('MediaPipe Pose not loaded. Include MediaPipe scripts in HTML.');
            }
            
            this.pose = new Pose({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                }
            });
            
            this.pose.setOptions({
                modelComplexity: 1, // 0=lite, 1=full, 2=heavy
                smoothLandmarks: true,
                enableSegmentation: false,
                smoothSegmentation: false,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });
            
            this.pose.onResults(this.onPoseResults.bind(this));
            
            console.log('MediaPipe Pose initialized successfully');
            return true;
            
        } catch (error) {
            console.error('Failed to initialize MediaPipe Pose:', error);
            return false;
        }
    }

    /**
     * Start camera and tracking
     */
    async startTracking() {
        try {
            // Get camera access
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                }
            });
            
            this.video.srcObject = stream;
            this.video.play();
            
            // Wait for video to be ready
            await new Promise(resolve => {
                this.video.onloadedmetadata = () => {
                    this.canvas.width = this.video.videoWidth;
                    this.canvas.height = this.video.videoHeight;
                    resolve();
                };
            });
            
            this.isTracking = true;
            this.trackLoop();
            
            console.log('Camera tracking started');
            return true;
            
        } catch (error) {
            console.error('Failed to start camera:', error);
            alert('Camera access denied. Please enable camera permissions.');
            return false;
        }
    }

    /**
     * Main tracking loop
     */
    async trackLoop() {
        if (!this.isTracking) return;
        
        // Send video frame to MediaPipe
        await this.pose.send({ image: this.video });
        
        // Continue loop
        requestAnimationFrame(() => this.trackLoop());
    }

    /**
     * MediaPipe pose results callback
     */
    onPoseResults(results) {
        this.landmarks = results.poseLandmarks;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw video frame
        this.ctx.drawImage(results.image, 0, 0, this.canvas.width, this.canvas.height);
        
        if (this.landmarks) {
            // Check alignment
            this.checkAlignment();
            
            // Draw visual guides
            this.drawAlignmentGuides();
            
            // Draw skeleton
            if (this.guides.showSkeletonOverlay) {
                this.drawSkeleton();
            }
            
            // Draw status indicators
            this.drawStatusIndicators();
            
            // Record frame if recording
            if (this.isRecording) {
                this.recordFrame();
            }
        }
    }

    /**
     * Check body alignment against guidelines
     */
    checkAlignment() {
        if (!this.landmarks) return;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Get key landmarks (MediaPipe landmark indices)
        const nose = this.landmarks[0];
        const leftShoulder = this.landmarks[11];
        const rightShoulder = this.landmarks[12];
        const leftHip = this.landmarks[23];
        const rightHip = this.landmarks[24];
        
        // Convert normalized coordinates to pixels
        const noseX = nose.x * this.canvas.width;
        const noseY = nose.y * this.canvas.height;
        
        const leftShoulderY = leftShoulder.y * this.canvas.height;
        const rightShoulderY = rightShoulder.y * this.canvas.height;
        
        const leftHipY = leftHip.y * this.canvas.height;
        const rightHipY = rightHip.y * this.canvas.height;
        
        // Calculate midpoint between shoulders
        const shoulderMidX = ((leftShoulder.x + rightShoulder.x) / 2) * this.canvas.width;
        const shoulderMidY = ((leftShoulder.y + rightShoulder.y) / 2) * this.canvas.height;
        
        // Check if centered
        this.alignmentState.centered = Math.abs(shoulderMidX - centerX) < this.alignmentThresholds.centerTolerance;
        
        // Check if shoulders are level
        this.alignmentState.shouldersLevel = Math.abs(leftShoulderY - rightShoulderY) < this.alignmentThresholds.shoulderLevelTolerance;
        
        // Check if hips are level
        this.alignmentState.hipsLevel = Math.abs(leftHipY - rightHipY) < this.alignmentThresholds.hipLevelTolerance;
        
        // Check if facing camera (shoulders visible, nose centered)
        this.alignmentState.facingCamera = leftShoulder.visibility > 0.5 && rightShoulder.visibility > 0.5;
        
        // Check distance (based on shoulder width - optimal is ~25-30% of frame width)
        const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x) * this.canvas.width;
        const optimalWidth = this.canvas.width * 0.27;
        this.alignmentState.distanceOk = Math.abs(shoulderWidth - optimalWidth) < 50;
        
        // Overall ready state
        this.alignmentState.ready = 
            this.alignmentState.centered &&
            this.alignmentState.shouldersLevel &&
            this.alignmentState.hipsLevel &&
            this.alignmentState.facingCamera &&
            this.alignmentState.distanceOk;
    }

    /**
     * Draw alignment guides overlay
     */
    drawAlignmentGuides() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Draw center line
        if (this.guides.showCenterLine) {
            this.ctx.strokeStyle = this.alignmentState.centered ? '#00ff00' : '#ff0000';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([10, 5]);
            
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, 0);
            this.ctx.lineTo(centerX, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.setLineDash([]);
        }
        
        // Draw alignment grid
        if (this.guides.showAlignmentGrid) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 1;
            
            // Vertical lines (thirds)
            for (let i = 1; i < 3; i++) {
                const x = (this.canvas.width / 3) * i;
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();
            }
            
            // Horizontal lines (thirds)
            for (let i = 1; i < 3; i++) {
                const y = (this.canvas.height / 3) * i;
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }
        }
        
        // Draw optimal positioning box
        const boxWidth = this.canvas.width * 0.5;
        const boxHeight = this.canvas.height * 0.7;
        const boxX = centerX - boxWidth / 2;
        const boxY = centerY - boxHeight / 2;
        
        this.ctx.strokeStyle = this.alignmentState.ready ? '#00ff00' : '#ffaa00';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        // Draw distance indicator
        if (this.guides.showDistanceIndicator && this.landmarks) {
            const leftShoulder = this.landmarks[11];
            const rightShoulder = this.landmarks[12];
            const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x) * this.canvas.width;
            const optimalWidth = this.canvas.width * 0.27;
            
            let distanceText = '';
            let distanceColor = '#00ff00';
            
            if (shoulderWidth < optimalWidth - 50) {
                distanceText = 'TOO FAR - Step Closer';
                distanceColor = '#ff0000';
            } else if (shoulderWidth > optimalWidth + 50) {
                distanceText = 'TOO CLOSE - Step Back';
                distanceColor = '#ff0000';
            } else {
                distanceText = 'DISTANCE OK';
                distanceColor = '#00ff00';
            }
            
            this.ctx.fillStyle = distanceColor;
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(distanceText, centerX, 50);
        }
    }

    /**
     * Draw skeleton overlay
     */
    drawSkeleton() {
        if (!this.landmarks) return;
        
        // Define connections (MediaPipe Pose connections)
        const connections = [
            [11, 12], // shoulders
            [11, 13], [13, 15], // left arm
            [12, 14], [14, 16], // right arm
            [11, 23], [12, 24], // torso
            [23, 24], // hips
            [23, 25], [25, 27], [27, 29], [27, 31], // left leg
            [24, 26], [26, 28], [28, 30], [28, 32]  // right leg
        ];
        
        // Draw connections
        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 3;
        
        connections.forEach(([start, end]) => {
            const startLandmark = this.landmarks[start];
            const endLandmark = this.landmarks[end];
            
            if (startLandmark && endLandmark && 
                startLandmark.visibility > 0.5 && endLandmark.visibility > 0.5) {
                
                this.ctx.beginPath();
                this.ctx.moveTo(
                    startLandmark.x * this.canvas.width,
                    startLandmark.y * this.canvas.height
                );
                this.ctx.lineTo(
                    endLandmark.x * this.canvas.width,
                    endLandmark.y * this.canvas.height
                );
                this.ctx.stroke();
            }
        });
        
        // Draw landmarks
        this.landmarks.forEach((landmark, index) => {
            if (landmark.visibility > 0.5) {
                const x = landmark.x * this.canvas.width;
                const y = landmark.y * this.canvas.height;
                
                this.ctx.fillStyle = '#ff0000';
                this.ctx.beginPath();
                this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        });
    }

    /**
     * Draw status indicators
     */
    drawStatusIndicators() {
        const padding = 20;
        const lineHeight = 30;
        let y = padding;
        
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        
        // Status items
        const statuses = [
            { label: 'Centered', value: this.alignmentState.centered },
            { label: 'Shoulders Level', value: this.alignmentState.shouldersLevel },
            { label: 'Hips Level', value: this.alignmentState.hipsLevel },
            { label: 'Facing Camera', value: this.alignmentState.facingCamera },
            { label: 'Distance OK', value: this.alignmentState.distanceOk }
        ];
        
        statuses.forEach(status => {
            const icon = status.value ? '✓' : '✗';
            const color = status.value ? '#00ff00' : '#ff0000';
            
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(padding - 5, y - 15, 200, 25);
            
            this.ctx.fillStyle = color;
            this.ctx.fillText(`${icon} ${status.label}`, padding, y);
            
            y += lineHeight;
        });
        
        // Overall status
        y += 10;
        const readyText = this.alignmentState.ready ? '✓ READY FOR ASSESSMENT' : '✗ ADJUST POSITION';
        const readyColor = this.alignmentState.ready ? '#00ff00' : '#ff0000';
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(padding - 5, y - 15, 250, 30);
        
        this.ctx.fillStyle = readyColor;
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillText(readyText, padding, y);
    }

    /**
     * Start recording assessment
     */
    startRecording() {
        this.recordedFrames = [];
        this.isRecording = true;
        console.log('Recording started');
    }

    /**
     * Stop recording and return data
     */
    stopRecording() {
        this.isRecording = false;
        console.log(`Recording stopped. Captured ${this.recordedFrames.length} frames`);
        return this.recordedFrames;
    }

    /**
     * Record current frame
     */
    recordFrame() {
        if (!this.landmarks) return;
        
        this.recordedFrames.push({
            timestamp: Date.now(),
            landmarks: JSON.parse(JSON.stringify(this.landmarks)),
            alignmentState: { ...this.alignmentState }
        });
    }

    /**
     * Stop tracking and cleanup
     */
    stopTracking() {
        this.isTracking = false;
        
        if (this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        }
        
        console.log('Tracking stopped');
    }

    /**
     * Export recorded data as assessment-compatible format
     */
    exportRecordedData() {
        if (this.recordedFrames.length === 0) {
            return null;
        }
        
        // Convert MediaPipe landmarks to assessment format
        const frames = this.recordedFrames.map((frame, index) => {
            const angles = this.calculateAnglesFromLandmarks(frame.landmarks);
            
            return {
                frameNumber: index,
                timestamp: frame.timestamp - this.recordedFrames[0].timestamp,
                angles: angles,
                joints: this.landmarksToJoints(frame.landmarks)
            };
        });
        
        return {
            metadata: {
                device: 'webcam_mediapipe',
                subject: 'Live Assessment',
                date: new Date().toISOString(),
                frameCount: frames.length,
                frameRate: 30 // approximate
            },
            frames: frames,
            summary: this.calculateSummary(frames)
        };
    }

    /**
     * Calculate joint angles from MediaPipe landmarks
     */
    calculateAnglesFromLandmarks(landmarks) {
        // Simplified angle calculations
        // In production, use proper 3D geometry calculations
        
        return {
            hip_flexion_left: this.calculateAngle(landmarks[23], landmarks[25], landmarks[27]),
            hip_flexion_right: this.calculateAngle(landmarks[24], landmarks[26], landmarks[28]),
            knee_flexion_left: this.calculateAngle(landmarks[25], landmarks[27], landmarks[29]),
            knee_flexion_right: this.calculateAngle(landmarks[26], landmarks[28], landmarks[30])
        };
    }

    /**
     * Calculate angle between three points
     */
    calculateAngle(a, b, c) {
        const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
        let angle = Math.abs(radians * 180.0 / Math.PI);
        
        if (angle > 180.0) {
            angle = 360 - angle;
        }
        
        return angle;
    }

    /**
     * Convert landmarks to joint positions
     */
    landmarksToJoints(landmarks) {
        return {
            nose: landmarks[0],
            left_shoulder: landmarks[11],
            right_shoulder: landmarks[12],
            left_hip: landmarks[23],
            right_hip: landmarks[24],
            left_knee: landmarks[25],
            right_knee: landmarks[26],
            left_ankle: landmarks[27],
            right_ankle: landmarks[28]
        };
    }

    /**
     * Calculate summary statistics
     */
    calculateSummary(frames) {
        const avgAngles = {};
        const angleKeys = Object.keys(frames[0].angles);
        
        angleKeys.forEach(key => {
            const values = frames.map(f => f.angles[key]);
            avgAngles[key] = values.reduce((a, b) => a + b, 0) / values.length;
        });
        
        return { avgAngles };
    }

    /**
     * Toggle visual guide
     */
    toggleGuide(guideName) {
        if (this.guides.hasOwnProperty(guideName)) {
            this.guides[guideName] = !this.guides[guideName];
        }
    }

    /**
     * Get alignment status
     */
    getAlignmentStatus() {
        return this.alignmentState;
    }

    /**
     * Take snapshot
     */
    takeSnapshot() {
        return {
            image: this.canvas.toDataURL('image/png'),
            landmarks: this.landmarks,
            alignmentState: this.alignmentState,
            timestamp: Date.now()
        };
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.RealtimePoseTracker = RealtimePoseTracker;
}
