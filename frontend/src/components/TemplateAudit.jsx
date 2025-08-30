import React, { useState, useContext } from "react";
import { ThemeContext } from "../App";

const templates = [
    {
        title: "Investor Due Diligence",
        description: "Evaluate if a company is worth investing in.",
        icon: "💰",
        sections: [
            "Company Overview",
            "Market Opportunity",
            "Product & Technology",
            "Financial Health",
            "Team & Leadership",
            "Risks & Red Flags",
            "Recommendation",
        ],
    },
    {
        title: "Partnership Assessment",
        description: "Assess if a business is a good partner candidate.",
        icon: "🤝",
        sections: [
            "Company Fit",
            "Reputation & Credibility",
            "Product/Service Synergy",
            "Market Position",
            "Financial Stability",
            "Strategic Value",
            "Risks",
            "Recommendation",
        ],
    },
    {
        title: "Competitive Intelligence",
        description: "Understand competitor strengths and weaknesses.",
        icon: "⚔️",
        sections: [
            "Company Overview",
            "Product Portfolio",
            "Market Positioning",
            "Traffic & Growth Signals",
            "Strengths",
            "Weaknesses",
            "Opportunities & Threats",
            "Competitive Scorecard",
        ],
    },
    {
        title: "Compliance Review",
        description: "Check legal, ethical, and regulatory compliance.",
        icon: "📋",
        sections: [
            "Business Legitimacy",
            "Financial Compliance",
            "Labor & HR Compliance",
            "Data & Privacy",
            "Industry Standards",
            "Legal Red Flags",
            "Risk Level",
            "Recommendation",
        ],
    },
    {
        title: "Employment Research",
        description: "Help job seekers evaluate a potential employer.",
        icon: "💼",
        sections: [
            "Company Overview",
            "Workplace Culture",
            "Growth Opportunities",
            "Compensation & Benefits",
            "Leadership Reputation",
            "Diversity & Inclusion",
            "Job Security & Stability",
            "Candidate Fit",
        ],
    },
    {
        title: "Strategic Planning",
        description: "Guide executives in creating long-term strategies.",
        icon: "🎯",
        sections: [
            "Company Overview",
            "Market Trends",
            "Customer Insights",
            "SWOT Analysis",
            "Strategic Goals",
            "Execution Roadmap",
            "Risk Assessment",
            "Recommendations",
        ],
    },
];

