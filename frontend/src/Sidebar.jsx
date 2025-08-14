import React, { useState, useEffect } from 'react';
import companyManager from './services/companyManager';

const Sidebar = ({ onShowForm, currentPage, companySection, onSelectCompany, selectedCompany, onNavigateToSection, onShowAudit }) => {
    return (
        <div className="fixed left-0 top-0 h-full w-48 bg-gray-900 text-white shadow-lg">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-white mb-8">
                    ODD AI
                </h1>

                {/* Add Company Button */}
                <button
                    onClick={onShowForm}
                    className="w-full py-3 px-4 rounded-md text-left transition-colors duration-200 bg-green-600 text-white hover:bg-green-700 mb-6"
                >
                    <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="font-medium">Add Company</span>
                    </div>
                </button>

                {/* Company Navigation */}
                <div className="mb-6">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                        Companies
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {companyManager.getCompaniesSorted().map((company) => (
                            <CompanyNavItem
                                key={company.id}
                                company={company}
                                isSelected={selectedCompany === company.companyName}
                                onSelect={() => onSelectCompany(company.companyName)}
                                onDelete={() => handleDeleteCompany(company.companyName)}
                            />
                        ))}
                    </div>
                </div>

                {/* Company-Specific Navigation - Only show when a company is selected */}
                {selectedCompany && currentPage === 'company' && (
                    <div className="mb-6">
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                            {selectedCompany} Navigation
                        </div>
                        
                        <div className="space-y-2">
                            {/* Company Details Form */}
                            <button
                                onClick={() => onNavigateToSection('form')}
                                className={`w-full py-2 px-3 rounded-md text-left transition-colors duration-200 text-sm ${
                                    companySection === 'form'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>Company Details</span>
                                </div>
                            </button>

                            {/* CRM Insights */}
                            <button
                                onClick={() => onNavigateToSection('crm')}
                                className={`w-full py-2 px-3 rounded-md text-left transition-colors duration-200 text-sm ${
                                    companySection === 'crm'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span>CRM Insights</span>
                                </div>
                            </button>

                            {/* Company Audit */}
                            <button
                                onClick={() => onNavigateToSection('audit')}
                                className={`w-full py-2 px-3 rounded-md text-left transition-colors duration-200 text-sm ${
                                    companySection === 'audit'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    <span>Company Audit</span>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* Current Page Indicator */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                        Current Page
                    </div>
                    <div className="text-sm text-gray-300">
                        {currentPage === 'dashboard' ? 'Main Dashboard' :
                         currentPage === 'form' ? 'Company Details Form' :
                         currentPage === 'company' ? `${selectedCompany} - ${companySection === 'form' ? 'Company Details' : companySection === 'crm' ? 'CRM Insights' : 'Company Audit'}` :
                         'Unknown Page'}
                    </div>
                </div>
            </div>
        </div>
    );

    // Company Navigation Item Component
    function CompanyNavItem({ company, isSelected, onSelect, onDelete }) {
        const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

        const handleDeleteClick = (e) => {
            e.stopPropagation();
            setShowDeleteConfirm(true);
        };

        const confirmDelete = (e) => {
            e.stopPropagation();
            onDelete();
            setShowDeleteConfirm(false);
        };

        const cancelDelete = (e) => {
            e.stopPropagation();
            setShowDeleteConfirm(false);
        };

        return (
            <div className="relative">
                <div
                    className={`w-full py-2 px-3 rounded-md text-left transition-colors duration-200 text-sm cursor-pointer ${
                        isSelected 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={onSelect}
                >
                    <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{company.companyName}</span>
                        <button
                            onClick={handleDeleteClick}
                            className="text-red-400 hover:text-red-300 ml-2 p-1 rounded hover:bg-red-900/20"
                            title="Delete company"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Company Status Indicators */}
                    <div className="flex items-center space-x-1 mt-1">
                        {company.companyData && (
                            <span className="w-2 h-2 bg-green-500 rounded-full" title="Company details saved"></span>
                        )}
                        {company.crmData && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full" title="CRM data available"></span>
                        )}
                        {company.auditData && (
                            <span className="w-2 h-2 bg-purple-500 rounded-full" title="Audit available"></span>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm && (
                    <div className="absolute left-full ml-2 top-0 bg-red-600 text-white p-3 rounded-md shadow-lg z-50 min-w-48">
                        <p className="text-sm mb-3">
                            Are you sure? Once deleted, all data for <strong>{company.companyName}</strong> will be lost and cannot be recovered.
                        </p>
                        <div className="flex space-x-2">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded text-sm"
                            >
                                Delete
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Delete Company Handler
    function handleDeleteCompany(companyName) {
        if (companyManager.deleteCompany(companyName)) {
            // If this was the selected company, clear selection
            if (selectedCompany === companyName) {
                onSelectCompany(null);
            }
        }
    }
};

export default Sidebar; 