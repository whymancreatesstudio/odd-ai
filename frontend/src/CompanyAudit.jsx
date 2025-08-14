import React, { useState, useEffect } from 'react';
import CRMAPI from './api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import companyManager from './services/companyManager';

const CompanyAudit = ({ companyData, crmData, onBackToCRM, onUpdateData, auditId = null }) => {
    const [audit, setAudit] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [error, setError] = useState(null);
    const [auditStatus, setAuditStatus] = useState('Draft');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        if (companyData && crmData) {
            // Check if we already have audit data for this company
            const existingCompany = companyManager.getCompany(companyData.companyName);
            if (existingCompany && existingCompany.auditData) {
                // Load existing audit data
                setAudit(existingCompany.auditData);
                setAuditStatus(existingCompany.auditData.auditMetadata?.status || 'Draft');
            } else {
                // No existing data, generate new audit
                generateAudit();
            }
        }
    }, [companyData?.companyName, crmData]); // Only regenerate when company name changes

    const generateAudit = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            const auditPrompt = `You are a senior marketing consultant conducting a comprehensive company audit. 

Generate a detailed audit report based on the following company data:

COMPANY FORM DATA:
${JSON.stringify(companyData, null, 2)}

CRM INSIGHTS:
${JSON.stringify(crmData, null, 2)}

Create a comprehensive audit with the following structure:

{
  "companyOverview": {
    "profile": "Quick profile summary from base company info",
    "industry": "Industry analysis and positioning",
    "location": "Geographic market analysis"
  },
  "fundingGrowthStage": {
    "fundingStatus": "Current funding stage and amount",
    "growthIndicators": "Revenue trends, hiring signals, expansion plans",
    "investmentReadiness": "Assessment of investment readiness"
  },
  "leadershipTeamStructure": {
    "decisionMakerProfile": "Key decision maker analysis",
    "outreachReadiness": "Best approach for outreach",
    "teamStructure": "Current team composition and gaps"
  },
  "marketingAgencyPresence": {
    "currentAgency": "Current agency relationships",
    "adSpendPatterns": "Advertising spend analysis",
    "marketingMaturity": "Overall marketing sophistication level"
  },
  "creativeStrategyGaps": {
    "croOpportunities": "Conversion rate optimization gaps",
    "messagingGaps": "Brand messaging and positioning issues",
    "contentCadence": "Content strategy and frequency analysis",
    "adFatigue": "Potential ad fatigue indicators",
    "landingAlignment": "Landing page and funnel alignment",
    "emailBasics": "Email marketing foundation assessment"
  },
  "industryOpportunities": {
    "formats": "Relevant content formats for their industry",
    "hooks": "Effective messaging hooks and angles",
    "platformShifts": "Emerging platform opportunities"
  },
  "competitiveBenchmark": {
    "topCompetitors": [
      {
        "name": "Competitor name",
        "socialCadence": "Social media posting frequency",
        "adVariants": "Number of ad variations",
        "siteSpeed": "Website performance assessment",
        "proofDensity": "Social proof and testimonials"
      }
    ],
    "competitiveAdvantage": "How they can differentiate"
  },
  "hiringTalentStrategy": {
    "growthStaffing": "Is growth being staffed effectively",
    "talentGaps": "Key talent needs and gaps",
    "hiringSignals": "Current hiring status and plans"
  },
  "immediateROIMoves": [
    {
      "action": "Specific action to take",
      "owner": "Who should own this",
      "steps": "Step-by-step implementation",
      "expectedLift": "Expected performance improvement",
      "metric": "How to measure success"
    }
  ],
  "auditSummary": {
    "executiveSummary": "Client-friendly summary for ClickUp",
    "priorityLevel": "High/Medium/Low priority client",
    "estimatedValue": "Potential client value estimate"
  },
  "auditMetadata": {
    "status": "Draft",
    "generatedDate": "${new Date().toISOString()}",
    "auditVersion": "1.0"
  }
}

Return ONLY valid JSON. No explanations or extra text.`;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    response_format: { type: "json_object" },
                    messages: [{ role: "user", content: auditPrompt }],
                    temperature: 0.1,
                    max_tokens: 3000
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            const auditData = JSON.parse(content);

            setAudit(auditData);
            setSnackbar({ open: true, message: '✅ Audit generated successfully!', severity: 'success' });

        } catch (error) {
            console.error('Error generating audit:', error);
            setError(`Failed to generate audit: ${error.message}`);
            setSnackbar({ open: true, message: `❌ Error: ${error.message}`, severity: 'error' });
        } finally {
            setIsGenerating(false);
        }
    };

    const enhanceAudit = async () => {
        if (!audit) return;

        setIsEnhancing(true);
        setError(null);

        try {
            const enhancePrompt = `You are a senior marketing consultant. Take this existing audit and make it MUCH deeper, more detailed, and more actionable.

EXISTING AUDIT:
${JSON.stringify(audit, null, 2)}

Enhance this audit by:
1. Adding 3-5 more specific, actionable recommendations
2. Including detailed implementation steps for each ROI move
3. Adding specific metrics and KPIs to track
4. Including industry-specific insights and benchmarks
5. Adding risk assessments and mitigation strategies
6. Including timeline estimates for each recommendation
7. Adding budget estimates where applicable
8. Including success case studies or examples

Make the audit significantly more comprehensive and actionable. Return ONLY the enhanced JSON structure.`;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    response_format: { type: "json_object" },
                    messages: [{ role: "user", content: enhancePrompt }],
                    temperature: 0.1,
                    max_tokens: 4000
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            const enhancedAudit = JSON.parse(content);

            setAudit(enhancedAudit);
            setSnackbar({ open: true, message: '🚀 Audit enhanced successfully!', severity: 'success' });

        } catch (error) {
            console.error('Error enhancing audit:', error);
            setError(`Failed to enhance audit: ${error.message}`);
            setSnackbar({ open: true, message: `❌ Error: ${error.message}`, severity: 'error' });
        } finally {
            setIsEnhancing(false);
        }
    };

    const saveAudit = async () => {
        if (!audit) return;

        try {
            // Save audit to database
            const response = await CRMAPI.saveAudit(companyData, crmData, audit, auditStatus);

            if (response.success) {
                // Save audit data to local storage
                companyManager.updateAuditData(companyData.companyName, audit);

                // If we have an update callback, call it
                if (onUpdateData) {
                    onUpdateData(audit);
                }

                setSnackbar({ open: true, message: '💾 Audit saved successfully!', severity: 'success' });
                // Update audit status
                setAuditStatus('Approved');
            } else {
                throw new Error(response.message || 'Failed to save audit');
            }
        } catch (error) {
            setSnackbar({ open: true, message: `❌ Error saving audit: ${error.message}`, severity: 'error' });
        }
    };

    const exportPDF = async () => {
        try {
            setSnackbar({
                open: true,
                message: 'Generating PDF...',
                severity: 'info'
            });

            // Get the audit content element
            const auditContent = document.getElementById('audit-content');
            if (!auditContent) {
                throw new Error('Audit content not found');
            }

            // Create a simplified version for PDF export to avoid CSS compatibility issues
            const pdfContent = auditContent.cloneNode(true);

            // Remove problematic CSS classes and simplify styling
            const allElements = pdfContent.querySelectorAll('*');
            allElements.forEach(element => {
                // Remove Tailwind classes that might cause issues
                element.className = element.className.replace(/bg-gradient-to-[^ ]*/g, '');
                element.className = element.className.replace(/from-[^ ]*/g, '');
                element.className = element.className.replace(/to-[^ ]*/g, '');

                // Add simple inline styles for PDF compatibility
                if (element.classList.contains('bg-white')) {
                    element.style.backgroundColor = '#ffffff';
                }
                if (element.classList.contains('bg-slate-50')) {
                    element.style.backgroundColor = '#f8fafc';
                }
                if (element.classList.contains('bg-emerald-50')) {
                    element.style.backgroundColor = '#ecfdf5';
                }
                if (element.classList.contains('bg-blue-50')) {
                    element.style.backgroundColor = '#eff6ff';
                }
                if (element.classList.contains('bg-amber-50')) {
                    element.style.backgroundColor = '#fffbeb';
                }
                if (element.classList.contains('bg-purple-50')) {
                    element.style.backgroundColor = '#faf5ff';
                }
                if (element.classList.contains('bg-indigo-50')) {
                    element.style.backgroundColor = '#eef2ff';
                }
                if (element.classList.contains('bg-rose-50')) {
                    element.style.backgroundColor = '#fff1f2';
                }
                if (element.classList.contains('bg-orange-50')) {
                    element.style.backgroundColor = '#fff7ed';
                }

                // Add border styles
                if (element.classList.contains('border-slate-200')) {
                    element.style.borderColor = '#e2e8f0';
                }
                if (element.classList.contains('border-amber-200')) {
                    element.style.borderColor = '#fcd34d';
                }

                // Add text colors
                if (element.classList.contains('text-slate-900')) {
                    element.style.color = '#0f172a';
                }
                if (element.classList.contains('text-slate-700')) {
                    element.style.color = '#334155';
                }
                if (element.classList.contains('text-slate-600')) {
                    element.style.color = '#475569';
                }
                if (element.classList.contains('text-slate-500')) {
                    element.style.color = '#64748b';
                }
                if (element.classList.contains('text-emerald-600')) {
                    element.style.color = '#059669';
                }
                if (element.classList.contains('text-blue-600')) {
                    element.style.color = '#2563eb';
                }
                if (element.classList.contains('text-amber-600')) {
                    element.style.color = '#d97706';
                }
                if (element.classList.contains('text-purple-600')) {
                    element.style.color = '#9333ea';
                }
                if (element.classList.contains('text-indigo-600')) {
                    element.style.color = '#4f46e5';
                }
                if (element.classList.contains('text-rose-600')) {
                    element.style.color = '#e11d48';
                }
            });

            // Temporarily append to body for html2canvas
            document.body.appendChild(pdfContent);
            pdfContent.style.position = 'absolute';
            pdfContent.style.left = '-9999px';
            pdfContent.style.top = '0';

            try {
                // Convert HTML to canvas
                const canvas = await html2canvas(pdfContent, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                });

                // Clean up
                document.body.removeChild(pdfContent);

                // Create PDF
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');

                const imgWidth = 210; // A4 width in mm
                const pageHeight = 295; // A4 height in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                // Add first page
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                // Add additional pages if content is longer than one page
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                // Generate filename
                const timestamp = new Date().toISOString().split('T')[0];
                const filename = `${companyData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_Audit_${timestamp}.pdf`;

                // Download PDF
                pdf.save(filename);

                setSnackbar({
                    open: true,
                    message: 'PDF exported successfully!',
                    severity: 'success'
                });

            } catch (error) {
                // Clean up on error
                if (document.body.contains(pdfContent)) {
                    document.body.removeChild(pdfContent);
                }
                throw error;
            }



        } catch (error) {
            console.error('PDF export error:', error);
            setSnackbar({
                open: true,
                message: 'PDF export failed. Please try again.',
                severity: 'error'
            });
        }
    };

    if (isGenerating) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Company Audit</h2>
                    <p className="text-gray-600">Analyzing company data and creating comprehensive insights...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error Generating Audit</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={generateAudit}
                        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                    >
                        🔄 Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!audit) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No Audit Data</h2>
                    <p className="text-gray-600 mb-4">Please wait while we generate your company audit...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Professional Header */}
                <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                    <div className="px-6 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-xl font-bold">A</span>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900">{companyData.companyName}</h1>
                                        <p className="text-slate-600 text-sm">Marketing Audit Report</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">Status</div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${auditStatus === 'Draft' ? 'bg-amber-100 text-amber-800' :
                                        auditStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                        {auditStatus}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">Generated</div>
                                    <div className="text-sm text-slate-900">{new Date(audit.auditMetadata?.generatedDate).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="bg-white border-b border-slate-200 px-6 py-3">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={onBackToCRM}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to CRM
                        </button>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={enhanceAudit}
                                disabled={isEnhancing}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 rounded-md transition-colors"
                            >
                                {isEnhancing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Enhancing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Enhance
                                    </>
                                )}
                            </button>

                            <button
                                onClick={generateAudit}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Regenerate Audit
                            </button>

                            <button
                                onClick={saveAudit}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                Save
                            </button>

                            <button
                                onClick={exportPDF}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                📄 Export PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* Audit Content */}
                <div id="audit-content" className="p-6 space-y-6">
                    {/* Executive Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Executive Summary</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-700 leading-relaxed">{audit.auditSummary?.executiveSummary}</p>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-slate-50 rounded-lg">
                                    <div className="text-2xl font-bold text-slate-900">{audit.auditSummary?.priorityLevel}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">Priority</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-lg">
                                    <div className="text-2xl font-bold text-slate-900">{audit.auditSummary?.estimatedValue}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">Value</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-lg">
                                    <div className="text-2xl font-bold text-slate-900">0-7 days</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">Quick Wins</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Overview */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-50 to-emerald-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Company Overview</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-slate-700">{audit.companyOverview?.profile}</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-emerald-50 rounded-lg">
                                    <div className="text-xs text-emerald-600 uppercase tracking-wide font-medium">Industry</div>
                                    <div className="text-sm text-slate-900 mt-1">{audit.companyOverview?.industry}</div>
                                </div>
                                <div className="p-3 bg-emerald-50 rounded-lg">
                                    <div className="text-xs text-emerald-600 uppercase tracking-wide font-medium">Location</div>
                                    <div className="text-sm text-slate-900 mt-1">{audit.companyOverview?.location}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Overview */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Financial Overview</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-slate-700">{audit.fundingGrowthStage?.fundingStatus}</p>
                            <p className="text-slate-700">{audit.fundingGrowthStage?.growthIndicators}</p>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="text-xs text-blue-600 uppercase tracking-wide font-medium">Investment Readiness</div>
                                <div className="text-sm text-slate-900 mt-1">{audit.fundingGrowthStage?.investmentReadiness}</div>
                            </div>
                        </div>
                    </div>

                    {/* Leadership & Team */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-50 to-amber-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Leadership & Team</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-slate-700">{audit.leadershipTeamStructure?.decisionMakerProfile}</p>
                            <p className="text-slate-700">{audit.leadershipTeamStructure?.outreachReadiness}</p>
                            <div className="p-3 bg-amber-50 rounded-lg">
                                <div className="text-xs text-amber-600 uppercase tracking-wide font-medium">Team Structure</div>
                                <div className="text-sm text-slate-900 mt-1">{audit.leadershipTeamStructure?.teamStructure}</div>
                            </div>
                        </div>
                    </div>

                    {/* Marketing & Agency */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-50 to-purple-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Marketing & Agency</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-slate-700">{audit.marketingAgencyPresence?.currentAgency}</p>
                            <p className="text-slate-700">{audit.marketingAgencyPresence?.adSpendPatterns}</p>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <div className="text-xs text-purple-600 uppercase tracking-wide font-medium">Marketing Maturity</div>
                                <div className="text-sm text-slate-900 mt-1">{audit.marketingAgencyPresence?.marketingMaturity}</div>
                            </div>
                        </div>
                    </div>

                    {/* Strategy Gaps */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-50 to-red-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Strategy & Creative Gaps</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">CRO Opportunities</h3>
                                        <p className="text-slate-600 text-sm">{audit.creativeStrategyGaps?.croOpportunities}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">Messaging Gaps</h3>
                                        <p className="text-slate-600 text-sm">{audit.creativeStrategyGaps?.messagingGaps}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">Content Strategy</h3>
                                        <p className="text-slate-600 text-sm">{audit.creativeStrategyGaps?.contentCadence}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">Ad Fatigue</h3>
                                        <p className="text-slate-600 text-sm">{audit.creativeStrategyGaps?.adFatigue}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">Landing Pages</h3>
                                        <p className="text-slate-600 text-sm">{audit.creativeStrategyGaps?.landingAlignment}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">Email Foundation</h3>
                                        <p className="text-slate-600 text-sm">{audit.creativeStrategyGaps?.emailBasics}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Industry Opportunities */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Industry Opportunities</h2>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="p-3 bg-indigo-50 rounded-lg">
                                <div className="text-xs text-indigo-600 uppercase tracking-wide font-medium">Content Formats</div>
                                <div className="text-sm text-slate-900 mt-1">{audit.industryOpportunities?.formats}</div>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-lg">
                                <div className="text-xs text-indigo-600 uppercase tracking-wide font-medium">Messaging Hooks</div>
                                <div className="text-sm text-slate-900 mt-1">{audit.industryOpportunities?.hooks}</div>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-lg">
                                <div className="text-xs text-indigo-600 uppercase tracking-wide font-medium">Platform Shifts</div>
                                <div className="text-sm text-slate-900 mt-1">{audit.industryOpportunities?.platformShifts}</div>
                            </div>
                        </div>
                    </div>

                    {/* Competitive Analysis */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-50 to-rose-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Competitive Analysis</h2>
                        </div>
                        <div className="p-6 space-y-3">
                            {audit.competitiveBenchmark?.topCompetitors?.map((competitor, index) => (
                                <div key={index} className="p-3 bg-rose-50 rounded-lg">
                                    <h4 className="text-sm font-semibold text-slate-900 mb-2">{competitor.name}</h4>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                                        <div>Social: {competitor.socialCadence}</div>
                                        <div>Ads: {competitor.adVariants}</div>
                                        <div>Speed: {competitor.siteSpeed}</div>
                                        <div>Proof: {competitor.proofDensity}</div>
                                    </div>
                                </div>
                            ))}
                            <div className="p-3 bg-rose-50 rounded-lg">
                                <div className="text-xs text-rose-600 uppercase tracking-wide font-medium">Competitive Advantage</div>
                                <div className="text-sm text-slate-900 mt-1">{audit.competitiveBenchmark?.competitiveAdvantage}</div>
                            </div>
                        </div>
                    </div>

                    {/* Hiring & Talent */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-50 to-emerald-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Hiring & Talent</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-slate-700">{audit.hiringTalentStrategy?.growthStaffing}</p>
                            <p className="text-slate-700">{audit.hiringTalentStrategy?.talentGaps}</p>
                            <div className="p-3 bg-emerald-50 rounded-lg">
                                <div className="text-xs text-emerald-600 uppercase tracking-wide font-medium">Hiring Signals</div>
                                <div className="text-sm text-slate-900 mt-1">{audit.hiringTalentStrategy?.hiringSignals}</div>
                            </div>
                        </div>
                    </div>

                    {/* Immediate ROI Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-50 to-amber-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Immediate ROI Actions</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {audit.immediateROIMoves?.map((move, index) => (
                                    <div key={index} className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                                        <h3 className="font-semibold text-slate-900 mb-3">{move.action}</h3>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="text-amber-600 font-medium">Owner:</span>
                                                <div className="text-slate-700">{move.owner}</div>
                                            </div>
                                            <div>
                                                <span className="text-amber-600 font-medium">Expected Lift:</span>
                                                <div className="text-slate-700">{move.expectedLift}</div>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-amber-600 font-medium">Steps:</span>
                                                <div className="text-slate-700 mt-1">{move.steps}</div>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-amber-600 font-medium">Metric:</span>
                                                <div className="text-slate-700 mt-1">{move.metric}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Snackbar */}
                {snackbar.open && (
                    <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${snackbar.severity === 'success' ? 'bg-green-500 text-white' :
                        snackbar.severity === 'error' ? 'bg-red-500 text-white' :
                            snackbar.severity === 'warning' ? 'bg-yellow-500 text-white' :
                                'bg-blue-500 text-white'
                        }`}>
                        {snackbar.message}
                        <button
                            onClick={() => setSnackbar({ ...snackbar, open: false })}
                            className="ml-4 text-white hover:text-gray-200"
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyAudit; 