const TemplateAudit = ({ onBack, onSelectTemplate }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showDevelopmentPopup, setShowDevelopmentPopup] = useState(false);
    const { theme } = useContext(ThemeContext);

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setShowDevelopmentPopup(true);
    };

    // Theme-based styling
    const isDark = theme === 'dark';
    const bgColor = isDark ? 'bg-[#242424]' : 'bg-gray-50';
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const secondaryTextColor = isDark ? 'text-gray-300' : 'text-gray-600';
    const cardBg = isDark ? 'bg-gray-900' : 'bg-white';
    const cardBorder = isDark ? 'border-gray-800' : 'border-gray-200';
    const cardHover = isDark ? 'hover:border-green-500/30' : 'hover:border-green-500/50';
    const shadow = isDark ? 'shadow-2xl shadow-black/50' : 'shadow-xl shadow-gray-200/50';
    const greenShadow = isDark ? 'hover:shadow-green-500/25' : 'hover:shadow-green-500/20';
    const headerBg = isDark ? 'bg-black/90' : 'bg-white/90';
    const headerBorder = isDark ? 'border-gray-800' : 'border-gray-200';
    const sectionBg = isDark ? 'bg-gray-800' : 'bg-gray-50';
    const sectionBorder = isDark ? 'border-gray-700' : 'border-gray-200';
    const itemBg = isDark ? 'bg-gray-700' : 'bg-white';
    const itemBorder = isDark ? 'border-gray-600' : 'border-gray-200';
    const itemHover = isDark ? 'hover:border-green-500/50' : 'hover:border-green-500/50';

    return (
        <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
            {/* Header */}
            <div className={`${headerBg} backdrop-blur-xl border-b ${headerBorder} sticky top-0 z-10`}>
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onBack}
                                className={`p-2 ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-xl transition-all duration-200`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h1 className={`text-2xl font-bold ${textColor}`}>Template-Based Audit</h1>
                                <p className={`${secondaryTextColor}`}>Choose from our professional audit templates</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h2 className={`text-4xl font-bold ${textColor} mb-4`}>Select Your Audit Template</h2>
                    <p className={`${secondaryTextColor} text-xl max-w-3xl mx-auto`}>
                        Choose from our expertly crafted templates designed for different business needs.
                        Hover over any template to see detailed sections.
                    </p>
                </div>

                {/* Templates Grid - Compact Cards with Hover Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template, idx) => (
                        <div
                            key={idx}
                            className="template-card relative transition-all duration-300"
                            style={{
                                animationDelay: `${idx * 100}ms`,
                                animation: 'fadeInUp 0.5s ease-out forwards'
                            }}
                        >
                            <div className={`${cardBg} rounded-2xl ${shadow} border ${cardBorder} transition-all duration-300 overflow-hidden h-full flex flex-col relative`}>
                                {/* Template Header - Compact */}
                                <div className={`${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-gray-100 to-gray-200'} p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-3xl">{template.icon}</div>
                                        <div className="flex-1">
                                            <h3 className={`text-lg font-bold ${textColor} leading-tight`}>{template.title}</h3>
                                            <p className={`${secondaryTextColor} text-xs mt-1 leading-tight`}>{template.description}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    {/* All Sections List */}
                                    <div className="mb-4 flex-1">
                                        <h5 className={`text-sm font-bold mb-3 text-center flex items-center justify-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            <span className="w-1.5 h-1.5 bg-[#00b894] rounded-full mr-2"></span>
                                            All Sections
                                            <span className="w-1.5 h-1.5 bg-[#00b894] rounded-full ml-2"></span>
                                        </h5>
                                        <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto">
                                            {template.sections.map((section, i) => (
                                                <div key={i} className={`flex items-center space-x-2 p-2 rounded-md border text-xs transition-colors duration-200 ${isDark
                                                    ? 'bg-gray-800/60 border-gray-700/50'
                                                    : 'bg-gray-200/60 border-gray-300/50'
                                                    }`}>
                                                    <div className="w-1.5 h-1.5 bg-[#00b894] rounded-full flex-shrink-0"></div>
                                                    <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{section}</span>
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

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <div className={`${cardBg} rounded-3xl p-8 ${shadow} border ${cardBorder}`}>
                        <h3 className={`text-2xl font-bold ${textColor} mb-4`}>Need a Custom Template?</h3>
                        <p className={`${secondaryTextColor} mb-6 max-w-2xl mx-auto`}>
                            Can't find the perfect template? Our custom audit option lets you build exactly what you need.
                        </p>
                        <button
                            onClick={onBack}
                            className={`px-8 py-4 ${isDark ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700' : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600'} text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border ${isDark ? 'border-gray-600' : 'border-gray-500'}`}
                        >
                            🛠️ Try Custom Audit Instead
                        </button>
                    </div>
                </div>
            </div>

            {/* Development Popup Modal */}
            {showDevelopmentPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${cardBg} rounded-3xl p-8 max-w-md w-full mx-4 ${shadow} border ${cardBorder}`}>
                        <div className="text-center">
                            {/* Icon */}
                            <div className="text-6xl mb-6">🚧</div>
                            
                            {/* Title */}
                            <h3 className={`text-2xl font-bold ${textColor} mb-4`}>
                                Still in Development
                            </h3>
                            
                            {/* Message */}
                            <p className={`${secondaryTextColor} mb-6 text-base leading-relaxed`}>
                                The template-based audit feature is currently being developed. 
                                In the meantime, you can use our custom audit option which is fully functional!
                            </p>
                            
                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => window.location.href = '/company-form'}
                                    className="px-6 py-3 bg-gradient-to-r from-[#00b894] to-[#00a085] text-white font-bold rounded-xl hover:from-[#00a085] hover:to-[#009874] transition-all duration-300 shadow-lg text-sm"
                                >
                                    🛠️ Use Custom Audit (Beta)
                                </button>
                                
                                <button
                                    onClick={() => setShowDevelopmentPopup(false)}
                                    className={`px-6 py-3 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${textColor} font-bold rounded-xl transition-all duration-300 text-sm`}
                                >
                                    Close
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
