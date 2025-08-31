import React, { useState, useContext } from "react";
import { ThemeContext } from "../App";
import { getThemeStyles } from "../utils/theme";

const allTemplates = [
    // 6 Sections
    {
        title: "Customer Insights & Market Research",
        description: "Understand customers, target market, and positioning.",
        icon: "🛒",
        sections: [
            "Customer Demographics & Segments",
            "Buying Behavior & Trends",
            "Customer Satisfaction Signals (reviews, ratings)",
            "Brand Perception & Sentiment Analysis",
            "Market Opportunities & Gaps",
            "Competitive Positioning Analysis",
        ],
    },
    {
        title: "Technology & Innovation Audit",
        description: "For tech-driven companies where innovation matters.",
        icon: "💻",
        sections: [
            "Technology Stack Overview",
            "R&D & Innovation Investments",
            "Intellectual Property (patents, IP strategy basics)",
            "Digital Transformation Readiness",
            "Tech Adoption Trends in Industry",
            "Innovation Pipeline Assessment",
        ],
    },
    {
        title: "Operational & Supply Chain Audit",
        description: "For manufacturing, logistics, e-commerce, or global players.",
        icon: "⚙️",
        sections: [
            "Supply Chain Overview",
            "Key Suppliers & Dependencies",
            "Production & Operational Efficiency",
            "Risk Factors (delays, shortages, geopolitical)",
            "Sustainability & Environmental Impact",
            "Cost Optimization Opportunities",
        ],
    },
    {
        title: "Sales & Marketing Effectiveness",
        description: "For businesses where GTM and growth strategy are critical.",
        icon: "📈",
        sections: [
            "Sales Channels & Effectiveness",
            "Marketing Strategy Overview",
            "Customer Acquisition Cost (CAC) basics",
            "Retention & Churn Trends",
            "Brand Visibility & Market Share Signals",
            "ROI & Performance Metrics",
        ],
    },
    {
        title: "Sustainability & ESG Review",
        description: "Increasingly important for investors, regulators, and public companies.",
        icon: "🌱",
        sections: [
            "Environmental Impact (carbon, waste, energy use)",
            "Social Responsibility (employees, communities)",
            "Governance Practices (board, transparency)",
            "ESG Risk & Compliance Status",
            "ESG Ratings (if available)",
            "Sustainability Strategy & Goals",
        ],
    },
    {
        title: "Investor Due Diligence",
        description: "Evaluate if a company is worth investing in.",
        icon: "💰",
        sections: [
            "Executive Summary (key highlights + risks)",
            "Market Size & Opportunity",
            "Financial Health & Key Metrics",
            "Team Background & Leadership",
            "Competitive Landscape",
            "Risk Assessment",
        ],
    },
    // 7 Sections
    {
        title: "Partnership Assessment",
        description: "Assess if a business is a good partner candidate.",
        icon: "🤝",
        sections: [
            "Executive Summary",
            "Company Fit & Synergy",
            "Market Position & Reputation",
            "Financial Stability",
            "Strategic Value of Partnership",
            "Risks & Potential Challenges",
            "Partnership Roadmap & Timeline",
        ],
    },
    {
        title: "Competitive Intelligence",
        description: "Understand competitor strengths and weaknesses.",
        icon: "⚔️",
        sections: [
            "Company Overview",
            "Product/Service Portfolio",
            "Market Positioning",
            "Growth Signals & Trends",
            "Strengths & Weaknesses",
            "Opportunities & Threats (SWOT)",
            "Competitive Scorecard & Metrics",
        ],
    },
    {
        title: "Compliance Review",
        description: "Check legal, ethical, and regulatory compliance.",
        icon: "📋",
        sections: [
            "Executive Summary",
            "Business Legitimacy (registration, ownership)",
            "Financial & Tax Compliance (basic)",
            "Labor & HR Compliance (basic workforce checks)",
            "Data Privacy & Security Compliance",
            "Legal Red Flags & Risk Level",
            "Compliance Monitoring & Reporting",
        ],
    },
    {
        title: "Employment Research",
        description: "Help job seekers evaluate a potential employer.",
        icon: "💼",
        sections: [
            "Company Overview",
            "Workplace Culture & Values",
            "Compensation & Benefits (basic range)",
            "Leadership Reputation",
            "Diversity & Inclusion Snapshot",
            "Job Security & Growth Stability",
            "Employee Satisfaction & Reviews",
        ],
    },
    // 8 Sections
    {
        title: "Strategic Planning",
        description: "Guide executives in creating long-term strategies.",
        icon: "🎯",
        sections: [
            "Executive Summary",
            "Company Overview",
            "Market Trends & Opportunities",
            "Customer Insights",
            "SWOT Analysis",
            "Strategic Goals & Roadmap (high-level)",
            "Risk Assessment & Recommendations",
            "Implementation & Success Metrics",
        ],
    },
];

