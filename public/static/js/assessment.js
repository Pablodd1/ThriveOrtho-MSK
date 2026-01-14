      // ================================================================
      // EXERCISES CONFIGURATION - Rep-based with auto-advance
      // ================================================================
      const EXERCISES = [
        {
          name: 'Deep Squat',
          desc: 'Squat down until knees bend past 90°, then stand up straight',
          voice: "Let's start with Deep Squats. Stand with your feet shoulder width apart, and when you're ready, squat down nice and low, then stand back up. We'll do 5 together. Take your time!",
          reps: 5,
          joint: 'knee',
          downThreshold: 120,  // More forgiving - angle when "down" (knee bent)
          upThreshold: 150,    // More forgiving - angle when "up" (standing)
          track: ['knee', 'hip'],
          encouragements: ['Great form!', 'Nice and steady!', 'Perfect!', 'You got this!', 'Excellent!']
        },
        {
          name: 'Shoulder Raise',
          desc: 'Raise both arms straight up overhead, then lower',
          voice: "Wonderful! Now let's do Shoulder Raises. Reach your arms up toward the ceiling, then bring them back down. 5 repetitions. Nice and smooth!",
          reps: 5,
          joint: 'shoulder',
          downThreshold: 70,   // More forgiving - arms down
          upThreshold: 130,    // More forgiving - arms up
          track: ['shoulder', 'elbow'],
          encouragements: ['Looking good!', 'Reach for the sky!', 'Beautiful!', 'Keep it up!', 'Almost there!']
        },
        {
          name: 'Hip Hinge',
          desc: 'Bend forward at hips keeping back straight, then stand',
          voice: "Great job! Next is the Hip Hinge. Bend forward at your hips, keeping your back nice and straight, then stand tall. 5 reps, at your own pace.",
          reps: 5,
          joint: 'hip',
          downThreshold: 120,  // More forgiving - bent forward
          upThreshold: 155,    // More forgiving - standing straight
          track: ['hip', 'knee'],
          encouragements: ['Excellent control!', 'Nice hip movement!', 'Perfect form!', 'Well done!', 'Fantastic!']
        },
        {
          name: 'Arm Curl',
          desc: 'Bend elbows to bring hands to shoulders, then straighten',
          voice: "You're doing amazing! Now let's do Arm Curls. Bend your elbows to bring your hands up toward your shoulders, then straighten them out. 5 repetitions.",
          reps: 5,
          joint: 'elbow',
          downThreshold: 70,   // More forgiving - elbow bent (curled)
          upThreshold: 130,    // More forgiving - arms straight
          track: ['elbow', 'shoulder'],
          encouragements: ['Strong arms!', 'Nice and controlled!', 'Great job!', 'Keep going!', 'You nailed it!']
        },
        {
          name: 'Trunk Rotation',
          desc: 'Rotate upper body left and right with arms extended',
          voice: "Almost done! Trunk Rotation time. Extend your arms out and gently rotate your upper body left, then right. 4 rotations. Nice and easy!",
          reps: 4,
          joint: 'hip',
          downThreshold: 160,  // More forgiving - rotated
          upThreshold: 168,    // More forgiving - centered
          track: ['hip', 'shoulder'],
          encouragements: ['Good rotation!', 'Smooth movement!', 'Nice twist!', 'Excellent!']
        },
        {
          name: 'Balance Check',
          desc: 'Stand on one leg for 3 seconds, then switch',
          voice: "Last one! Balance Check. Carefully lift one foot off the ground and hold for a moment, then switch legs. 3 times each. Use support if you need it!",
          reps: 3,
          joint: 'hip',
          downThreshold: 160,  // More forgiving
          upThreshold: 168,    // More forgiving
          track: ['hip', 'knee'],
          encouragements: ['Great balance!', 'Steady as you go!', 'Wonderful!']
        }
      ];

      // ================================================================
      // TEMPORAL SMOOTHING
      // ================================================================
      const Smoother = {
        history: {},
        config: { windowSize: 5, alpha: 0.3, outlierThreshold: 30 },

        smooth: function(joint, value) {
          if (!this.history[joint]) this.history[joint] = [];
          const hist = this.history[joint];

          // Outlier rejection
          if (hist.length > 0) {
            const last = hist[hist.length - 1];
            if (Math.abs(value - last) > this.config.outlierThreshold) {
              value = last + (value - last) * 0.1;
            }
          }

          // EMA
          let ema = hist.length === 0 ? value : this.config.alpha * value + (1 - this.config.alpha) * hist[hist.length - 1];
          hist.push(ema);
          if (hist.length > this.config.windowSize * 2) hist.shift();

          return Math.round(ema);
        },

        getVelocity: function(joint) {
          const hist = this.history[joint];
          if (!hist || hist.length < 3) return 0;
          return Math.abs(hist[hist.length - 1] - hist[hist.length - 3]);
        },

        isStable: function(joint) {
          return this.getVelocity(joint) < 5;
        },

        reset: function() {
          this.history = {};
        }
      };

      // ================================================================
      // TEXT TO SPEECH - Friendly, warm voice settings
      // ================================================================
      const TTS = {
        muted: false,
        speaking: false,
        preferredVoice: null,

        init: function() {
          // Find a friendly voice (prefer female voices for warmth)
          const loadVoices = () => {
            const voices = speechSynthesis.getVoices();
            // Prefer: Samantha, Google UK English Female, Microsoft Zira
            const preferred = ['Samantha', 'Google UK English Female', 'Microsoft Zira', 'Fiona', 'Karen', 'Moira', 'Google US English'];
            for (const name of preferred) {
              const found = voices.find(v => v.name.includes(name));
              if (found) {
                this.preferredVoice = found;
                console.log('[TTS] Using voice:', found.name);
                break;
              }
            }
            if (!this.preferredVoice && voices.length > 0) {
              // Fallback to first English voice
              this.preferredVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
            }
          };

          if (speechSynthesis.getVoices().length > 0) loadVoices();
          speechSynthesis.onvoiceschanged = loadVoices;
        },

        speak: function(text, onEnd) {
          if (this.muted || !window.speechSynthesis) {
            if (onEnd) setTimeout(onEnd, 500);
            return;
          }

          const utterance = new SpeechSynthesisUtterance(text);
          // Friendly voice settings - slower, warmer tone
          utterance.rate = 0.85;   // Slower for clarity (was 1.0)
          utterance.pitch = 1.1;   // Slightly higher for warmth (was 1.0)
          utterance.volume = 0.9;  // Comfortable volume

          if (this.preferredVoice) {
            utterance.voice = this.preferredVoice;
          }

          utterance.onend = () => {
            this.speaking = false;
            if (onEnd) onEnd();
          };

          this.speaking = true;
          speechSynthesis.cancel();
          speechSynthesis.speak(utterance);
        },

        // Urgent alert voice (faster, higher pitch for attention)
        speakAlert: function(text, onEnd) {
          if (this.muted || !window.speechSynthesis) {
            if (onEnd) setTimeout(onEnd, 500);
            return;
          }

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.95;   // Slightly faster for urgency
          utterance.pitch = 1.2;   // Higher pitch for attention
          utterance.volume = 1.0;  // Full volume for alerts

          if (this.preferredVoice) {
            utterance.voice = this.preferredVoice;
          }

          utterance.onend = () => {
            this.speaking = false;
            if (onEnd) onEnd();
          };

          this.speaking = true;
          speechSynthesis.cancel();
          speechSynthesis.speak(utterance);
        },

        stop: function() {
          speechSynthesis.cancel();
          this.speaking = false;
        },

        toggle: function() {
          this.muted = !this.muted;
          if (this.muted) this.stop();
          return this.muted;
        }
      };

      // ================================================================
      // SPEECH RECOGNITION
      // ================================================================
      const SpeechRecognizer = {
        recognition: null,
        transcript: '',
        active: false,

        init: function() {
          const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (!SR) return;

          this.recognition = new SR();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;

          this.recognition.onresult = (e) => {
            let text = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
              text += e.results[i][0].transcript;
            }
            this.transcript += text + ' ';

            // Check for red flags
            RedFlags.check(text.toLowerCase());
          };

          this.recognition.onerror = () => {};
          this.recognition.onend = () => {
            if (this.active) {
              try { this.recognition.start(); } catch(e) {}
            }
          };
        },

        start: function() {
          if (!this.recognition) return;
          this.active = true;
          try { this.recognition.start(); } catch(e) {}
          document.getElementById('micDot').classList.add('active');
          document.getElementById('micLabel').textContent = 'RECORDING';
        },

        stop: function() {
          this.active = false;
          if (this.recognition) this.recognition.stop();
          document.getElementById('micDot').classList.remove('active');
          document.getElementById('micLabel').textContent = 'MIC OFF';
        },

        getTranscript: function() { return this.transcript; },
        clear: function() { this.transcript = ''; }
      };

      // ================================================================
      // RED FLAG DETECTION - Enhanced with visual + voice alerts
      // ================================================================
      const RedFlags = {
        flags: [],
        lastAlertTime: 0,
        alertCooldown: 3000, // 3 seconds between voice alerts
        keywords: {
          pain: ['pain', 'hurt', 'ache', 'sore', 'ouch', 'ow', 'painful'],
          fall_risk: ['dizzy', 'unsteady', 'falling', 'balance', 'wobbly', 'fell', 'trip', 'stumble'],
          acute: ['sharp', 'severe', 'intense', 'worst', 'stabbing', 'excruciating', 'unbearable'],
          numbness: ['numb', 'tingling', 'pins', 'needles', 'dead feeling', 'no feeling'],
          weakness: ['weak', 'cant', 'unable', 'give out', 'giving way', 'buckle', 'collapse'],
          red_flag_neuro: ['bowel', 'bladder', 'incontinence', 'saddle', 'bilateral leg']
        },
        severityMap: {
          pain: 'medium',
          fall_risk: 'high',
          acute: 'high',
          numbness: 'high',
          weakness: 'medium',
          red_flag_neuro: 'critical'
        },
        voiceAlerts: {
          pain: 'I noticed you mentioned some discomfort. Let me make a note of that.',
          fall_risk: 'Attention, doctor: patient reports balance or fall concern. Please assess.',
          acute: 'Alert: Patient reporting severe or acute symptoms. Please evaluate.',
          numbness: 'Important: Patient reporting numbness or tingling. Neurological check recommended.',
          weakness: 'Note: Patient mentions weakness. Further evaluation may be needed.',
          red_flag_neuro: 'CRITICAL ALERT: Possible neurological red flag detected. Immediate assessment required.'
        },

        check: function(text) {
          for (const [type, words] of Object.entries(this.keywords)) {
            for (const word of words) {
              if (text.includes(word)) {
                this.add(type, text);
                return;
              }
            }
          }
        },

        // Check ROM for clinical red flags
        checkROM: function(joint, leftVal, rightVal) {
          const asymmetry = Math.abs(leftVal - rightVal);
          const range = App.ROM_RANGES[joint];

          // Alert on significant asymmetry (>20°)
          if (asymmetry > 20) {
            this.addROMFlag('asymmetry', joint, leftVal, rightVal, asymmetry);
          }

          // Alert on severely restricted ROM
          if (range && (leftVal < range.min * 0.7 || rightVal < range.min * 0.7)) {
            this.addROMFlag('restricted', joint, leftVal, rightVal, 0);
          }
        },

        addROMFlag: function(type, joint, leftVal, rightVal, delta) {
          const now = Date.now();
          const flagKey = type + '_' + joint;

          // Prevent duplicate alerts within 10 seconds
          if (this.flags.some(f => f.flagKey === flagKey && (now - new Date(f.timestamp).getTime()) < 10000)) {
            return;
          }

          const flag = {
            flagKey,
            type: type === 'asymmetry' ? 'ROM Asymmetry' : 'ROM Restricted',
            severity: type === 'asymmetry' ? 'medium' : 'high',
            joint: joint.toUpperCase(),
            left: leftVal,
            right: rightVal,
            delta,
            context: type === 'asymmetry'
              ? joint.toUpperCase() + ': L=' + leftVal + '° R=' + rightVal + '° (Δ' + delta + '°)'
              : joint.toUpperCase() + ' severely restricted: L=' + leftVal + '° R=' + rightVal + '°',
            time: new Date().toLocaleTimeString(),
            timestamp: new Date().toISOString(),
            exercise: EXERCISES[App.currentIdx]?.name || 'Assessment'
          };

          this.flags.push(flag);
          this.showAlert(flag);

          // Voice alert for ROM issues
          if (now - this.lastAlertTime > this.alertCooldown) {
            const voiceMsg = type === 'asymmetry'
              ? 'Note: Significant asymmetry detected in ' + joint + '. Left and right differ by ' + delta + ' degrees.'
              : 'Alert: ' + joint + ' range of motion is significantly restricted.';
            TTS.speakAlert(voiceMsg);
            this.lastAlertTime = now;
          }

          // Log to server
          fetch('/api/red-flag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: flag.type, severity: flag.severity, context: flag.context, joint: flag.joint })
          }).catch(() => {});
        },

        add: function(type, context) {
          const now = Date.now();
          const severity = this.severityMap[type] || 'medium';

          const flag = {
            type,
            severity,
            context,
            time: new Date().toLocaleTimeString(),
            timestamp: new Date().toISOString(),
            exercise: EXERCISES[App.currentIdx]?.name || 'General'
          };
          this.flags.push(flag);
          this.showAlert(flag);

          // Voice alert (with cooldown to prevent spam)
          if (now - this.lastAlertTime > this.alertCooldown) {
            const voiceMsg = this.voiceAlerts[type] || 'Clinical flag detected. Please review.';
            TTS.speakAlert(voiceMsg);
            this.lastAlertTime = now;
          }

          // Log to server
          fetch('/api/red-flag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, severity, context })
          }).catch(() => {});
        },

        showAlert: function(flag) {
          const container = document.getElementById('alertsContainer');
          const div = document.createElement('div');

          // Different styling based on severity
          const severityClass = flag.severity === 'critical' ? 'alert-critical' :
                                flag.severity === 'high' ? 'alert-high' : 'alert-item';
          div.className = severityClass;

          const icon = flag.severity === 'critical' ? '🚨' :
                       flag.severity === 'high' ? '⚠️' : '📋';

          div.innerHTML = '<span class="alert-icon">' + icon + '</span><span class="alert-text"><strong>' +
            (flag.type || '').replace('_', ' ').toUpperCase() + '</strong><br>' +
            (flag.context ? flag.context.substring(0, 50) : flag.exercise) + '</span>';
          container.appendChild(div);

          // Critical alerts stay longer
          const timeout = flag.severity === 'critical' ? 10000 : flag.severity === 'high' ? 7000 : 5000;
          setTimeout(() => div.remove(), timeout);

          // Flash the dashboard for critical/high
          if (flag.severity === 'critical' || flag.severity === 'high') {
            const dashboard = document.querySelector('.dashboard');
            dashboard.classList.add('alert-flash');
            setTimeout(() => dashboard.classList.remove('alert-flash'), 1000);
          }
        },

        getFlags: function() { return this.flags; },
        clear: function() { this.flags = []; }
      };

      // ================================================================
      // MAIN APPLICATION
      // ================================================================
      const App = {
        holistic: null,
        video: null,
        canvas: null,
        ctx: null,
        stream: null,
        running: false,

        // Exercise state
        currentIdx: 0,
        reps: 0,
        repState: 'neutral', // 'neutral', 'down', 'up'
        results: [],
        startTime: null,

        // Tracking
        angles: {},
        frameCount: 0,
        lastFpsTime: Date.now(),
        fps: 0,

        // ============== INIT ==============
        init: async function() {
          console.log('[MSK v10.3] Initializing desktop view with enhanced tracking...');

          this.video = document.getElementById('video');
          this.canvas = document.getElementById('canvas');
          this.ctx = this.canvas.getContext('2d');

          // Initialize TTS with friendly voice
          TTS.init();

          // Attach listeners
          document.getElementById('startBtn').onclick = () => this.start();
          document.getElementById('skipBtn').onclick = () => this.skipExercise();
          document.getElementById('stopBtn').onclick = () => this.stop();
          document.getElementById('restartBtn').onclick = () => this.restart();
          document.getElementById('muteBtn').onclick = () => this.toggleMute();
          document.getElementById('reportBtn').onclick = () => this.generateReport();
          document.getElementById('generateBtn').onclick = () => this.generateReport();
          document.getElementById('cameraSelect').onchange = (e) => this.selectedCamera = e.target.value;

          // Init speech
          SpeechRecognizer.init();

          // Enumerate cameras
          await this.enumerateCameras();

          console.log('[MSK v9] Ready');
        },

        enumerateCameras: async function() {
          const select = document.getElementById('cameraSelect');
          const startBtn = document.getElementById('startBtn');

          try {
            const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            tempStream.getTracks().forEach(t => t.stop());

            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter(d => d.kind === 'videoinput');

            if (cameras.length === 0) throw new Error('No cameras found');

            select.innerHTML = cameras.map((cam, i) =>
              '<option value="' + cam.deviceId + '">' + (cam.label || 'Camera ' + (i+1)) + '</option>'
            ).join('');

            this.selectedCamera = cameras[0].deviceId;
            startBtn.disabled = false;

          } catch (e) {
            document.getElementById('errorDisplay').textContent = 'Camera access required: ' + e.message;
            document.getElementById('errorDisplay').style.display = 'block';
          }
        },

        // ============== START ==============
        start: async function() {
          console.log('[MSK v9] Starting assessment...');

          document.getElementById('startBtn').disabled = true;
          document.getElementById('startBtn').textContent = 'Loading...';

          try {
            // Start camera
            this.stream = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: this.selectedCamera, width: 1280, height: 720 },
              audio: false
            });
            this.video.srcObject = this.stream;
            await this.video.play();

            // Resize canvas
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;

            // Init Holistic
            if (!this.holistic) {
              this.holistic = new Holistic({
                locateFile: (file) => 'https://cdn.jsdelivr.net/npm/@mediapipe/holistic/' + file
              });

              this.holistic.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                refineFaceLandmarks: false,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
              });

              this.holistic.onResults((r) => this.onResults(r));
            }

            // Start
            this.running = true;
            this.startTime = Date.now();
            this.currentIdx = 0;
            this.reps = 0;
            this.repState = 'neutral';
            this.results = [];
            Smoother.reset();

            // UI
            document.getElementById('startScreen').style.display = 'none';
            document.getElementById('repOverlay').style.display = 'block';
            document.getElementById('instructionOverlay').style.display = 'block';
            document.getElementById('activeControls').style.display = 'flex';
            document.getElementById('startBtn').style.display = 'none';
            document.getElementById('liveIndicator').style.display = 'flex';

            // Start recording timer
            this.recordingTimer = setInterval(() => {
              const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
              const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
              const secs = (elapsed % 60).toString().padStart(2, '0');
              document.getElementById('recordTime').textContent = mins + ':' + secs;
            }, 1000);

            // Start speech recognition
            SpeechRecognizer.start();

            // Start first exercise
            this.startExercise(0);

            // Start processing
            this.processFrame();

          } catch (e) {
            console.error('[MSK v9] Start failed:', e);
            document.getElementById('errorDisplay').textContent = 'Failed to start: ' + e.message;
            document.getElementById('errorDisplay').style.display = 'block';
            document.getElementById('startBtn').disabled = false;
            document.getElementById('startBtn').textContent = '🎬 Start Assessment';
          }
        },

        processFrame: async function() {
          if (!this.running) return;

          try {
            await this.holistic.send({ image: this.video });
          } catch (e) {}

          requestAnimationFrame(() => this.processFrame());
        },

        // ============== RESULTS HANDLER ==============
        onResults: function(results) {
          // Clear canvas
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

          // Draw pose
          if (results.poseLandmarks) {
            // Draw skeleton in BLUE
            drawConnectors(this.ctx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#3b82f6', lineWidth: 4 });
            drawLandmarks(this.ctx, results.poseLandmarks, { color: '#93c5fd', fillColor: '#3b82f6', radius: 6 });

            // Calculate angles
            this.calculateAngles(results.poseLandmarks);

            // Detect reps
            this.detectRep();
          }

          // Draw face (subtle)
          if (results.faceLandmarks) {
            drawConnectors(this.ctx, results.faceLandmarks, FACEMESH_TESSELATION, { color: 'rgba(6, 182, 212, 0.1)', lineWidth: 1 });
          }

          // Draw hands
          if (results.leftHandLandmarks) {
            drawConnectors(this.ctx, results.leftHandLandmarks, HAND_CONNECTIONS, { color: '#8b5cf6', lineWidth: 2 });
          }
          if (results.rightHandLandmarks) {
            drawConnectors(this.ctx, results.rightHandLandmarks, HAND_CONNECTIONS, { color: '#8b5cf6', lineWidth: 2 });
          }

          // Update FPS
          this.frameCount++;
          const now = Date.now();
          if (now - this.lastFpsTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsTime = now;
            this.updateFPS();
          }
        },

        // ============== ANGLE CALCULATION ==============
        calculateAngles: function(lm) {
          if (!lm || lm.length < 33) return;

          const angle = (a, b, c) => {
            const rad = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
            let deg = Math.abs(rad * 180 / Math.PI);
            if (deg > 180) deg = 360 - deg;
            return deg;
          };

          // Landmarks
          const LS=11, RS=12, LE=13, RE=14, LW=15, RW=16, LH=23, RH=24, LK=25, RK=26, LA=27, RA=28;

          // Raw angles (bilateral)
          const rawKneeL = angle(lm[LH], lm[LK], lm[LA]);
          const rawKneeR = angle(lm[RH], lm[RK], lm[RA]);
          const rawHipL = angle(lm[LS], lm[LH], lm[LK]);
          const rawHipR = angle(lm[RS], lm[RH], lm[RK]);
          const rawShoulderL = angle(lm[LE], lm[LS], lm[LH]);
          const rawShoulderR = angle(lm[RE], lm[RS], lm[RH]);
          const rawElbowL = angle(lm[LS], lm[LE], lm[LW]);
          const rawElbowR = angle(lm[RS], lm[RE], lm[RW]);

          // Smooth bilateral
          const kneeL = Smoother.smooth('knee_L', rawKneeL);
          const kneeR = Smoother.smooth('knee_R', rawKneeR);
          const hipL = Smoother.smooth('hip_L', rawHipL);
          const hipR = Smoother.smooth('hip_R', rawHipR);
          const shoulderL = Smoother.smooth('shoulder_L', rawShoulderL);
          const shoulderR = Smoother.smooth('shoulder_R', rawShoulderR);
          const elbowL = Smoother.smooth('elbow_L', rawElbowL);
          const elbowR = Smoother.smooth('elbow_R', rawElbowR);

          // Average
          this.angles = {
            knee: Smoother.smooth('knee', (kneeL + kneeR) / 2),
            hip: Smoother.smooth('hip', (hipL + hipR) / 2),
            shoulder: Smoother.smooth('shoulder', (shoulderL + shoulderR) / 2),
            elbow: Smoother.smooth('elbow', (elbowL + elbowR) / 2),
            knee_L: kneeL, knee_R: kneeR,
            hip_L: hipL, hip_R: hipR,
            shoulder_L: shoulderL, shoulder_R: shoulderR,
            elbow_L: elbowL, elbow_R: elbowR
          };

          this.updateAnglesUI();
        },

        // ============== ROM RANGE REFERENCE VALUES ==============
        ROM_RANGES: {
          knee: { normal: 140, min: 120, label: 'Knee Flexion' },
          hip: { normal: 120, min: 90, label: 'Hip Flexion' },
          shoulder: { normal: 180, min: 150, label: 'Shoulder Flexion' },
          elbow: { normal: 150, min: 130, label: 'Elbow Flexion' }
        },

        // ============== CHECK ROM RANGE STATUS ==============
        checkRangeStatus: function(joint, value) {
          const range = this.ROM_RANGES[joint];
          if (!range || !value || value === '--') return { status: 'unknown', percent: 0 };

          const val = parseInt(value);
          const percent = Math.min(100, Math.max(0, (val / range.normal) * 100));

          if (val >= range.min) {
            return { status: 'in-range', percent, label: 'NORMAL', color: '#22c55e' };
          } else if (val >= range.min * 0.8) {
            return { status: 'warning-range', percent, label: 'LIMITED', color: '#f59e0b' };
          } else {
            return { status: 'out-range', percent, label: 'RESTRICTED', color: '#ef4444' };
          }
        },

        // ============== UPDATE ANGLE CARD WITH RANGE ==============
        updateAngleCard: function(joint, value) {
          const card = document.getElementById(joint + 'Card');
          const valueEl = document.getElementById(joint + 'Value');
          const rangeFill = document.getElementById(joint + 'RangeFill');
          const rangeText = document.getElementById(joint + 'RangeText');
          const rangeBadge = document.getElementById(joint + 'RangeBadge');

          if (!card) return;

          valueEl.textContent = value || '--';

          const range = this.ROM_RANGES[joint];
          const rangeStatus = this.checkRangeStatus(joint, value);

          // Remove all range classes
          card.classList.remove('in-range', 'warning-range', 'out-range');

          if (value && value !== '--' && range) {
            // Add appropriate range class
            card.classList.add(rangeStatus.status);

            // Update range fill bar
            if (rangeFill) {
              rangeFill.style.width = rangeStatus.percent + '%';
              rangeFill.className = 'rom-range-fill ' + rangeStatus.status;
            }

            // Update range text
            if (rangeText) {
              rangeText.textContent = 'Normal: ' + range.normal + '° | Min: ' + range.min + '°';
              rangeText.className = 'rom-range-text ' + rangeStatus.status;
            }

            // Update badge
            if (rangeBadge) {
              rangeBadge.textContent = rangeStatus.label;
              rangeBadge.className = 'range-status-badge ' + rangeStatus.status;
            }
          } else {
            if (rangeFill) rangeFill.style.width = '0%';
            if (rangeBadge) rangeBadge.textContent = '--';
          }
        },

        // ============== UPDATE UI ==============
        updateAnglesUI: function() {
          const ex = EXERCISES[this.currentIdx];
          if (!ex) return;

          const primaryJoint = ex.joint;
          const primaryVal = this.angles[primaryJoint] || 0;
          const primaryL = this.angles[primaryJoint + '_L'] || 0;
          const primaryR = this.angles[primaryJoint + '_R'] || 0;
          const delta = Math.abs(primaryL - primaryR);
          const isStable = Smoother.isStable(primaryJoint);

          // Get range status for primary joint
          const primaryRange = this.ROM_RANGES[primaryJoint];
          const primaryRangeStatus = this.checkRangeStatus(primaryJoint, primaryVal);

          // Primary angle card
          const primaryCard = document.getElementById('primaryAngle');
          primaryCard.classList.remove('in-range', 'warning-range', 'out-range');
          if (primaryVal) primaryCard.classList.add(primaryRangeStatus.status);

          document.getElementById('primaryName').textContent = primaryJoint.toUpperCase();
          document.getElementById('primaryValue').textContent = primaryVal;

          // Left/Right values with individual range status
          const primaryLEl = document.getElementById('primaryL');
          const primaryREl = document.getElementById('primaryR');
          const lRangeStatus = this.checkRangeStatus(primaryJoint, primaryL);
          const rRangeStatus = this.checkRangeStatus(primaryJoint, primaryR);

          primaryLEl.textContent = 'L: ' + primaryL + '°';
          primaryLEl.className = lRangeStatus.status;
          primaryREl.textContent = 'R: ' + primaryR + '°';
          primaryREl.className = rRangeStatus.status;

          // Delta indicator
          const deltaEl = document.getElementById('primaryDelta');
          deltaEl.textContent = 'Δ ' + delta + '°';
          deltaEl.className = 'angle-delta ' + (delta > 15 ? 'critical' : delta > 10 ? 'warn' : 'ok');

          // Primary range bar
          const primaryRangeFill = document.getElementById('primaryRangeFill');
          const primaryRangeText = document.getElementById('primaryRangeText');
          const primaryRangeBadge = document.getElementById('primaryRangeBadge');

          if (primaryRange && primaryVal) {
            primaryRangeFill.style.width = primaryRangeStatus.percent + '%';
            primaryRangeFill.className = 'rom-range-fill ' + primaryRangeStatus.status;
            primaryRangeText.textContent = 'Normal: ' + primaryRange.normal + '° | Min: ' + primaryRange.min + '°';
            primaryRangeText.className = 'rom-range-text ' + primaryRangeStatus.status;
            primaryRangeBadge.textContent = primaryRangeStatus.label;
            primaryRangeBadge.className = 'range-status-badge ' + primaryRangeStatus.status;
          }

          const statusDot = document.getElementById('primaryStatus');
          const statusText = document.getElementById('primaryStatusText');
          statusDot.className = 'status-dot ' + (isStable ? 'stable' : 'moving');
          statusText.textContent = isStable ? 'Stable' : 'Moving';

          // Secondary cards with ROM range checking
          this.updateAngleCard('knee', this.angles.knee);
          this.updateAngleCard('hip', this.angles.hip);
          this.updateAngleCard('shoulder', this.angles.shoulder);
          this.updateAngleCard('elbow', this.angles.elbow);

          // Highlight tracked joints
          ['knee', 'hip', 'shoulder', 'elbow'].forEach(j => {
            const card = document.getElementById(j + 'Card');
            if (ex.track.includes(j)) {
              card.classList.add('highlight');
            } else {
              card.classList.remove('highlight');
            }
          });
        },

        updateFPS: function() {
          const badge = document.getElementById('fpsBadge');
          badge.textContent = this.fps + ' FPS';
          badge.className = 'fps-badge ' + (this.fps >= 20 ? 'good' : this.fps >= 10 ? 'ok' : 'bad');
        },

        // ============== REP DETECTION ==============
        detectRep: function() {
          const ex = EXERCISES[this.currentIdx];
          if (!ex) return;

          const angle = this.angles[ex.joint];
          if (!angle) return;

          // State machine: neutral -> down -> up (= 1 rep)
          if (this.repState === 'neutral' || this.repState === 'up') {
            // Waiting to go DOWN (angle decreases below threshold)
            if (angle <= ex.downThreshold) {
              this.repState = 'down';
              console.log('[REP] Down detected:', angle, '<=', ex.downThreshold);
            }
          } else if (this.repState === 'down') {
            // Waiting to come UP (angle increases above threshold)
            if (angle >= ex.upThreshold) {
              this.repState = 'up';
              this.completeRep();
              console.log('[REP] Up detected:', angle, '>=', ex.upThreshold);
            }
          }
        },

        completeRep: function() {
          this.reps++;
          const ex = EXERCISES[this.currentIdx];

          // Update UI
          document.getElementById('repCount').textContent = this.reps;
          document.getElementById('repFill').style.width = (this.reps / ex.reps * 100) + '%';

          // Check ROM for red flags during exercise
          const primaryJoint = ex.joint;
          const leftVal = this.angles[primaryJoint + '_L'];
          const rightVal = this.angles[primaryJoint + '_R'];
          if (leftVal && rightVal) {
            RedFlags.checkROM(primaryJoint, leftVal, rightVal);
          }

          // Voice feedback with encouraging phrases
          if (this.reps < ex.reps) {
            const encouragement = ex.encouragements?.[this.reps - 1] || String(this.reps);
            TTS.speak(encouragement);
          }

          // Check if exercise complete
          if (this.reps >= ex.reps) {
            // Save result with detailed data for medical notes
            this.results.push({
              name: ex.name,
              reps: this.reps,
              target: ex.reps,
              score: 3, // Full score
              maxAngles: { ...this.angles },
              leftAngles: {
                knee: this.angles.knee_L,
                hip: this.angles.hip_L,
                shoulder: this.angles.shoulder_L,
                elbow: this.angles.elbow_L
              },
              rightAngles: {
                knee: this.angles.knee_R,
                hip: this.angles.hip_R,
                shoulder: this.angles.shoulder_R,
                elbow: this.angles.elbow_R
              },
              skipped: false,
              timestamp: new Date().toISOString()
            });

            // Move to next exercise with friendly message
            const completionMessages = [
              'Wonderful! Great job on that one!',
              'Excellent work! You did amazing!',
              'Perfect! That was fantastic!',
              'Beautiful! Really nice form!',
              'Outstanding! Well done!',
              'Congratulations! All exercises complete!'
            ];
            TTS.speak(completionMessages[Math.min(this.currentIdx, 5)], () => {
              setTimeout(() => this.startExercise(this.currentIdx + 1), 1500);
            });
          }
        },

        // ============== EXERCISE FLOW ==============
        startExercise: function(idx) {
          if (idx >= EXERCISES.length) {
            this.complete();
            return;
          }

          this.currentIdx = idx;
          this.reps = 0;
          this.repState = 'neutral';
          Smoother.reset();

          const ex = EXERCISES[idx];

          // Update UI
          document.getElementById('exerciseBadge').textContent = (idx + 1) + '/' + EXERCISES.length + ' ' + ex.name;
          document.getElementById('instructionTitle').textContent = ex.name;
          document.getElementById('instructionDesc').textContent = ex.desc;
          document.getElementById('repCount').textContent = '0';
          document.getElementById('repTarget').textContent = '/ ' + ex.reps;
          document.getElementById('repFill').style.width = '0%';

          // Update progress pills
          const pills = document.querySelectorAll('.progress-pill');
          pills.forEach((pill, i) => {
            pill.classList.remove('done', 'active');
            if (i < idx) pill.classList.add('done');
            if (i === idx) pill.classList.add('active');
          });

          console.log('[MSK v9] Starting exercise:', ex.name);

          // Voice instructions
          TTS.speak(ex.voice);
        },

        skipExercise: function() {
          const ex = EXERCISES[this.currentIdx];

          this.results.push({
            name: ex.name,
            reps: this.reps,
            target: ex.reps,
            score: this.reps > 0 ? 1 : 0,
            maxAngles: { ...this.angles },
            skipped: true
          });

          TTS.speak('Skipping to next exercise.');
          this.startExercise(this.currentIdx + 1);
        },

        // ============== COMPLETE ==============
        complete: function() {
          console.log('[MSK v10.3] Assessment complete');

          this.running = false;
          SpeechRecognizer.stop();

          if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
          }

          TTS.speak("Congratulations! You've completed all the exercises. Great job today!");

          // Calculate stats
          const totalReps = this.results.reduce((sum, r) => sum + r.reps, 0);
          const completedEx = this.results.filter(r => !r.skipped && r.reps >= r.target).length;

          // Update complete screen
          document.getElementById('statExercises').textContent = completedEx + '/' + EXERCISES.length;
          document.getElementById('statReps').textContent = totalReps;
          document.getElementById('statFlags').textContent = RedFlags.getFlags().length;

          // Show complete screen
          document.getElementById('repOverlay').style.display = 'none';
          document.getElementById('instructionOverlay').style.display = 'none';
          document.getElementById('completeScreen').style.display = 'flex';
          document.getElementById('activeControls').style.display = 'none';
          document.getElementById('completeControls').style.display = 'flex';
        },

        // ============== CONTROLS ==============
        stop: function() {
          this.running = false;
          SpeechRecognizer.stop();
          TTS.stop();

          if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
          }

          if (this.stream) {
            this.stream.getTracks().forEach(t => t.stop());
          }

          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

          document.getElementById('startScreen').style.display = 'flex';
          document.getElementById('repOverlay').style.display = 'none';
          document.getElementById('instructionOverlay').style.display = 'none';
          document.getElementById('activeControls').style.display = 'none';
          document.getElementById('liveIndicator').style.display = 'none';
          document.getElementById('startBtn').style.display = 'block';
          document.getElementById('startBtn').disabled = false;
          document.getElementById('startBtn').textContent = '🎬 Resume';
        },

        restart: function() {
          this.stop();

          this.currentIdx = 0;
          this.reps = 0;
          this.repState = 'neutral';
          this.results = [];
          RedFlags.clear();
          SpeechRecognizer.clear();
          Smoother.reset();

          document.getElementById('exerciseBadge').textContent = 'Ready';
          document.getElementById('completeScreen').style.display = 'none';
          document.getElementById('completeControls').style.display = 'none';
          document.getElementById('alertsContainer').innerHTML = '';
          document.getElementById('startBtn').textContent = '🎬 Start Assessment';

          // Reset progress pills
          document.querySelectorAll('.progress-pill').forEach(p => p.classList.remove('done', 'active'));
        },

        toggleMute: function() {
          const muted = TTS.toggle();
          document.getElementById('muteBtn').textContent = muted ? '🔇 Unmute' : '🔊 Mute';
        },

        generateReport: function() {
          const duration = Math.round((Date.now() - this.startTime) / 1000);
          const flags = RedFlags.getFlags();

          // Save to session storage for notes page
          sessionStorage.setItem('mskAssessment', JSON.stringify({
            date: new Date().toISOString(),
            duration,
            exercises: this.results,
            redFlags: flags,
            transcript: SpeechRecognizer.getTranscript()
          }));

          // Save to D1
          fetch('/api/assessment/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              duration,
              exercises: this.results,
              redFlags: flags,
              transcript: SpeechRecognizer.getTranscript()
            })
          }).then(() => {
            window.location.href = '/doctor/notes';
          }).catch(() => {
            window.location.href = '/doctor/notes';
          });
        }
      };

      // Initialize
      document.addEventListener('DOMContentLoaded', () => App.init());
