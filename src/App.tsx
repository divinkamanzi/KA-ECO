import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { AuthWrapper } from './components/auth/AuthWrapper';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { WetlandManagement } from './components/wetlands/WetlandManagement';
import { Reports } from './components/reports/Reports';
import { AdminPanel } from './components/admin/AdminPanel';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    return <AuthWrapper />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'wetlands':
        return <WetlandManagement />;
      case 'reports':
        return <Reports />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-background text-foreground">
          <AppContent />
        </div>
      </DataProvider>
    </AuthProvider>
  );
}