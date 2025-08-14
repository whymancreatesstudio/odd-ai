import React, { useState, useEffect, Suspense, lazy } from 'react'
import Sidebar from './Sidebar'
import MainDashboard from './components/MainDashboard'
import { measureComponentLoad, trackUserInteraction } from './utils/performance'
import companyManager from './services/companyManager'

// Lazy load components for better performance
const CompanyForm = lazy(() => import('./CompanyForm'))
const CRMInsights = lazy(() => import('./CRMInsights'))
const CompanyAudit = lazy(() => import('./CompanyAudit'))

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [companyData, setCompanyData] = useState(null);
  const [crmData, setCrmData] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

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

  const showCRM = (data) => {
    trackUserInteraction('navigate_to_crm');
    setCompanyData(data);
    setCurrentPage('crm');
    
    // Save company data
    companyManager.saveCompany(data.companyName, data);
  };

  const backToForm = () => {
    trackUserInteraction('navigate_to_form');
    setCurrentPage('form');
    setCompanyData(null);
  };

  const backToCRM = () => {
    trackUserInteraction('navigate_to_crm');
    setCurrentPage('crm');
  };

  const showAudit = (companyData, crmData) => {
    trackUserInteraction('navigate_to_audit');
    setCompanyData(companyData);
    setCrmData(crmData);
    setCurrentPage('audit');
  };

  const showDashboard = () => {
    trackUserInteraction('navigate_to_dashboard');
    setCurrentPage('dashboard');
    setCompanyData(null);
    setCrmData(null);
    setSelectedCompany(null);
  };

  const selectCompany = (companyName) => {
    if (companyName) {
      const company = companyManager.getCompany(companyName);
      if (company) {
        setCompanyData(company.companyData);
        setCrmData(company.crmData);
        setSelectedCompany(companyName);
        setCurrentPage('form');
      }
    } else {
      setSelectedCompany(null);
      setCompanyData(null);
      setCrmData(null);
    }
  };

  return (
    <>
      <Sidebar 
        onShowForm={showDashboard} 
        currentPage={currentPage} 
        onSelectCompany={selectCompany}
        selectedCompany={selectedCompany}
        onShowAudit={showAudit}
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
          ) : currentPage === 'crm' ? (
            <div onLoad={measureComponentLoad('CRMInsights')}>
              <CRMInsights companyData={companyData} onBackToForm={backToForm} onShowAudit={showAudit} />
            </div>
          ) : currentPage === 'audit' && companyData && crmData ? (
            <div onLoad={measureComponentLoad('CompanyAudit')}>
              <CompanyAudit
                companyData={companyData}
                crmData={crmData}
                onBackToCRM={backToCRM}
              />
            </div>
          ) : null}
        </Suspense>
      </div>
    </>
  )
}

export default App
