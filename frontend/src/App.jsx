import React, { useState, useEffect, Suspense, lazy } from 'react'
import Sidebar from './Sidebar'
import MainDashboard from './components/MainDashboard'
import DeleteConfirmationModal from './components/DeleteConfirmationModal'
import { measureComponentLoad, trackUserInteraction } from './utils/performance'
import companyManager from './services/companyManager'

// Lazy load components for better performance
const CompanyForm = lazy(() => import('./CompanyForm'))
const CRMInsights = lazy(() => import('./CRMInsights'))
const CompanyAudit = lazy(() => import('./CompanyAudit'))

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companySection, setCompanySection] = useState('form'); // 'form', 'crm', 'audit'
  const [companyData, setCompanyData] = useState(null);
  const [crmData, setCrmData] = useState(null);
  const [auditData, setAuditData] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, companyName: null });

  // Check URL parameters for audit page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const companyParam = urlParams.get('company');
    const crmParam = urlParams.get('crm');

    if (companyParam && crmParam) {
      try {
        const company = JSON.parse(decodeURIComponent(companyParam));
        const crm = JSON.parse(decodeURIComponent(crmParam));
        setCompanyData(company);
        setCrmData(crm);
        setCurrentPage('audit');
      } catch (error) {
        console.error('Error parsing URL parameters:', error);
      }
    }
  }, []);

  // Load company data when selected company changes
  useEffect(() => {
    if (selectedCompany) {
      const company = companyManager.getCompany(selectedCompany);
      if (company) {
        setCompanyData(company.companyData);
        setCrmData(company.crmData);
        setAuditData(company.auditData);
      }
    }
  }, [selectedCompany]);

  const showCRM = (data) => {
    trackUserInteraction('navigate_to_crm');
    setCompanyData(data);
    setCompanySection('crm');
    
    // Save company data
    companyManager.saveCompany(data.companyName, data);
  };

  const backToForm = () => {
    trackUserInteraction('navigate_to_form');
    setCompanySection('form');
  };

  const backToCRM = () => {
    trackUserInteraction('navigate_to_crm');
    setCompanySection('crm');
  };

  const showDashboard = () => {
    trackUserInteraction('navigate_to_dashboard');
    setCurrentPage('dashboard');
    setSelectedCompany(null);
    setCompanySection('form');
    setCompanyData(null);
    setCrmData(null);
    setAuditData(null);
  };

  const selectCompany = (companyName) => {
    if (companyName) {
      setSelectedCompany(companyName);
      setCurrentPage('company');
      setCompanySection('form');
    } else {
      setSelectedCompany(null);
      setCompanyData(null);
      setCrmData(null);
      setAuditData(null);
    }
  };

  const navigateToCompanySection = (section) => {
    trackUserInteraction(`navigate_to_${section}`);
    setCompanySection(section);
  };

  const showAudit = (companyData, crmData) => {
    trackUserInteraction('navigate_to_audit');
    setCompanyData(companyData);
    setCrmData(crmData);
    setCompanySection('audit');
  };

  // Update company data when it changes
  const updateCompanyData = (newData) => {
    setCompanyData(newData);
    if (selectedCompany) {
      companyManager.saveCompany(selectedCompany, newData);
    }
  };

  // Update CRM data when it changes
  const updateCRMData = (newData) => {
    setCrmData(newData);
    if (selectedCompany) {
      companyManager.updateCRMData(selectedCompany, newData);
    }
  };

  // Update audit data when it changes
  const updateAuditData = (newData) => {
    setAuditData(newData);
    if (selectedCompany) {
      companyManager.updateAuditData(selectedCompany, newData);
    }
  };

  // Delete modal functions
  const showDeleteModal = (companyName) => {
    setDeleteModal({ isOpen: true, companyName });
  };

  const hideDeleteModal = () => {
    setDeleteModal({ isOpen: false, companyName: null });
  };

  const confirmDeleteCompany = () => {
    const companyName = deleteModal.companyName;
    if (companyName && companyManager.deleteCompany(companyName)) {
      // If this was the selected company, clear selection
      if (selectedCompany === companyName) {
        setSelectedCompany(null);
        setCurrentPage('dashboard');
        setCompanySection('form');
        setCompanyData(null);
        setCrmData(null);
        setAuditData(null);
      }
      hideDeleteModal();
    }
  };

  return (
    <>
      <Sidebar 
        onShowForm={showDashboard} 
        currentPage={currentPage}
        companySection={companySection}
        onSelectCompany={selectCompany}
        selectedCompany={selectedCompany}
        onNavigateToSection={navigateToSection}
        onShowAudit={showAudit}
        onShowDeleteModal={showDeleteModal}
      />
      <div className="ml-48">
        <Suspense fallback={
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading...</h2>
              <p className="text-slate-600">Please wait while we load the component</p>
            </div>
          </div>
        }>
          {currentPage === 'dashboard' ? (
            <div onLoad={measureComponentLoad('MainDashboard')}>
              <MainDashboard onAddCompany={() => setCurrentPage('form')} />
            </div>
          ) : currentPage === 'form' ? (
            <div onLoad={measureComponentLoad('CompanyForm')}>
              <CompanyForm onShowCRM={showCRM} />
            </div>
          ) : currentPage === 'company' && selectedCompany ? (
            // Company-specific pages
            companySection === 'form' ? (
              <div onLoad={measureComponentLoad('CompanyForm')}>
                <CompanyForm 
                  onShowCRM={() => navigateToCompanySection('crm')}
                  initialData={companyData}
                  onUpdateData={updateCompanyData}
                />
              </div>
            ) : companySection === 'crm' ? (
              <div onLoad={measureComponentLoad('CRMInsights')}>
                <CRMInsights 
                  companyData={companyData} 
                  onBackToForm={backToForm}
                  onShowAudit={showAudit}
                  onUpdateData={updateCRMData}
                />
              </div>
            ) : companySection === 'audit' ? (
              <div onLoad={measureComponentLoad('CompanyAudit')}>
                <CompanyAudit
                  companyData={companyData}
                  crmData={crmData}
                  onBackToCRM={backToCRM}
                  onUpdateData={updateAuditData}
                />
              </div>
            ) : null
          ) : null}
        </Suspense>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        companyName={deleteModal.companyName}
        onConfirm={confirmDeleteCompany}
        onCancel={hideDeleteModal}
      />
    </>
  )
}

export default App
