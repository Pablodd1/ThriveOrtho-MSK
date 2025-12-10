/**
 * Visual Assessment Workflow Manager
 * Handles step-by-step workflow with error handling and user guidance
 */

// Global state
let currentStep = 1;
let cameraDetector = null;
let poseTracker = null;
let recordedData = null;
let analysisResult = null;
let recordingInterval = null;
let recordingStartTime = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Visual Assessment Workflow initialized');
    checkBrowserSupport();
});

/**
 * Check browser support for required features
 */
function checkBrowserSupport() {
    const support = CameraLidarDetector.checkBrowserSupport();
    
    if (!support.supported) {
        showError(
            'Browser Not Supported',
            `Your browser is missing required features: ${support.missingFeatures.join(', ')}`,
            'Please use a modern browser like Chrome, Firefox, or Edge'
        );
        document.getElementById('detect-btn').disabled = true;
    } else {
        console.log('✅ Browser fully supported');
    }
}

/**
 * Step 1: Detect Cameras
 */
async function detectCameras() {
    try {
        showLoading(1, true);
        updateProgress(1, 'Detecting cameras...');
        
        // Initialize detector
        cameraDetector = new CameraLidarDetector();
        
        // Detect devices
        const result = await cameraDetector.detectDevices();
        
        if (!result.success) {
            throw new Error(result.error || 'Failed to detect cameras');
        }
        
        if (result.devices.length === 0) {
            throw new Error('No cameras found on this device');
        }
        
        // Display camera list
        displayCameraList(result.devices);
        
        // Show camera info
        displayCameraInfo(result.selected);
        
        // Enable start button
        document.getElementById('start-camera-btn').classList.remove('hidden');
        document.getElementById('start-camera-btn').disabled = false;
        
        showToast('Success', `Found ${result.devices.length} camera(s)`, 'success');
        console.log('✅ Camera detection complete:', result);
        
    } catch (error) {
        console.error('❌ Camera detection error:', error);
        showError(
            'Camera Detection Failed',
            error.message,
            'Please check camera connections and browser permissions'
        );
    } finally {
        showLoading(1, false);
    }
}

/**
 * Display camera list
 */
