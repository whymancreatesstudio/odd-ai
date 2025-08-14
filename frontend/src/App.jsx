import React, { useState, useEffect, Suspense, lazy } from 'react'
import Sidebar from './Sidebar'
import { measureComponentLoad, trackUserInteraction } from './utils/performance'

// Lazy load components for better performance
const CompanyForm = lazy(() => import('./CompanyForm'))
const CRMInsights = lazy(() => import('./CRMInsights'))
const CompanyAudit = lazy(() => import('./CompanyAudit'))

function App() {
  const [currentPage, setCurrentPage] = useState('form');
  const [companyData, setCompanyData] = useState(null);
  const [crmData, setCrmData] = useState(null);

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

  return (
    <>
      <Sidebar onShowForm={backToForm} currentPage={currentPage} />
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
          {currentPage === 'form' ? (
            <div onLoad={measureComponentLoad('CompanyForm')}>
              <CompanyForm onShowCRM={showCRM} />
            </div>
          ) : currentPage === 'crm' ? (
            <div onLoad={measureComponentLoad('CRMInsights')}>
              <CRMInsights companyData={companyData} onBackToForm={backToForm} />
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