// Current 6 templates for main display
const templates = allTemplates.slice(0, 6);

const TemplateAudit = ({ onBack, onSelectTemplate }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [showAllTemplates, setShowAllTemplates] = useState(false);
    const [companyUrl, setCompanyUrl] = useState('');
    const [urlError, setUrlError] = useState('');
    const { theme } = useContext(ThemeContext);

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setShowUrlInput(true);
    };

    const validateUrl = (url) => {
        // Basic URL validation
        const urlPattern = /^https?:\/\/.+/;

        if (!url.trim()) {
            return 'Please enter a company website URL';
        }

        if (!urlPattern.test(url)) {
            return 'Please enter a valid URL starting with http:// or https://';
        }

        // Check if it's a valid domain format
        try {
            const urlObj = new URL(url);
            if (!urlObj.hostname || urlObj.hostname.length < 3) {
                return 'Please enter a valid domain name';
            }
            return '';
        } catch (error) {
            return 'Please enter a valid URL format';
        }
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setCompanyUrl(url);
        setUrlError(''); // Clear error when user types
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && companyUrl.trim() && !urlError) {
            handleGenerateAudit();
        }
    };

    const handleGenerateAudit = () => {
        const error = validateUrl(companyUrl);
        if (error) {
            setUrlError(error);
            return;
        }

        // URL is valid, proceed with audit generation
        console.log(`Generating ${selectedTemplate.title} audit for: ${companyUrl}`);
        // For now, redirect to company form with the URL
        window.location.href = `/company-form?url=${encodeURIComponent(companyUrl)}`;
    };

    // Theme-based styling
    const themeStyles = getThemeStyles(theme);

    return (
        <div className={`min-h-screen ${themeStyles.bgColor} ${themeStyles.textColor} transition-colors duration-300`}>
            {/* Header */}
            <div className={`${themeStyles.headerBg} backdrop-blur-xl border-b ${themeStyles.headerBorder} sticky top-0 z-10`}>
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onBack}
                                className={`p-2 ${themeStyles.isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-xl transition-all duration-200`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h1 className={`text-2xl font-bold ${themeStyles.textColor}`}>Template-Based Audit</h1>
                                <p className={`${themeStyles.secondaryTextColor}`}>Choose from our professional audit templates</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h2 className={`text-4xl font-bold ${themeStyles.textColor} mb-4`}>Select Your Audit Template</h2>
                    <p className={`${themeStyles.secondaryTextColor} text-xl max-w-3xl mx-auto`}>
                        Choose from our expertly crafted templates designed for different business needs.
                        Hover over any template to see detailed sections.
                    </p>
                </div>

                {/* Templates Grid - Compact Cards with Hover Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(showAllTemplates ? allTemplates : templates).map((template, idx) => (
                        <div
                            key={idx}
                            className="template-card relative transition-all duration-300"
                            style={{
                                animationDelay: `${idx * 100}ms`,
                                animation: 'fadeInUp 0.5s ease-out forwards'
                            }}
                        >
                            <div className={`${themeStyles.cardBg} rounded-2xl ${themeStyles.shadow} border ${themeStyles.cardBorder} transition-all duration-300 overflow-hidden h-full flex flex-col relative`}>
                                {/* Template Header - Compact */}
                                <div className={`${themeStyles.headerGradient} p-4 border-b ${themeStyles.sectionBorder}`}>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-3xl">{template.icon}</div>
                                        <div className="flex-1">
                                            <h3 className={`text-lg font-bold ${themeStyles.textColor} leading-tight`}>{template.title}</h3>
                                            <p className={`${themeStyles.secondaryTextColor} text-xs mt-1 leading-tight`}>{template.description}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    {/* All Sections List */}
                                    <div className="mb-4 flex-1">
                                        <h5 className={`text-sm font-bold mb-3 text-center flex items-center justify-center ${themeStyles.isDark ? 'text-white' : 'text-gray-900'}`}>
                                            <span className="w-1.5 h-1.5 bg-[#00b894] rounded-full mr-2"></span>
                                            All Sections ({template.sections.length})
                                            <span className="w-1.5 h-1.5 bg-[#00b894] rounded-full ml-2"></span>
                                        </h5>
                                        <div className="grid grid-cols-1 gap-1.5">
                                            {template.sections.map((section, i) => (
                                                <div key={i} className={`flex items-center space-x-2 p-2 rounded-md border text-xs transition-colors duration-200 ${themeStyles.sectionItemBg} ${themeStyles.sectionItemBorder}`}>
                                                    <div className="w-1.5 h-1.5 bg-[#00b894] rounded-full flex-shrink-0"></div>
                                                    <span className={`font-medium ${themeStyles.isDark ? 'text-gray-200' : 'text-gray-700'}`}>{section}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Generate Button */}
                                    <button
                                        onClick={() => handleTemplateSelect(template)}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-[#00b894] to-[#00a085] text-white font-bold rounded-xl hover:from-[#00a085] hover:to-[#009874] transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg text-sm"
                                    >
                                        <span>⚡ Generate Audit</span>
                                        {selectedTemplate === template && (
                                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center animate-pulse">
                                                <svg className="w-2.5 h-2.5 text-[#00b894]" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                </div>


                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Templates Toggle */}
                <div className="text-center mt-12">
                    <div className={`${themeStyles.cardBg} rounded-2xl p-6 ${themeStyles.shadow} border ${themeStyles.cardBorder}`}>
                        <h3 className={`text-xl font-bold ${themeStyles.textColor} mb-3`}>Need More Template Options?</h3>
                        <p className={`${themeStyles.secondaryTextColor} mb-4 max-w-2xl mx-auto`}>
                            We have 11 professional audit templates covering all business needs.
                            Click below to see all templates including Technology, Operations, Sales & more.
                        </p>
                        <button
                            onClick={() => setShowAllTemplates(!showAllTemplates)}
                            className={`px-6 py-3 bg-gradient-to-r from-[#00b894] to-[#00a085] text-white font-bold rounded-xl hover:from-[#00a085] hover:to-[#009874] transition-all duration-300 shadow-lg text-sm`}
                        >
                            {showAllTemplates ? '🔽 Show Only 6 Templates' : '🔍 Show All 11 Templates'}
                        </button>
                    </div>
                </div>




                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <div className={`${themeStyles.cardBg} rounded-3xl p-8 ${themeStyles.shadow} border ${themeStyles.cardBorder}`}>
                        <h3 className={`text-2xl font-bold ${themeStyles.textColor} mb-4`}>Need a Custom Template?</h3>
                        <p className={`${themeStyles.secondaryTextColor} mb-6 max-w-2xl mx-auto`}>
                            Can't find the perfect template? Our custom audit option lets you build exactly what you need.
                        </p>
                        {/* Custom Audit Button */}
                        <button
                            onClick={onBack}
                            className="inline-flex items-center px-6 py-3 mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-bold rounded-full shadow-lg animate-pulse transition-all duration-300"
                        >
                            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></span>
                            🚀 CUSTOM AUDIT - BUILD YOUR OWN
                        </button>
                    </div>
                </div>
            </div>

            {/* URL Input Modal */}
            {showUrlInput && selectedTemplate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${themeStyles.cardBg} rounded-3xl p-8 max-w-md w-full mx-4 ${themeStyles.shadow} border ${themeStyles.cardBorder}`}>
                        <div className="text-center">
                            {/* Icon */}
                            <div className="text-4xl mb-4">{selectedTemplate.icon}</div>

                            {/* Title */}
                            <h3 className={`text-2xl font-bold ${themeStyles.textColor} mb-2`}>
                                {selectedTemplate.title}
                            </h3>

                            {/* Message */}
                            <p className={`${themeStyles.secondaryTextColor} mb-6 text-base leading-relaxed`}>
                                Enter the company website URL to generate your {selectedTemplate.title.toLowerCase()} audit
                            </p>

                            {/* URL Input */}
                            <div className="mb-6">
                                <input
                                    type="url"
                                    value={companyUrl}
                                    onChange={handleUrlChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="https://example.com"
                                    className={`w-full px-4 py-3 border ${themeStyles.inputBorder} ${themeStyles.inputBg} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b894] focus:border-transparent transition-all duration-200 ${themeStyles.textColor}`}
                                />
                                {urlError && (
                                    <p className={`text-red-500 text-sm mt-2 text-left`}>
                                        ⚠️ {urlError}
                                    </p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={handleGenerateAudit}
                                    disabled={!companyUrl.trim() || urlError}
                                    className={`px-6 py-3 font-bold rounded-xl transition-all duration-300 shadow-lg text-sm ${companyUrl.trim() && !urlError
                                        ? 'bg-gradient-to-r from-[#00b894] to-[#00a085] text-white hover:from-[#00a085] hover:to-[#009874]'
                                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        }`}
                                >
                                    ⚡ Generate Audit
                                </button>

                                <button
                                    onClick={() => {
                                        setShowUrlInput(false);
                                        setCompanyUrl('');
                                        setUrlError('');
                                        setSelectedTemplate(null);
                                    }}
                                    className={`px-6 py-3 ${themeStyles.buttonSecondary} ${themeStyles.textColor} font-bold rounded-xl transition-all duration-300 text-sm`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}



            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .template-card:nth-child(1) { animation-delay: 0ms; }
                .template-card:nth-child(2) { animation-delay: 100ms; }
                .template-card:nth-child(3) { animation-delay: 200ms; }
                .template-card:nth-child(4) { animation-delay: 300ms; }
                .template-card:nth-child(5) { animation-delay: 400ms; }
                .template-card:nth-child(6) { animation-delay: 500ms; }


            `}</style>
        </div>
    );
};

export default TemplateAudit;
