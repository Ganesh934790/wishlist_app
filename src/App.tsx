import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './pages/Dashboard';
import { WishlistView } from './pages/WishlistView';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  
  // Check for direct dashboard access
  const urlParams = new URLSearchParams(window.location.search);
  const directAccess = urlParams.get('direct') === 'true';
  
  if (directAccess && !user) {
    // Auto-login with demo user for direct access
    const demoUser = {
      id: 'demo-user-id',
      email: 'demo@wishlist.com',
      name: 'Demo User',
      createdAt: new Date().toISOString()
    };
    
    // Set demo user in localStorage
    localStorage.setItem('wishlist_user', JSON.stringify(demoUser));
    
    // Reload to trigger auth context update
    window.location.reload();
    return null;
  }
  
  if (!user) {
    return <LoginForm />;
  }

  // Simple routing based on URL
  const path = window.location.pathname;
  const wishlistMatch = path.match(/^\/wishlist\/(.+)$/);
  
  if (wishlistMatch) {
    return <WishlistView wishlistId={wishlistMatch[1]} />;
  }

  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;