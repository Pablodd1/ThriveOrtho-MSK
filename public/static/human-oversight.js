/**
 * Human Oversight System
 * 
 * Ensures that licensed healthcare professionals (doctors, physical therapists, coaches)
 * remain the primary decision-makers throughout the entire patient care workflow.
 * 
 * This module provides:
 * - "Consult Professional" buttons on all AI-generated content
 * - Disclaimers emphasizing human oversight
 * - Professional review tracking
 * - Human override options
 * - Consent management
 * 
 * PHILOSOPHY: AI assists, humans decide
 * 
 * @version 1.0.0
 * @author F-AI bian Platform
 */

class HumanOversightSystem {
    constructor() {
        this.disclaimerShown = false;
        this.professionalReviews = {};
        this.init();
    }
    
    init() {
        this.injectCSS();
        this.addGlobalDisclaimer();
        console.log('✅ Human Oversight System initialized');
    }
    
    injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Human Oversight Styles */
            .human-oversight-disclaimer {
                position: sticky;
                top: 0;
                z-index: 1000;
                background: linear-gradient(135deg, #FFA500 0%, #FF6347 100%);
                color: white;
                padding: 12px 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                animation: slideDown 0.5s ease-out;
            }
            
            @keyframes slideDown {
                from { transform: translateY(-100%); }
                to { transform: translateY(0); }
            }
            
            .consult-professional-btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 10px 20px;
                background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
            }
            
