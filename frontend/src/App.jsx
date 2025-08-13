import React, { useState, useEffect } from 'react'
import CompanyForm from './CompanyForm'
import CRMInsights from './CRMInsights'
import CompanyAudit from './CompanyAudit'
import Sidebar from './Sidebar'

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
    setCompanyData(data);
    setCurrentPage('crm');
  };

  const backToForm = () => {
    setCurrentPage('form');
    setCompanyData(null);
  };

  const backToCRM = () => {
    setCurrentPage('crm');
  };

  return (
    <>
      <Sidebar onShowForm={backToForm} currentPage={currentPage} />
      <div className="ml-48">
        {currentPage === 'form' ? (
          <CompanyForm onShowCRM={showCRM} />
        ) : currentPage === 'crm' ? (
          <CRMInsights companyData={companyData} onBackToForm={backToForm} />
        ) : currentPage === 'audit' && companyData && crmData ? (
          <CompanyAudit
            companyData={companyData}
            crmData={crmData}
            onBackToCRM={backToCRM}
          />
        ) : null}
      </div>
    </>
  )
}

export default App
