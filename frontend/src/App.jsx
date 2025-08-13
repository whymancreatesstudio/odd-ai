import React, { useState } from 'react'
import CompanyForm from './CompanyForm'
import CRMInsights from './CRMInsights'
import Sidebar from './Sidebar'

function App() {
  const [currentPage, setCurrentPage] = useState('form');
  const [companyData, setCompanyData] = useState(null);

  const showCRM = (data) => {
    setCompanyData(data);
    setCurrentPage('crm');
  };

  const backToForm = () => {
    setCurrentPage('form');
    setCompanyData(null);
  };

  return (
    <>
      <Sidebar onShowForm={backToForm} currentPage={currentPage} />
      <div className="ml-48">
        {currentPage === 'form' ? (
          <CompanyForm onShowCRM={showCRM} />
        ) : (
          <CRMInsights companyData={companyData} onBackToForm={backToForm} />
        )}
      </div>
    </>
  )
}

export default App
