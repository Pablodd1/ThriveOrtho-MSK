/**
 * Trainer AI Helper - Patient-side Virtual Coach
 * 
 * Provides AI-powered assistance for patients to:
 * - Ask questions about exercises
 * - Get explanations of treatment plans
 * - Understand medical terminology
 * - Receive exercise form tips
 * - Get motivation and encouragement
 * 
 * Uses Gemini Flash AI API for fast, contextual responses
 * 
 * @version 1.0.0
 * @author F-AI bian Platform
 */

class TrainerAIHelper {
    constructor() {
        this.apiEndpoint = '/api/gemini-flash';
        this.conversationHistory = [];
        this.maxHistoryLength = 10; // Keep last 10 messages for context
        this.isOpen = false;
        this.isLoading = false;
        this.patientContext = null;
        this.currentExercises = [];
        
        // Predefined quick questions
        this.quickQuestions = [
            {
                icon: 'fa-dumbbell',
                question: "How do I perform this exercise correctly?",
                category: 'technique'
            },
            {
                icon: 'fa-heartbeat',
                question: "What should I feel during this exercise?",
                category: 'sensation'
            },
            {
                icon: 'fa-exclamation-triangle',
                question: "When should I stop or be concerned?",
                category: 'safety'
            },
            {
                icon: 'fa-question-circle',
                question: "Why was this exercise prescribed to me?",
                category: 'rationale'
            },
            {
                icon: 'fa-calendar-alt',
                question: "How often should I do these exercises?",
                category: 'frequency'
            },
            {
                icon: 'fa-trophy',
                question: "How will I know I'm making progress?",
                category: 'progress'
            }
        ];
        
        // Exercise library knowledge base
        this.exerciseKnowledge = {
            'squat': {
                name: 'Bodyweight Squat',
                purpose: 'Strengthen quads, glutes, and core stability',
                commonMistakes: ['Knees caving inward', 'Not going deep enough', 'Heels lifting off ground'],
                tips: ['Push through heels', 'Keep chest up', 'Knees track over toes'],
                sensations: 'You should feel activation in your thighs and glutes, slight core engagement',
                safety: 'Stop if you feel sharp knee pain or cannot maintain balance'
            },
            'lunge': {
                name: 'Forward Lunge',
                purpose: 'Build single-leg strength, improve balance and coordination',
                commonMistakes: ['Knee extending past toes', 'Leaning forward', 'Short stride'],
                tips: ['90-degree angles at both knees', 'Keep torso upright', 'Control the descent'],
                sensations: 'Front leg should feel most of the work, especially quad and glute',
                safety: 'Reduce depth if knee pain occurs, hold wall for balance if needed'
            },
            'single_leg_stance': {
                name: 'Single Leg Balance',
                purpose: 'Improve balance, ankle stability, and proprioception',
                commonMistakes: ['Holding breath', 'Tensing upper body', 'Not engaging core'],
                tips: ['Find a focal point', 'Engage core muscles', 'Start with eyes open'],
                sensations: 'Small muscles around ankle should fire, core engaged',
                safety: 'Use wall or chair for support initially, no pain should occur'
            },
            'overhead_reach': {
                name: 'Overhead Reach',
                purpose: 'Improve shoulder mobility and thoracic spine extension',
                commonMistakes: ['Arching lower back excessively', 'Shrugging shoulders', 'Limited range'],
                tips: ['Keep ribs down', 'Reach tall through fingertips', 'Breathe naturally'],
                sensations: 'Stretch in shoulders and upper back, no pinching',
                safety: 'Stop if sharp shoulder pain or numbness occurs'
            },
            'sit_to_stand': {
                name: 'Sit to Stand',
                purpose: 'Functional lower body strength for daily activities',
                commonMistakes: ['Using momentum', 'Not engaging legs', 'Poor posture'],
                tips: ['Lean forward slightly', 'Push through heels', 'Use arms minimally'],
                sensations: 'Thighs and glutes should work, smooth controlled motion',
                safety: 'Use arms for assistance if needed, no knee pain'
            },
            'step_up': {
                name: 'Step Up',
                purpose: 'Build unilateral leg strength and power',
                commonMistakes: ['Pushing off back leg', 'Leaning forward', 'Knee valgus'],
                tips: ['Drive through front heel', 'Keep chest upright', 'Control descent'],
                sensations: 'Front leg does the work, glutes and quads engaged',
                safety: 'Start with lower step height, avoid if knee pain worsens'
            }
        };
        
        this.init();
    }
    