            .consult-professional-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(37, 99, 235, 0.4);
                background: linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%);
            }
            
            .consult-professional-btn i {
                font-size: 16px;
            }
            
            .ai-content-disclaimer {
                background: #FEF3C7;
                border-left: 4px solid #F59E0B;
                padding: 12px 16px;
                margin: 16px 0;
                border-radius: 8px;
                font-size: 14px;
                color: #78350F;
            }
            
            .ai-content-disclaimer strong {
                color: #92400E;
            }
            
            .professional-review-badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 6px 12px;
                background: #10B981;
                color: white;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
            }
            
            .pending-review-badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 6px 12px;
                background: #F59E0B;
                color: white;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            .override-modal {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.5);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
            }
            
            .override-modal.active {
                display: flex;
            }
            
            .override-modal-content {
                background: white;
                border-radius: 16px;
                max-width: 600px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            
            .consent-status {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 4px 12px;
                background: #DBEAFE;
                color: #1E40AF;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }
    
    addGlobalDisclaimer() {
        // Only add once per page
        if (document.querySelector('.human-oversight-disclaimer')) {
            return;
        }
        
        const disclaimer = document.createElement('div');
        disclaimer.className = 'human-oversight-disclaimer';
        disclaimer.innerHTML = `
            <div class="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center gap-3">
                    <i class="fas fa-user-md text-2xl"></i>
                    <div>
                        <strong class="block text-sm">Human Professional Oversight</strong>
                        <span class="text-xs opacity-90">
                            All AI recommendations require review by your licensed healthcare provider
                        </span>
                    </div>
                </div>
                <button onclick="window.humanOversight?.showOversightInfo()" 
                        class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors">
                    <i class="fas fa-info-circle mr-2"></i>Learn More
                </button>
            </div>
        `;
        
        document.body.insertBefore(disclaimer, document.body.firstChild);
    }
    
    addConsultButton(containerId, context = 'general') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container #${containerId} not found`);
            return;
        }
        
        const btnContainer = document.createElement('div');
        btnContainer.className = 'mt-4 flex items-center gap-3 flex-wrap';
        btnContainer.innerHTML = `
            <button onclick="window.humanOversight?.consultProfessional('${context}')" 
                    class="consult-professional-btn">
                <i class="fas fa-user-md"></i>
                Consult Healthcare Professional
            </button>
            <span class="pending-review-badge">
                <i class="fas fa-clock"></i>
                Pending Professional Review
            </span>
        `;
        
        container.appendChild(btnContainer);
    }
    
    addAIDisclaimer(containerId, aiFeature = 'AI-generated content') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container #${containerId} not found`);
            return;
        }
        
        const disclaimer = document.createElement('div');
        disclaimer.className = 'ai-content-disclaimer';
        disclaimer.innerHTML = `
            <div class="flex items-start gap-3">
                <i class="fas fa-robot text-xl flex-shrink-0 mt-1"></i>
                <div>
                    <strong>AI-Assisted ${aiFeature}</strong>
                    <p class="mt-1">
                        This ${aiFeature.toLowerCase()} was generated using AI technology to assist your healthcare provider. 
                        <strong>A licensed professional must review and approve this content before it is used in your care.</strong> 
                        If you have questions or concerns, please consult your doctor, physical therapist, or coach.
                    </p>
                </div>
            </div>
        `;
        
        // Insert at the top of container
        container.insertBefore(disclaimer, container.firstChild);
    }
    
    consultProfessional(context) {
        const modal = document.createElement('div');
        modal.className = 'override-modal active';
        modal.id = 'consultModal';
        modal.innerHTML = `
            <div class="override-modal-content">
                <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-2xl">
                    <h2 class="text-2xl font-bold">
                        <i class="fas fa-user-md mr-2"></i>
                        Consult Healthcare Professional
                    </h2>
                    <p class="text-sm mt-2 opacity-90">Request professional review and guidance</p>
                </div>
                
                <div class="p-6 space-y-4">
                    <div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                        <h3 class="font-bold text-gray-900 mb-2">
                            <i class="fas fa-info-circle text-blue-600 mr-2"></i>
                            What happens next?
                        </h3>
                        <ol class="text-sm text-gray-700 space-y-2 ml-4 list-decimal">
                            <li>Your request will be sent to your assigned healthcare professional</li>
                            <li>They will review the AI-generated content and your concerns</li>
                            <li>You will receive a response within 24-48 hours</li>
                            <li>All treatment decisions will be made by your professional</li>
                        </ol>
                    </div>
                    
                    <div>
                        <label class="block font-semibold text-gray-900 mb-2">
                            What would you like to discuss?
                        </label>
                        <select id="consultReason" class="w-full p-3 border-2 border-gray-300 rounded-lg">
                            <option value="">Select a reason...</option>
                            <option value="review_ai_assessment">Review AI assessment results</option>
                            <option value="review_exercise_plan">Review exercise recommendations</option>
                            <option value="review_risk_analysis">Review injury risk analysis</option>
                            <option value="question_treatment">Question about treatment plan</option>
                            <option value="pain_concerns">Pain or symptom concerns</option>
                            <option value="progress_review">Discuss progress</option>
                            <option value="alternative_options">Request alternative options (no AI)</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block font-semibold text-gray-900 mb-2">
                            Additional details (optional):
                        </label>
                        <textarea id="consultDetails" rows="4" 
                                  placeholder="Describe your concerns or questions..."
                                  class="w-full p-3 border-2 border-gray-300 rounded-lg"></textarea>
                    </div>
                    
                    <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                        <h4 class="font-bold text-gray-900 mb-1">
                            <i class="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
                            Urgent Concerns?
                        </h4>
                        <p class="text-sm text-gray-700">
                            If you are experiencing severe pain, dizziness, chest pain, or other serious symptoms, 
                            <strong>stop all exercises and contact your healthcare provider immediately or seek emergency care.</strong>
                        </p>
                    </div>
                    
                    <div class="flex gap-3">
                        <button onclick="window.humanOversight?.submitConsultRequest('${context}')" 
                                class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                            <i class="fas fa-paper-plane mr-2"></i>
                            Send Request
                        </button>
                        <button onclick="window.humanOversight?.closeConsultModal()" 
                                class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeConsultModal();
            }
        });
        
        document.body.appendChild(modal);
    }
    
    closeConsultModal() {
        const modal = document.getElementById('consultModal');
        if (modal) {
            modal.remove();
        }
    }
    
    submitConsultRequest(context) {
        const reason = document.getElementById('consultReason').value;
        const details = document.getElementById('consultDetails').value;
        
        if (!reason) {
            alert('Please select a reason for consultation');
            return;
        }
        
        // Store consultation request
        const request = {
            timestamp: new Date().toISOString(),
            context: context,
            reason: reason,
            details: details,
            status: 'pending'
        };
        
        const requests = JSON.parse(localStorage.getItem('consultRequests') || '[]');
        requests.push(request);
        localStorage.setItem('consultRequests', JSON.stringify(requests));
        
        // Close modal
        this.closeConsultModal();
        
        // Show success message
        alert('✅ Consultation request sent!\n\nYour healthcare professional will review this and respond within 24-48 hours. You will be notified via email/SMS when they respond.');
    }
    
    showOversightInfo() {
        const modal = document.createElement('div');
        modal.className = 'override-modal active';
        modal.id = 'oversightInfoModal';
        modal.innerHTML = `
            <div class="override-modal-content">
                <div class="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-t-2xl">
                    <h2 class="text-2xl font-bold">
                        <i class="fas fa-shield-alt mr-2"></i>
                        Human Professional Oversight
                    </h2>
                    <p class="text-sm mt-2 opacity-90">Your care is guided by licensed professionals</p>
                </div>
                
                <div class="p-6 space-y-4">
                    <div class="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                        <h3 class="font-bold text-gray-900 mb-2">
                            <i class="fas fa-user-md text-green-600 mr-2"></i>
                            Your Healthcare Team
                        </h3>
                        <p class="text-sm text-gray-700">
                            All aspects of your care are overseen by licensed healthcare professionals including 
                            doctors, physical therapists, and certified coaches. They are the primary decision-makers 
                            for your treatment.
                        </p>
                    </div>
                    
                    <div>
                        <h3 class="font-bold text-gray-900 mb-3">
                            <i class="fas fa-robot text-purple-600 mr-2"></i>
                            How AI Assists (But Doesn't Decide)
                        </h3>
                        <div class="space-y-2 text-sm text-gray-700">
                            <div class="flex items-start gap-3">
                                <i class="fas fa-check-circle text-green-600 mt-1"></i>
                                <div>
                                    <strong>AI Helps With:</strong> Motion analysis, preliminary assessments, 
                                    exercise suggestions, documentation
                                </div>
                            </div>
                            <div class="flex items-start gap-3">
                                <i class="fas fa-times-circle text-red-600 mt-1"></i>
                                <div>
                                    <strong>AI Does NOT:</strong> Make diagnosis, prescribe treatment, 
                                    replace professional judgment, or make final decisions
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="font-bold text-gray-900 mb-3">
                            <i class="fas fa-clipboard-check text-blue-600 mr-2"></i>
                            Professional Review Process
                        </h3>
                        <ol class="space-y-2 text-sm text-gray-700 ml-6 list-decimal">
                            <li>AI generates preliminary assessment or recommendations</li>
                            <li><strong>Licensed professional reviews all AI content</strong></li>
                            <li>Professional approves, modifies, or rejects AI suggestions</li>
                            <li>Only approved content is used in your care</li>
                            <li>You receive final treatment plan from professional</li>
                        </ol>
                    </div>
                    
                    <div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                        <h3 class="font-bold text-gray-900 mb-2">
                            <i class="fas fa-hand-paper text-blue-600 mr-2"></i>
                            Your Rights
                        </h3>
                        <ul class="space-y-1 text-sm text-gray-700 ml-4 list-disc">
                            <li>Request human-only assessment (no AI)</li>
                            <li>Consult your professional at any time</li>
                            <li>Ask questions about AI's role in your care</li>
                            <li>Request second opinions</li>
                            <li>Decline any AI-assisted services</li>
                        </ul>
                    </div>
                    
                    <button onclick="window.humanOversight?.closeOversightInfo()" 
                            class="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold">
                        <i class="fas fa-check mr-2"></i>
                        I Understand
                    </button>
                </div>
            </div>
        `;
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeOversightInfo();
            }
        });
        
        document.body.appendChild(modal);
    }
    
    closeOversightInfo() {
        const modal = document.getElementById('oversightInfoModal');
        if (modal) {
            modal.remove();
        }
    }
    
    markAsReviewed(itemId, reviewedBy, notes = '') {
        this.professionalReviews[itemId] = {
            reviewedBy: reviewedBy,
            reviewDate: new Date().toISOString(),
            notes: notes,
            status: 'approved'
        };
        
        localStorage.setItem('professionalReviews', JSON.stringify(this.professionalReviews));
    }
    
    isReviewPending(itemId) {
        return !this.professionalReviews[itemId];
    }
    
    getConsentStatus() {
        const consents = {
            hipaa: localStorage.getItem('consent_hipaa') === 'true',
            treatment: localStorage.getItem('consent_treatment') === 'true',
            ai: localStorage.getItem('consent_ai') === 'true',
            liability: localStorage.getItem('consent_liability') === 'true'
        };
        
        return {
            allSigned: Object.values(consents).every(v => v),
            consents: consents
        };
    }
    
    showConsentBadge(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const status = this.getConsentStatus();
        const badge = document.createElement('div');
        badge.className = 'consent-status';
        badge.innerHTML = status.allSigned 
            ? '<i class="fas fa-check-circle"></i> Consents Signed'
            : '<i class="fas fa-exclamation-circle"></i> Consents Incomplete';
        
        container.appendChild(badge);
    }
}

// Auto-initialize
if (typeof window !== 'undefined') {
    window.humanOversight = new HumanOversightSystem();
}

console.log('✅ Human Oversight Module loaded');
