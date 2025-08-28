import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';

const ReportsPage = () => {
    const { theme } = useContext(ThemeContext);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    // Theme-based styling
    const isDark = theme === 'dark';
    const bgColor = isDark ? 'bg-[#242424]' : 'bg-gray-50';
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const secondaryTextColor = isDark ? 'text-gray-300' : 'text-gray-600';
    const cardBg = isDark ? 'bg-gray-900' : 'bg-white';
    const cardBorder = isDark ? 'border-gray-800' : 'border-gray-200';
    const shadow = isDark ? 'shadow-2xl shadow-black/50' : 'shadow-xl shadow-gray-200/50';

    // Mock reports data (replace with real data later)
    const reports = [
        {
            id: 1,
            companyName: 'TechStart Inc',
            auditType: 'Investor Due Diligence',
            status: 'completed',
            date: '2024-01-15',
            score: 85,
            description: 'Comprehensive due diligence report for Series A investment round.'
        },
        {
            id: 2,
            companyName: 'InnovateCorp',
            auditType: 'Partnership Assessment',
            status: 'completed',
            date: '2024-01-10',
            score: 92,
            description: 'Strategic partnership evaluation and synergy analysis.'
        },
        {
            id: 3,
            companyName: 'DataFlow Solutions',
            auditType: 'Competitive Intelligence',
            status: 'completed',
            date: '2024-01-05',
            score: 78,
            description: 'Market positioning and competitive landscape analysis.'
        },
        {
            id: 4,
            companyName: 'GreenTech Ventures',
            auditType: 'Compliance Review',
            status: 'in-progress',
            date: '2024-01-20',
            score: null,
            description: 'Regulatory compliance and risk assessment.'
        }
    ];

    const filteredReports = filter === 'all'
        ? reports
        : reports.filter(report => report.status === filter);

    const getStatusColor = (status) => {
        if (status === 'completed') return 'bg-[#00b894] text-white';
        if (status === 'in-progress') return 'bg-yellow-500 text-white';
        return 'bg-gray-500 text-white';
    };

    const getStatusText = (status) => {
        if (status === 'completed') return 'Completed';
        if (status === 'in-progress') return 'In Progress';
        return 'Draft';
    };

    if (reports.length === 0) {
        return (
            <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
                {/* Header */}
                <div className={`${cardBg} border-b ${cardBorder} sticky top-0 z-40`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => window.location.href = '/'}
                                className={`p-2 rounded-xl ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-all duration-200`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-xl sm:text-2xl font-bold">My Reports</h1>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
                    <div className={`${cardBg} rounded-3xl p-8 sm:p-12 ${shadow} border ${cardBorder}`}>
                        <div className="text-6xl sm:text-8xl mb-6">📊</div>
                        <h2 className={`text-2xl sm:text-3xl font-bold ${textColor} mb-4`}>
                            No reports yet
                        </h2>
                        <p className={`${secondaryTextColor} text-base sm:text-lg mb-8`}>
                            Once you save reports, they'll appear here for easy access and management.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-[#00b894] hover:bg-[#00a085] text-white font-medium rounded-xl transition-all duration-200"
                        >
                            Start Your First Audit
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
            {/* Header */}
            <div className={`${cardBg} border-b ${cardBorder} sticky top-0 z-40`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => window.location.href = '/'}
                                className={`p-2 rounded-xl ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-all duration-200`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-xl sm:text-2xl font-bold">My Reports</h1>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${filter === 'all'
                                    ? 'bg-[#00b894] text-white'
                                    : `${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`
                                    }`}
                            >
                                All ({reports.length})
                            </button>
                            <button
                                onClick={() => setFilter('completed')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${filter === 'completed'
                                    ? 'bg-[#00b894] text-white'
                                    : `${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`
                                    }`}
                            >
                                Completed ({reports.filter(r => r.status === 'completed').length})
                            </button>
                            <button
                                onClick={() => setFilter('in-progress')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${filter === 'in-progress'
                                    ? 'bg-[#00b894] text-white'
                                    : `${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`
                                    }`}
                            >
                                In Progress ({reports.filter(r => r.status === 'in-progress').length})
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Reports Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {filteredReports.map((report) => (
                        <div key={report.id} className={`${cardBg} rounded-3xl p-6 sm:p-8 ${shadow} border ${cardBorder} hover:border-[#00b894]/30 transition-all duration-300`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-bold ${textColor} text-lg sm:text-xl mb-2 truncate`}>
                                        {report.companyName}
                                    </h3>
                                    <p className={`${secondaryTextColor} text-sm sm:text-base mb-3`}>
                                        {report.auditType}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(report.status)}`}>
                                    {getStatusText(report.status)}
                                </span>
                            </div>

                            <p className={`${textColor} text-sm sm:text-base mb-4 leading-relaxed`}>
                                {report.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <span className={`text-xs ${secondaryTextColor}`}>
                                        {new Date(report.date).toLocaleDateString()}
                                    </span>
                                    {report.score && (
                                        <div className="flex items-center space-x-2">
                                            <span className={`text-xs ${secondaryTextColor}`}>Score:</span>
                                            <span className="text-sm font-bold text-[#00b894]">{report.score}/100</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex space-x-2">
                                    <button className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                                        }`}>
                                        View
                                    </button>
                                    <button className="px-3 py-2 bg-[#00b894] hover:bg-[#00a085] text-white text-xs font-medium rounded-xl transition-all duration-200">
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results for Filter */}
                {filteredReports.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className={`text-xl font-bold ${textColor} mb-2`}>No reports found</h3>
                        <p className={`${secondaryTextColor} mb-6`}>
                            No reports match the selected filter. Try changing the filter or create a new report.
                        </p>
                        <button
                            onClick={() => setFilter('all')}
                            className="px-6 py-3 bg-[#00b894] hover:bg-[#00a085] text-white font-medium rounded-xl transition-all duration-200"
                        >
                            View All Reports
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;