    init() {
        this.injectCSS();
        this.createUI();
        this.attachEventListeners();
        this.loadPatientContext();
        console.log('✅ Trainer AI Helper initialized');
    }
    
    injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Trainer AI Helper Styles */
            .trainer-ai-helper {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }
            
            .trainer-ai-toggle {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                color: white;
                border: none;
                box-shadow: 0 8px 24px rgba(5, 150, 105, 0.4);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                transition: all 0.3s;
                position: relative;
            }
            
            .trainer-ai-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 12px 32px rgba(5, 150, 105, 0.5);
            }
            
            .trainer-ai-toggle .notification-badge {
                position: absolute;
                top: -4px;
                right: -4px;
                width: 20px;
                height: 20px;
                background: #EF4444;
                border-radius: 50%;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid white;
            }
            
            .trainer-ai-chat-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 400px;
                max-width: calc(100vw - 48px);
                height: 600px;
                max-height: calc(100vh - 120px);
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                display: none;
                flex-direction: column;
                overflow: hidden;
                animation: slideUp 0.3s ease-out;
            }
            
            .trainer-ai-chat-window.open {
                display: flex;
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .trainer-ai-header {
                background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                color: white;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .trainer-ai-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 700;
            }
            
            .trainer-ai-header .subtitle {
                font-size: 12px;
                opacity: 0.9;
                margin-top: 4px;
            }
            
            .trainer-ai-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            }
            
            .trainer-ai-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            .trainer-ai-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: #F9FAFB;
            }
            
            .trainer-ai-message {
                margin-bottom: 16px;
                display: flex;
                gap: 12px;
                animation: fadeIn 0.3s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .trainer-ai-message.user {
                flex-direction: row-reverse;
            }
            
            .trainer-ai-message .avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                flex-shrink: 0;
            }
            
            .trainer-ai-message.assistant .avatar {
                background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                color: white;
            }
            
            .trainer-ai-message.user .avatar {
                background: #3B82F6;
                color: white;
            }
            
            .trainer-ai-message .content {
                max-width: 75%;
            }
            
            .trainer-ai-message.assistant .content {
                background: white;
                padding: 12px 16px;
                border-radius: 12px 12px 12px 4px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            
            .trainer-ai-message.user .content {
                background: #3B82F6;
                color: white;
                padding: 12px 16px;
                border-radius: 12px 12px 4px 12px;
            }
            
            .trainer-ai-message .content p {
                margin: 0 0 8px 0;
            }
            
            .trainer-ai-message .content p:last-child {
                margin-bottom: 0;
            }
            
            .trainer-ai-message .content ul, .trainer-ai-message .content ol {
                margin: 8px 0;
                padding-left: 20px;
            }
            
            .trainer-ai-message .content li {
                margin: 4px 0;
            }
            
            .trainer-ai-quick-questions {
                padding: 16px;
                background: white;
                border-top: 1px solid #E5E7EB;
                overflow-x: auto;
            }
            
            .quick-question-btn {
                display: inline-block;
                margin: 4px;
                padding: 8px 16px;
                background: #F3F4F6;
                border: 1px solid #E5E7EB;
                border-radius: 20px;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
                white-space: nowrap;
            }
            
            .quick-question-btn:hover {
                background: #E5E7EB;
                transform: translateY(-1px);
            }
            
            .trainer-ai-input-area {
                padding: 16px;
                background: white;
                border-top: 1px solid #E5E7EB;
            }
            
            .trainer-ai-input-wrapper {
                display: flex;
                gap: 8px;
            }
            
            .trainer-ai-input {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid #E5E7EB;
                border-radius: 24px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s;
            }
            
            .trainer-ai-input:focus {
                border-color: #059669;
            }
            
            .trainer-ai-send {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                transition: all 0.2s;
            }
            
            .trainer-ai-send:hover:not(:disabled) {
                transform: scale(1.05);
            }
            
            .trainer-ai-send:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .trainer-ai-loading {
                display: flex;
                gap: 6px;
                padding: 12px;
            }
            
            .trainer-ai-loading span {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #059669;
                animation: bounce 1.4s infinite ease-in-out both;
            }
            
            .trainer-ai-loading span:nth-child(1) { animation-delay: -0.32s; }
            .trainer-ai-loading span:nth-child(2) { animation-delay: -0.16s; }
            
            @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }
            
            .trainer-ai-welcome {
                text-align: center;
                padding: 40px 20px;
                color: #6B7280;
            }
            
            .trainer-ai-welcome i {
                font-size: 64px;
                color: #059669;
                margin-bottom: 16px;
            }
            
            .trainer-ai-welcome h4 {
                font-size: 20px;
                color: #1F2937;
                margin-bottom: 8px;
            }
            
            .trainer-ai-welcome p {
                font-size: 14px;
                line-height: 1.6;
            }
            
            @media (max-width: 640px) {
                .trainer-ai-chat-window {
                    width: calc(100vw - 48px);
                    height: calc(100vh - 120px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    createUI() {
        const container = document.createElement('div');
        container.className = 'trainer-ai-helper';
        container.innerHTML = `
            <button class="trainer-ai-toggle" id="trainerAIToggle" title="Ask Your Trainer AI">
                <i class="fas fa-user-md"></i>
            </button>
            
            <div class="trainer-ai-chat-window" id="trainerAIChatWindow">
                <div class="trainer-ai-header">
                    <div>
                        <h3><i class="fas fa-user-md mr-2"></i>Your AI Trainer</h3>
                        <div class="subtitle">Ask me anything about your exercises</div>
                    </div>
                    <button class="trainer-ai-close" id="trainerAIClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="trainer-ai-messages" id="trainerAIMessages">
                    <div class="trainer-ai-welcome">
                        <i class="fas fa-dumbbell"></i>
                        <h4>Welcome! I'm Your AI Trainer</h4>
                        <p>I'm here to help you understand your exercises, treatment plan, and answer any questions you have.</p>
                        <p style="margin-top: 12px; font-weight: 600;">Try asking:</p>
                    </div>
                </div>
                
                <div class="trainer-ai-quick-questions" id="trainerAIQuickQuestions">
                    ${this.quickQuestions.map(q => `
                        <button class="quick-question-btn" data-question="${q.question}">
                            <i class="fas ${q.icon} mr-2"></i>${q.question}
                        </button>
                    `).join('')}
                </div>
                
                <div class="trainer-ai-input-area">
                    <div class="trainer-ai-input-wrapper">
                        <input 
                            type="text" 
                            class="trainer-ai-input" 
                            id="trainerAIInput" 
                            placeholder="Type your question..."
                            maxlength="500"
                        />
                        <button class="trainer-ai-send" id="trainerAISend">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
    }
    
    attachEventListeners() {
        // Toggle button
        document.getElementById('trainerAIToggle').addEventListener('click', () => {
            this.toggleChat();
        });
        
        // Close button
        document.getElementById('trainerAIClose').addEventListener('click', () => {
            this.closeChat();
        });
        
        // Send button
        document.getElementById('trainerAISend').addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Input enter key
        document.getElementById('trainerAIInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isLoading) {
                this.sendMessage();
            }
        });
        
        // Quick questions
        document.querySelectorAll('.quick-question-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                this.askQuestion(question);
            });
        });
    }
    
    toggleChat() {
        const chatWindow = document.getElementById('trainerAIChatWindow');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatWindow.classList.add('open');
            document.getElementById('trainerAIInput').focus();
        } else {
            chatWindow.classList.remove('open');
        }
    }
    
    closeChat() {
        const chatWindow = document.getElementById('trainerAIChatWindow');
        this.isOpen = false;
        chatWindow.classList.remove('open');
    }
    
    async sendMessage() {
        const input = document.getElementById('trainerAIInput');
        const message = input.value.trim();
        
        if (!message || this.isLoading) return;
        
        input.value = '';
        await this.askQuestion(message);
    }
    
    async askQuestion(question) {
        if (this.isLoading) return;
        
        this.addMessage('user', question);
        this.isLoading = true;
        this.updateSendButton();
        this.showTypingIndicator();
        
        try {
            const response = await this.queryAI(question);
            this.removeTypingIndicator();
            this.addMessage('assistant', response);
            
            // Store in conversation history
            this.conversationHistory.push({
                role: 'user',
                content: question
            });
            this.conversationHistory.push({
                role: 'assistant',
                content: response
            });
            
            // Trim history if too long
            if (this.conversationHistory.length > this.maxHistoryLength * 2) {
                this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength * 2);
            }
            
        } catch (error) {
            console.error('AI query error:', error);
            this.removeTypingIndicator();
            this.addMessage('assistant', 
                "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or contact your physical therapist directly if you need immediate assistance."
            );
        } finally {
            this.isLoading = false;
            this.updateSendButton();
        }
    }
    
    async queryAI(question) {
        // Build context from patient data and exercise library
        const context = this.buildContext();
        
        // Build conversation history for context
        const messages = [
            {
                role: 'system',
                content: `You are a knowledgeable and encouraging physical therapy AI trainer helping a patient understand their exercises and treatment plan. 

Your role:
- Answer questions about exercises, form, and technique
- Explain treatment plans in simple, patient-friendly language
- Provide motivation and encouragement
- Clarify medical terminology
- Give safety guidance and when to stop exercises
- Suggest modifications if needed

Guidelines:
- Use simple, clear language (avoid medical jargon)
- Be encouraging and supportive
- Keep responses concise (2-4 short paragraphs)
- Use bullet points for lists
- Always prioritize patient safety
- If unsure, recommend consulting their physical therapist

Patient Context:
${context}

Remember: You are a helpful guide, not a replacement for their physical therapist. If the question is about pain, injury concerns, or treatment changes, always recommend they contact their PT directly.`
            },
            ...this.conversationHistory,
            {
                role: 'user',
                content: question
            }
        ];
        
        // Call Gemini API through backend
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.response || data.text || "I'm not sure how to answer that. Could you rephrase your question?";
    }
    
    buildContext() {
        let context = '';
        
        // Add patient context if available
        if (this.patientContext) {
            context += `Patient Name: ${this.patientContext.name || 'Unknown'}\n`;
            if (this.patientContext.age) {
                context += `Age: ${this.patientContext.age}\n`;
            }
            if (this.patientContext.condition) {
                context += `Condition/Diagnosis: ${this.patientContext.condition}\n`;
            }
        }
        
        // Add current exercises
        if (this.currentExercises.length > 0) {
            context += `\nCurrent Exercise Program:\n`;
            this.currentExercises.forEach(ex => {
                const knowledge = this.exerciseKnowledge[ex.id] || {};
                context += `- ${knowledge.name || ex.name}: ${knowledge.purpose || ''}\n`;
            });
        }
        
        return context || 'No specific patient context available.';
    }
    
    loadPatientContext() {
        // Try to load patient context from localStorage
        try {
            const patientData = localStorage.getItem('currentPatient');
            if (patientData) {
                this.patientContext = JSON.parse(patientData);
            }
            
            const exerciseData = localStorage.getItem('currentExercises');
            if (exerciseData) {
                this.currentExercises = JSON.parse(exerciseData);
            }
        } catch (error) {
            console.warn('Could not load patient context:', error);
        }
    }
    
    addMessage(role, content) {
        const messagesContainer = document.getElementById('trainerAIMessages');
        
        // Remove welcome message if this is the first real message
        const welcomeMsg = messagesContainer.querySelector('.trainer-ai-welcome');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `trainer-ai-message ${role}`;
        
        const avatar = role === 'assistant' 
            ? '<i class="fas fa-user-md"></i>' 
            : '<i class="fas fa-user"></i>';
        
        // Convert markdown-style formatting to HTML
        const formattedContent = this.formatMessage(content);
        
        messageDiv.innerHTML = `
            <div class="avatar">${avatar}</div>
            <div class="content">${formattedContent}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    formatMessage(text) {
        // Simple markdown-like formatting
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>')              // Italic
            .replace(/\n/g, '<br>')                             // Line breaks
            .replace(/^- (.+)$/gm, '<li>$1</li>');             // List items
        
        // Wrap list items in ul
        if (formatted.includes('<li>')) {
            formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        }
        
        // Add paragraph tags
        const paragraphs = formatted.split('<br><br>');
        if (paragraphs.length > 1) {
            formatted = paragraphs.map(p => `<p>${p}</p>`).join('');
        }
        
        return formatted;
    }
    
    showTypingIndicator() {
        const messagesContainer = document.getElementById('trainerAIMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'trainer-ai-message assistant';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="avatar"><i class="fas fa-user-md"></i></div>
            <div class="content">
                <div class="trainer-ai-loading">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    updateSendButton() {
        const sendBtn = document.getElementById('trainerAISend');
        sendBtn.disabled = this.isLoading;
    }
    
    // Public method to set patient context
    setPatientContext(patientData) {
        this.patientContext = patientData;
        localStorage.setItem('currentPatient', JSON.stringify(patientData));
    }
    
    // Public method to set current exercises
    setExercises(exercises) {
        this.currentExercises = exercises;
        localStorage.setItem('currentExercises', JSON.stringify(exercises));
    }
    
    // Public method to show a suggested question
    suggestQuestion(question) {
        if (!this.isOpen) {
            this.toggleChat();
        }
        document.getElementById('trainerAIInput').value = question;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.trainerAI = new TrainerAIHelper();
    });
} else {
    window.trainerAI = new TrainerAIHelper();
}
