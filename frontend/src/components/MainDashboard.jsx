import React, { useContext } from "react";
import Header from "./Header";
import { ThemeContext } from "../App";

const MainDashboard = ({ onAddCompany }) => {
    const { theme } = useContext(ThemeContext);

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
    return (
        <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Welcome Section */}
                <div className="text-center mb-12 sm:mb-16">
                    {/* Beta Version Badge */}
                    <div className="inline-flex items-center px-4 py-2 mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg animate-pulse">
                        <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></span>
                        🚧 BETA VERSION - STILL IN DEVELOPMENT
                    </div>

                    <h2 className={`text-2xl sm:text-3xl font-bold ${textColor} mb-4 sm:mb-6`}>
                        Welcome to Your Dashboard
                    </h2>
                    <p className={`${secondaryTextColor} text-base sm:text-lg max-w-2xl mx-auto px-4`}>
                        Choose your audit approach and start generating comprehensive business insights
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
                    {/* Template-Based Audit */}
                    <div className={`${cardBg} rounded-3xl p-6 sm:p-8 ${shadow} border ${cardBorder} ${cardHover} transition-all duration-500`}>
                        <div className="text-center">
                            <div className="text-6xl mb-4">🚀</div>
                            <h3 className={`text-xl sm:text-2xl font-bold ${textColor} mb-3 sm:mb-4`}>
                                Template-Based Audit
                            </h3>
                            <p className={`${secondaryTextColor} mb-4 sm:mb-6 text-sm sm:text-base`}>
                                Choose from our expertly crafted templates designed for different business needs. Perfect for standard audit requirements.
                            </p>
                            <button
                                onClick={() => window.location.href = '/template-audit'}
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#00b894] to-[#00a085] text-white font-bold rounded-xl hover:from-[#00a085] hover:to-[#009874] transition-all duration-300 shadow-lg hover:shadow-green-500/25 text-sm sm:text-base"
                            >
                                Start Template Audit
                            </button>
                        </div>
                    </div>

                    {/* Custom Audit */}
                    <div className={`${cardBg} rounded-3xl p-6 sm:p-8 ${shadow} border ${cardBorder} ${cardHover} transition-all duration-500`}>
                        <div className="text-center">
                            <div className="text-6xl mb-4">🛠️</div>
                            <h3 className={`text-xl sm:text-2xl font-bold ${textColor} mb-3 sm:mb-4`}>
                                Custom Audit
                            </h3>
                            <p className={`${secondaryTextColor} mb-4 sm:mb-6 text-sm sm:text-base`}>
                                Build your own custom audit with specific sections, length, and focus areas. Ideal for unique business requirements.
                            </p>
                            <button
                                onClick={onAddCompany}
                                className={`px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-white font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg  text-sm sm:text-base relative overflow-hidden`}
                            >
                                <span className="relative z-10">Start Custom Audit</span>

                                {/* Rainbow Glowing Border - Always On (like screenshot) */}
                                <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-[#ff0000] via-[#ff7300] via-[#fffb00] via-[#48ff00] via-[#00ffd5] via-[#002bff] via-[#7a00ff] via-[#ff00c8] to-[#ff0000] bg-[length:400%_100%]"></div>

                                {/* Glow Shadow - Always On */}
                                <div className="absolute inset-0 rounded-lg shadow-[0_0_20px_rgba(255,0,0,0.6),0_0_40px_rgba(255,0,0,0.4),0_0_60px_rgba(255,0,0,0.2)]"></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Reports Section */}
                <div className={`${cardBg} rounded-3xl p-6 sm:p-8 ${shadow} border ${cardBorder}`}>
                    <h3 className={`text-xl sm:text-2xl font-bold ${textColor} mb-4 sm:mb-6 flex items-center`}>
                        <span className="w-3 h-3 bg-[#00b894] rounded-full mr-3"></span>
                        Recent Reports
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Report Card 1 */}
                        <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl p-4 sm:p-6 border ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:border-[#00b894]/50 transition-all duration-200`}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 bg-[#00b894] text-white text-xs font-bold rounded-full">
                                    Investor
                                </span>
                                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>2 days ago</span>
                            </div>
                            <h4 className={`font-bold mb-2 ${textColor}`}>TechStart Inc</h4>
                            <p className={`text-sm mb-4 ${secondaryTextColor}`}>
                                Due diligence report for potential investment
                            </p>
                            <div className="flex space-x-2">
                                <button className={`px-3 py-2 ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} text-xs rounded-lg transition-colors`}>
                                    View
                                </button>
                                <button className="px-3 py-2 bg-[#00b894] text-white text-xs rounded-lg hover:bg-[#00a085] transition-colors">
                                    Download
                                </button>
                            </div>
                        </div>

                        {/* Report Card 2 */}
                        <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl p-4 sm:p-6 border ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:border-[#00b894]/50 transition-all duration-200`}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 bg-[#00b894] text-white text-xs font-bold rounded-full">
                                    Partnership
                                </span>
                                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>1 week ago</span>
                            </div>
                            <h4 className={`font-bold mb-2 ${textColor}`}>InnovateCorp</h4>
                            <p className={`text-sm mb-4 ${secondaryTextColor}`}>
                                Partnership assessment and synergy analysis
                            </p>
                            <div className="flex space-x-2">
                                <button className={`px-3 py-2 ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} text-xs rounded-lg transition-colors`}>
                                    View
                                </button>
                                <button className="px-3 py-2 bg-[#00b894] text-white text-xs rounded-lg hover:bg-[#00a085] transition-colors">
                                    Download
                                </button>
                            </div>
                        </div>

                        {/* Report Card 3 */}
                        <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl p-4 sm:p-6 border ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:border-[#00b894]/50 transition-all duration-200`}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 bg-[#00b894] text-white text-xs font-bold rounded-full">
                                    Competitive
                                </span>
                                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>2 weeks ago</span>
                            </div>
                            <h4 className={`font-bold mb-2 ${textColor}`}>MarketLeader</h4>
                            <p className={`text-sm mb-4 ${secondaryTextColor}`}>
                                Competitive intelligence and market analysis
                            </p>
                            <div className="flex space-x-2">
                                <button className={`px-3 py-2 ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} text-xs rounded-lg transition-colors`}>
                                    View
                                </button>
                                <button className="px-3 py-2 bg-[#00b894] text-white text-xs rounded-lg hover:bg-[#00a085] transition-colors">
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainDashboard;