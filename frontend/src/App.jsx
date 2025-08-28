import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MainDashboard from './components/MainDashboard';
import CompanyForm from './CompanyForm';
import CRMInsights from './CRMInsights';
import CompanyAudit from './CompanyAudit';
import ProfilePage from './pages/ProfilePage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import TemplateAudit from './components/TemplateAudit';
import { lazy, Suspense } from 'react';

// Create theme context
export const ThemeContext = createContext();

// Lazy load components
const DeleteConfirmationModal = lazy(() => import('./components/DeleteConfirmationModal'));

// App Routes Component
function AppRoutes() {
    const navigate = useNavigate();

    const handleAddCompany = () => {
        navigate('/company-form');
    };

    const handleBackToDashboard = () => {
        navigate('/');
    };

    const handleViewCRM = (companyData) => {
        navigate('/crm-insights');
    };

    const handleViewAudit = (companyData) => {
        navigate('/company-audit');
    };

    return (
        <Routes>
            <Route path="/" element={
                <MainDashboard onAddCompany={handleAddCompany} />
            } />
            <Route path="/template-audit" element={
                <TemplateAudit onBack={handleBackToDashboard} onSelectTemplate={(template) => console.log('Selected template:', template)} />
            } />
            <Route path="/company-form" element={
                <CompanyForm onBack={handleBackToDashboard} onViewCRM={handleViewCRM} />
            } />
            <Route path="/crm-insights" element={
                <CRMInsights onBack={handleBackToDashboard} onViewAudit={handleViewAudit} />
            } />
            <Route path="/company-audit" element={
                <CompanyAudit onBack={handleBackToDashboard} />
            } />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    const [theme, setTheme] = useState(() => {
        // Get theme from localStorage or default to dark
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'dark';
    });

    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = prev === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    // Apply theme to document
    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
    }, [theme]);

    return (
        <Router>
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark'
                    ? 'bg-[#242424] text-white'
                    : 'bg-gray-50 text-gray-900'
                    }`}>

                    <AppRoutes />

                    <Suspense fallback={<div>Loading...</div>}>
                        <DeleteConfirmationModal />
                    </Suspense>
                </div>
            </ThemeContext.Provider>
        </Router>
    );
}

export default App;
