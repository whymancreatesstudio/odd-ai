import React from 'react';

const MainDashboard = ({ onAddCompany }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="text-center max-w-2xl mx-auto px-4 md:px-6">
                {/* Main Heading */}
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 md:mb-8">
                    ODD ENOUGH AI TOOL
                </h1>
                {/* Add Company Button */}
                <button
                    onClick={onAddCompany}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    ➕ Add Company Details
                </button>
            </div>
        </div>
    );
};

export default MainDashboard; 