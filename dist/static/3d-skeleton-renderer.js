/**
 * 3D Skeleton Renderer
 * Medical-grade 3D skeleton visualization with full rotation control
 * Uses Three.js for WebGL rendering
 */

class SkeletonRenderer3D {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        // Skeleton components
        this.joints = {};
        this.bones = [];
        this.angleLabels = [];
        this.angleArcs = [];
        
        // Playback state
        this.recordedFrames = [];
        this.currentFrame = 0;
        this.isPlaying = false;
        this.playbackSpeed = 1.0;
        this.animationFrameId = null;
        
        // Callbacks
        this.onFrameUpdate = null;
        
        // Angle display
        this.showAngles = true;
        
        this.init();
    }
    
    async init() {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.error('Three.js not loaded! Please include Three.js before this script.');
            return;
        }
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f5f5);
        
        // Create camera
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 1.5, 3);
        this.camera.lookAt(0, 1, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
        
        // Add orbit controls (requires OrbitControls to be loaded)
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.minDistance = 1;
            this.controls.maxDistance = 10;
            this.controls.target.set(0, 1, 0);
            this.controls.update();
        } else {
            console.warn('OrbitControls not loaded. Camera rotation will be limited.');
        }
        
        // Add lights
        this.setupLighting();
        
        // Add grid floor
        const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0xcccccc);
        this.scene.add(gridHelper);
        
        // Add reference axes (for debugging)
        // const axesHelper = new THREE.AxesHelper(1);
        // this.scene.add(axesHelper);
        
        // Create skeleton
        this.createSkeleton();
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Start animation loop
        this.animate();
        
        console.log('✅ 3D Skeleton Renderer initialized');
    }
    
    setupLighting() {
        // Ambient light (soft overall illumination)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (main light with shadows)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);
        
        // Hemisphere light (sky and ground colors)
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
        this.scene.add(hemisphereLight);
    }
    
    createSkeleton() {
        // Define joint materials
        const majorJointMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4ECDC4,
            emissive: 0x072534,
            shininess: 100,
            transparent: false
        });
        
        const minorJointMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x45B7D1,
            emissive: 0x062030,
            shininess: 80,
            transparent: false
        });
        
        // Define bone material
        const boneMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x3498db,
            shininess: 50,
            transparent: true,
            opacity: 0.9
        });
        
        // Create geometries
        const majorJointGeometry = new THREE.SphereGeometry(0.04, 16, 16);
        const minorJointGeometry = new THREE.SphereGeometry(0.025, 12, 12);
        const boneGeometry = new THREE.CylinderGeometry(0.015, 0.015, 1, 8);
        
        // MediaPipe landmark to joint name mapping
        const landmarkMapping = {
            0: { name: 'nose', major: false },
            11: { name: 'left_shoulder', major: true },
            12: { name: 'right_shoulder', major: true },
            13: { name: 'left_elbow', major: true },
            14: { name: 'right_elbow', major: true },
            15: { name: 'left_wrist', major: false },
            16: { name: 'right_wrist', major: false },
            23: { name: 'left_hip', major: true },
            24: { name: 'right_hip', major: true },
            25: { name: 'left_knee', major: true },
            26: { name: 'right_knee', major: true },
            27: { name: 'left_ankle', major: false },
            28: { name: 'right_ankle', major: false },
            29: { name: 'left_heel', major: false },
            30: { name: 'right_heel', major: false },
            31: { name: 'left_foot_index', major: false },
            32: { name: 'right_foot_index', major: false }
        };
        
        // Create joints
        Object.entries(landmarkMapping).forEach(([mpIndex, config]) => {
            const geometry = config.major ? majorJointGeometry : minorJointGeometry;
            const material = config.major ? majorJointMaterial : minorJointMaterial;
            const joint = new THREE.Mesh(geometry, material);
            joint.castShadow = true;
            joint.receiveShadow = true;
            joint.userData.landmarkIndex = parseInt(mpIndex);
            joint.userData.jointName = config.name;
            
            this.joints[config.name] = joint;
            this.scene.add(joint);
        });
        
        // Define bone connections
        const boneConnections = [
            // Shoulders
            ['left_shoulder', 'right_shoulder'],
            
            // Hips
            ['left_hip', 'right_hip'],
            
            // Spine/trunk
            ['left_shoulder', 'left_hip'],
            ['right_shoulder', 'right_hip'],
            
            // Left arm
            ['left_shoulder', 'left_elbow'],
            ['left_elbow', 'left_wrist'],
            
            // Right arm
            ['right_shoulder', 'right_elbow'],
            ['right_elbow', 'right_wrist'],
            
            // Left leg
            ['left_hip', 'left_knee'],
            ['left_knee', 'left_ankle'],
            ['left_ankle', 'left_heel'],
            ['left_ankle', 'left_foot_index'],
            
            // Right leg
            ['right_hip', 'right_knee'],
            ['right_knee', 'right_ankle'],
            ['right_ankle', 'right_heel'],
            ['right_ankle', 'right_foot_index'],
            
            // Head/neck
            ['nose', 'left_shoulder'],
            ['nose', 'right_shoulder']
        ];
        
        // Create bones
        boneConnections.forEach(([joint1Name, joint2Name]) => {
            const bone = new THREE.Mesh(boneGeometry, boneMaterial);
            bone.castShadow = true;
            bone.receiveShadow = true;
            bone.userData.joint1 = joint1Name;
            bone.userData.joint2 = joint2Name;
            
            this.bones.push(bone);
            this.scene.add(bone);
        });
    }
    
    updateBone(bone, startPos, endPos) {
        // Calculate bone position and rotation
        const direction = new THREE.Vector3().subVectors(endPos, startPos);
        const length = direction.length();
        
        // Position bone at midpoint
        bone.position.copy(startPos).add(direction.multiplyScalar(0.5));
        
        // Scale bone to match distance
        bone.scale.y = length;
        
        // Rotate bone to point from start to end
        const axis = new THREE.Vector3(0, 1, 0);
        bone.quaternion.setFromUnitVectors(axis, direction.normalize());
    }
    
    mediaPipeToWorld(landmark) {
        // Convert MediaPipe normalized coordinates (0-1) to 3D world space
        // MediaPipe: x (0=left, 1=right), y (0=top, 1=bottom), z (depth, negative=closer)
        
        const x = (landmark.x - 0.5) * 2;        // Center around 0, range -1 to 1
        const y = (1 - landmark.y) * 2 - 0.5;    // Flip Y (MediaPipe is top-down), range -0.5 to 1.5
        const z = -landmark.z;                   // Negate Z (closer to camera = negative)
        
        return new THREE.Vector3(x, y, z);
    }
    
    updatePose(mediaPipeLandmarks) {
        if (!mediaPipeLandmarks || mediaPipeLandmarks.length === 0) {
            console.warn('No landmarks provided to updatePose');
            return;
        }
        
        // Update joint positions from MediaPipe data
        Object.values(this.joints).forEach(joint => {
            const landmarkIndex = joint.userData.landmarkIndex;
            const landmark = mediaPipeLandmarks[landmarkIndex];
            
            if (landmark && landmark.visibility > 0.5) {
                const worldPos = this.mediaPipeToWorld(landmark);
                joint.position.copy(worldPos);
                joint.visible = true;
            } else {
                joint.visible = false;
            }
        });
        
        // Update bones to connect joints
        this.bones.forEach(bone => {
            const joint1 = this.joints[bone.userData.joint1];
            const joint2 = this.joints[bone.userData.joint2];
            
            if (joint1 && joint2 && joint1.visible && joint2.visible) {
                this.updateBone(bone, joint1.position, joint2.position);
                bone.visible = true;
            } else {
                bone.visible = false;
            }
        });
        
        // Update angle displays if enabled
        if (this.showAngles) {
            this.updateAngleDisplays();
        }
    }
    
    updateAngleDisplays() {
        // Clear old angle displays
        this.angleLabels.forEach(label => this.scene.remove(label));
        this.angleArcs.forEach(arc => this.scene.remove(arc));
        this.angleLabels = [];
        this.angleArcs = [];
        
        // Calculate and display key joint angles
        const angles = this.getCurrentAngles();
        
        // Display left knee angle
        if (angles.leftKnee !== null) {
            this.drawAngle(
                this.joints.left_hip?.position,
                this.joints.left_knee?.position,
                this.joints.left_ankle?.position,
                angles.leftKnee,
                0xff6b6b
            );
        }
        
        // Display right knee angle
        if (angles.rightKnee !== null) {
            this.drawAngle(
                this.joints.right_hip?.position,
                this.joints.right_knee?.position,
                this.joints.right_ankle?.position,
                angles.rightKnee,
                0xff6b6b
            );
        }
    }
    
    drawAngle(p1, p2, p3, angleDegrees, color = 0xff0000) {
        if (!p1 || !p2 || !p3) return;
        
        // Create angle arc
        const radius = 0.15;
        const v1 = new THREE.Vector3().subVectors(p1, p2).normalize();
        const v2 = new THREE.Vector3().subVectors(p3, p2).normalize();
        const angleRad = v1.angleTo(v2);
        
        const curve = new THREE.EllipseCurve(
            0, 0,            // center
            radius, radius,  // x/y radius
            0, angleRad,     // start/end angle
            false,           // clockwise
            0                // rotation
        );
        
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: color, linewidth: 2 });
        const arc = new THREE.Line(geometry, material);
        
        arc.position.copy(p2);
        arc.lookAt(p1);
        
        this.angleArcs.push(arc);
        this.scene.add(arc);
        
        // Create text label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 64;
        context.font = 'Bold 32px Arial';
        context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        context.textAlign = 'center';
        context.fillText(`${angleDegrees.toFixed(0)}°`, 64, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(p2).add(new THREE.Vector3(0.3, 0.3, 0));
        sprite.scale.set(0.4, 0.2, 1);
        
        this.angleLabels.push(sprite);
        this.scene.add(sprite);
    }
    
    getCurrentAngles() {
        const angles = {
            leftKnee: null,
            rightKnee: null,
            leftHip: null,
            rightHip: null,
            leftElbow: null,
            rightElbow: null,
            trunkLean: null
        };
        
        // Left knee angle (hip-knee-ankle)
        if (this.joints.left_hip?.visible && this.joints.left_knee?.visible && this.joints.left_ankle?.visible) {
            angles.leftKnee = this.calculateAngle(
                this.joints.left_hip.position,
                this.joints.left_knee.position,
                this.joints.left_ankle.position
            );
        }
        
        // Right knee angle
        if (this.joints.right_hip?.visible && this.joints.right_knee?.visible && this.joints.right_ankle?.visible) {
            angles.rightKnee = this.calculateAngle(
                this.joints.right_hip.position,
                this.joints.right_knee.position,
                this.joints.right_ankle.position
            );
        }
        
        // Left hip angle (shoulder-hip-knee)
        if (this.joints.left_shoulder?.visible && this.joints.left_hip?.visible && this.joints.left_knee?.visible) {
            angles.leftHip = this.calculateAngle(
                this.joints.left_shoulder.position,
                this.joints.left_hip.position,
                this.joints.left_knee.position
            );
        }
        
        // Right hip angle
        if (this.joints.right_shoulder?.visible && this.joints.right_hip?.visible && this.joints.right_knee?.visible) {
            angles.rightHip = this.calculateAngle(
                this.joints.right_shoulder.position,
                this.joints.right_hip.position,
                this.joints.right_knee.position
            );
        }
        
        return angles;
    }
    
    calculateAngle(p1, p2, p3) {
        // Calculate angle at p2 between p1-p2-p3
        const v1 = new THREE.Vector3().subVectors(p1, p2);
        const v2 = new THREE.Vector3().subVectors(p3, p2);
        const angleRad = v1.angleTo(v2);
        return angleRad * (180 / Math.PI);
    }
    
    // PLAYBACK CONTROLS
    
    loadRecording(frames) {
        this.recordedFrames = frames;
        this.currentFrame = 0;
        this.isPlaying = false;
        console.log(`✅ Loaded recording: ${frames.length} frames`);
        
        // Show first frame
        if (frames.length > 0 && frames[0].landmarks) {
            this.updatePose(frames[0].landmarks);
        }
    }
    
    play() {
        this.isPlaying = true;
        this.playbackLoop();
    }
    
    pause() {
        this.isPlaying = false;
    }
    
    stop() {
        this.isPlaying = false;
        this.currentFrame = 0;
        this.seekToFrame(0);
    }
    
    playbackLoop() {
        if (!this.isPlaying) return;
        
        if (this.currentFrame < this.recordedFrames.length) {
            const frame = this.recordedFrames[Math.floor(this.currentFrame)];
            
            if (frame && frame.landmarks) {
                this.updatePose(frame.landmarks);
            }
            
            // Callback for UI update
            if (this.onFrameUpdate) {
                this.onFrameUpdate(Math.floor(this.currentFrame), this.recordedFrames.length);
            }
            
            this.currentFrame += this.playbackSpeed;
            
            // Schedule next frame (30 FPS)
            setTimeout(() => this.playbackLoop(), 1000 / 30);
        } else {
            // Loop playback
            this.currentFrame = 0;
        }
    }
    
    seekToFrame(frameNumber) {
        this.currentFrame = Math.max(0, Math.min(frameNumber, this.recordedFrames.length - 1));
        const frame = this.recordedFrames[Math.floor(this.currentFrame)];
        
        if (frame && frame.landmarks) {
            this.updatePose(frame.landmarks);
        }
        
        if (this.onFrameUpdate) {
            this.onFrameUpdate(Math.floor(this.currentFrame), this.recordedFrames.length);
        }
    }
    
    setPlaybackSpeed(speed) {
        this.playbackSpeed = speed;
        console.log(`Playback speed: ${speed}x`);
    }
    
    // CAMERA PRESETS
    
    viewFromFront() {
        this.camera.position.set(0, 1.5, 3);
        this.camera.lookAt(0, 1, 0);
        if (this.controls) this.controls.update();
    }
    
    viewFromSide() {
        this.camera.position.set(3, 1.5, 0);
        this.camera.lookAt(0, 1, 0);
        if (this.controls) this.controls.update();
    }
    
    viewFromTop() {
        this.camera.position.set(0, 5, 0.1);
        this.camera.lookAt(0, 1, 0);
        if (this.controls) this.controls.update();
    }
    
    viewFromBehind() {
        this.camera.position.set(0, 1.5, -3);
        this.camera.lookAt(0, 1, 0);
        if (this.controls) this.controls.update();
    }
    
    // UTILITY FUNCTIONS
    
    toggleAngleDisplay() {
        this.showAngles = !this.showAngles;
        
        if (!this.showAngles) {
            // Hide all angle displays
            this.angleLabels.forEach(label => this.scene.remove(label));
            this.angleArcs.forEach(arc => this.scene.remove(arc));
            this.angleLabels = [];
            this.angleArcs = [];
        }
    }
    
    captureScreenshot() {
        this.renderer.render(this.scene, this.camera);
        const dataURL = this.renderer.domElement.toDataURL('image/png');
        
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = `skeleton_view_${Date.now()}.png`;
        a.click();
        
        console.log('✅ Screenshot captured');
    }
    
    handleResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
    
    animate() {
        this.animationFrameId = requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    dispose() {
        // Clean up resources
        this.isPlaying = false;
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        console.log('✅ 3D Skeleton Renderer disposed');
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.SkeletonRenderer3D = SkeletonRenderer3D;
}
