import React from 'react';

const MainDashboard = ({ onAddCompany }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center max-w-2xl mx-auto px-6">
                {/* Main Heading */}
                <h1 className="text-5xl font-bold text-slate-900 mb-8">
                    ODD ENOUGH AI TOOL
                </h1>
                
                {/* Subtitle */}
                <p className="text-xl text-slate-600 mb-12">
                    AI-Powered Company Research & CRM Insights
                </p>
                
                {/* Add Company Button */}
                <button
                    onClick={onAddCompany}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    ➕ Add Company Details
                </button>
                
                {/* Features List */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-3xl mb-3">🔍</div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Company Research</h3>
                        <p className="text-slate-600 text-sm">Generate comprehensive company insights using AI</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-3xl mb-3">📊</div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">CRM Analytics</h3>
                        <p className="text-slate-600 text-sm">Get detailed financial and business intelligence</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-3xl mb-3">📋</div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Audit Reports</h3>
                        <p className="text-slate-600 text-sm">Generate professional marketing audit reports</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainDashboard; 