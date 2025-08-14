import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import CRMAPI from './api';
import companyManager from './services/companyManager';
// Temporarily disabled MUI imports for testing
// import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material';
// import { Warning, CheckCircle, Info } from '@mui/icons-material';

const CRMInsights = ({ companyData, onBackToForm, onShowAudit }) => {
    const [crmData, setCrmData] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [officialCompanyName, setOfficialCompanyName] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);

    const [showBackConfirm, setShowBackConfirm] = useState(false);
    const [showNameConfirm, setShowNameConfirm] = useState(false);
    const [nameConfirmData, setNameConfirmData] = useState({ userInput: '', officialName: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        if (companyData) {
            // Check if we already have CRM data for this company
            const existingCompany = companyManager.getCompany(companyData.companyName);
            if (existingCompany && existingCompany.crmData) {
                // Load existing CRM data
                setCrmData(existingCompany.crmData);
                setSearchResults(existingCompany.searchResults || null);
                setOfficialCompanyName(existingCompany.officialCompanyName || companyData.companyName);
            } else {
                // No existing data, run the pipeline
                runFullPipeline();
            }
        }
    }, [companyData?.companyName]); // Only regenerate when company name changes

    const runFullPipeline = async () => {
        if (!companyData) return;

        setIsGenerating(true);
        setError(null);

        try {
            // Step 1: Fetch website info and get official company name
            let websiteInfo = null;
            if (companyData.website) {
                try {
                    setIsSearching(true);
                    websiteInfo = await CRMAPI.fetchWebsiteInfo(companyData.website);
                    setOfficialCompanyName(websiteInfo.companyName);

                    // Ask user to confirm official company name if different
                    if (websiteInfo.companyName &&
                        websiteInfo.companyName.toLowerCase() !== companyData.companyName.toLowerCase()) {
                        setNameConfirmData({ userInput: companyData.companyName, officialName: websiteInfo.companyName });
                        setShowNameConfirm(true);
                    }
                } catch (error) {
                    // Continue without website info - we can still search by company name
                    setOfficialCompanyName(companyData.companyName);

                    // Show user-friendly error message
                    if (error.message.includes('blocking automated requests')) {
                        setError('Note: Website is blocking automated requests (this is normal for some sites). Continuing with company name search only.');
                    } else if (error.message.includes('Website not found')) {
                        setError('Note: Website not found. Continuing with company name search only.');
                    } else if (error.message.includes('server error')) {
                        setError('Note: Website server error. Continuing with company name search only.');
                    } else {
                        setError(`Note: Could not fetch website info. Continuing with company name search only.`);
                    }

                    // Clear the error after a few seconds to avoid confusion
                    setTimeout(() => {
                        setError(null);
                    }, 5000);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setOfficialCompanyName(companyData.companyName);
            }

            // Step 2: Run enhanced company search with live data
            const finalCompanyName = officialCompanyName || companyData.companyName;
            let enhancedSearchResults;

            try {
                enhancedSearchResults = await CRMAPI.searchCompanyEnhanced(finalCompanyName, companyData.website);
                setSearchResults(enhancedSearchResults);
            } catch (searchError) {
                // Create a basic fallback structure if search fails
                enhancedSearchResults = {
                    companyName: finalCompanyName,
                    website: companyData.website,
                    searchDate: new Date().toISOString(),
                    funding: { results: [] },
                    news: { results: [] },
                    jobs: { results: [] },
                    people: { results: [] },
                    company: { results: [] },
                    searchQuality: "Limited (fallback data)",
                    source: "fallback",
                    rawPerplexityData: {
                        funding: { totalFunding: "Unknown", lastRound: "Unknown", fundingRounds: "Unknown" },
                        revenue: { annualRevenue: "Unknown", revenueRange: "Unknown" },
                        people: { ceo: "Unknown", keyDecisionMaker: "Unknown", linkedinProfiles: [] },
                        hiring: { isHiring: "Unknown", openRoles: [], hiringSignals: "Unknown" },
                        agency: { currentAgency: "Unknown", agencyRelationship: "Unknown" },
                        news: { recentAnnouncements: [], companyUpdates: "Unknown" }
                    }
                };
                setSearchResults(enhancedSearchResults);
            }

            // Step 3: Generate AI insights using live data + form data
            const aiInsights = await generateAIInsights(enhancedSearchResults, finalCompanyName);
            setCrmData(aiInsights);

            // Clear any previous errors if we succeeded
            if (error && typeof error === 'string' && error.startsWith('Note:')) {
                setError(null);
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const generateAIInsights = async (searchResults, companyName) => {
        try {
            // Debug: Log the data being sent (only in development)
            if (import.meta.env.DEV) {
                console.log('Company Data:', companyData);
                console.log('Search Results:', searchResults);
            }

            // Validate data before sending
            if (!searchResults || !companyData) {
                throw new Error('Missing required data: searchResults or companyData is null/undefined');
            }

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    response_format: { type: "json_object" },
                    messages: [
                        {
                            role: "user",
                            content: `You are a senior business intelligence analyst specializing in comprehensive company research. Your task is to analyze the provided company data and Perplexity search results to generate PROFESSIONAL-GRADE CRM insights.

IMPORTANT: Use searchResults.rawPerplexityData as your PRIMARY source. If data is missing, use intelligent analysis and industry patterns to provide educated insights rather than "Unknown".

REQUIRED OUTPUT FORMAT (return as valid JSON):
{
    "estimatedFundingTotal": "Specific amount with currency and context (e.g., '$10M over 2 rounds', '₹50 crore through Series A', 'Not publicly disclosed')",
    "lastFundingRound": "Specific round with date and details (e.g., '$10M in 2024', 'Series B - June 2024', 'No recent funding')",
    "estimatedAnnualRevenue": "Specific range with currency and period (e.g., '$100M-$500M annually', '₹200-300 crore', 'Not publicly disclosed')",
    "adSpendLevel": "Low/Medium/High based on hiring signals, growth stage, and industry patterns with reasoning",
    "estimatedCreativeMarketingBudget": "Budget band: 'Under ₹1 lakh', '₹1-3 lakh', 'Over ₹3 lakh' based on company size, growth, and marketing approach",
    "primaryDecisionMaker": "Full name with role and context (e.g., 'John Smith, CEO', 'Founder & CEO', 'Not publicly identified')",
    "roleTitle": "Specific title with context (e.g., 'Founder & CEO', 'Chief Executive Officer', 'Not specified')",
    "linkedinProfile": "Full LinkedIn URL or 'Profile not found'",
    "email": "Exact email if found or 'Not publicly available'",
    "phone": "Exact phone if found or 'Not publicly available'",
    "currentAgency": "Specific agency name with relationship details or 'No agency partnership identified'",
    "whetherTheyreHiringForGrowth": "Yes/No with specific evidence and details (e.g., 'Yes - actively hiring for growth', 'No - stable team size')",
    "keyOpenRoles": "Specific marketing/content roles with details (e.g., 'Marketing Manager', 'Content Specialist', 'No specific marketing roles identified')",
    "leadScore": "Score 0-100 with detailed justification (e.g., '85 - Strong funding, clear decision maker, active hiring')",
    "tier": "Cold/Warm/Hot/Red-hot with reasoning and context"
}

QUALITY REQUIREMENTS:
- Provide SPECIFIC, ACTIONABLE insights with real data and evidence
- Use industry knowledge to fill gaps intelligently
- Format numbers with proper currency symbols and context
- Include specific details, dates, and evidence
- Make recommendations based on available data
- Structure output professionally like a business report
- If data is limited, provide educated analysis based on company stage and industry
- IMPORTANT: Return ONLY valid JSON format as specified above

Company Data: ${JSON.stringify(companyData, null, 2)}
Live Search Results: ${JSON.stringify(searchResults, null, 2)}

Generate comprehensive, professional, and actionable business intelligence insights in the exact JSON format specified above.`
                        }
                    ],
                    temperature: 0.3, // Balanced temperature for creativity and consistency
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Debug: Log OpenAI response (only in development)
            if (import.meta.env.DEV) {
                console.log('OpenAI API Response:', data);
            }

            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Invalid response format from OpenAI API');
            }

            const content = data.choices[0].message.content;

            // Debug: Log OpenAI content (only in development)
            if (import.meta.env.DEV) {
                console.log('OpenAI Content:', content);
            }

            try {
                return JSON.parse(content);
            } catch (parseError) {
                throw new Error('OpenAI returned invalid JSON format');
            }

        } catch (error) {
            throw new Error(`Failed to generate AI insights: ${error.message}`);
        }
    };

    const saveToDatabase = async () => {
        if (!crmData || !companyData || !searchResults) return;

        try {
            // Call the backend endpoint to save final results
            const response = await CRMAPI.saveFinalResults(
                companyData,           // Basic company data from form
                crmData,               // AI-generated CRM insights
                searchResults,         // Raw search data
                officialCompanyName,   // Official company name
                companyData.notes      // User notes
            );

            if (response.success) {
                // Save CRM data to local storage
                companyManager.updateCRMData(companyData.companyName, crmData);

                setSnackbar({
                    open: true,
                    message: 'Company and CRM insights saved successfully! Now generating audit...',
                    severity: 'success'
                });

                // Navigate to audit page after saving
                setTimeout(() => {
                    // Navigate to audit page using callback
                    if (onShowAudit) {
                        onShowAudit(companyData, crmData);
                    }
                }, 2000);
            } else {
                throw new Error(response.message || 'Failed to save data');
            }

        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error saving data: ' + error.message,
                severity: 'error'
            });
        }
    };

    // Handle going back to form with unsaved data warning
    const handleBackToForm = () => {
        if (crmData) {
            setShowBackConfirm(true);
        } else {
            onBackToForm();
        }
    };

    // Handle back confirmation
    const handleBackConfirm = () => {
        setShowBackConfirm(false);
        onBackToForm();
    };

    // Handle website name confirmation
    const handleNameConfirm = (confirmed) => {
        setShowNameConfirm(false);
        if (confirmed) {
            setOfficialCompanyName(nameConfirmData.officialName);
        }
    };

    // Close snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (isGenerating || isSearching) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {isSearching ? 'Gathering Live Data...' : 'Generating CRM Insights...'}
                    </h2>
                    <p className="text-gray-600">
                        {isSearching
                            ? 'Searching the web for company information, funding, news, and more...'
                            : 'Our AI is analyzing the company and generating business intelligence.'
                        }
                    </p>
                    {isSearching && (
                        <div className="mt-4 text-sm text-gray-500">
                            🔍 Searching: Funding • News • Jobs • Key People • Company Profile
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Generating CRM Insights</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-x-4">
                        <button onClick={runFullPipeline} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                            Try Again
                        </button>
                        <button onClick={onBackToForm} className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700">
                            Back to Form
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!crmData) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Demo Header */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 CRM Insights Preview</h1>
                            <p className="text-gray-600 mb-4">This is what your CRM insights will look like after entering company details</p>
                            <button
                                onClick={onBackToForm}
                                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                            >
                                ← Go to Company Form to Get Started
                            </button>
                        </div>
                    </div>

                    {/* Demo CRM Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Finance Overview */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">💰 Finance Overview</h2>
                            <div className="space-y-3">
                                <div className="bg-blue-50 p-3 rounded-md">
                                    <p className="text-sm text-blue-800"><strong>Estimated Funding Total:</strong> <span className="text-gray-500">Will show actual amount</span></p>
                                </div>
                                <div className="bg-green-50 p-3 rounded-md">
                                    <p className="text-sm text-green-800"><strong>Last Funding Round:</strong> <span className="text-gray-500">Will show round details</span></p>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-md">
                                    <p className="text-sm text-purple-800"><strong>Annual Revenue Range:</strong> <span className="text-gray-500">Will show revenue estimate</span></p>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded-md">
                                    <p className="text-sm text-yellow-800"><strong>Ad Spend Level:</strong> <span className="text-gray-500">Low/Medium/High</span></p>
                                </div>
                                <div className="bg-indigo-50 p-3 rounded-md">
                                    <p className="text-sm text-indigo-800"><strong>Creative Budget:</strong> <span className="text-gray-500">Will show budget band</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Key People */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">👥 Key People</h2>
                            <div className="space-y-3">
                                <div className="bg-blue-50 p-3 rounded-md">
                                    <p className="text-sm text-blue-800"><strong>Primary Decision Maker:</strong> <span className="text-gray-500">Will show name and role</span></p>
                                </div>
                                <div className="bg-green-50 p-3 rounded-md">
                                    <p className="text-sm text-green-800"><strong>LinkedIn Profile:</strong> <span className="text-gray-500">Will show profile link</span></p>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-md">
                                    <p className="text-sm text-purple-800"><strong>Email:</strong> <span className="text-gray-500">Will show if found</span></p>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded-md">
                                    <p className="text-sm text-yellow-800"><strong>Phone:</strong> <span className="text-gray-500">Will show if public</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Business Signals */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">📡 Business Signals</h2>
                            <div className="space-y-3">
                                <div className="bg-blue-50 p-3 rounded-md">
                                    <p className="text-sm text-blue-800"><strong>Current Agency:</strong> <span className="text-gray-500">Will show if any</span></p>
                                </div>
                                <div className="bg-green-50 p-3 rounded-md">
                                    <p className="text-sm text-green-800"><strong>Hiring for Growth:</strong> <span className="text-gray-500">Yes/No with details</span></p>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-md">
                                    <p className="text-sm text-purple-800"><strong>Key Open Roles:</strong> <span className="text-gray-500">Will show job positions</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Lead Scoring */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Lead Scoring</h2>
                            <div className="space-y-3">
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
                                    <p className="text-sm text-red-800"><strong>Lead Score:</strong> <span className="text-gray-500">0-100 (will calculate)</span></p>
                                </div>
                                <div className="bg-gradient-to-r from-yellow-50 to-green-50 p-4 rounded-lg border border-yellow-200">
                                    <p className="text-sm text-yellow-800"><strong>Tier:</strong> <span className="text-gray-500">Cold/Warm/Hot/Red-hot</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">🏢 Company Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="text-sm text-gray-800"><strong>Company Name:</strong> <span className="text-gray-500">Will show from form</span></p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="text-sm text-gray-800"><strong>Website:</strong> <span className="text-gray-500">Will show URL</span></p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="text-sm text-gray-800"><strong>Industry:</strong> <span className="text-gray-500">Will show from form</span></p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="text-sm text-gray-800"><strong>Location:</strong> <span className="text-gray-500">Will show from form</span></p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="text-sm text-gray-800"><strong>Social Media:</strong> <span className="text-gray-500">Will show handles</span></p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="text-sm text-gray-800"><strong>Notes:</strong> <span className="text-gray-500">Will show your observations</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6 lg:col-span-2">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">🚀 Next Steps</h2>
                            <div className="text-center space-y-4">
                                <p className="text-gray-700">Once you fill out the company form, you'll get:</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                                        <h3 className="font-semibold text-blue-800 mb-2">📊 Live Data</h3>
                                        <p className="text-sm text-gray-600">Real-time company information from web search</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-green-200">
                                        <h3 className="font-semibold text-green-800 mb-2">🤖 AI Insights</h3>
                                        <p className="text-sm text-gray-600">Intelligent analysis and recommendations</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-purple-200">
                                        <h3 className="font-semibold text-purple-800 mb-2">🔍 Full Audit</h3>
                                        <p className="text-sm text-gray-600">Comprehensive marketing audit report</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onBackToForm}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-medium text-lg"
                                >
                                    🚀 Start Your Company Analysis
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {officialCompanyName || companyData.companyName}
                            </h1>
                            <p className="text-gray-600 mt-2">{companyData.industry} • {companyData.location}</p>
                            {companyData.website && (
                                <p className="text-blue-600 mt-1">
                                    <a href={companyData.website} target="_blank" rel="noopener noreferrer">
                                        {companyData.website}
                                    </a>
                                </p>
                            )}
                            {officialCompanyName && officialCompanyName !== companyData.companyName && (
                                <p className="text-green-600 text-sm mt-1">
                                    ✅ Using official company name for enhanced results
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleBackToForm}
                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                        >
                            ← Back to Form
                        </button>
                    </div>
                </div>

                {/* CRM Insights Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Finance Overview */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            💰 Finance Overview
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Estimated Funding Total:</span>
                                <span className="font-medium">{crmData.estimatedFundingTotal || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Last Funding Round:</span>
                                <span className="font-medium">{crmData.lastFundingRound || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Annual Revenue:</span>
                                <span className="font-medium">{crmData.estimatedAnnualRevenue || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Ad Spend Level:</span>
                                <span className="font-medium">{crmData.adSpendLevel || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Marketing Budget:</span>
                                <span className="font-medium">{crmData.estimatedCreativeMarketingBudget || 'Unknown'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Key People */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            👥 Key People
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Decision Maker:</span>
                                <span className="font-medium">{crmData.primaryDecisionMaker || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Role/Title:</span>
                                <span className="font-medium">{crmData.roleTitle || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">LinkedIn:</span>
                                <span className="font-medium">
                                    {crmData.linkedinProfile ? (
                                        <a href={crmData.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            View Profile
                                        </a>
                                    ) : 'Unknown'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Email:</span>
                                <span className="font-medium">{crmData.email || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Phone:</span>
                                <span className="font-medium">{crmData.phone || 'Unknown'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Business Signals */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            📊 Business Signals
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Current Agency:</span>
                                <span className="font-medium">{crmData.currentAgency || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Hiring for Growth:</span>
                                <span className="font-medium">{crmData.whetherTheyreHiringForGrowth || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Marketing/Content Roles:</span>
                                <span className="font-medium max-w-xs text-right">
                                    {crmData.keyOpenRoles || 'Unknown'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Lead Scoring */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            🎯 Lead Scoring
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Lead Score:</span>
                                <span className="font-medium">{crmData.leadScore || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tier:</span>
                                <span className={`font-medium px-2 py-1 rounded-full text-sm ${crmData.tier === 'Red-hot' ? 'bg-red-100 text-red-800' :
                                    crmData.tier === 'Hot' ? 'bg-orange-100 text-orange-800' :
                                        crmData.tier === 'Warm' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {crmData.tier || 'Unknown'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    {/* Data status and actions */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center">
                            <div className="text-blue-600 text-xl mr-3">ℹ️</div>
                            <div className="text-left">
                                <h3 className="text-sm font-medium text-blue-800">CRM Data Status</h3>
                                <p className="text-sm text-blue-700 mt-1">
                                    {crmData ?
                                        "CRM insights are loaded from saved data. Use 'Regenerate Insights' for fresh data or 'Save and Begin Audit' to proceed." :
                                        "Generating CRM insights... Please wait."
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={runFullPipeline}
                            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
                        >
                            🔄 Regenerate Insights
                        </button>
                        <button
                            onClick={saveToDatabase}
                            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium"
                        >
                            💾 Save and Begin Audit
                        </button>
                    </div>
                </div>
            </div>

            {/* Temporary HTML alerts for testing - replacing MUI components */}
            {snackbar.open && (
                <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${snackbar.severity === 'success' ? 'bg-green-500 text-white' :
                    snackbar.severity === 'error' ? 'bg-red-500 text-white' :
                        snackbar.severity === 'warning' ? 'bg-yellow-500 text-white' :
                            'bg-blue-500 text-white'
                    }`}>
                    {snackbar.message}
                    <button onClick={handleCloseSnackbar} className="ml-2 text-white hover:text-gray-200">×</button>
                </div>
            )}

            {/* Back confirmation modal */}
            {showBackConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">⚠️ Warning: CRM Details Not Saved!</h3>
                        <p className="text-gray-600 mb-6">
                            You have generated CRM insights that haven't been saved to the database.
                            <br /><br />
                            If you go back now, you'll lose:
                            <br />• All AI-generated CRM insights
                            <br />• Live search results
                            <br />• Generated data
                            <br /><br />
                            <strong>Are you sure you want to go back without saving?</strong>
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setShowBackConfirm(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                                Cancel
                            </button>
                            <button onClick={handleBackConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Website name confirmation modal */}
            {showNameConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">ℹ️ Official Company Name Mismatch</h3>
                        <p className="text-gray-600 mb-6">
                            The official company name found on the website ("{nameConfirmData.officialName}") is different from the name you entered in the form ("{nameConfirmData.userInput}").
                            <br /><br />
                            <strong>Should we use the official name for better search results?</strong>
                            <br /><br />
                            If you choose "Yes", the official name will be used for the CRM insights.
                            <br />If you choose "No", the name you entered in the form will be used.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => handleNameConfirm(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                                No, use my input
                            </button>
                            <button onClick={() => handleNameConfirm(true)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                Yes, use official name
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CRMInsights;
