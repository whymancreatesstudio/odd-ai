import React from 'react'
import CompanyForm from './CompanyForm'
import Sidebar from './Sidebar'

function App() {
  return (
    <>
      <Sidebar />
      <div className="ml-64">
        <CompanyForm />
      </div>
    </>
  )
}

export default App