function displayCameraList(devices) {
    const container = document.getElementById('camera-list');
    container.classList.remove('hidden');
    
    container.innerHTML = `
        <h3 class="font-semibold text-gray-900 mb-3">Available Cameras:</h3>
        <div class="space-y-2">
            ${devices.map((device, index) => `
                <div class="p-4 border ${device.recommended ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} rounded-lg cursor-pointer hover:border-blue-400"
                     onclick="selectCamera('${device.deviceId}')">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="font-semibold text-gray-900">
                                ${device.label}
                                ${device.recommended ? '<span class="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">Recommended</span>' : ''}
                            </div>
                            <div class="text-sm text-gray-600">
                                ${device.maxResolution?.name || 'Unknown'} • ${device.type}
                                ${device.supportsDepth ? ' • <span class="text-green-600 font-semibold">Depth/LiDAR</span>' : ''}
                            </div>
                        </div>
                        <i class="fas fa-${device.supportsDepth ? 'cube' : 'video'} text-2xl text-gray-400"></i>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Display selected camera info
 */
function displayCameraInfo(device) {
    if (!device) return;
    
    const container = document.getElementById('camera-info');
    container.classList.remove('hidden');
    
    document.getElementById('camera-details').innerHTML = `
        <div class="space-y-2 text-sm">
            <div><strong>Camera:</strong> ${device.label}</div>
            <div><strong>Type:</strong> ${device.type}${device.supportsDepth ? ' (Depth/LiDAR Support)' : ''}</div>
            <div><strong>Resolution:</strong> ${device.maxResolution?.name} (${device.maxResolution?.width}x${device.maxResolution?.height})</div>
            <div><strong>Aspect Ratio:</strong> ${device.maxResolution?.aspectRatio || 'N/A'}</div>
        </div>
    `;
}

/**
 * Select camera
 */
function selectCamera(deviceId) {
    if (cameraDetector) {
        cameraDetector.selectDevice(deviceId);
        const device = cameraDetector.devices.find(d => d.deviceId === deviceId);
        displayCameraInfo(device);
        showToast('Camera Selected', device.label, 'info');
    }
}

/**
 * Step 2: Start Camera Stream
 */
async function startCameraStream() {
    try {
        showLoading(1, true);
        updateProgress(2, 'Starting camera...');
        
        // Start camera with maximum resolution
        const result = await cameraDetector.startCamera();
        
        if (!result.success) {
            throw new Error(result.error || 'Failed to start camera');
        }
        
        // Initialize pose tracker
        const video = document.getElementById('video-input');
        const canvas = document.getElementById('video-canvas');
        
        video.srcObject = result.stream;
        
        poseTracker = new RealtimePoseTracker(video, canvas);
        
        const initialized = await poseTracker.init();
        if (!initialized) {
            throw new Error('Failed to initialize pose tracking');
        }
        
        await poseTracker.startTracking();
        
        // Move to step 2
        completeStep(1);
        activateStep(2);
        updateProgress(2, 'Position the patient');
        
        // Start alignment monitoring
        startAlignmentMonitoring();
        
        showToast('Camera Started', 'Position the patient in frame', 'success');
        
    } catch (error) {
        console.error('❌ Camera start error:', error);
        showError(
            'Camera Start Failed',
            error.message,
            'Check if another app is using the camera'
        );
    } finally {
        showLoading(1, false);
    }
}

/**
 * Monitor alignment status
 */
function startAlignmentMonitoring() {
    const checkAlignment = () => {
        if (!poseTracker || !poseTracker.isTracking) return;
        
        const status = poseTracker.getAlignmentStatus();
        
        // Update individual checks
        updateAlignmentCheck('check-centered', status.centered);
        updateAlignmentCheck('check-shoulders', status.shouldersLevel);
        updateAlignmentCheck('check-hips', status.hipsLevel);
        updateAlignmentCheck('check-facing', status.facingCamera);
        updateAlignmentCheck('check-distance', status.distanceOk);
        
        // Update overall status
        const alignmentStatus = document.getElementById('alignment-status');
        if (status.ready) {
            alignmentStatus.innerHTML = `
                <div class="text-lg font-bold text-green-700">
                    <i class="fas fa-check-circle mr-2"></i>
                    Ready for Assessment!
                </div>
            `;
            alignmentStatus.className = 'p-4 bg-green-100 border border-green-300 rounded-lg text-center';
            
            // Enable confirm button
            const confirmBtn = document.getElementById('confirm-position-btn');
            confirmBtn.classList.remove('hidden');
            confirmBtn.disabled = false;
        } else {
            alignmentStatus.innerHTML = `
                <div class="text-lg font-bold text-gray-700">
                    <span class="pulse-dot inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                    Adjust position...
                </div>
            `;
            alignmentStatus.className = 'p-4 bg-gray-100 rounded-lg text-center';
        }
        
        // Continue monitoring
        setTimeout(checkAlignment, 100);
    };
    
    checkAlignment();
}

/**
 * Update alignment check indicator
 */
function updateAlignmentCheck(elementId, isGood) {
    const element = document.getElementById(elementId);
    const indicator = element.querySelector('.status-indicator');
    
    if (isGood) {
        indicator.className = 'status-indicator status-success mx-auto mb-2';
        element.className = 'p-3 bg-green-50 border border-green-200 rounded-lg text-center';
    } else {
        indicator.className = 'status-indicator status-error mx-auto mb-2';
        element.className = 'p-3 bg-gray-50 rounded-lg text-center';
    }
}

/**
 * Confirm position and move to recording
 */
function confirmPosition() {
    completeStep(2);
    activateStep(3);
    updateProgress(3, 'Record movement');
    showToast('Position Confirmed', 'Ready to record movement', 'success');
}

/**
 * Step 3: Start Recording
 */
function startRecording() {
    try {
        if (!poseTracker) {
            throw new Error('Pose tracker not initialized');
        }
        
        poseTracker.startRecording();
        recordingStartTime = Date.now();
        
        // UI updates
        document.getElementById('record-btn').classList.add('hidden');
        document.getElementById('stop-btn').classList.remove('hidden');
        document.getElementById('recording-status').classList.remove('hidden');
        document.getElementById('recording-complete').classList.add('hidden');
        
        // Start timer
        recordingInterval = setInterval(() => {
            const duration = ((Date.now() - recordingStartTime) / 1000).toFixed(1);
            const frames = poseTracker.recordedFrames?.length || 0;
            
            document.getElementById('record-duration').textContent = duration;
            document.getElementById('record-frames').textContent = frames;
        }, 100);
        
        updateProgress(3, 'Recording movement...');
        showToast('Recording Started', 'Perform the movement', 'info');
        
    } catch (error) {
        console.error('❌ Recording start error:', error);
        showError('Recording Failed', error.message, 'Try restarting the camera');
    }
}

/**
 * Stop Recording
 */
function stopRecording() {
    try {
        if (!poseTracker) {
            throw new Error('Pose tracker not initialized');
        }
        
        recordedData = poseTracker.stopRecording();
        
        // Clear timer
        clearInterval(recordingInterval);
        
        const duration = ((Date.now() - recordingStartTime) / 1000).toFixed(1);
        
        // UI updates
        document.getElementById('stop-btn').classList.add('hidden');
        document.getElementById('record-btn').classList.remove('hidden');
        document.getElementById('recording-status').classList.add('hidden');
        document.getElementById('recording-complete').classList.remove('hidden');
        document.getElementById('total-frames').textContent = recordedData.length;
        document.getElementById('total-duration').textContent = duration;
        document.getElementById('proceed-analysis-btn').classList.remove('hidden');
        
        updateProgress(3, 'Recording complete');
        showToast('Recording Complete', `Captured ${recordedData.length} frames`, 'success');
        
    } catch (error) {
        console.error('❌ Recording stop error:', error);
        showError('Recording Stop Failed', error.message, 'Try recording again');
    }
}

/**
 * Retake recording
 */
function retakeRecording() {
    recordedData = null;
    document.getElementById('recording-complete').classList.add('hidden');
    document.getElementById('proceed-analysis-btn').classList.add('hidden');
    updateProgress(3, 'Record movement');
}

/**
 * Proceed to analysis
 */
function proceedToAnalysis() {
    completeStep(3);
    activateStep(4);
    updateProgress(4, 'Analyzing data...');
    
    // Start analysis automatically
    setTimeout(analyzeRecording, 500);
}

/**
 * Step 4: Analyze Recording
 */
async function analyzeRecording() {
    try {
        showLoading(4, true);
        
        // Phase 1: Parse data
        updateAnalysisPhase('parse', 'running', 'Parsing movement data...');
        
        const exportedData = poseTracker.exportRecordedData();
        
        if (!exportedData || exportedData.frames.length === 0) {
            throw new Error('No valid data to analyze');
        }
        
        await sleep(1000);
        updateAnalysisPhase('parse', 'complete', `Parsed ${exportedData.frames.length} frames`);
        
        // Phase 2: Biomechanical analysis
        updateAnalysisPhase('analyze', 'running', 'Calculating ROM, risk scores...');
        
        const analyzer = new BiomechanicalAnalyzer();
        const analysis = await analyzer.analyze(exportedData, {
            name: 'Assessment Patient',
            age: 45,
            gender: 'M'
        });
        
        await sleep(1500);
        updateAnalysisPhase('analyze', 'complete', `Risk score: ${analysis.riskScore}/100`);
        
        // Phase 3: AI assessment generation
        updateAnalysisPhase('generate', 'running', 'Generating SOAP notes and HEP...');
        
        const hub = new DeviceIntegrationHub();
        const assessment = await hub.generateAssessment(analysis, {
            name: 'Assessment Patient',
            age: 45,
            gender: 'M',
            chiefComplaint: document.getElementById('chief-complaint')?.value || 'Visual assessment'
        });
        
        await sleep(2000);
        updateAnalysisPhase('generate', 'complete', 'AI assessment generated');
        
        // Phase 4: AMA compliance
        updateAnalysisPhase('ama', 'running', 'Adding CPT codes, SMART goals...');
        
        await sleep(1000);
        updateAnalysisPhase('ama', 'complete', `CPT ${assessment.amaCompliance?.cptCode?.code || 'N/A'} assigned`);
        
        // Store result
        analysisResult = {
            rawData: exportedData,
            analysis: analysis,
            assessment: assessment
        };
        
        // Show complete
        document.getElementById('analysis-complete').classList.remove('hidden');
        document.getElementById('proceed-create-btn').classList.remove('hidden');
        
        updateProgress(4, 'Analysis complete');
        showToast('Analysis Complete', 'Ready to create assessment', 'success');
        
    } catch (error) {
        console.error('❌ Analysis error:', error);
        showError(
            'Analysis Failed',
            error.message,
            'Try recording the movement again'
        );
    } finally {
        showLoading(4, false);
    }
}

/**
 * Update analysis phase status
 */
function updateAnalysisPhase(phase, state, message) {
    const container = document.getElementById(`${phase}-spinner`).parentElement.parentElement;
    const spinner = document.getElementById(`${phase}-spinner`);
    const statusText = document.getElementById(`${phase}-status`);
    
    if (state === 'running') {
        container.classList.remove('opacity-50');
        spinner.classList.remove('hidden');
        statusText.textContent = message;
        statusText.className = 'text-sm text-blue-600 font-semibold';
    } else if (state === 'complete') {
        spinner.classList.add('hidden');
        statusText.textContent = `✓ ${message}`;
        statusText.className = 'text-sm text-green-600 font-semibold';
    }
}

/**
 * Proceed to create assessment
 */
function proceedToCreate() {
    completeStep(4);
    activateStep(5);
    updateProgress(5, 'Create assessment');
}

/**
 * Step 5: Save Assessment
 */
async function saveAssessment() {
    try {
        // Validate inputs
        const name = document.getElementById('patient-name').value.trim();
        const age = parseInt(document.getElementById('patient-age').value);
        const gender = document.getElementById('patient-gender').value;
        
        if (!name) {
            throw new Error('Please enter patient name');
        }
        
        if (!age || age < 1 || age > 120) {
            throw new Error('Please enter a valid age');
        }
        
        const saveBtn = document.getElementById('save-btn');
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
        
        // Create full assessment
        const hub = new DeviceIntegrationHub();
        const result = await hub.createAssessmentFromImport(
            {
                success: true,
                deviceType: 'webcam_mediapipe',
                deviceName: 'Live Visual Assessment',
                dataPoints: analysisResult.rawData.frames.length,
                data: analysisResult.rawData,
                analysis: analysisResult.analysis,
                importId: `visual_${Date.now()}`
            },
            {
                name: name,
                age: age,
                gender: gender,
                email: `${name.toLowerCase().replace(/\s+/g, '.')}@demo.com`,
                chiefComplaint: document.getElementById('chief-complaint').value
            }
        );
        
        if (!result.success) {
            throw new Error(result.error || 'Failed to save assessment');
        }
        
        completeStep(5);
        updateProgress(5, 'Assessment saved!');
        
        // Show success and redirect
        showToast('Assessment Saved', 'Redirecting to dashboard...', 'success');
        
        setTimeout(() => {
            window.location.href = '/static/human-dashboard.html';
        }, 2000);
        
    } catch (error) {
        console.error('❌ Save error:', error);
        showError('Save Failed', error.message, 'Please check all fields and try again');
        
        const saveBtn = document.getElementById('save-btn');
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Save Assessment';
    }
}

/**
 * Export data as JSON
 */
function exportData() {
    if (!analysisResult) {
        showToast('No Data', 'No analysis data to export', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(analysisResult, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `visual_assessment_${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    showToast('Export Complete', 'Data downloaded as JSON', 'success');
}

/**
 * Helper: Sleep function
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * UI Helpers
 */

function updateProgress(step, text) {
    const percentage = (step / 5) * 100;
    document.getElementById('progress-bar').style.width = `${percentage}%`;
    document.getElementById('progress-text').textContent = `Step ${step} of 5: ${text}`;
}

function activateStep(step) {
    currentStep = step;
    
    // Update all steps
    for (let i = 1; i <= 5; i++) {
        const stepEl = document.getElementById(`step-${i}`);
        const stepNum = stepEl.querySelector('.inline-flex');
        
        if (i < step) {
            stepEl.className = 'step step-complete bg-white rounded-xl shadow-lg p-6 mb-6';
            stepNum.className = 'inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white text-sm mr-2';
        } else if (i === step) {
            stepEl.className = 'step step-active bg-white rounded-xl shadow-lg p-6 mb-6';
            stepNum.className = 'inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm mr-2';
        } else {
            stepEl.className = 'step step-inactive bg-white rounded-xl shadow-lg p-6 mb-6';
            stepNum.className = 'inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-400 text-white text-sm mr-2';
        }
    }
}

function completeStep(step) {
    const stepEl = document.getElementById(`step-${step}`);
    stepEl.className = 'step step-complete bg-white rounded-xl shadow-lg p-6 mb-6';
    
    const stepNum = stepEl.querySelector('.inline-flex');
    stepNum.className = 'inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white text-sm mr-2';
    stepNum.innerHTML = '<i class="fas fa-check"></i>';
}

function showLoading(step, show) {
    const loader = document.getElementById(`loading-${step}`);
    if (loader) {
        loader.classList.toggle('hidden', !show);
    }
}

function showError(title, message, action) {
    const banner = document.getElementById('error-banner');
    document.getElementById('error-title').textContent = title;
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-action').textContent = action || '';
    banner.classList.remove('hidden');
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => dismissError(), 10000);
}

function dismissError() {
    document.getElementById('error-banner').classList.add('hidden');
}

function showToast(title, message, type = 'info') {
    const colors = {
        success: 'border-l-4 border-green-500',
        error: 'border-l-4 border-red-500',
        warning: 'border-l-4 border-yellow-500',
        info: 'border-l-4 border-blue-500'
    };
    
    const icons = {
        success: 'check-circle text-green-500',
        error: 'exclamation-circle text-red-500',
        warning: 'exclamation-triangle text-yellow-500',
        info: 'info-circle text-blue-500'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${colors[type]}`;
    toast.innerHTML = `
        <div class="flex items-start">
            <i class="fas fa-${icons[type]} text-xl mr-3 mt-1"></i>
            <div class="flex-1">
                <div class="font-bold">${title}</div>
                <div class="text-sm text-gray-600">${message}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.getElementById('toast-container').appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => toast.remove(), 5000);
}

function showHelp() {
    alert(`Visual Assessment Workflow:

1. SETUP CAMERA
   - Detect available cameras
   - Auto-selects best quality
   - Supports LiDAR/depth cameras

2. POSITION PATIENT
   - Stand 6-8 feet from camera
   - Follow alignment guides
   - Wait for all checks to turn green

3. RECORD MOVEMENT
   - Choose movement type
   - Record 5-10 seconds
   - Can re-record if needed

4. ANALYZE DATA
   - Automatic biomechanical analysis
   - AI generates SOAP notes
   - AMA compliance added

5. CREATE ASSESSMENT
   - Add patient information
   - Save to dashboard
   - Export data if needed

Need help? Contact support or check documentation.`);
}
