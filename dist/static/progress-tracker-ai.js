/**
 * AI Progress Tracker
 * 
 * Automatically analyzes patient progress across multiple assessment sessions
 * Generates personalized insights comparing baseline → previous → current performance
 * Uses Gemini AI to create narrative progress reports
 */

class ProgressTrackerAI {
    constructor(apiKey = null) {
        this.apiKey = apiKey;
        this.sessionHistory = [];
        this.insights = [];
        this.trends = {};
    }

    /**
     * Main analysis function - compares current assessment to historical data
     */
    async analyzeProgress(currentAssessment, historicalAssessments, patientData) {
        console.log('🔍 ProgressTrackerAI: Analyzing progress...');
        
        // Sort assessments by date (oldest first)
        const sortedAssessments = this.sortAssessmentsByDate([...historicalAssessments, currentAssessment]);
        
        // Identify baseline, previous, and current
        const baseline = sortedAssessments[0]; // First assessment
        const previous = sortedAssessments.length > 1 ? sortedAssessments[sortedAssessments.length - 2] : baseline;
        const current = sortedAssessments[sortedAssessments.length - 1];
        
        // Calculate metrics for each session
        const baselineMetrics = this.calculateSessionMetrics(baseline);
        const previousMetrics = this.calculateSessionMetrics(previous);
        const currentMetrics = this.calculateSessionMetrics(current);
        
        // Analyze trends
        this.trends = {
            rom: this.analyzeTrend(baselineMetrics.avgROM, previousMetrics.avgROM, currentMetrics.avgROM),
            balance: this.analyzeTrend(baselineMetrics.avgBalance, previousMetrics.avgBalance, currentMetrics.avgBalance),
            symmetry: this.analyzeTrend(baselineMetrics.avgSymmetry, previousMetrics.avgSymmetry, currentMetrics.avgSymmetry),
            deficiencyCount: this.analyzeTrend(baselineMetrics.deficiencyCount, previousMetrics.deficiencyCount, currentMetrics.deficiencyCount, true) // Lower is better
        };
        
        // Generate insights
        this.insights = this.generateInsights(baselineMetrics, previousMetrics, currentMetrics);
        
        // Calculate overall progress score
        const progressScore = this.calculateProgressScore(baselineMetrics, currentMetrics);
        
        // Generate AI narrative using Gemini
        let aiNarrative = null;
        if (this.apiKey) {
            aiNarrative = await this.generateAINarrative(
                patientData,
                baselineMetrics,
                previousMetrics,
                currentMetrics,
                this.insights,
                progressScore
            );
        }
        
        return {
            baseline: {
                date: baseline.created_at,
                metrics: baselineMetrics
            },
            previous: {
                date: previous.created_at,
                metrics: previousMetrics
            },
            current: {
                date: current.created_at,
                metrics: currentMetrics
            },
            trends: this.trends,
            insights: this.insights,
            progressScore: progressScore,
            aiNarrative: aiNarrative,
            sessionCount: sortedAssessments.length,
            timespan: this.calculateTimespan(baseline.created_at, current.created_at)
        };
    }

