import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';

const SettingsPage = () => {
    const { theme } = useContext(ThemeContext);
    const [activeTab, setActiveTab] = useState('profile');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const mobileMenuRef = useRef(null);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    // Theme-based styling
    const isDark = theme === 'dark';
    const bgColor = isDark ? 'bg-[#242424]' : 'bg-gray-50';
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const secondaryTextColor = isDark ? 'text-gray-300' : 'text-gray-600';
    const cardBg = isDark ? 'bg-gray-900' : 'bg-white';
    const cardBorder = isDark ? 'border-gray-800' : 'border-gray-200';
    const shadow = isDark ? 'shadow-2xl shadow-black/50' : 'shadow-xl shadow-gray-200/50';
    const sidebarBg = isDark ? 'bg-gray-800' : 'bg-white';
    const sidebarBorder = isDark ? 'border-gray-700' : 'border-gray-200';

    const tabs = [
        { id: 'profile', name: 'Profile Settings', icon: '👤' },
        { id: 'billing', name: 'Billing & Plans', icon: '💳' },
        { id: 'privacy', name: 'Privacy', icon: '🔒' },
        { id: 'notifications', name: 'Notifications', icon: '🔔' },
        { id: 'integrations', name: 'Integrations', icon: '🔗' },
        { id: 'security', name: 'Security', icon: '🛡️' },
        { id: 'help', name: 'Help Center', icon: '❓' },
        { id: 'plans-comparison', name: 'Plans Comparison', icon: '📊' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Profile Settings</h2>
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    defaultValue="John Doe"
                                    className={`w-full px-4 py-3 rounded-xl border ${cardBorder} ${bgColor} ${textColor} focus:border-[#00b894] focus:outline-none transition-colors`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    defaultValue="john.doe@company.com"
                                    className={`w-full px-4 py-3 rounded-xl border ${cardBorder} ${bgColor} ${textColor} focus:border-[#00b894] focus:outline-none transition-colors`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                                    Bio
                                </label>
                                <textarea
                                    rows={4}
                                    defaultValue="Business analyst and technology enthusiast with 5+ years of experience in market research and competitive intelligence."
                                    className={`w-full px-4 py-3 rounded-xl border ${cardBorder} ${bgColor} ${textColor} focus:border-[#00b894] focus:outline-none transition-colors`}
                                />
                            </div>
                            <button className="px-6 py-3 bg-[#00b894] hover:bg-[#00a085] text-white font-medium rounded-xl transition-all duration-200">
                                Save Changes
                            </button>
                        </div>
                    </div>
                );

            case 'billing':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <h2 className="text-xl sm:text-2xl font-bold">Billing & Plans</h2>
                            <button
                                onClick={() => setActiveTab('plans-comparison')}
                                className="px-3 sm:px-4 py-2 bg-[#00b894] hover:bg-[#00a085] text-white text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 w-full sm:w-auto"
                            >
                                📊 See All Plans
                            </button>
                        </div>
                        <div className={`${cardBg} rounded-2xl p-6 border ${cardBorder}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className={`text-lg font-semibold ${textColor}`}>Current Plan</h3>
                                    <p className={`${secondaryTextColor} text-sm`}>Monthly Plan</p>
                                </div>
                                <span className="px-3 py-1 bg-[#00b894] text-white text-xs font-bold rounded-full">
                                    Active
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-[#00b894] mb-4">₹799/month</div>
                            <p className={`${secondaryTextColor} text-sm mb-4`}>
                                Next billing date: February 15, 2024
                            </p>
                            <div className="flex space-x-3">
                                <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-xl transition-all duration-200">
                                    Change Plan
                                </button>
                                <button className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium rounded-xl transition-all duration-200">
                                    Cancel Subscription
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'privacy':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Privacy Settings</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className={`font-medium ${textColor}`}>Data Collection</h3>
                                    <p className={`${secondaryTextColor} text-sm`}>Allow us to collect usage data to improve the service</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00b894]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00b894]"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className={`font-medium ${textColor}`}>Marketing Emails</h3>
                                    <p className={`${secondaryTextColor} text-sm`}>Receive updates about new features and offers</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00b894]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00b894]"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Notification Preferences</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className={`font-medium ${textColor}`}>Audit Completion</h3>
                                    <p className={`${secondaryTextColor} text-sm`}>Get notified when your audit is ready</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00b894]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00b894]"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className={`font-medium ${textColor}`}>Weekly Reports</h3>
                                    <p className={`${secondaryTextColor} text-sm`}>Receive weekly summaries of your activity</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00b894]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00b894]"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 'integrations':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Integrations</h2>
                        <div className="space-y-4">
                            <div className={`${cardBg} rounded-2xl p-6 border ${cardBorder}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold">N</span>
                                        </div>
                                        <div>
                                            <h3 className={`font-medium ${textColor}`}>Notion</h3>
                                            <p className={`${secondaryTextColor} text-sm`}>Sync your audit reports to Notion</p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 bg-[#00b894] hover:bg-[#00a085] text-white text-sm font-medium rounded-xl transition-all duration-200">
                                        Connect
                                    </button>
                                </div>
                            </div>
                            <div className={`${cardBg} rounded-2xl p-6 border ${cardBorder}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold">S</span>
                                        </div>
                                        <div>
                                            <h3 className={`font-medium ${textColor}`}>Slack</h3>
                                            <p className={`${secondaryTextColor} text-sm`}>Get notifications in your Slack channels</p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 bg-[#00b894] hover:bg-[#00a085] text-white text-sm font-medium rounded-xl transition-all duration-200">
                                        Connect
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Security Settings</h2>
                        <div className="space-y-4">
                            <button className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className={`font-medium ${textColor}`}>Change Password</h3>
                                        <p className={`${secondaryTextColor} text-sm`}>Update your account password</p>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                            <button className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className={`font-medium ${textColor}`}>Two-Factor Authentication</h3>
                                        <p className={`${secondaryTextColor} text-sm`}>Add an extra layer of security</p>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                );

            case 'help':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Help Center</h2>
                        <div className="space-y-4">
                            <div className={`${cardBg} rounded-2xl p-6 border ${cardBorder}`}>
                                <h3 className={`text-lg font-semibold ${textColor} mb-3`}>Getting Started</h3>
                                <p className={`${secondaryTextColor} text-sm mb-4`}>
                                    Learn the basics of using our audit tool and create your first report.
                                </p>
                                <button className="text-[#00b894] hover:text-[#00a085] text-sm font-medium">
                                    Read Guide →
                                </button>
                            </div>
                            <div className={`${cardBg} rounded-2xl p-6 border ${cardBorder}`}>
                                <h3 className={`text-lg font-semibold ${textColor} mb-3`}>FAQ</h3>
                                <p className={`${secondaryTextColor} text-sm mb-4`}>
                                    Find answers to commonly asked questions about our service.
                                </p>
                                <button className="text-[#00b894] hover:text-[#00a085] text-sm font-medium">
                                    View FAQ →
                                </button>
                            </div>
                            <div className={`${cardBg} rounded-2xl p-6 border ${cardBorder}`}>
                                <h3 className={`text-lg font-semibold ${textColor} mb-3`}>Contact Support</h3>
                                <p className={`${secondaryTextColor} text-sm mb-4`}>
                                    Need help? Our support team is here to assist you.
                                </p>
                                <button className="px-4 py-2 bg-[#00b894] hover:bg-[#00a085] text-white text-sm font-medium rounded-xl transition-all duration-200">
                                    Contact Us
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'plans-comparison':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <h2 className="text-xl sm:text-2xl font-bold">Plans Comparison</h2>
                            <button
                                onClick={() => setActiveTab('billing')}
                                className={`px-3 sm:px-4 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-xl transition-all duration-200 text-xs sm:text-sm font-medium w-full sm:w-auto`}
                            >
                                ← Back to Billing
                            </button>
                        </div>
                        <p className={`${secondaryTextColor} text-sm sm:text-base`}>
                            Choose the perfect plan for your business intelligence needs
                        </p>

                        {/* Plans Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {/* Free Plan */}
                            <div className={`${cardBg} rounded-2xl p-4 sm:p-6 border ${cardBorder} relative`}>
                                <div className="text-center mb-4 sm:mb-6">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-600 mb-2">Free</h3>
                                    <div className="text-2xl sm:text-3xl font-bold text-gray-600 mb-1">₹0</div>
                                    <div className="text-xs sm:text-sm text-gray-500">forever</div>
                                </div>

                                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">CRM only templates</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">1 audit per day</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">Basic AI insights</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-red-500 mr-2 text-sm sm:text-base">✗</span>
                                        <span className="text-xs sm:text-sm text-gray-500">Charts & scorecards</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-red-500 mr-2 text-sm sm:text-base">✗</span>
                                        <span className="text-xs sm:text-sm text-gray-500">Save audits</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-red-500 mr-2 text-sm sm:text-base">✗</span>
                                        <span className="text-xs sm:text-sm text-gray-500">Download reports</span>
                                    </div>
                                </div>

                                <button className="w-full py-2 px-3 sm:px-4 bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm">
                                    Current Plan
                                </button>
                            </div>

                            {/* Day Pass Plan */}
                            <div className={`${cardBg} rounded-2xl p-4 sm:p-6 border ${cardBorder} relative`}>
                                <div className="text-center mb-4 sm:mb-6">
                                    <h3 className="text-lg sm:text-xl font-bold text-blue-600 mb-2">Day Pass</h3>
                                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">₹299</div>
                                    <div className="text-xs sm:text-sm text-gray-500">24 hours</div>
                                </div>

                                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">All templates access</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">3 audits in 24 hours</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">Enhanced AI insights</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">Charts & scorecards</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-red-500 mr-2 text-sm sm:text-base">✗</span>
                                        <span className="text-xs sm:text-sm text-gray-500">Save audits</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-red-500 mr-2 text-sm sm:text-base">✗</span>
                                        <span className="text-xs sm:text-sm text-gray-500">Download reports</span>
                                    </div>
                                </div>

                                <button className="w-full py-2 px-3 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm">
                                    Get Day Pass
                                </button>
                            </div>

                            {/* Monthly Plan */}
                            <div className={`${cardBg} rounded-2xl p-4 sm:p-6 border-2 border-[#00b894] relative`}>
                                <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-[#00b894] text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                                        MOST POPULAR
                                    </span>
                                </div>

                                <div className="text-center mb-4 sm:mb-6">
                                    <h3 className="text-lg sm:text-xl font-bold text-[#00b894] mb-2">Monthly</h3>
                                    <div className="text-2xl sm:text-3xl font-bold text-[#00b894] mb-1">₹799</div>
                                    <div className="text-xs sm:text-sm text-gray-500">per month</div>
                                </div>

                                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">All templates access</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">Unlimited audits</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">Premium AI insights</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">Advanced charts & scorecards</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">Save & download audits</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">Comment & like system</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">Multiple export formats</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">Email support</span>
                                    </div>
                                </div>

                                <button className="w-full py-2 px-3 sm:px-4 bg-[#00b894] hover:bg-[#00a085] text-white rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm">
                                    Upgrade to Monthly
                                </button>
                            </div>

                            {/* Annual Plan */}
                            <div className={`${cardBg} rounded-2xl p-4 sm:p-6 border ${cardBorder} relative`}>
                                <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-purple-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                                        BEST VALUE
                                    </span>
                                </div>

                                <div className="text-center mb-4 sm:mb-6">
                                    <h3 className="text-lg sm:text-xl font-bold text-purple-600 mb-2">Annual</h3>
                                    <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">₹7,999</div>
                                    <div className="text-xs sm:text-sm text-gray-500">per year</div>
                                    <div className="text-xs text-green-500 mt-1">Save ₹1,589</div>
                                </div>

                                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">Everything in Monthly</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">Team collaboration</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">Custom templates</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">White-label options</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">Priority support</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2 text-sm sm:text-base">✓</span>
                                        <span className="text-xs sm:text-sm">API access</span>
                                    </div>
                                </div>

                                <button className="w-full py-2 px-3 sm:px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm">
                                    Get Annual Plan
                                </button>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className={`${cardBg} rounded-2xl p-4 sm:p-6 border ${cardBorder}`}>
                            <h3 className="text-lg sm:text-xl font-bold mb-4">Frequently Asked Questions</h3>
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2 text-sm sm:text-base">Can I change plans anytime?</h4>
                                    <p className={`${secondaryTextColor} text-xs sm:text-sm`}>Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 text-sm sm:text-base">What payment methods do you accept?</h4>
                                    <p className={`${secondaryTextColor} text-xs sm:text-sm`}>We accept all major credit cards, UPI, and net banking. All payments are secure and encrypted.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 text-sm sm:text-base">Is there a free trial?</h4>
                                    <p className={`${secondaryTextColor} text-xs sm:text-sm`}>Yes! Our free tier gives you 1 audit per day with basic features to try out the tool.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
            {/* Header */}
            <div className={`${cardBg} border-b ${cardBorder} sticky top-0 z-40`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => navigate('/')}
                                className={`p-2 rounded-xl ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-all duration-200`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-xl sm:text-2xl font-bold">Settings</h1>
                        </div>

                        {/* Mobile Menu Button - Hidden on Desktop */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Mobile Current Tab Indicator - Hidden on Desktop */}
                <div className="lg:hidden mb-6">
                    <div className={`${cardBg} rounded-2xl p-4 border ${cardBorder}`}>
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">{tabs.find(tab => tab.id === activeTab)?.icon}</span>
                            <div>
                                <div className="text-sm text-gray-500">Current Section</div>
                                <div className="font-semibold">{tabs.find(tab => tab.id === activeTab)?.name}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Sidebar Overlay - Hidden on Desktop */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-50">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black bg-opacity-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Mobile Sidebar */}
                        <div ref={mobileMenuRef} className={`absolute left-0 top-0 h-full w-80 ${cardBg} border-r ${cardBorder} transform transition-transform duration-300 ease-in-out`}>
                            <div className="p-4">
                                {/* Close Button */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold">Settings Menu</h2>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Navigation Tabs */}
                                <nav className="space-y-2">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                                    ? 'bg-[#00b894] text-white'
                                                    : `${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'}`
                                                }`}
                                        >
                                            <span className="mr-3">{tab.icon}</span>
                                            {tab.name}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar - Hidden on Mobile */}
                    <div className="hidden lg:block lg:w-64 ${sidebarBg} rounded-2xl p-6 border ${sidebarBorder} lg:sticky lg:top-8 lg:h-fit">
                        <nav className="space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                        ? 'bg-[#00b894] text-white'
                                        : `${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                                        }`}
                                >
                                    <span className="mr-3">{tab.icon}</span>
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        <div className={`${cardBg} rounded-2xl p-6 sm:p-8 ${shadow} border ${cardBorder}`}>
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
