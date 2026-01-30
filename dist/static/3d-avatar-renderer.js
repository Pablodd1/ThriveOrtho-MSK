/**
 * 3D Avatar Renderer
 * Realistic human avatar with Inverse Kinematics for patient-friendly visualization
 * Uses Three.js + GLTFLoader for 3D character models
 */

class AvatarRenderer3D {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        // Avatar components
        this.avatar = null;
        this.bones = {};
        this.mixer = null;
        
        // Playback state
        this.recordedFrames = [];
        this.currentFrame = 0;
        this.isPlaying = false;
        this.playbackSpeed = 1.0;
        this.animationFrameId = null;
        
        // Callbacks
        this.onFrameUpdate = null;
        
        // Model loading state
        this.isModelLoaded = false;
        
        // IK Solver
        this.ikSolver = null;
        this.ikHelper = null;

        this.init();
    }
    
    async loadIKLibrary() {
        if (typeof THREE !== 'undefined' && typeof THREE.CCDIKSolver !== 'undefined') {
            console.log('✅ THREE.CCDIKSolver already loaded');
            return;
        }

        return new Promise((resolve, reject) => {
            console.log('🔄 Loading THREE.CCDIKSolver...');
            const script = document.createElement('script');
            // Use specific version to match Three.js version if possible, or 0.147.0 as safe fallback
            // Note: This relies on the global THREE object being available
            script.src = 'https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/animation/CCDIKSolver.js';
            script.onload = () => {
                console.log('✅ THREE.CCDIKSolver loaded');
                resolve();
            };
            script.onerror = (e) => {
                console.warn('⚠️ Failed to load THREE.CCDIKSolver. Falling back to simplified IK.');
                // Don't reject, just resolve so initialization continues
                resolve();
            };
            document.head.appendChild(script);
        });
    }

    async init() {
        // Load IK library early
        await this.loadIKLibrary();

        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.error('Three.js not loaded!');
            return;
        }
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
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
        
        // Add orbit controls
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.minDistance = 1;
            this.controls.maxDistance = 10;
            this.controls.target.set(0, 1, 0);
            this.controls.update();
        }
        
        // Add lights
        this.setupLighting();
        
        // Add ground plane
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Add grid
        const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0xdddddd);
        this.scene.add(gridHelper);
        
        // Load default avatar (will be replaced with actual model)
        await this.loadDefaultAvatar();
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Start animation loop
        this.animate();
        
        console.log('✅ 3D Avatar Renderer initialized');
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        this.scene.add(directionalLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);
        
        // Hemisphere light
        const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x545454, 0.4);
        this.scene.add(hemisphereLight);
    }
    
    async loadDefaultAvatar() {
        // Create a simple humanoid figure as placeholder
        // In production, replace with actual GLB model from Mixamo or ReadyPlayerMe
        
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B7355,
            roughness: 0.7,
            metalness: 0.1
        });
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(0, 1.65, 0);
        head.castShadow = true;
        
        // Torso
        const torsoGeometry = new THREE.CylinderGeometry(0.15, 0.18, 0.6, 16);
        const torso = new THREE.Mesh(torsoGeometry, bodyMaterial);
        torso.position.set(0, 1.2, 0);
        torso.castShadow = true;
        
        // Left upper arm
        const armGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.3, 12);
        const leftUpperArm = new THREE.Mesh(armGeometry, bodyMaterial);
        leftUpperArm.position.set(-0.25, 1.35, 0);
        leftUpperArm.castShadow = true;
        
        // Left forearm
        const leftForearm = new THREE.Mesh(armGeometry, bodyMaterial);
        leftForearm.position.set(-0.25, 1.0, 0);
        leftForearm.castShadow = true;
        
        // Right upper arm
        const rightUpperArm = new THREE.Mesh(armGeometry, bodyMaterial);
        rightUpperArm.position.set(0.25, 1.35, 0);
        rightUpperArm.castShadow = true;
        
        // Right forearm
        const rightForearm = new THREE.Mesh(armGeometry, bodyMaterial);
        rightForearm.position.set(0.25, 1.0, 0);
        rightForearm.castShadow = true;
        
        // Pelvis
        const pelvisGeometry = new THREE.CylinderGeometry(0.18, 0.16, 0.2, 16);
        const pelvis = new THREE.Mesh(pelvisGeometry, bodyMaterial);
        pelvis.position.set(0, 0.85, 0);
        pelvis.castShadow = true;
        
        // Left thigh
        const legGeometry = new THREE.CylinderGeometry(0.06, 0.05, 0.45, 12);
        const leftThigh = new THREE.Mesh(legGeometry, bodyMaterial);
        leftThigh.position.set(-0.1, 0.53, 0);
        leftThigh.castShadow = true;
        
        // Left shin
        const leftShin = new THREE.Mesh(legGeometry, bodyMaterial);
        leftShin.position.set(-0.1, 0.23, 0);
        leftShin.castShadow = true;
        
        // Right thigh
        const rightThigh = new THREE.Mesh(legGeometry, bodyMaterial);
        rightThigh.position.set(0.1, 0.53, 0);
        rightThigh.castShadow = true;
        
        // Right shin
        const rightShin = new THREE.Mesh(legGeometry, bodyMaterial);
        rightShin.position.set(0.1, 0.23, 0);
        rightShin.castShadow = true;
        
        // Create avatar group
        this.avatar = new THREE.Group();
        this.avatar.add(head, torso, 
                       leftUpperArm, leftForearm, rightUpperArm, rightForearm,
                       pelvis, leftThigh, leftShin, rightThigh, rightShin);
        
        // Store references to body parts for IK
        this.bones = {
            head: head,
            torso: torso,
            leftUpperArm: leftUpperArm,
            leftForearm: leftForearm,
            rightUpperArm: rightUpperArm,
            rightForearm: rightForearm,
            pelvis: pelvis,
            leftThigh: leftThigh,
            leftShin: leftShin,
            rightThigh: rightThigh,
            rightShin: rightShin
        };
        
        this.scene.add(this.avatar);
        this.isModelLoaded = true;
        
        console.log('✅ Default avatar loaded (placeholder)');
        console.log('💡 To use a realistic model, load GLB from Mixamo or ReadyPlayerMe');
    }
    
    async loadMixamoModel(modelURL) {
        // Load actual GLB/GLTF model from Mixamo or ReadyPlayerMe
        // Requires GLTFLoader to be loaded
        
        if (typeof THREE.GLTFLoader === 'undefined') {
            console.error('GLTFLoader not available. Cannot load 3D model.');
            return;
        }
        
        const loader = new THREE.GLTFLoader();
        
        return new Promise((resolve, reject) => {
            loader.load(
                modelURL,
                (gltf) => {
                    // Remove old avatar
                    if (this.avatar) {
                        this.scene.remove(this.avatar);
                    }
                    
                    this.avatar = gltf.scene;
                    this.avatar.castShadow = true;
                    this.avatar.receiveShadow = true;
                    
                    // Enable shadows for all meshes
                    this.avatar.traverse((object) => {
                        if (object.isMesh) {
                            object.castShadow = true;
                            object.receiveShadow = true;
                        }
                        
                        // Find bones
                        if (object.isBone) {
                            this.mapBone(object);
                        }
                    });
                    
                    this.scene.add(this.avatar);
                    this.isModelLoaded = true;
                    
                    // Setup animation mixer if model has animations
                    if (gltf.animations && gltf.animations.length > 0) {
                        this.mixer = new THREE.AnimationMixer(this.avatar);
                    }
                    
                    // Setup IK
                    this.setupIKSolver();

                    console.log('✅ Mixamo model loaded successfully');
                    resolve();
                },
                (progress) => {
                    const percentComplete = (progress.loaded / progress.total) * 100;
                    console.log(`Loading model: ${percentComplete.toFixed(1)}%`);
                },
                (error) => {
                    console.error('Error loading model:', error);
                    reject(error);
                }
            );
        });
    }
    
    mapBone(bone) {
        // Map bone names from Mixamo rig to our system
        const boneMapping = {
            'mixamorig:Head': 'head',
            'mixamorig:Spine2': 'torso',
            'mixamorig:LeftArm': 'leftUpperArm',
            'mixamorig:LeftForeArm': 'leftForearm',
            'mixamorig:RightArm': 'rightUpperArm',
            'mixamorig:RightForeArm': 'rightForearm',
            'mixamorig:Hips': 'pelvis',
            'mixamorig:LeftUpLeg': 'leftThigh',
            'mixamorig:LeftLeg': 'leftShin',
            'mixamorig:RightUpLeg': 'rightThigh',
            'mixamorig:RightLeg': 'rightShin',
            'mixamorig:LeftShoulder': 'leftShoulder',
            'mixamorig:RightShoulder': 'rightShoulder',
            'mixamorig:LeftHand': 'leftHand',
            'mixamorig:RightHand': 'rightHand',
            'mixamorig:LeftFoot': 'leftFoot',
            'mixamorig:RightFoot': 'rightFoot'
        };
        
        Object.entries(boneMapping).forEach(([mixamoName, ourName]) => {
            if (bone.name === mixamoName) {
                this.bones[ourName] = bone;
            }
        });
    }

    setupIKSolver() {
        if (typeof THREE.CCDIKSolver === 'undefined') {
            return;
        }

        // Find the skinned mesh
        let skinnedMesh = null;
        this.avatar.traverse((obj) => {
            if (obj.isSkinnedMesh && !skinnedMesh) {
                skinnedMesh = obj;
            }
        });

        if (!skinnedMesh || !skinnedMesh.skeleton) {
            console.warn('⚠️ No SkinnedMesh/Skeleton found for IK setup');
            return;
        }

        const skeleton = skinnedMesh.skeleton;
        const bones = skeleton.bones;

        // Helper to find bone index by our internal name
        const getIndex = (name) => {
            const bone = this.bones[name];
            return bone ? bones.indexOf(bone) : -1;
        };

        // Create target bones and add to skeleton
        this.ikTargets = {};
        const iks = [];

        const createChain = (effectorName, linksNames, targetName) => {
            const effectorIdx = getIndex(effectorName);
            if (effectorIdx === -1) return;

            // Create target bone
            const targetBone = new THREE.Bone();
            targetBone.name = targetName;
            this.scene.add(targetBone); // Add to scene for world-space positioning
            bones.push(targetBone);
            const targetIdx = bones.length - 1;

            this.ikTargets[effectorName] = targetBone;

            // Create links
            const links = [];
            for (const linkName of linksNames) {
                const linkIdx = getIndex(linkName);
                if (linkIdx !== -1) {
                    links.push({
                        index: linkIdx
                        // Note: Constraints (rotationMin/Max) can be added here for better realism
                    });
                }
            }

            iks.push({
                target: targetIdx,
                effector: effectorIdx,
                links: links
            });
        };

        // Define chains
        // Arms: Forearm -> UpperArm
        createChain('leftHand', ['leftForearm', 'leftUpperArm'], 'ik_target_left_hand');
        createChain('rightHand', ['rightForearm', 'rightUpperArm'], 'ik_target_right_hand');

        // Legs: Shin -> Thigh
        createChain('leftFoot', ['leftShin', 'leftThigh'], 'ik_target_left_foot');
        createChain('rightFoot', ['rightShin', 'rightThigh'], 'ik_target_right_foot');

        if (iks.length > 0) {
            this.ikSolver = new THREE.CCDIKSolver(skinnedMesh, iks);
            console.log(`✅ IK System initialized with ${iks.length} chains`);
        }
    }
    
    mediaPipeToWorld(landmark) {
        // Convert MediaPipe coordinates to 3D world space
        const x = (landmark.x - 0.5) * 2;
        const y = (1 - landmark.y) * 2 - 0.5;
        const z = -landmark.z;
        
        return new THREE.Vector3(x, y, z);
    }
    
    updateAvatarPose(mediaPipeLandmarks) {
        if (!this.isModelLoaded || !mediaPipeLandmarks) {
            return;
        }
        
        // Get key landmark positions
        const nose = mediaPipeLandmarks[0];
        const leftShoulder = mediaPipeLandmarks[11];
        const rightShoulder = mediaPipeLandmarks[12];
        const leftElbow = mediaPipeLandmarks[13];
        const rightElbow = mediaPipeLandmarks[14];
        const leftWrist = mediaPipeLandmarks[15];
        const rightWrist = mediaPipeLandmarks[16];
        const leftHip = mediaPipeLandmarks[23];
        const rightHip = mediaPipeLandmarks[24];
        const leftKnee = mediaPipeLandmarks[25];
        const rightKnee = mediaPipeLandmarks[26];
        const leftAnkle = mediaPipeLandmarks[27];
        const rightAnkle = mediaPipeLandmarks[28];

        // --- IK Solver Path (for Mixamo/SkinnedMesh) ---
        if (this.ikSolver && this.ikTargets) {
            // Update Pelvis (Root)
            // Note: We only set position for the root of the skeleton.
            // Child bones (limbs) are handled by IK and hierarchy.
            if (leftHip && rightHip && this.bones.pelvis) {
                const leftHipPos = this.mediaPipeToWorld(leftHip);
                const rightHipPos = this.mediaPipeToWorld(rightHip);
                const pelvisPos = new THREE.Vector3().addVectors(leftHipPos, rightHipPos).multiplyScalar(0.5);
                this.bones.pelvis.position.copy(pelvisPos);
            }

            // Update IK Targets
            if (leftWrist && this.ikTargets.leftHand) {
                this.ikTargets.leftHand.position.copy(this.mediaPipeToWorld(leftWrist));
            }
            if (rightWrist && this.ikTargets.rightHand) {
                this.ikTargets.rightHand.position.copy(this.mediaPipeToWorld(rightWrist));
            }
            if (leftAnkle && this.ikTargets.leftFoot) {
                this.ikTargets.leftFoot.position.copy(this.mediaPipeToWorld(leftAnkle));
            }
            if (rightAnkle && this.ikTargets.rightFoot) {
                this.ikTargets.rightFoot.position.copy(this.mediaPipeToWorld(rightAnkle));
            }

            // Update Solver
            this.ikSolver.update();
            return;
        }

        // --- Simplified Path (for Default Avatar) ---
        
        // Update head position
        if (nose && this.bones.head) {
            const headPos = this.mediaPipeToWorld(nose);
            this.bones.head.position.copy(headPos);
        }
        
        // Update torso (midpoint of shoulders)
        if (leftShoulder && rightShoulder && this.bones.torso) {
            const leftShoulderPos = this.mediaPipeToWorld(leftShoulder);
            const rightShoulderPos = this.mediaPipeToWorld(rightShoulder);
            const torsoPos = new THREE.Vector3().addVectors(leftShoulderPos, rightShoulderPos).multiplyScalar(0.5);
            this.bones.torso.position.copy(torsoPos);
        }
        
        // Update pelvis (midpoint of hips)
        if (leftHip && rightHip && this.bones.pelvis) {
            const leftHipPos = this.mediaPipeToWorld(leftHip);
            const rightHipPos = this.mediaPipeToWorld(rightHip);
            const pelvisPos = new THREE.Vector3().addVectors(leftHipPos, rightHipPos).multiplyScalar(0.5);
            this.bones.pelvis.position.copy(pelvisPos);
        }
        
        // Update left arm
        if (leftShoulder && leftElbow && this.bones.leftUpperArm) {
            const shoulderPos = this.mediaPipeToWorld(leftShoulder);
            const elbowPos = this.mediaPipeToWorld(leftElbow);
            
            this.bones.leftUpperArm.position.copy(shoulderPos);
            this.bones.leftUpperArm.lookAt(elbowPos);
        }
        
        if (leftElbow && leftWrist && this.bones.leftForearm) {
            const elbowPos = this.mediaPipeToWorld(leftElbow);
            const wristPos = this.mediaPipeToWorld(leftWrist);
            
            this.bones.leftForearm.position.copy(elbowPos);
            this.bones.leftForearm.lookAt(wristPos);
        }
        
        // Update right arm
        if (rightShoulder && rightElbow && this.bones.rightUpperArm) {
            const shoulderPos = this.mediaPipeToWorld(rightShoulder);
            const elbowPos = this.mediaPipeToWorld(rightElbow);
            
            this.bones.rightUpperArm.position.copy(shoulderPos);
            this.bones.rightUpperArm.lookAt(elbowPos);
        }
        
        if (rightElbow && rightWrist && this.bones.rightForearm) {
            const elbowPos = this.mediaPipeToWorld(rightElbow);
            const wristPos = this.mediaPipeToWorld(rightWrist);
            
            this.bones.rightForearm.position.copy(elbowPos);
            this.bones.rightForearm.lookAt(wristPos);
        }
        
        // Update left leg
        if (leftHip && leftKnee && this.bones.leftThigh) {
            const hipPos = this.mediaPipeToWorld(leftHip);
            const kneePos = this.mediaPipeToWorld(leftKnee);
            
            this.bones.leftThigh.position.copy(hipPos);
            this.bones.leftThigh.lookAt(kneePos);
        }
        
        if (leftKnee && leftAnkle && this.bones.leftShin) {
            const kneePos = this.mediaPipeToWorld(leftKnee);
            const anklePos = this.mediaPipeToWorld(leftAnkle);
            
            this.bones.leftShin.position.copy(kneePos);
            this.bones.leftShin.lookAt(anklePos);
        }
        
        // Update right leg
        if (rightHip && rightKnee && this.bones.rightThigh) {
            const hipPos = this.mediaPipeToWorld(rightHip);
            const kneePos = this.mediaPipeToWorld(rightKnee);
            
            this.bones.rightThigh.position.copy(hipPos);
            this.bones.rightThigh.lookAt(kneePos);
        }
        
        if (rightKnee && rightAnkle && this.bones.rightShin) {
            const kneePos = this.mediaPipeToWorld(rightKnee);
            const anklePos = this.mediaPipeToWorld(rightAnkle);
            
            this.bones.rightShin.position.copy(kneePos);
            this.bones.rightShin.lookAt(anklePos);
        }
    }
    
    // PLAYBACK CONTROLS (same as skeleton renderer)
    
    loadRecording(frames) {
        this.recordedFrames = frames;
        this.currentFrame = 0;
        this.isPlaying = false;
        console.log(`✅ Avatar loaded recording: ${frames.length} frames`);
        
        if (frames.length > 0 && frames[0].landmarks) {
            this.updateAvatarPose(frames[0].landmarks);
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
                this.updateAvatarPose(frame.landmarks);
            }
            
            if (this.onFrameUpdate) {
                this.onFrameUpdate(Math.floor(this.currentFrame), this.recordedFrames.length);
            }
            
            this.currentFrame += this.playbackSpeed;
            
            setTimeout(() => this.playbackLoop(), 1000 / 30);
        } else {
            this.currentFrame = 0;
        }
    }
    
    seekToFrame(frameNumber) {
        this.currentFrame = Math.max(0, Math.min(frameNumber, this.recordedFrames.length - 1));
        const frame = this.recordedFrames[Math.floor(this.currentFrame)];
        
        if (frame && frame.landmarks) {
            this.updateAvatarPose(frame.landmarks);
        }
        
        if (this.onFrameUpdate) {
            this.onFrameUpdate(Math.floor(this.currentFrame), this.recordedFrames.length);
        }
    }
    
    setPlaybackSpeed(speed) {
        this.playbackSpeed = speed;
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
    
    captureScreenshot() {
        this.renderer.render(this.scene, this.camera);
        const dataURL = this.renderer.domElement.toDataURL('image/png');
        
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = `avatar_view_${Date.now()}.png`;
        a.click();
        
        console.log('✅ Avatar screenshot captured');
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
        
        // Update animation mixer if present
        if (this.mixer) {
            this.mixer.update(0.01);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    dispose() {
        this.isPlaying = false;
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        console.log('✅ 3D Avatar Renderer disposed');
    }
}

// Export
if (typeof window !== 'undefined') {
    window.AvatarRenderer3D = AvatarRenderer3D;
}
