/**
 * Device Integration Hub
 * Orchestrates the complete device data import and analysis workflow
 * 1. Parse device data (DeviceDataParser)
 * 2. Analyze biomechanics (BiomechanicalAnalyzer)
 * 3. Generate assessment (API call to Gemini)
 * 4. Store results in localStorage
 */

class DeviceIntegrationHub {
    constructor() {
        this.parser = new window.DeviceDataParser();
        this.analyzer = new window.BiomechanicalAnalyzer();
        
        this.importHistory = this.loadImportHistory();
    }

    /**
     * Main import function - handles complete workflow
     */
    async importDeviceData(file, deviceType = 'auto_detect', patientInfo = {}) {
        try {
            console.log('Starting device data import...', { fileName: file.name, deviceType });
            
            // Step 1: Parse file
            console.log('Step 1: Parsing file...');
            const parseResult = await this.parser.parseFile(file, deviceType);
            
            if (!parseResult.success) {
                throw new Error(parseResult.error);
            }
            
            console.log('Parse complete:', parseResult);
            
            // Step 2: Analyze biomechanics
            console.log('Step 2: Analyzing biomechanics...');
            const analysis = await this.analyzer.analyze(parseResult.data, patientInfo);
            
            console.log('Analysis complete:', analysis);
            
            // Step 3: Save import to history
            const importRecord = {
                id: `import_${Date.now()}`,
                timestamp: new Date().toISOString(),
                fileName: file.name,
                deviceType: parseResult.deviceType,
                deviceName: parseResult.deviceName,
                dataPoints: parseResult.dataPoints,
                patient: patientInfo,
                analysis: {
                    riskScore: analysis.riskScore,
                    deficiencyCount: analysis.deficiencies.length,
                    predictionCount: analysis.injuryPredictions.length
                }
            };
            
            this.importHistory.push(importRecord);
            this.saveImportHistory();
            
            // Return complete results
            return {
                success: true,
                deviceType: parseResult.deviceType,
                deviceName: parseResult.deviceName,
                dataPoints: parseResult.dataPoints,
                warnings: parseResult.warnings,
                data: parseResult.data,
                analysis: analysis,
                importId: importRecord.id
            };
            
        } catch (error) {
            console.error('Import error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate complete assessment from analysis with AMA guidelines
     * Calls backend API to generate SOAP note and HEP using Gemini
     */
    async generateAssessment(analysis, patientInfo) {
        // Generate AMA-compliant assessment data first
        let amaCompliance = null;
        if (typeof AMAGuidelinesSystem !== 'undefined') {
            const amaSystem = new AMAGuidelinesSystem();
            amaCompliance = amaSystem.generateAMACompliantAssessment(
                analysis, 
                patientInfo, 
                patientInfo.chiefComplaint || 'Patient seeking physical therapy evaluation'
            );
            console.log('AMA compliance data generated:', amaCompliance);
        }
        
    /**
     * Generate complete assessment from analysis
     * Calls backend API to generate SOAP note and HEP using Gemini
     */
    async generateAssessmentOriginal(analysis, patientInfo) {
        try {
            console.log('Generating assessment from analysis...');
            
            const response = await fetch('/api/generate-assessment-from-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    analysis: analysis,
                    patientInfo: patientInfo
                })
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to generate assessment');
            }
            
            console.log('Assessment generated:', result);
            
            return {
                success: true,
                soapNote: result.soapNote,
                homeExerciseProgram: result.homeExerciseProgram,
                deficiencies: result.deficiencies,
                injuryPredictions: result.injuryPredictions,
                recommendations: result.recommendations,
                riskScore: result.riskScore,
                amaCompliance: amaCompliance // Include AMA guidelines data
            };
            
        } catch (error) {
            console.error('Assessment generation error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create and save assessment from imported data
     */
    async createAssessmentFromImport(importResult, patientInfo) {
        try {
            // Generate AI assessment (SOAP, HEP)
            const assessmentResult = await this.generateAssessment(
                importResult.analysis, 
                patientInfo
            );
            
            if (!assessmentResult.success) {
                throw new Error(assessmentResult.error);
            }
            
            // Create complete assessment object
            const assessment = {
                id: `assessment_${Date.now()}`,
                date: new Date().toISOString(),
                patientId: patientInfo.id || 'unknown',
                patientName: patientInfo.name || 'Unknown Patient',
                email: patientInfo.email || '',
                
                // Source information
                source: 'device_import',
                deviceType: importResult.deviceType,
                deviceName: importResult.deviceName,
                importId: importResult.importId,
                
                // Analysis results
                riskScore: importResult.analysis.riskScore,
                romAnalysis: importResult.analysis.romAnalysis,
                functionalMovement: importResult.analysis.functionalMovement,
                balanceAssessment: importResult.analysis.balanceAssessment,
                movementQuality: importResult.analysis.movementQuality,
                
                // AI-generated content
                soapNote: assessmentResult.soapNote,
                homeExerciseProgram: assessmentResult.homeExerciseProgram,
                deficiencies: assessmentResult.deficiencies,
                injuryPredictions: assessmentResult.injuryPredictions,
                recommendations: assessmentResult.recommendations,
                
                // Status
                status: 'Pending Review',
                reviewedBy: null,
                reviewDate: null
            };
            
            // Save to localStorage
            const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
            assessments.push(assessment);
            localStorage.setItem('assessments', JSON.stringify(assessments));
            
            console.log('Assessment created and saved:', assessment);
            
            return {
                success: true,
                assessment: assessment
            };
            
        } catch (error) {
            console.error('Create assessment error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get import history
     */
    getImportHistory() {
        return this.importHistory;
    }

    /**
     * Load import history from localStorage
     */
    loadImportHistory() {
        try {
            const history = localStorage.getItem('deviceImportHistory');
            return history ? JSON.parse(history) : [];
        } catch {
            return [];
        }
    }

    /**
     * Save import history to localStorage
     */
    saveImportHistory() {
        try {
            localStorage.setItem('deviceImportHistory', JSON.stringify(this.importHistory));
        } catch (error) {
            console.error('Failed to save import history:', error);
        }
    }

    /**
     * Clear import history
     */
    clearImportHistory() {
        this.importHistory = [];
        localStorage.removeItem('deviceImportHistory');
    }

    /**
     * Get import by ID
     */
    getImportById(importId) {
        return this.importHistory.find(imp => imp.id === importId);
    }

    /**
     * Delete import from history
     */
    deleteImport(importId) {
        this.importHistory = this.importHistory.filter(imp => imp.id !== importId);
        this.saveImportHistory();
    }

    /**
     * Export analysis results as JSON
     */
    exportAnalysisJSON(analysis) {
        const dataStr = JSON.stringify(analysis, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `biomechanical_analysis_${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    /**
     * Export analysis results as CSV
     */
    exportAnalysisCSV(analysis) {
        // Prepare ROM data
        const romRows = Object.entries(analysis.romAnalysis).map(([joint, data]) => {
            return [
                'ROM',
                joint.replace(/_/g, ' ').toUpperCase(),
                data.avgValue,
                data.status,
                data.limitation,
                data.normalMin,
                data.normalMax
            ];
        });
        
        // Prepare deficiency data
        const deficiencyRows = analysis.deficiencies.map(d => {
            return [
                'Deficiency',
                d.joint,
                d.type,
                d.severity,
                d.value,
                d.impact,
                d.recommendation
            ];
        });
        
        // Prepare injury prediction data
        const predictionRows = analysis.injuryPredictions.map(p => {
            return [
                'Prediction',
                p.injury,
                Math.round(p.probability * 100) + '%',
                p.riskFactors.join('; '),
                p.prevention.join('; ')
            ];
        });
        
        // Combine all rows
        const headers = ['Category', 'Item', 'Value1', 'Value2', 'Value3', 'Value4', 'Value5'];
        const allRows = [headers, ...romRows, ...deficiencyRows, ...predictionRows];
        
        const csvContent = allRows.map(row => 
            row.map(cell => {
                const cellStr = String(cell || '');
                return cellStr.includes(',') ? `"${cellStr}"` : cellStr;
            }).join(',')
        ).join('\n');
        
        const dataBlob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `biomechanical_analysis_${Date.now()}.csv`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// Export for use in HTML
if (typeof window !== 'undefined') {
    window.DeviceIntegrationHub = DeviceIntegrationHub;
}
