import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../App';

const Plans = ({ onBack }) => {
    const { theme } = useContext(ThemeContext);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [billingCycle, setBillingCycle] = useState('monthly');

    // Theme-based styling
    const isDark = theme === 'dark';
    const bgColor = isDark ? 'bg-[#242424]' : 'bg-gray-50';
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const secondaryTextColor = isDark ? 'text-gray-300' : 'text-gray-600';
    const cardBg = isDark ? 'bg-gray-900' : 'bg-white';
    const cardBorder = isDark ? 'border-gray-800' : 'border-gray-200';
    const shadow = isDark ? 'shadow-2xl shadow-black/50' : 'shadow-xl shadow-gray-200/50';
    const headerBg = isDark ? 'bg-black/90' : 'bg-white/90';
    const headerBorder = isDark ? 'border-gray-800' : 'border-gray-200';

    const plans = [
        {
            name: 'Free',
            price: '₹0',
            period: 'forever',
            description: 'Perfect for trying out our tool',
            features: [
                'CRM only templates',
                '1 audit per day',
                'Basic AI insights',
                'PDF export (watermarked)',
                'Community support'
            ],
            limitations: [
                'Limited templates',
                'No charts & scorecards',
                'Cannot save audits',
                'No download option'
            ],
            buttonText: 'Get Started Free',
            buttonStyle: 'bg-gray-600 hover:bg-gray-700',
            popular: false
        },
        {
            name: 'Day Pass',
            price: '₹299',
            period: '24 hours',
            description: 'Perfect for one-time needs',
            features: [
                'All templates access',
                '3 audits in 24 hours',
                'Enhanced AI insights',
                'Charts & scorecards',
                'PDF + Word export',
                'Priority processing'
            ],
            limitations: [
                '24-hour time limit',
                'Cannot save audits',
                'No download option',
                'No team features'
            ],
            buttonText: 'Get Day Pass',
            buttonStyle: 'bg-blue-600 hover:bg-blue-700',
            popular: false
        },
        {
            name: 'Monthly',
            price: '₹799',
            period: 'per month',
            description: 'Professional business tool',
            features: [
                'All templates access',
                'Unlimited audits',
                'Premium AI insights',
                'Advanced charts & scorecards',
                'Save & download audits',
                'Comment & like system',
                'Multiple export formats',
                'Email support',
                'Audit history'
            ],
            limitations: [
                'No team collaboration',
                'No custom templates',
                'No white-label option'
            ],
            buttonText: 'Start Monthly',
            buttonStyle: 'bg-[#00b894] hover:bg-[#00a085]',
            popular: true
        },
        {
            name: 'Annual',
            price: '₹7,999',
            period: 'per year',
            description: 'Enterprise solution with team features',
            features: [
                'All templates access',
                'Unlimited audits',
                'Premium AI insights',
                'Advanced charts & scorecards',
                'Save & download audits',
                'Comment & like system',
                'Multiple export formats',
                'Priority phone support',
                'Team collaboration',
                'Custom template creation',
                'White-label reports',
                'API access',
                'Dedicated account manager'
            ],
            limitations: [],
            buttonText: 'Start Annual',
            buttonStyle: 'bg-purple-600 hover:bg-purple-700',
            popular: false,
            savings: 'Save ₹1,589'
        }
    ];

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        // Here you would typically redirect to payment or show payment modal
        console.log('Selected plan:', plan);
    };

    return (
        <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
            {/* Header */}
            <div className={`${headerBg} backdrop-blur-xl border-b ${headerBorder} sticky top-0 z-10`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
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
                                <h1 className={`text-2xl font-bold ${textColor}`}>Billing & Plans</h1>
                                <p className={`${secondaryTextColor}`}>Choose the perfect plan for your business needs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Hero Section */}
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className={`text-3xl sm:text-4xl font-bold ${textColor} mb-4 sm:mb-6`}>
                        Choose Your Plan
                    </h2>
                    <p className={`${secondaryTextColor} text-lg sm:text-xl max-w-3xl mx-auto px-4`}>
                        Start with our free tier and upgrade as you grow. All plans include our advanced AI-powered business intelligence.
                    </p>
                </div>

                {/* Billing Cycle Toggle */}
                <div className="flex justify-center mb-8">
                    <div className={`${cardBg} rounded-2xl p-1 border ${cardBorder} ${shadow}`}>
                        <div className="flex">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${billingCycle === 'monthly'
                                        ? 'bg-[#00b894] text-white shadow-lg'
                                        : `${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('annual')}
                                className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${billingCycle === 'annual'
                                        ? 'bg-[#00b894] text-white shadow-lg'
                                        : `${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                                    }`}
                            >
                                Annual
                                <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">Save 17%</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`${cardBg} rounded-3xl border ${cardBorder} ${shadow} transition-all duration-300 hover:shadow-2xl relative ${plan.popular ? 'ring-2 ring-[#00b894] ring-opacity-50' : ''
                                }`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-[#00b894] text-white px-4 py-1 rounded-full text-sm font-bold">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            {/* Savings Badge */}
                            {plan.savings && (
                                <div className="absolute -top-3 right-4">
                                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                                        {plan.savings}
                                    </span>
                                </div>
                            )}

                            <div className="p-6 sm:p-8">
                                {/* Plan Header */}
                                <div className="text-center mb-6">
                                    <h3 className={`text-xl sm:text-2xl font-bold ${textColor} mb-2`}>
                                        {plan.name}
                                    </h3>
                                    <div className="mb-2">
                                        <span className="text-3xl sm:text-4xl font-bold text-[#00b894]">
                                            {plan.price}
                                        </span>
                                        <span className={`text-sm ${secondaryTextColor} ml-1`}>
                                            {plan.period}
                                        </span>
                                    </div>
                                    <p className={`${secondaryTextColor} text-sm`}>
                                        {plan.description}
                                    </p>
                                </div>

                                {/* Features List */}
                                <div className="mb-6">
                                    <h4 className={`font-semibold ${textColor} mb-3 text-sm`}>✅ What's Included:</h4>
                                    <ul className="space-y-2">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className={`text-xs sm:text-sm ${secondaryTextColor} flex items-start`}>
                                                <span className="text-[#00b894] mr-2">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Limitations List */}
                                {plan.limitations.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className={`font-semibold ${textColor} mb-3 text-sm`}>❌ Limitations:</h4>
                                        <ul className="space-y-2">
                                            {plan.limitations.map((limitation, idx) => (
                                                <li key={idx} className={`text-xs sm:text-sm ${secondaryTextColor} flex items-start`}>
                                                    <span className="text-red-500 mr-2">✗</span>
                                                    {limitation}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Action Button */}
                                <button
                                    onClick={() => handlePlanSelect(plan)}
                                    className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 ${plan.buttonStyle} hover:shadow-lg transform hover:-translate-y-1`}
                                >
                                    {plan.buttonText}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className={`${cardBg} rounded-3xl p-6 sm:p-8 ${shadow} border ${cardBorder}`}>
                    <h3 className={`text-2xl font-bold ${textColor} mb-6 text-center`}>Frequently Asked Questions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className={`font-semibold ${textColor} mb-2`}>Can I change plans anytime?</h4>
                            <p className={`${secondaryTextColor} text-sm`}>Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                        </div>
                        <div>
                            <h4 className={`font-semibold ${textColor} mb-2`}>What payment methods do you accept?</h4>
                            <p className={`${secondaryTextColor} text-sm`}>We accept all major credit cards, UPI, and net banking. All payments are secure and encrypted.</p>
                        </div>
                        <div>
                            <h4 className={`font-semibold ${textColor} mb-2`}>Is there a free trial?</h4>
                            <p className={`${secondaryTextColor} text-sm`}>Yes! Our free tier gives you 1 audit per day with basic features to try out the tool.</p>
                        </div>
                        <div>
                            <h4 className={`font-semibold ${textColor} mb-2`}>Can I cancel anytime?</h4>
                            <p className={`${secondaryTextColor} text-sm`}>Absolutely! No long-term contracts. Cancel your subscription anytime with no questions asked.</p>
                        </div>
                    </div>
                </div>

                {/* Contact Support */}
                <div className="text-center mt-12">
                    <p className={`${secondaryTextColor} mb-4`}>Need help choosing a plan?</p>
                    <button className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-all duration-200">
                        💬 Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Plans;
