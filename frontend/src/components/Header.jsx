import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';

const Header = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const profileRef = useRef(null);

    // Theme-based styling
    const isDark = theme === 'dark';
    const bgColor = isDark ? 'bg-gray-900/95' : 'bg-white/95';
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const secondaryTextColor = isDark ? 'text-gray-300' : 'text-gray-600';
    const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';
    const hoverBg = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
    const dropdownBg = isDark ? 'bg-gray-800' : 'bg-white';
    const dropdownBorder = isDark ? 'border-gray-700' : 'border-gray-200';

    // Close dropdowns when clicking outside or pressing Escape
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsProfileOpen(false);
            }
        };

        // Add event listeners
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const handleProfileClick = () => {
        setIsProfileOpen(false);
        navigate('/profile');
    };

    const handleReportsClick = () => {
        setIsProfileOpen(false);
        navigate('/reports');
    };

    const handleSettingsClick = () => {
        setIsProfileOpen(false);
        navigate('/settings');
    };

    return (
        <header className={`${bgColor} backdrop-blur-xl border-b ${borderColor} sticky top-0 z-50 transition-all duration-300`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    {/* Left Side - Branding */}
                    <div className="flex items-center space-x-4">
                        {/* Logo/Brand */}
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#00b894] to-[#00a085] rounded-xl flex items-center justify-center">
                                <span className="text-white text-sm sm:text-xl font-bold">ODD</span>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className={`text-lg sm:text-xl font-bold ${textColor}`}>ODD ENOUGH AI TOOL</h1>
                                <p className={`text-xs ${secondaryTextColor}`}>Professional Business Intelligence</p>
                            </div>
                            <div className="sm:hidden">
                                <h1 className={`text-lg font-bold ${textColor}`}>ODD</h1>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-xl ${hoverBg} transition-all duration-200 ${textColor}`}
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                        {/* Profile */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => {
                                    setIsProfileOpen(!isProfileOpen);
                                }}
                                className={`flex items-center space-x-2 p-2 rounded-xl ${hoverBg} transition-all duration-200`}
                                title="Profile"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-[#00b894] to-[#00a085] rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">U</span>
                                </div>
                                <span className={`text-sm font-medium ${textColor} hidden md:block`}>User</span>
                                <svg className={`w-4 h-4 ${textColor} transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className={`absolute right-0 mt-2 w-40 sm:w-48 ${dropdownBg} rounded-xl shadow-lg border ${dropdownBorder} py-2 z-50`}>
                                    <div className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                        <p className={`text-xs sm:text-sm font-medium ${textColor}`}>User Account</p>
                                        <p className={`text-xs ${secondaryTextColor}`}>user@example.com</p>
                                    </div>
                                    <button
                                        onClick={handleProfileClick}
                                        className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm ${textColor} ${hoverBg} transition-colors`}
                                    >
                                        👤 View Profile
                                    </button>
                                    <button
                                        onClick={handleReportsClick}
                                        className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm ${textColor} ${hoverBg} transition-colors`}
                                    >
                                        📊 My Reports
                                    </button>
                                    <button
                                        onClick={handleSettingsClick}
                                        className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm ${textColor} ${hoverBg} transition-colors`}
                                    >
                                        ⚙️ Settings
                                    </button>
                                    <hr className={`my-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
                                    <button className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors`}>
                                        🚪 Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;