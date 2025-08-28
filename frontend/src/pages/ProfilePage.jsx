import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';

const ProfilePage = () => {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    // Theme-based styling
    const isDark = theme === 'dark';
    const bgColor = isDark ? 'bg-[#242424]' : 'bg-gray-50';
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const secondaryTextColor = isDark ? 'text-gray-300' : 'text-gray-600';
    const cardBg = isDark ? 'bg-gray-900' : 'bg-white';
    const cardBorder = isDark ? 'border-gray-800' : 'border-gray-200';
    const shadow = isDark ? 'shadow-2xl shadow-black/50' : 'shadow-xl shadow-gray-200/50';

    // Mock user data (replace with real data later)
    const user = {
        name: 'John Doe',
        email: 'john.doe@company.com',
        bio: 'Business analyst and technology enthusiast with 5+ years of experience in market research and competitive intelligence.',
        avatar: 'JD',
        joinDate: 'January 2024'
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
                            <h1 className="text-xl sm:text-2xl font-bold">Profile</h1>
                        </div>
                        <button
                            onClick={() => navigate('/settings')}
                            className={`px-4 py-2 rounded-xl ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-all duration-200 text-sm font-medium`}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Profile Card */}
                <div className={`${cardBg} rounded-3xl p-6 sm:p-8 ${shadow} border ${cardBorder} mb-8`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#00b894] to-[#00a085] rounded-full flex items-center justify-center">
                                <span className="text-white text-2xl sm:text-4xl font-bold">{user.avatar}</span>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                            <h2 className={`text-2xl sm:text-3xl font-bold ${textColor} mb-2`}>
                                {user.name}
                            </h2>
                            <p className={`${secondaryTextColor} text-base sm:text-lg mb-3`}>
                                {user.email}
                            </p>
                            <p className={`${secondaryTextColor} text-sm sm:text-base mb-4`}>
                                Member since {user.joinDate}
                            </p>
                            <p className={`${textColor} text-sm sm:text-base leading-relaxed`}>
                                {user.bio}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className={`${cardBg} rounded-3xl p-6 sm:p-8 ${shadow} border ${cardBorder} mb-8`}>
                    <h3 className={`text-xl sm:text-2xl font-bold ${textColor} mb-6`}>Activity Overview</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl p-4 sm:p-6 text-center`}>
                            <div className="text-2xl sm:text-3xl font-bold text-[#00b894] mb-2">24</div>
                            <div className={`${secondaryTextColor} text-sm sm:text-base`}>Audits Completed</div>
                        </div>
                        <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl p-4 sm:p-6 text-center`}>
                            <div className="text-2xl sm:text-3xl font-bold text-[#00b894] mb-2">12</div>
                            <div className={`${secondaryTextColor} text-sm sm:text-base`}>Reports Saved</div>
                        </div>
                        <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl p-4 sm:p-6 text-center`}>
                            <div className="text-2xl sm:text-3xl font-bold text-[#00b894] mb-2">156</div>
                            <div className={`${secondaryTextColor} text-sm sm:text-base`}>Hours Saved</div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className={`${cardBg} rounded-3xl p-6 sm:p-8 ${shadow} border ${cardBorder}`}>
                    <h3 className={`text-xl sm:text-2xl font-bold ${textColor} mb-6`}>Recent Activity</h3>
                    <div className="space-y-4">
                        <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl p-4 sm:p-6 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className={`font-semibold ${textColor} text-sm sm:text-base`}>TechStart Inc - Investor Audit</h4>
                                    <p className={`${secondaryTextColor} text-xs sm:text-sm`}>Completed 2 days ago</p>
                                </div>
                                <span className="px-3 py-1 bg-[#00b894] text-white text-xs font-bold rounded-full">
                                    Completed
                                </span>
                            </div>
                        </div>
                        <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl p-4 sm:p-6 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className={`font-semibold ${textColor} text-sm sm:text-base`}>InnovateCorp - Partnership Assessment</h4>
                                    <p className={`${secondaryTextColor} text-xs sm:text-sm`}>Completed 1 week ago</p>
                                </div>
                                <span className="px-3 py-1 bg-[#00b894] text-white text-xs font-bold rounded-full">
                                    Completed
                                </span>
                            </div>
                        </div>
                        <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl p-4 sm:p-6 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className={`font-semibold ${textColor} text-sm sm:text-base`}>DataFlow Solutions - Competitive Analysis</h4>
                                    <p className={`${secondaryTextColor} text-xs sm:text-sm`}>Completed 2 weeks ago</p>
                                </div>
                                <span className="px-3 py-1 bg-[#00b894] text-white text-xs font-bold rounded-full">
                                    Completed
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
