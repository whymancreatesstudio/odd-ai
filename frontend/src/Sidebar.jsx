import React from 'react';

const Sidebar = ({ onShowForm, currentPage }) => {
    return (
        <div className="fixed left-0 top-0 h-full w-48 bg-gray-900 text-white shadow-lg">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-white mb-8">
                    ODD AI
                </h1>

                {/* Navigation Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={onShowForm}
                        className={`w-full py-3 px-4 rounded-md text-left transition-colors duration-200 ${currentPage === 'form'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                        <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="font-medium">Company Form</span>
                        </div>
                    </button>

                    <button
                        className={`w-full py-3 px-4 rounded-md text-left transition-colors duration-200 ${currentPage === 'crm'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        disabled={currentPage === 'crm'}
                    >
                        <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="font-medium">CRM Insights</span>
                        </div>
                    </button>
                </div>

                {/* Current Page Indicator */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                        Current Page
                    </div>
                    <div className="text-sm text-gray-300">
                        {currentPage === 'form' ? 'Company Details Form' : 'AI-Powered CRM Insights'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar; 