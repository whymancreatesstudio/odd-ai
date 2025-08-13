import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import CRMAPI from './api';
// Temporarily disabled MUI imports for testing
// import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material';
// import { Warning, CheckCircle, Info } from '@mui/icons-material';

const CRMInsights = ({ companyData, onBackToForm }) => {
    const [crmData, setCrmData] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [officialCompanyName, setOfficialCompanyName] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);
    const [showRawData, setShowRawData] = useState(false);
    const [showBackConfirm, setShowBackConfirm] = useState(false);
    const [showNameConfirm, setShowNameConfirm] = useState(false);
    const [nameConfirmData, setNameConfirmData] = useState({ userInput: '', officialName: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        if (companyData) {
            runFullPipeline();
        }
    }, [companyData]);

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
                    console.warn('Could not fetch website info:', error);
                    setOfficialCompanyName(companyData.companyName);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setOfficialCompanyName(companyData.companyName);
            }

            // Step 2: Run enhanced company search with live data
            const finalCompanyName = officialCompanyName || companyData.companyName;
            const enhancedSearchResults = await CRMAPI.searchCompanyEnhanced(finalCompanyName, companyData.website);
            setSearchResults(enhancedSearchResults);

            // Step 3: Generate AI insights using live data + form data
            const aiInsights = await generateAIInsights(enhancedSearchResults, finalCompanyName);
            setCrmData(aiInsights);

        } catch (error) {
            console.error('Error in full pipeline:', error);
            setError(error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const generateAIInsights = async (searchResults, companyName) => {
        try {
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
                            content: `You are a CRM data assistant. Analyze the company and generate CRM insights based ONLY on the provided information and live search results.

Generate the following fields using EXACT values from the search results. If no data is found in the provided searchResults JSON, return "Unknown". NEVER guess or make up information.

IMPORTANT: The searchResults contain data in this structure:
- funding.totalFunding, funding.lastRound, funding.fundingRounds
- revenue.annualRevenue, revenue.revenueRange  
- people.ceo, people.keyDecisionMaker
- hiring.isHiring, hiring.openRoles, hiring.hiringSignals
- agency.currentAgency
- news.recentAnnouncements

**CRITICAL: Use searchResults.rawPerplexityData for the most accurate mapping!**

Map these to the required fields:

{
    "estimatedFundingTotal": "Use searchResults.rawPerplexityData.funding.totalFunding or 'Unknown'",
    "lastFundingRound": "Use searchResults.rawPerplexityData.funding.lastRound or 'Unknown'",
    "estimatedAnnualRevenue": "Use searchResults.rawPerplexityData.revenue.annualRevenue or 'Unknown'",
    "adSpendLevel": "Use searchResults.rawPerplexityData.hiring.hiringSignals to estimate if they're spending on growth or 'Unknown'",
    "estimatedCreativeMarketingBudget": "Use searchResults.rawPerplexityData.hiring.hiringSignals to estimate if they're hiring marketing roles or 'Unknown'",
    "primaryDecisionMaker": "Use searchResults.rawPerplexityData.people.ceo or 'Unknown'",
    "roleTitle": "Use searchResults.rawPerplexityData.people.keyDecisionMaker or 'Unknown'",
    "linkedinProfile": "Use searchResults.rawPerplexityData.people.linkedinProfiles[0] or 'Unknown'",
    "email": "Exact email from searchResults or 'Unknown'",
    "phone": "Exact phone from searchResults or 'Unknown'",
    "currentAgency": "Use searchResults.rawPerplexityData.agency.currentAgency or 'Unknown'",
    "whetherTheyreHiringForGrowth": "Use searchResults.rawPerplexityData.hiring.isHiring or 'Unknown'",
    "keyOpenRoles": "Use searchResults.rawPerplexityData.hiring.openRoles (filter for marketing/content roles only) or 'Unknown'",
    "leadScore": "Score 0-100 based on available data quality",
    "tier": "Cold/Warm/Hot/Red-hot based on lead score"
}

Company Data:
${JSON.stringify(companyData, null, 2)}

Live Search Results:
${JSON.stringify(searchResults, null, 2)}

CRITICAL RULES:
- Use ONLY exact values from the provided searchResults JSON
- Map the nested fields correctly (e.g., funding.totalFunding → estimatedFundingTotal)
- If a field is not found in searchResults, return "Unknown"
- NEVER guess, estimate, or make up information
- NEVER use industry patterns or assumptions
- For keyOpenRoles: ONLY include marketing, content, creative, or digital marketing roles
- Filter out non-marketing jobs like engineers, developers, sales, HR, etc.
- Lead score and tier can be calculated based on data availability
- Output ONLY valid JSON matching the structure above`
                        }
                    ],
                    temperature: 0.1, // Very low temperature for consistency
                    max_tokens: 1500
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            return JSON.parse(content);

        } catch (error) {
            console.error('Error generating AI insights:', error);
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
                setSnackbar({
                    open: true,
                    message: 'Company and CRM insights saved successfully!',
                    severity: 'success'
                });
                setTimeout(() => onBackToForm(), 2000); // Go back after showing success message
            } else {
                throw new Error(response.message || 'Failed to save data');
            }

        } catch (error) {
            console.error('Error saving to database:', error);
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
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="text-yellow-500 text-6xl mb-4">⏳</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No CRM Data Available</h2>
                    <p className="text-gray-600 mb-6">CRM insights haven't been generated yet.</p>
                    <div className="space-x-4">
                        <button onClick={runFullPipeline} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                            Generate CRM Insights
                        </button>
                        <button onClick={onBackToForm} className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700">
                            Back to Form
                        </button>
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

                {/* Raw Search Data Section */}
                {searchResults && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                🔍 Raw Search Data
                            </h2>
                            <button
                                onClick={() => setShowRawData(!showRawData)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                {showRawData ? 'Hide Details' : 'Show Details'}
                            </button>
                        </div>

                        {showRawData && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border rounded-lg p-4">
                                        <h3 className="font-semibold text-green-600 mb-2">💰 Funding</h3>
                                        <pre className="text-xs text-gray-700 overflow-auto max-h-32">
                                            {JSON.stringify(searchResults.funding, null, 2)}
                                        </pre>
                                    </div>
                                    <div className="border rounded-lg p-4">
                                        <h3 className="font-semibold text-blue-600 mb-2">📰 News</h3>
                                        <pre className="text-xs text-gray-700 overflow-auto max-h-32">
                                            {JSON.stringify(searchResults.news, null, 2)}
                                        </pre>
                                    </div>
                                    <div className="border rounded-lg p-4">
                                        <h3 className="font-semibold text-purple-600 mb-2">💼 Jobs (Marketing Focus)</h3>
                                        <p className="text-xs text-purple-600 mb-2 italic">Filtered for marketing, content & creative roles</p>
                                        <pre className="text-xs text-gray-700 overflow-auto max-h-32">
                                            {JSON.stringify(searchResults.jobs, null, 2)}
                                        </pre>
                                    </div>
                                    <div className="border rounded-lg p-4">
                                        <h3 className="font-semibold text-orange-600 mb-2">👥 People</h3>
                                        <pre className="text-xs text-gray-700 overflow-auto max-h-32">
                                            {JSON.stringify(searchResults.people, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-semibold text-indigo-600 mb-2">🏢 Company Profile</h3>
                                    <pre className="text-xs text-gray-700 overflow-auto max-h-32">
                                        {JSON.stringify(searchResults.company, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    {/* Warning about unsaved data */}
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-center">
                            <div className="text-yellow-600 text-xl mr-3">⚠️</div>
                            <div className="text-left">
                                <h3 className="text-sm font-medium text-yellow-800">CRM Details Not Saved</h3>
                                <p className="text-sm text-yellow-700 mt-1">
                                    Your CRM insights are currently in preview mode. Click "Save to Database" to permanently store this data in Supabase.
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
                            💾 Save to Database
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
