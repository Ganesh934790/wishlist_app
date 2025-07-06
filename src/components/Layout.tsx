import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Plus, Heart, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleLogoClick}
            >
              <Heart className="w-8 h-8 text-pink-400" />
              <span className="text-xl font-bold text-white">WishTogether</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogoClick}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              
              <span className="text-white/80 hidden sm:inline">Welcome, {user?.name}</span>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {/* Direct Access Info */}
      <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-3 text-white/80 text-xs max-w-xs">
        <div className="font-semibold mb-1">🎯 Direct Access Mode</div>
        <div>Logged in as: {user?.name}</div>
        <div className="mt-2 text-white/60">
          URL: <code className="bg-white/10 px-1 rounded">?direct=true</code>
        </div>
      </div>
    </div>
  );
};