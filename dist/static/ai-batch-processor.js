/**
 * AI API Call Batching Optimization
 * 
 * Consolidates multiple AI requests into single batch calls
 * Reduces API costs and improves performance by:
 * - Batching SOAP note + HEP + Analysis into one prompt
 * - Queuing requests and processing in batches
 * - Caching common responses
 * - Smart request deduplication
 */

class AIBatchProcessor {
    constructor(apiKey = null) {
        this.apiKey = apiKey;
        this.requestQueue = [];
        this.cache = new Map();
        this.batchSize = 5;
        this.batchDelay = 2000; // Wait 2 seconds before processing batch
        this.batchTimer = null;
        this.processing = false;
    }

    /**
     * Main batch processing function
     * Combines SOAP Note + HEP + Deficiency Analysis into single AI call
     */
    async generateComprehensiveAnalysis(assessmentData, patientData) {
        console.log('🚀 AIBatchProcessor: Generating comprehensive analysis in single call...');
        
        if (!this.apiKey) {
            throw new Error('API key required for AI batch processing');
        }
        
        // Check cache first
        const cacheKey = this.generateCacheKey(assessmentData, patientData);
        if (this.cache.has(cacheKey)) {
            console.log('✅ Cache hit - returning cached result');
            return this.cache.get(cacheKey);
        }
        
        // Build comprehensive prompt combining all analysis needs
        const prompt = this.buildComprehensivePrompt(assessmentData, patientData);
        
        try {
            const startTime = Date.now();
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 4000 // Larger limit for comprehensive response
                    }
                })
            });

            const data = await response.json();
            const duration = Date.now() - startTime;
            
            console.log(`✅ Comprehensive analysis generated in ${duration}ms`);
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const responseText = data.candidates[0].content.parts[0].text;
                
                // Parse structured response
                const parsed = this.parseComprehensiveResponse(responseText);
                
                // Cache result
                this.cache.set(cacheKey, parsed);
                
                // Clear old cache entries if cache is too large
                if (this.cache.size > 50) {
                    const firstKey = this.cache.keys().next().value;
                    this.cache.delete(firstKey);
                }
                
                return parsed;
            } else {
                throw new Error('Unexpected API response format');
            }
        } catch (error) {
            console.error('Error in comprehensive analysis:', error);
            throw error;
        }
    }

    /**
     * Build comprehensive prompt combining SOAP + HEP + Analysis
     */
    buildComprehensivePrompt(assessmentData, patientData) {
        // Extract test results
        const testResults = this.summarizeTestResults(assessmentData);
        
        return `You are a physical therapist analyzing patient assessment data. Generate a comprehensive analysis with MULTIPLE sections in a SINGLE response.

PATIENT INFORMATION:
Name: ${patientData.name}
Age: ${patientData.age} years
Gender: ${patientData.gender}
Height: ${patientData.height_cm} cm
Weight: ${patientData.weight_kg} kg
BMI: ${(patientData.weight_kg / Math.pow(patientData.height_cm / 100, 2)).toFixed(1)}
Chief Complaint: ${patientData.chief_complaint || 'General movement assessment'}
${patientData.pain_locations ? 'Pain Locations: ' + patientData.pain_locations : ''}

TEST RESULTS:
${testResults}

Generate a comprehensive analysis with the following sections. Use clear markers so the response can be parsed:

===SOAP_NOTE===
Write a professional SOAP note with:
- Subjective: Patient's chief complaint and relevant history
- Objective: Test results, ROM measurements, deficiencies identified
- Assessment: Clinical interpretation and diagnosis
- Plan: Treatment recommendations and goals

===HEP_SUMMARY===
Generate a Home Exercise Program summary:
- List 5-7 specific exercises targeting identified deficiencies
- Include sets, reps, frequency for each
- Prioritize exercises by importance
- Brief rationale for each exercise selection

===DEFICIENCY_ANALYSIS===
Provide detailed deficiency analysis:
- List all identified movement deficiencies
- Categorize by severity (High/Medium/Low)
- Explain functional impact of each deficiency
- Suggest specific corrective strategies

===PROGRESS_GOALS===
Define measurable progress goals for next 4-6 weeks:
- Short-term goals (2 weeks)
- Medium-term goals (4-6 weeks)
- Specific metrics to track improvement
- Expected functional outcomes

===CLINICAL_INSIGHTS===
Provide clinical insights:
- Key patterns observed across tests
- Injury risk factors identified
- Compensation patterns detected
- Recommendations for further assessment if needed

Format each section clearly with the markers above so it can be automatically parsed.`;
    }

    /**
     * Summarize test results for prompt
     */
    summarizeTestResults(assessmentData) {
        let summary = '';
        
        if (assessmentData.tests && Array.isArray(assessmentData.tests)) {
            assessmentData.tests.forEach(test => {
                const analysis = test.analysis_result ? JSON.parse(test.analysis_result) : null;
                
                summary += `\nTest: ${test.test_name}\n`;
                summary += `Score: ${test.score}/3\n`;
                
                if (analysis) {
                    if (analysis.avg_angles) {
                        summary += `Average Angles:\n`;
                        Object.entries(analysis.avg_angles).forEach(([joint, angle]) => {
                            summary += `  - ${joint}: ${angle.toFixed(1)}°\n`;
                        });
                    }
                    
                    if (analysis.deficiencies && analysis.deficiencies.length > 0) {
                        summary += `Deficiencies:\n`;
                        analysis.deficiencies.forEach(def => {
                            summary += `  - ${def}\n`;
                        });
                    }
                    
                    if (analysis.balance_metrics) {
                        summary += `Balance: ${analysis.balance_metrics.stability_score || 'N/A'}\n`;
                    }
                }
            });
        }
        
        return summary;
    }

    /**
     * Parse comprehensive AI response into structured sections
     */
    parseComprehensiveResponse(responseText) {
        const sections = {
            soapNote: '',
            hepSummary: '',
            deficiencyAnalysis: '',
            progressGoals: '',
            clinicalInsights: ''
        };
        
        // Extract each section using markers
        const soapMatch = responseText.match(/===SOAP_NOTE===\s*([\s\S]*?)(?====|$)/);
        if (soapMatch) sections.soapNote = soapMatch[1].trim();
        
        const hepMatch = responseText.match(/===HEP_SUMMARY===\s*([\s\S]*?)(?====|$)/);
        if (hepMatch) sections.hepSummary = hepMatch[1].trim();
        
        const deficiencyMatch = responseText.match(/===DEFICIENCY_ANALYSIS===\s*([\s\S]*?)(?====|$)/);
        if (deficiencyMatch) sections.deficiencyAnalysis = deficiencyMatch[1].trim();
        
        const goalsMatch = responseText.match(/===PROGRESS_GOALS===\s*([\s\S]*?)(?====|$)/);
        if (goalsMatch) sections.progressGoals = goalsMatch[1].trim();
        
        const insightsMatch = responseText.match(/===CLINICAL_INSIGHTS===\s*([\s\S]*?)(?====|$)/);
        if (insightsMatch) sections.clinicalInsights = insightsMatch[1].trim();
        
        return sections;
    }

    /**
     * Generate cache key for request
     */
    generateCacheKey(assessmentData, patientData) {
        // Create hash based on patient ID and test results
        const testScores = assessmentData.tests ? 
            assessmentData.tests.map(t => t.score).join(',') : '';
        
        return `${patientData.patient_id}_${assessmentData.id}_${testScores}`;
    }

    /**
     * Queue-based batch processing (for multiple concurrent requests)
     */
    queueRequest(request) {
        console.log('📥 Queuing AI request for batch processing...');
        
        return new Promise((resolve, reject) => {
            this.requestQueue.push({
                request: request,
                resolve: resolve,
                reject: reject,
                timestamp: Date.now()
            });
            
            // Start batch timer if not already running
            if (!this.batchTimer) {
                this.batchTimer = setTimeout(() => this.processBatch(), this.batchDelay);
            }
            
            // Process immediately if queue is full
            if (this.requestQueue.length >= this.batchSize) {
                clearTimeout(this.batchTimer);
                this.batchTimer = null;
                this.processBatch();
            }
        });
    }

    /**
     * Process queued requests in batch
     */
    async processBatch() {
        if (this.processing || this.requestQueue.length === 0) {
            return;
        }
        
        this.processing = true;
        console.log(`🔄 Processing batch of ${this.requestQueue.length} requests...`);
        
        const batch = this.requestQueue.splice(0, this.batchSize);
        
        try {
            // Process all requests in parallel
            const results = await Promise.all(
                batch.map(item => this.processRequest(item.request))
            );
            
            // Resolve all promises
            batch.forEach((item, index) => {
                item.resolve(results[index]);
            });
            
            console.log(`✅ Batch processed successfully`);
        } catch (error) {
            console.error('❌ Batch processing error:', error);
            
            // Reject all promises
            batch.forEach(item => {
                item.reject(error);
            });
        } finally {
            this.processing = false;
            
            // Process next batch if queue has items
            if (this.requestQueue.length > 0) {
                this.batchTimer = setTimeout(() => this.processBatch(), this.batchDelay);
            }
        }
    }

    /**
     * Process individual request
     */
    async processRequest(request) {
        // Check cache
        const cacheKey = JSON.stringify(request);
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        // Make API call
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
        
        const data = await response.json();
        
        // Cache result
        this.cache.set(cacheKey, data);
        
        return data;
    }

    /**
     * Batch analyze multiple assessments (for progress tracking)
     */
    async batchAnalyzeAssessments(assessments, patientData) {
        console.log(`📊 Batch analyzing ${assessments.length} assessments...`);
        
        // Create single comprehensive prompt for all assessments
        const prompt = `Analyze multiple assessment sessions for patient ${patientData.name} and identify trends:

${assessments.map((assessment, index) => `
SESSION ${index + 1} (${assessment.created_at}):
Score: ${assessment.total_score}
Tests Completed: ${assessment.tests.length}
${this.summarizeTestResults(assessment)}
`).join('\n---\n')}

Provide:
1. Overall progress trend (improving/stable/declining)
2. Key improvements observed
3. Areas of concern
4. Recommended focus for next session

Keep response concise (max 300 words).`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500
                    }
                })
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0]) {
                return data.candidates[0].content.parts[0].text;
            }
        } catch (error) {
            console.error('Error in batch analysis:', error);
            throw error;
        }
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            hitRate: '0%', // Would need to track hits/misses to calculate
            oldestEntry: this.cache.size > 0 ? 'Available' : 'N/A'
        };
    }

    /**
     * Clear cache
     */
    clearCache() {
        const size = this.cache.size;
        this.cache.clear();
        console.log(`🗑️ Cleared ${size} cached entries`);
    }

    /**
     * Get queue status
     */
    getQueueStatus() {
        return {
            queueLength: this.requestQueue.length,
            processing: this.processing,
            batchTimerActive: this.batchTimer !== null
        };
    }

    /**
     * Generate cost savings report
     */
    generateCostReport(originalCallCount, batchedCallCount) {
        const savings = originalCallCount - batchedCallCount;
        const savingsPercentage = ((savings / originalCallCount) * 100).toFixed(1);
        
        return {
            originalCalls: originalCallCount,
            batchedCalls: batchedCallCount,
            callsSaved: savings,
            savingsPercentage: savingsPercentage + '%',
            estimatedCostSavings: `$${(savings * 0.01).toFixed(2)}`, // Assuming $0.01 per call
            recommendation: savingsPercentage > 50 
                ? '✅ Excellent batching efficiency'
                : '⚠️ Consider increasing batch size'
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIBatchProcessor;
}