    /**
     * Sort assessments by created_at date
     */
    sortAssessmentsByDate(assessments) {
        return assessments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    /**
     * Calculate comprehensive metrics for a single session
     */
    calculateSessionMetrics(assessment) {
        const tests = assessment.tests || [];
        
        if (tests.length === 0) {
            return {
                avgROM: 0,
                avgBalance: 0,
                avgSymmetry: 0,
                deficiencyCount: 0,
                passedTests: 0,
                failedTests: 0
            };
        }
        
        let totalROM = 0;
        let totalBalance = 0;
        let totalSymmetry = 0;
        let deficiencyCount = 0;
        let passedTests = 0;
        let failedTests = 0;
        
        tests.forEach(test => {
            const analysis = test.analysis_result ? JSON.parse(test.analysis_result) : null;
            
            if (!analysis) return;
            
            // ROM calculation (average of all joint angles)
            if (analysis.avg_angles) {
                const angles = [
                    analysis.avg_angles.hip_left,
                    analysis.avg_angles.hip_right,
                    analysis.avg_angles.knee_left,
                    analysis.avg_angles.knee_right,
                    analysis.avg_angles.ankle_left,
                    analysis.avg_angles.ankle_right
                ].filter(a => a !== undefined && a > 0);
                
                if (angles.length > 0) {
                    totalROM += angles.reduce((sum, angle) => sum + angle, 0) / angles.length;
                }
            }
            
            // Balance calculation
            if (analysis.balance_metrics) {
                totalBalance += analysis.balance_metrics.stability_score || 0;
            }
            
            // Symmetry calculation
            if (analysis.avg_angles) {
                const hipSymmetry = Math.abs(analysis.avg_angles.hip_left - analysis.avg_angles.hip_right);
                const kneeSymmetry = Math.abs(analysis.avg_angles.knee_left - analysis.avg_angles.knee_right);
                const avgAsymmetry = (hipSymmetry + kneeSymmetry) / 2;
                totalSymmetry += Math.max(0, 100 - avgAsymmetry); // Convert to symmetry score (100 = perfect)
            }
            
            // Deficiency count
            if (analysis.deficiencies && Array.isArray(analysis.deficiencies)) {
                deficiencyCount += analysis.deficiencies.length;
            }
            
            // Pass/Fail
            if (test.score === 3) passedTests++;
            else failedTests++;
        });
        
        const testCount = tests.length;
        
        return {
            avgROM: totalROM / testCount,
            avgBalance: totalBalance / testCount,
            avgSymmetry: totalSymmetry / testCount,
            deficiencyCount: deficiencyCount,
            passedTests: passedTests,
            failedTests: failedTests,
            totalTests: testCount
        };
    }

    /**
     * Analyze trend between baseline → previous → current
     */
    analyzeTrend(baseline, previous, current, lowerIsBetter = false) {
        const baselineToCurrent = current - baseline;
        const previousToCurrent = current - previous;
        
        // Determine direction
        let direction = 'stable';
        if (lowerIsBetter) {
            if (previousToCurrent < -2) direction = 'improving';
            else if (previousToCurrent > 2) direction = 'declining';
        } else {
            if (previousToCurrent > 2) direction = 'improving';
            else if (previousToCurrent < -2) direction = 'declining';
        }
        
        // Calculate percentage change
        const percentChange = baseline !== 0 ? ((current - baseline) / baseline) * 100 : 0;
        const recentPercentChange = previous !== 0 ? ((current - previous) / previous) * 100 : 0;
        
        return {
            baseline: baseline,
            previous: previous,
            current: current,
            absoluteChange: baselineToCurrent,
            recentChange: previousToCurrent,
            percentChange: percentChange,
            recentPercentChange: recentPercentChange,
            direction: direction
        };
    }

    /**
     * Generate actionable insights
     */
    generateInsights(baselineMetrics, previousMetrics, currentMetrics) {
        const insights = [];
        
        // ROM Insights
        const romChange = currentMetrics.avgROM - baselineMetrics.avgROM;
        if (romChange > 5) {
            insights.push({
                category: 'ROM',
                type: 'improvement',
                severity: 'positive',
                message: `Range of motion improved by ${romChange.toFixed(1)}° since baseline`,
                icon: '📈',
                priority: 'high'
            });
        } else if (romChange < -5) {
            insights.push({
                category: 'ROM',
                type: 'regression',
                severity: 'warning',
                message: `Range of motion decreased by ${Math.abs(romChange).toFixed(1)}° since baseline`,
                icon: '⚠️',
                priority: 'high'
            });
        }
        
        // Balance Insights
        const balanceChange = currentMetrics.avgBalance - baselineMetrics.avgBalance;
        if (balanceChange > 10) {
            insights.push({
                category: 'Balance',
                type: 'improvement',
                severity: 'positive',
                message: `Balance stability improved by ${balanceChange.toFixed(0)} points`,
                icon: '🎯',
                priority: 'medium'
            });
        } else if (balanceChange < -10) {
            insights.push({
                category: 'Balance',
                type: 'regression',
                severity: 'warning',
                message: `Balance stability decreased - review fall risk precautions`,
                icon: '⚠️',
                priority: 'high'
            });
        }
        
        // Symmetry Insights
        const symmetryChange = currentMetrics.avgSymmetry - baselineMetrics.avgSymmetry;
        if (symmetryChange > 10) {
            insights.push({
                category: 'Symmetry',
                type: 'improvement',
                severity: 'positive',
                message: `Movement symmetry improved - better bilateral balance`,
                icon: '⚖️',
                priority: 'medium'
            });
        } else if (symmetryChange < -10) {
            insights.push({
                category: 'Symmetry',
                type: 'regression',
                severity: 'warning',
                message: `Asymmetry increased - address compensatory patterns`,
                icon: '⚠️',
                priority: 'high'
            });
        }
        
        // Deficiency Insights
        const deficiencyChange = currentMetrics.deficiencyCount - baselineMetrics.deficiencyCount;
        if (deficiencyChange < -2) {
            insights.push({
                category: 'Deficiencies',
                type: 'improvement',
                severity: 'positive',
                message: `${Math.abs(deficiencyChange)} fewer deficiencies identified`,
                icon: '✅',
                priority: 'high'
            });
        } else if (deficiencyChange > 2) {
            insights.push({
                category: 'Deficiencies',
                type: 'new_issues',
                severity: 'alert',
                message: `${deficiencyChange} new deficiencies detected - requires attention`,
                icon: '🚨',
                priority: 'urgent'
            });
        }
        
        // Test Performance Insights
        const passRateBaseline = (baselineMetrics.passedTests / baselineMetrics.totalTests) * 100;
        const passRateCurrent = (currentMetrics.passedTests / currentMetrics.totalTests) * 100;
        const passRateChange = passRateCurrent - passRateBaseline;
        
        if (passRateChange > 20) {
            insights.push({
                category: 'Performance',
                type: 'improvement',
                severity: 'positive',
                message: `Test pass rate improved from ${passRateBaseline.toFixed(0)}% to ${passRateCurrent.toFixed(0)}%`,
                icon: '🏆',
                priority: 'high'
            });
        }
        
        // Consistency Insight
        const recentChange = currentMetrics.avgROM - previousMetrics.avgROM;
        if (Math.abs(recentChange) < 2 && romChange > 0) {
            insights.push({
                category: 'Consistency',
                type: 'stable_improvement',
                severity: 'positive',
                message: `Maintaining consistent performance - excellent compliance`,
                icon: '📊',
                priority: 'medium'
            });
        }
        
        return insights;
    }

    /**
     * Calculate overall progress score (0-100)
     */
    calculateProgressScore(baselineMetrics, currentMetrics) {
        let score = 50; // Start at neutral
        
        // ROM contribution (±20 points)
        const romChange = ((currentMetrics.avgROM - baselineMetrics.avgROM) / baselineMetrics.avgROM) * 100;
        score += Math.min(20, Math.max(-20, romChange / 2));
        
        // Balance contribution (±15 points)
        const balanceChange = ((currentMetrics.avgBalance - baselineMetrics.avgBalance) / Math.max(1, baselineMetrics.avgBalance)) * 100;
        score += Math.min(15, Math.max(-15, balanceChange / 3));
        
        // Symmetry contribution (±10 points)
        const symmetryChange = ((currentMetrics.avgSymmetry - baselineMetrics.avgSymmetry) / Math.max(1, baselineMetrics.avgSymmetry)) * 100;
        score += Math.min(10, Math.max(-10, symmetryChange / 2));
        
        // Deficiency reduction (±15 points)
        const deficiencyChange = baselineMetrics.deficiencyCount - currentMetrics.deficiencyCount; // Inverted (lower is better)
        score += Math.min(15, Math.max(-15, deficiencyChange * 3));
        
        // Test pass rate (±10 points)
        const passRateBaseline = (baselineMetrics.passedTests / baselineMetrics.totalTests) * 100;
        const passRateCurrent = (currentMetrics.passedTests / currentMetrics.totalTests) * 100;
        score += Math.min(10, Math.max(-10, (passRateCurrent - passRateBaseline) / 5));
        
        return Math.round(Math.min(100, Math.max(0, score)));
    }

    /**
     * Calculate timespan between two dates
     */
    calculateTimespan(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffMs = end - start;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffWeeks = Math.floor(diffDays / 7);
        
        if (diffWeeks > 0) {
            return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''}`;
        } else {
            return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
        }
    }

    /**
     * Generate AI narrative using Gemini
     */
    async generateAINarrative(patientData, baselineMetrics, previousMetrics, currentMetrics, insights, progressScore) {
        try {
            const prompt = `You are a physical therapist writing a progress note for a patient.

Patient: ${patientData.name}, ${patientData.age} years old, ${patientData.gender}

Assessment Progress Summary:
- Overall Progress Score: ${progressScore}/100
- Session Count: ${insights.length} insights generated

BASELINE METRICS:
- Average ROM: ${baselineMetrics.avgROM.toFixed(1)}°
- Balance Score: ${baselineMetrics.avgBalance.toFixed(1)}
- Symmetry Score: ${baselineMetrics.avgSymmetry.toFixed(1)}%
- Deficiencies: ${baselineMetrics.deficiencyCount}
- Tests Passed: ${baselineMetrics.passedTests}/${baselineMetrics.totalTests}

PREVIOUS SESSION:
- Average ROM: ${previousMetrics.avgROM.toFixed(1)}°
- Balance Score: ${previousMetrics.avgBalance.toFixed(1)}
- Symmetry Score: ${previousMetrics.avgSymmetry.toFixed(1)}%
- Deficiencies: ${previousMetrics.deficiencyCount}
- Tests Passed: ${previousMetrics.passedTests}/${previousMetrics.totalTests}

CURRENT SESSION:
- Average ROM: ${currentMetrics.avgROM.toFixed(1)}°
- Balance Score: ${currentMetrics.avgBalance.toFixed(1)}
- Symmetry Score: ${currentMetrics.avgSymmetry.toFixed(1)}%
- Deficiencies: ${currentMetrics.deficiencyCount}
- Tests Passed: ${currentMetrics.passedTests}/${currentMetrics.totalTests}

KEY INSIGHTS:
${insights.map(insight => `- ${insight.icon} ${insight.message}`).join('\n')}

Write a concise, professional progress narrative (3-4 sentences) that:
1. Summarizes overall progress trajectory
2. Highlights the most significant improvement or concern
3. Provides clinical interpretation
4. Recommends next steps

Use professional medical terminology but keep it accessible.`;

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
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                console.error('Unexpected Gemini API response:', data);
                return null;
            }
        } catch (error) {
            console.error('Error generating AI narrative:', error);
            return null;
        }
    }

    /**
     * Generate comparison charts data for visualization
     */
    generateChartData(baseline, previous, current) {
        return {
            labels: ['Baseline', 'Previous', 'Current'],
            datasets: {
                rom: {
                    label: 'Average ROM (degrees)',
                    data: [
                        baseline.metrics.avgROM,
                        previous.metrics.avgROM,
                        current.metrics.avgROM
                    ],
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)'
                },
                balance: {
                    label: 'Balance Score',
                    data: [
                        baseline.metrics.avgBalance,
                        previous.metrics.avgBalance,
                        current.metrics.avgBalance
                    ],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)'
                },
                symmetry: {
                    label: 'Symmetry Score (%)',
                    data: [
                        baseline.metrics.avgSymmetry,
                        previous.metrics.avgSymmetry,
                        current.metrics.avgSymmetry
                    ],
                    borderColor: '#F59E0B',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)'
                },
                deficiencies: {
                    label: 'Deficiency Count',
                    data: [
                        baseline.metrics.deficiencyCount,
                        previous.metrics.deficiencyCount,
                        current.metrics.deficiencyCount
                    ],
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)'
                }
            }
        };
    }

    /**
     * Format progress report for display
     */
    formatProgressReport(progressData) {
        const { baseline, previous, current, trends, insights, progressScore, aiNarrative, sessionCount, timespan } = progressData;
        
        let html = `
            <div class="progress-tracker-report">
                <!-- Header -->
                <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
                    <h2 class="text-2xl font-bold mb-2">
                        <i class="fas fa-chart-line mr-2"></i>
                        Progress Report
                    </h2>
                    <p class="text-blue-100">
                        ${sessionCount} sessions tracked over ${timespan}
                    </p>
                </div>

                <!-- Overall Progress Score -->
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h3 class="text-lg font-semibold mb-4">Overall Progress Score</h3>
                    <div class="flex items-center gap-4">
                        <div class="text-5xl font-bold ${this.getScoreColor(progressScore)}">${progressScore}</div>
                        <div class="flex-1">
                            <div class="w-full bg-gray-200 rounded-full h-4">
                                <div class="h-4 rounded-full ${this.getScoreBarColor(progressScore)}" 
                                     style="width: ${progressScore}%"></div>
                            </div>
                            <p class="text-sm text-gray-600 mt-2">${this.getScoreLabel(progressScore)}</p>
                        </div>
                    </div>
                </div>

                <!-- AI Narrative -->
                ${aiNarrative ? `
                <div class="bg-purple-50 border-l-4 border-purple-500 p-6 mb-6">
                    <h3 class="text-lg font-semibold mb-2 text-purple-900">
                        <i class="fas fa-brain mr-2"></i>
                        AI Clinical Interpretation
                    </h3>
                    <p class="text-gray-700 leading-relaxed">${aiNarrative}</p>
                </div>
                ` : ''}

                <!-- Key Insights -->
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h3 class="text-lg font-semibold mb-4">Key Insights</h3>
                    <div class="space-y-3">
                        ${insights.map(insight => `
                            <div class="flex items-start gap-3 p-3 rounded ${this.getInsightBgColor(insight.severity)}">
                                <span class="text-2xl">${insight.icon}</span>
                                <div class="flex-1">
                                    <div class="font-semibold text-sm text-gray-700">${insight.category}</div>
                                    <div class="text-gray-900">${insight.message}</div>
                                </div>
                                ${insight.priority === 'urgent' ? '<span class="px-2 py-1 bg-red-600 text-white text-xs rounded">URGENT</span>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Metrics Comparison Table -->
                <div class="bg-white p-6 rounded-lg shadow mb-6">
                    <h3 class="text-lg font-semibold mb-4">Metrics Comparison</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b">
                                    <th class="text-left py-2 px-4">Metric</th>
                                    <th class="text-center py-2 px-4">Baseline</th>
                                    <th class="text-center py-2 px-4">Previous</th>
                                    <th class="text-center py-2 px-4">Current</th>
                                    <th class="text-center py-2 px-4">Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.generateMetricRow('ROM (avg)', trends.rom, '°')}
                                ${this.generateMetricRow('Balance', trends.balance, ' pts')}
                                ${this.generateMetricRow('Symmetry', trends.symmetry, '%')}
                                ${this.generateMetricRow('Deficiencies', trends.deficiencyCount, '', true)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        return html;
    }

    generateMetricRow(label, trend, unit, lowerIsBetter = false) {
        const changeIcon = trend.direction === 'improving' ? '📈' : 
                          trend.direction === 'declining' ? '📉' : '➡️';
        const changeColor = trend.direction === 'improving' ? 'text-green-600' : 
                           trend.direction === 'declining' ? 'text-red-600' : 'text-gray-600';
        
        return `
            <tr class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 font-semibold">${label}</td>
                <td class="text-center py-3 px-4">${trend.baseline.toFixed(1)}${unit}</td>
                <td class="text-center py-3 px-4">${trend.previous.toFixed(1)}${unit}</td>
                <td class="text-center py-3 px-4">${trend.current.toFixed(1)}${unit}</td>
                <td class="text-center py-3 px-4 ${changeColor}">
                    ${changeIcon} ${trend.recentChange > 0 ? '+' : ''}${trend.recentChange.toFixed(1)}${unit}
                    <div class="text-xs">(${trend.recentPercentChange > 0 ? '+' : ''}${trend.recentPercentChange.toFixed(1)}%)</div>
                </td>
            </tr>
        `;
    }

    getScoreColor(score) {
        if (score >= 70) return 'text-green-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    }

    getScoreBarColor(score) {
        if (score >= 70) return 'bg-green-600';
        if (score >= 50) return 'bg-yellow-500';
        return 'bg-red-600';
    }

    getScoreLabel(score) {
        if (score >= 80) return 'Excellent Progress - Continue current treatment plan';
        if (score >= 70) return 'Good Progress - Patient responding well to therapy';
        if (score >= 50) return 'Moderate Progress - Consider adjusting treatment approach';
        if (score >= 30) return 'Limited Progress - Review treatment plan and patient compliance';
        return 'Regression Detected - Immediate clinical review recommended';
    }

    getInsightBgColor(severity) {
        switch (severity) {
            case 'positive': return 'bg-green-50 border-l-4 border-green-500';
            case 'warning': return 'bg-yellow-50 border-l-4 border-yellow-500';
            case 'alert': return 'bg-red-50 border-l-4 border-red-500';
            default: return 'bg-gray-50 border-l-4 border-gray-300';
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressTrackerAI;
}
