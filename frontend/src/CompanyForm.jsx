import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

const CompanyForm = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        website: '',
        socialMedia: {
            linkedin: '',
            instagram: '',
            youtube: '',
            x: ''
        },
        customSocials: [],
        industry: '',
        customIndustry: '',
        location: '',
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
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

    // Load industries from Supabase on component mount
    useEffect(() => {
        loadIndustries();
    }, []);

    const loadIndustries = async () => {
        try {
            const { data, error } = await supabase
                .from('industries')
                .select('name')
                .order('name');

            if (error) throw error;

            if (data && data.length > 0) {
                const dbIndustries = data.map(item => item.name);
                // Merge with default industries, avoiding duplicates
                const allIndustries = [...new Set([...industries.slice(0, -1), ...dbIndustries, 'Other'])];
                setIndustries(allIndustries);
            }
        } catch (error) {
            console.error('Error loading industries:', error);
        }
    };

    const addNewIndustry = async (industryName) => {
        try {
            // Add to Supabase industries table
            const { error } = await supabase
                .from('industries')
                .insert([{ name: industryName }]);

            if (error) throw error;

            // Add to local state
            setIndustries(prev => {
                const withoutOther = prev.filter(item => item !== 'Other');
                return [...withoutOther, industryName, 'Other'];
            });

            return true;
        } catch (error) {
            console.error('Error adding industry:', error);
            return false;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleIndustryChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            industry: value,
            customIndustry: value === 'Other' ? prev.customIndustry : ''
        }));
    };

    const handleSocialMediaChange = (platform, value) => {
        setFormData(prev => ({
            ...prev,
            socialMedia: {
                ...prev.socialMedia,
                [platform]: value
            }
        }));
    };

    const addCustomSocial = () => {
        setFormData(prev => ({
            ...prev,
            customSocials: [...prev.customSocials, { platform: '', url: '' }]
        }));
    };

    const removeCustomSocial = (index) => {
        setFormData(prev => ({
            ...prev,
            customSocials: prev.customSocials.filter((_, i) => i !== index)
        }));
    };

    const handleCustomSocialChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            customSocials: prev.customSocials.map((social, i) =>
                i === index ? { ...social, [field]: value } : social
            )
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            // Determine final industry value
            let finalIndustry = formData.industry;
            if (formData.industry === 'Other' && formData.customIndustry.trim()) {
                finalIndustry = formData.customIndustry.trim();

                // Add new industry to database if it doesn't exist
                const success = await addNewIndustry(finalIndustry);
                if (!success) {
                    throw new Error('Failed to save new industry');
                }
            }

            // Prepare data for Supabase
            const companyData = {
                company_name: formData.companyName,
                website: formData.website || null,
                linkedin: formData.socialMedia.linkedin || null,
                instagram: formData.socialMedia.instagram || null,
                youtube: formData.socialMedia.youtube || null,
                x: formData.socialMedia.x || null,
                custom_socials: formData.customSocials.length > 0 ? formData.customSocials : null,
                industry: finalIndustry,
                location: formData.location,
                notes: formData.notes || null,
                created_at: new Date().toISOString()
            };

            // Insert data into Supabase
            const { data, error } = await supabase
                .from('companies')
                .insert([companyData])
                .select();

            if (error) {
                throw error;
            }

            setSubmitMessage('Company details saved successfully!');

            // Reset form
            setFormData({
                companyName: '',
                website: '',
                socialMedia: {
                    linkedin: '',
                    instagram: '',
                    youtube: '',
                    x: ''
                },
                customSocials: [],
                industry: '',
                customIndustry: '',
                location: '',
                notes: ''
            });

        } catch (error) {
            console.error('Error saving company:', error);
            setSubmitMessage(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Company Details
                    </h1>
                    <p className="text-gray-600">
                        Please provide your company information below
                    </p>
                </div>

                {/* Submit Message */}
                {submitMessage && (
                    <div className={`mb-6 p-4 rounded-md ${submitMessage.includes('Error')
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                        {submitMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Company Name */}
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name *
                        </label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your company name"
                        />
                    </div>

                    {/* Website */}
                    <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                            Website
                        </label>
                        <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://example.com"
                        />
                    </div>

                    {/* Industry */}
                    <div>
                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                            Industry *
                        </label>
                        <select
                            id="industry"
                            name="industry"
                            value={formData.industry}
                            onChange={handleIndustryChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select an industry</option>
                            {industries.map((industry, index) => (
                                <option key={index} value={industry}>
                                    {industry}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Custom Industry Input (shown when "Other" is selected) */}
                    {formData.industry === 'Other' && (
                        <div>
                            <label htmlFor="customIndustry" className="block text-sm font-medium text-gray-700 mb-2">
                                Specify Industry *
                            </label>
                            <input
                                type="text"
                                id="customIndustry"
                                name="customIndustry"
                                value={formData.customIndustry}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter the industry name"
                            />
                        </div>
                    )}

                    {/* Location */}
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                            Location *
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="City, State, Country"
                        />
                    </div>

                    {/* Socials Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Socials
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="linkedin" className="block text-xs text-gray-600 mb-1">
                                    LinkedIn
                                </label>
                                <input
                                    type="text"
                                    id="linkedin"
                                    value={formData.socialMedia.linkedin}
                                    onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="company-name"
                                />
                            </div>
                            <div>
                                <label htmlFor="instagram" className="block text-xs text-gray-600 mb-1">
                                    Instagram
                                </label>
                                <input
                                    type="text"
                                    id="instagram"
                                    value={formData.socialMedia.instagram}
                                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="@company"
                                />
                            </div>
                            <div>
                                <label htmlFor="youtube" className="block text-xs text-gray-600 mb-1">
                                    YouTube
                                </label>
                                <input
                                    type="text"
                                    id="youtube"
                                    value={formData.socialMedia.youtube}
                                    onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="channel-name"
                                />
                            </div>
                            <div>
                                <label htmlFor="x" className="block text-xs text-gray-600 mb-1">
                                    X (Twitter)
                                </label>
                                <input
                                    type="text"
                                    id="x"
                                    value={formData.socialMedia.x}
                                    onChange={(e) => handleSocialMediaChange('x', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="@company"
                                />
                            </div>
                        </div>

                        {/* Custom Social Media Links */}
                        {formData.customSocials.map((social, index) => (
                            <div key={index} className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-medium text-gray-700">Custom Social #{index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeCustomSocial(index)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">
                                            Platform Name
                                        </label>
                                        <input
                                            type="text"
                                            value={social.platform}
                                            onChange={(e) => handleCustomSocialChange(index, 'platform', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., TikTok, Snapchat"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">
                                            Handle/URL
                                        </label>
                                        <input
                                            type="text"
                                            value={social.url}
                                            onChange={(e) => handleCustomSocialChange(index, 'url', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., @company or URL"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add More Social Media Button */}
                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={addCustomSocial}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                + Add More Social Media
                            </button>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Any observations or additional notes about the company..."
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                                } text-white`}
                        >
                            {isSubmitting ? 'Saving...' : 'Submit Company Details'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanyForm; 