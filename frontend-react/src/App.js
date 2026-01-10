import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import LoginPage from './components/auth/LoginPage';
import Layout from './components/layout/ Layout';
import ProduitsPage from './pages/ProduitsPage';
import CommandesPage from './pages/CommandesPage';

function App() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('produits');

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Chargement...</p>
          </div>
        </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
      <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        {currentPage === 'produits' && <ProduitsPage />}
        {currentPage === 'commandes' && <CommandesPage />}
      </Layout>
  );
}

export default App;