      let isRecording = false;
      let recognition;
      let transcript = '';
      let micPermissionGranted = false;

      // Initialize speech recognition with better error handling
      async function initSpeechRecognition() {
        // Check if Speech Recognition is supported
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
          document.getElementById('voiceStatus').textContent = 'Speech recognition not supported in this browser';
          document.getElementById('voiceStatus').style.color = '#dc2626';
          document.getElementById('voiceBtn').disabled = true;
          return false;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          console.log('Speech recognition started');
          micPermissionGranted = true;
        };

        recognition.onresult = (e) => {
          transcript = '';
          for (let i = 0; i < e.results.length; i++) {
            transcript += e.results[i][0].transcript;
          }
          document.getElementById('transcript').textContent = transcript || 'Listening...';
          document.getElementById('transcript').style.color = 'var(--gray-900)';
        };

        recognition.onerror = (e) => {
          console.error('Speech recognition error:', e.error);

          if (e.error === 'not-allowed' || e.error === 'permission-denied') {
            document.getElementById('voiceStatus').textContent = 'Microphone permission denied. Please allow access.';
            document.getElementById('voiceStatus').style.color = '#dc2626';
            isRecording = false;
            document.getElementById('voiceBtn').classList.remove('recording');
            document.getElementById('voiceIcon').className = 'fas fa-microphone';
          } else if (e.error === 'no-speech') {
            document.getElementById('voiceStatus').textContent = 'No speech detected. Try again.';
          } else if (e.error === 'network') {
            document.getElementById('voiceStatus').textContent = 'Network error. Check connection.';
          } else {
            document.getElementById('voiceStatus').textContent = 'Error: ' + e.error;
          }
        };

        recognition.onend = () => {
          if (isRecording) {
            // Restart if still recording (speech recognition auto-stops)
            try {
              recognition.start();
            } catch (e) {
              console.log('Could not restart recognition');
            }
          }
        };

        return true;
      }

      // Request microphone permission explicitly
      async function requestMicPermission() {
        const alertDiv = document.getElementById('micPermissionAlert');
        const alertText = document.getElementById('micPermissionText');

        try {
          // Show requesting state
          if (alertDiv && alertText) {
            alertDiv.style.display = 'block';
            alertDiv.style.background = '#dbeafe';
            alertDiv.style.borderColor = '#93c5fd';
            alertDiv.style.color = '#1e40af';
            alertText.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i>When prompted, tap <strong>"Allow"</strong> to enable microphone';
          }

          // This will trigger the permission prompt
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop the stream immediately - we just needed permission
          stream.getTracks().forEach(track => track.stop());
          micPermissionGranted = true;

          // Hide alert on success
          if (alertDiv) alertDiv.style.display = 'none';
          return true;
        } catch (err) {
          console.error('Microphone permission error:', err);

          if (alertDiv && alertText) {
            alertDiv.style.display = 'block';
            alertDiv.style.background = '#fee2e2';
            alertDiv.style.borderColor = '#fca5a5';
            alertDiv.style.color = '#991b1b';

            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
              alertText.innerHTML = '<strong>Microphone Permission Denied</strong><br>' +
                '1. Tap the <strong>lock/info icon</strong> in address bar<br>' +
                '2. Find "Microphone" → Set to <strong>Allow</strong><br>' +
                '3. <strong>Reload</strong> this page';
              document.getElementById('voiceStatus').innerHTML =
                '<span style="color: #dc2626;">Permission denied. See instructions above.</span>';
            } else if (err.name === 'NotFoundError') {
              alertText.innerHTML = '<strong>No Microphone Found</strong><br>Please use a device with a microphone.';
              document.getElementById('voiceStatus').textContent = 'No microphone detected';
            } else {
              alertText.innerHTML = '<strong>Microphone Error</strong><br>' + err.message;
              document.getElementById('voiceStatus').textContent = 'Error: ' + err.name;
            }
          }
          return false;
        }
      }

      // Check microphone permission on page load
      async function checkMicPermission() {
        const alertDiv = document.getElementById('micPermissionAlert');
        const alertText = document.getElementById('micPermissionText');

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (alertDiv && alertText) {
            alertDiv.style.display = 'block';
            alertDiv.style.background = '#fee2e2';
            alertDiv.style.borderColor = '#fca5a5';
            alertDiv.style.color = '#991b1b';
            alertText.innerHTML = '<strong>Microphone API not available</strong><br>Page must be accessed via HTTPS.';
          }
          return;
        }

        if (navigator.permissions && navigator.permissions.query) {
          try {
            const result = await navigator.permissions.query({ name: 'microphone' });
            if (result.state === 'granted') {
              micPermissionGranted = true;
              if (alertDiv) alertDiv.style.display = 'none';
            } else if (result.state === 'denied') {
              if (alertDiv && alertText) {
                alertDiv.style.display = 'block';
                alertDiv.style.background = '#fee2e2';
                alertDiv.style.borderColor = '#fca5a5';
                alertDiv.style.color = '#991b1b';
                alertText.innerHTML = '<strong>Microphone blocked</strong><br>Go to browser settings → Site permissions → Microphone → Allow';
              }
            }
            // Listen for changes
            result.addEventListener('change', () => checkMicPermission());
          } catch (e) {
            console.log('Microphone permission query not supported');
          }
        }
      }

      async function toggleRecording() {
        if (!recognition) {
          const initialized = await initSpeechRecognition();
          if (!initialized) return;
        }

        if (isRecording) {
          // Stop recording
          isRecording = false;
          document.getElementById('voiceBtn').classList.remove('recording');
          document.getElementById('voiceIcon').className = 'fas fa-microphone';
          document.getElementById('voiceStatus').textContent = 'Click to start recording';
          document.getElementById('voiceStatus').style.color = '';
          if (recognition) {
            try { recognition.stop(); } catch (e) {}
          }
        } else {
          // Start recording - first ensure we have permission
          if (!micPermissionGranted) {
            document.getElementById('voiceStatus').textContent = 'Requesting microphone access...';
            const hasPermission = await requestMicPermission();
            if (!hasPermission) return;
          }

          isRecording = true;
          document.getElementById('voiceBtn').classList.add('recording');
          document.getElementById('voiceIcon').className = 'fas fa-stop';
          document.getElementById('voiceStatus').textContent = 'Recording... Speak now';
          document.getElementById('voiceStatus').style.color = '#dc2626';

          try {
            recognition.start();
          } catch (e) {
            console.error('Start error:', e);
            // Already started, ignore
          }
        }
      }

      // Initialize on page load
      initSpeechRecognition();
      checkMicPermission();

      async function analyzeVoice() {
        if (!transcript) {
          alert('Please record some audio first');
          return;
        }

        const flagsContainer = document.getElementById('flagsContainer');
        flagsContainer.innerHTML = '<div class="panel-card text-center"><i class="fas fa-spinner fa-spin"></i> Analyzing...</div>';

        try {
          const response = await fetch('/api/ai/analyze-voice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcript })
          });

          const data = await response.json();

          let html = '';
          if (data.flags.red.length > 0) {
            html += '<div class="flag flag-red"><i class="fas fa-exclamation-triangle"></i><div><strong>Red:</strong> ' + data.flags.red.join(', ') + '</div></div>';
          }
          if (data.flags.yellow.length > 0) {
            html += '<div class="flag flag-yellow"><i class="fas fa-exclamation-circle"></i><div><strong>Yellow:</strong> ' + data.flags.yellow.join(', ') + '</div></div>';
          }
          if (data.flags.elderly.length > 0) {
            html += '<div class="flag flag-elderly"><i class="fas fa-person-cane"></i><div><strong>Fall Risk:</strong> ' + data.flags.elderly.join(', ') + '</div></div>';
          }

          if (!html) {
            html = '<div class="panel-card text-center text-sm" style="color: var(--success);"><i class="fas fa-check-circle"></i> No flags detected</div>';
          }

          flagsContainer.innerHTML = html;
          sessionStorage.setItem('intakeTranscript', transcript);
          sessionStorage.setItem('intakeFlags', JSON.stringify(data.flags));
        } catch (err) {
          flagsContainer.innerHTML = '<div class="panel-card text-center text-danger text-sm">Analysis failed</div>';
        }
      }
