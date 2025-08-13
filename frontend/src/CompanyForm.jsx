import React, { useState, useEffect } from 'react';
import CRMAPI from './api';
// Temporarily disabled MUI imports for testing
// import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material';
// import { Warning, CheckCircle, Info } from '@mui/icons-material';

const CompanyForm = ({ onShowCRM }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        website: '',
        socialMedia: {
            linkedin: '',
            instagram: '',
            youtube: '',
            x: '',
            facebook: ''
        },
        customSocials: [],
        industry: '',
        customIndustry: '',
        location: '',
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [industries, setIndustries] = useState([
        'D2C (Direct to Consumer)',
        'B2B (Business to Business)',
        'B2C (Business to Consumer)',
        'SaaS (Software as a Service)',
        'E-commerce',
        'Fintech',
        'Healthcare',
        'Education',
        'Real Estate',
        'Manufacturing',
        'Retail',
        'Food & Beverage',
        'Travel & Hospitality',
        'Entertainment',
        'Technology',
        'Consulting',
        'Marketing & Advertising',
        'Other'
    ]);

    // A utility function for common input styles
    const inputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200";

    // Load industries from localStorage or use defaults
    useEffect(() => {
        loadIndustries();
        loadSavedFormData();
    }, []);

    const loadIndustries = async () => {
        try {
            // For now, use the default industries
            // In the future, we can load from our backend API
            setIndustries(prev => [...new Set([...prev])]);
        } catch (error) {
            console.error('Error loading industries:', error);
            // Fallback to default industries
        }
    };

    // Load saved form data from localStorage
    const loadSavedFormData = () => {
        try {
            const saved = localStorage.getItem('oddToolCompanyFormData');
            if (saved) {
                const parsed = JSON.parse(saved);
                setFormData(prev => ({ ...prev, ...parsed }));
            }
        } catch (error) {
            console.error('Error loading saved form data:', error);
        }
    };

    // Save form data to localStorage
    const saveFormData = (data) => {
        try {
            localStorage.setItem('oddToolCompanyFormData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    };

    // Clear saved form data
    const clearSavedFormData = () => {
        try {
            localStorage.removeItem('oddToolCompanyFormData');
        } catch (error) {
            console.error('Error clearing saved form data:', error);
        }
    };

    // Clear form with confirmation
    const handleClearForm = () => {
        const hasData = Object.values(formData).some(value => {
            if (typeof value === 'string') return value.trim() !== '';
            if (Array.isArray(value)) return value.length > 0;
            if (typeof value === 'object') {
                return Object.values(value).some(v =>
                    typeof v === 'string' ? v.trim() !== '' : v !== null && v !== undefined
                );
            }
            return value !== null && value !== undefined;
        });

        if (hasData) {
            setShowClearConfirm(true);
        } else {
            setSnackbar({
                open: true,
                message: 'Form is already empty. Nothing to clear.',
                severity: 'info'
            });
        }
    };

    // Handle clear confirmation
    const handleClearConfirm = () => {
        setFormData({
            companyName: '',
            website: '',
            socialMedia: {
                linkedin: '',
                instagram: '',
                youtube: '',
                x: '',
                facebook: ''
            },
            customSocials: [],
            industry: '',
            customIndustry: '',
            location: '',
            notes: ''
        });
        clearSavedFormData();
        setSubmitMessage('');
        setShowClearConfirm(false);
        setSnackbar({
            open: true,
            message: 'Form data cleared successfully!',
            severity: 'success'
        });
    };

    // Close snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const sanitizeInput = (input) => {
        if (typeof input !== 'string') return '';
        // Remove potentially dangerous characters and scripts
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/<[^>]*>/g, '')
            .trim();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = sanitizeInput(value);

        setFormData(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));

        // Save to localStorage as user types
        const updatedData = { ...formData, [name]: sanitizedValue };
        saveFormData(updatedData);
    };

    const handleIndustryChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            industry: value,
            customIndustry: value === 'Other' ? prev.customIndustry : ''
        }));

        // Save to localStorage
        const updatedData = { ...formData, industry: value, customIndustry: value === 'Other' ? formData.customIndustry : '' };
        saveFormData(updatedData);
    };

    const handleSocialMediaChange = (platform, value) => {
        const sanitizedValue = sanitizeInput(value);
        setFormData(prev => ({
            ...prev,
            socialMedia: {
                ...prev.socialMedia,
                [platform]: sanitizedValue
            }
        }));

        // Save to localStorage
        const updatedData = {
            ...formData,
            socialMedia: {
                ...formData.socialMedia,
                [platform]: sanitizedValue
            }
        };
        saveFormData(updatedData);
    };

    const addCustomSocial = () => {
        const newSocial = { platform: '', url: '' };
        setFormData(prev => ({
            ...prev,
            customSocials: [...prev.customSocials, newSocial]
        }));

        // Save to localStorage
        const updatedData = { ...formData, customSocials: [...formData.customSocials, newSocial] };
        saveFormData(updatedData);
    };

    const removeCustomSocial = (index) => {
        setFormData(prev => ({
            ...prev,
            customSocials: prev.customSocials.filter((_, i) => i !== index)
        }));

        // Save to localStorage
        const updatedData = { ...formData, customSocials: formData.customSocials.filter((_, i) => i !== index) };
        saveFormData(updatedData);
    };

    const handleCustomSocialChange = (index, field, value) => {
        const sanitizedValue = sanitizeInput(value);
        setFormData(prev => ({
            ...prev,
            customSocials: prev.customSocials.map((social, i) =>
                i === index ? { ...social, [field]: sanitizedValue } : social
            )
        }));

        // Save to localStorage
        const updatedCustomSocials = formData.customSocials.map((social, i) =>
            i === index ? { ...social, [field]: sanitizedValue } : social
        );
        const updatedData = { ...formData, customSocials: updatedCustomSocials };
        saveFormData(updatedData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            // Security validation
            if (!formData.companyName || !formData.industry || !formData.location) {
                setSubmitMessage('Please fill in all required fields (Company Name, Industry, Location)');
                return;
            }

            // Additional security checks
            if (formData.companyName.length > 200 || formData.location.length > 200) {
                setSubmitMessage('Company name and location must be under 200 characters');
                return;
            }

            // Validate industry selection
            const validIndustries = industries.filter(item => item !== 'Other');
            if (!validIndustries.includes(formData.industry) && formData.industry !== 'Other') {
                setSubmitMessage('Please select a valid industry');
                return;
            }

            // Validate custom industry if "Other" is selected
            if (formData.industry === 'Other' && (!formData.customIndustry || formData.customIndustry.length > 100)) {
                setSubmitMessage('Custom industry must be provided and under 100 characters');
                return;
            }

            let finalIndustry = formData.industry;
            if (formData.industry === 'Other' && formData.customIndustry.trim()) {
                finalIndustry = formData.customIndustry.trim();

                // Add to local industries list (no database save yet)
                if (!industries.includes(finalIndustry)) {
                    setIndustries(prev => {
                        const withoutOther = prev.filter(item => item !== 'Other');
                        return [...withoutOther, finalIndustry, 'Other'];
                    });
                }
            }

            const companyData = {
                companyName: formData.companyName,
                website: formData.website || '',
                socialMedia: formData.socialMedia,
                customSocials: formData.customSocials,
                industry: finalIndustry,
                location: formData.location,
                notes: formData.notes || ''
            };

            // Save form data to localStorage before navigating
            saveFormData(formData);

            // Navigate to CRM Insights
            onShowCRM(companyData);
        } catch (error) {
            setSubmitMessage(`Error submitting form: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateCompanyDetails = async () => {
        // Check API key security
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (!apiKey || apiKey.length < 20) {
            setSnackbar({
                open: true,
                message: 'OpenAI API key is not properly configured. Please check your environment variables.',
                severity: 'warning'
            });
            return;
        }

        // Security validation
        if (!formData.website || !formData.website.trim()) {
            setSnackbar({
                open: true,
                message: 'Please enter a website URL',
                severity: 'warning'
            });
            return;
        }

        // Validate URL format and security
        let url;
        try {
            url = new URL(formData.website);
        } catch (e) {
            setSnackbar({
                open: true,
                message: 'Please enter a valid website URL',
                severity: 'warning'
            });
            return;
        }

        // Security checks
        if (!['http:', 'https:'].includes(url.protocol)) {
            setSnackbar({
                open: true,
                message: 'Only HTTP and HTTPS URLs are allowed',
                severity: 'warning'
            });
            return;
        }

        // Block potentially dangerous URLs
        const blockedDomains = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
        if (blockedDomains.some(domain => url.hostname.includes(domain))) {
            setSnackbar({
                open: true,
                message: 'Local and internal URLs are not allowed for security reasons',
                severity: 'warning'
            });
            return;
        }

        // Check for suspicious patterns
        if (url.hostname.includes('..') || url.hostname.includes('//')) {
            setSnackbar({
                open: true,
                message: 'Invalid URL format detected',
                severity: 'warning'
            });
            return;
        }
        setIsGenerating(true);
        setSubmitMessage('');

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "user",
                            content: `You are a JSON generator. Analyze the website ${formData.website} and return ONLY a valid JSON object.

CRITICAL: Start your response with { and end with }. No other text, no markdown, no explanations.

{
  "companyName": "Company name from website",
  "website": "${formData.website}",
  "industry": "Choose from: D2C (Direct to Consumer), B2B (Business to Business), B2C (Business to Consumer), SaaS (Software as a Service), E-commerce, Fintech, Healthcare, Education, Real Estate, Manufacturing, Retail, Food & Beverage, Travel & Hospitality, Entertainment, Technology, Consulting, Marketing & Advertising",
  "location": "City, State, Country",
  "linkedin": "Full LinkedIn URL if found",
  "instagram": "Full Instagram URL if found",
  "youtube": "Full YouTube URL if found",
  "x": "Full X (Twitter) URL if found",
  "facebook": "Full Facebook URL if found"
}

IMPORTANT: Return ONLY valid JSON. No other text.`
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;

            // Try to parse JSON from the response
            let parsedData;
            try {
                // Extract JSON if it's wrapped in markdown
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    parsedData = JSON.parse(jsonMatch[0]);
                } else {
                    parsedData = JSON.parse(content);
                }
            } catch (parseError) {
                throw new Error(`Failed to parse generated data: ${parseError.message}`);
            }

            // Update form with generated data
            setFormData(prev => ({
                ...prev,
                companyName: parsedData.companyName || prev.companyName,
                industry: parsedData.industry || prev.industry,
                location: parsedData.location || prev.location,
                socialMedia: {
                    ...prev.socialMedia,
                    linkedin: parsedData.linkedin || prev.socialMedia.linkedin,
                    instagram: parsedData.instagram || prev.socialMedia.instagram,
                    youtube: parsedData.youtube || prev.socialMedia.youtube,
                    x: parsedData.x || prev.socialMedia.x,
                    facebook: parsedData.facebook || prev.socialMedia.facebook
                }
            }));

            // Save updated data to localStorage
            const updatedData = {
                ...formData,
                companyName: parsedData.companyName || formData.companyName,
                industry: parsedData.industry || formData.industry,
                location: parsedData.location || formData.location,
                socialMedia: {
                    ...formData.socialMedia,
                    linkedin: parsedData.linkedin || formData.socialMedia.linkedin,
                    instagram: parsedData.instagram || formData.socialMedia.instagram,
                    youtube: parsedData.youtube || formData.socialMedia.youtube,
                    x: parsedData.x || formData.socialMedia.x,
                    facebook: parsedData.facebook || formData.socialMedia.facebook
                }
            };
            saveFormData(updatedData);

            setSubmitMessage('✅ Company details generated successfully!');
        } catch (error) {
            setSubmitMessage(`Error generating company details: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Details Form</h1>
                            <p className="text-gray-600">Fill in the company information to generate AI-powered CRM insights</p>
                        </div>
                        <button
                            onClick={handleClearForm}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                        >
                            🗑️ Clear Form
                        </button>
                    </div>

                    {submitMessage && (
                        <div className={`mb-6 p-4 rounded-md text-sm font-medium ${submitMessage.includes('Error') || submitMessage.includes('Failed')
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-green-50 text-green-700 border border-green-200'
                            }`}>
                            {submitMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                                <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} required className={inputStyles} placeholder="Enter your company name" />
                            </div>
                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                                <div className="flex gap-2">
                                    <input type="url" id="website" name="website" value={formData.website} onChange={handleInputChange} className={inputStyles} placeholder="https://example.com" />
                                    <button type="button" onClick={generateCompanyDetails} disabled={!formData.website || isGenerating} className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${!formData.website || isGenerating ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                                        {isGenerating ? 'Generating...' : '🤖 Generate with AI'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                                <select id="industry" name="industry" value={formData.industry} onChange={handleIndustryChange} required className={inputStyles}>
                                    <option value="">Select an industry</option>
                                    {industries.map((industry, index) => (<option key={index} value={industry}>{industry}</option>))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                                <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} required className={inputStyles} placeholder="City, State, Country" />
                            </div>
                        </div>

                        {formData.industry === 'Other' && (
                            <div>
                                <label htmlFor="customIndustry" className="block text-sm font-medium text-gray-700 mb-2">Specify Industry *</label>
                                <input type="text" id="customIndustry" name="customIndustry" value={formData.customIndustry} onChange={handleInputChange} required className={inputStyles} placeholder="Enter the industry name" />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Socials</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(formData.socialMedia).map(([platform, url]) => (
                                    <div key={platform}>
                                        <label htmlFor={platform} className="block text-xs text-gray-600 mb-1">{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                                        <input type="text" id={platform} value={url} onChange={(e) => handleSocialMediaChange(platform, e.target.value)} className={inputStyles} placeholder={`https://${platform}.com/...`} />
                                    </div>
                                ))}
                            </div>

                            {formData.customSocials.map((social, index) => (
                                <div key={index} className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-medium text-gray-700">Custom Social #{index + 1}</h4>
                                        <button type="button" onClick={() => removeCustomSocial(index)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Platform Name</label>
                                            <input type="text" value={social.platform} onChange={(e) => handleCustomSocialChange(index, 'platform', e.target.value)} className={inputStyles} placeholder="e.g., TikTok, Snapchat" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Handle/URL</label>
                                            <input type="text" value={social.url} onChange={(e) => handleCustomSocialChange(index, 'url', e.target.value)} className={inputStyles} placeholder="e.g., @company or URL" />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-3">
                                <button type="button" onClick={addCustomSocial} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                    + Add More Social Media
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                            <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows="4" className={inputStyles} placeholder="Any observations or additional notes about the company..." />
                        </div>

                        <div className="pt-4">
                            <button type="submit" disabled={isSubmitting} className={`w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                                {isSubmitting ? 'Processing...' : 'Continue to CRM Insights'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* MUI Components - Temporarily disabled for testing */}
                {/* 
                <React.Fragment>
                    {snackbar.open && (
                        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                                {snackbar.message}
                            </Alert>
                        </Snackbar>
                    )}

                    {showClearConfirm && (
                        <Dialog
                            open={showClearConfirm}
                            onClose={() => setShowClearConfirm(false)}
                            aria-labelledby="clear-form-dialog-title"
                            aria-describedby="clear-form-dialog-description"
                        >
                            <DialogTitle id="clear-form-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Warning color="warning" />
                                Clear Form Data
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="clear-form-dialog-description">
                                    <strong>⚠️ Are you sure you want to clear all form data?</strong>
                                    <br /><br />
                                    This will remove all entered information including:
                                    <br />• Company name and website
                                    <br />• Industry and location
                                    <br />• Social media links
                                    <br />• Custom social media
                                    <br />• Notes
                                    <br /><br />
                                    <strong>This action cannot be undone!</strong>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setShowClearConfirm(false)} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleClearConfirm} color="error" variant="contained" startIcon={<CheckCircle />}>
                                    Clear All Data
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )}
                </React.Fragment>
                */}

                {/* Temporary HTML alerts for testing */}
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

                {showClearConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold mb-4">⚠️ Clear Form Data</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to clear all form data? This action cannot be undone!
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowClearConfirm(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleClearConfirm}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Clear All Data
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyForm; 