import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { WishlistCard } from '../components/WishlistCard';
import { CreateWishlistModal } from '../components/CreateWishlistModal';
import { Wishlist } from '../types';
import { api } from '../services/api';
import { wsService } from '../services/websocket';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Search } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlists();
    if (user) {
      wsService.connect(user.id);
      wsService.on('wishlist_created', handleWishlistCreated);
    }

    return () => {
      wsService.off('wishlist_created', handleWishlistCreated);
    };
  }, [user]);

  const loadWishlists = async () => {
    try {
      const data = await api.get('/wishlists');
      setWishlists(data);
    } catch (error) {
      console.error('Error loading wishlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistCreated = (data: any) => {
    setWishlists(prev => [...prev, data.wishlist]);
  };

  const handleCreateWishlist = async (name: string, description: string) => {
    try {
      const wishlist = await api.post('/wishlists', { name, description });
      setWishlists(prev => [...prev, wishlist]);
    } catch (error) {
      console.error('Error creating wishlist:', error);
    }
  };

  const filteredWishlists = wishlists.filter(wishlist =>
    wishlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wishlist.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">My Wishlists</h1>
            <p className="text-white/70 mt-1">Create and manage your shared wishlists</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Create Wishlist</span>
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-white/50" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search wishlists..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {filteredWishlists.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg mb-4">
              {searchTerm ? 'No wishlists found matching your search.' : 'No wishlists yet.'}
            </div>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Create your first wishlist
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWishlists.map(wishlist => (
              <WishlistCard
                key={wishlist.id}
                wishlist={wishlist}
                onClick={() => window.location.href = `/wishlist/${wishlist.id}`}
              />
            ))}
          </div>
        )}
      </div>

      <CreateWishlistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateWishlist}
      />
    </Layout>
  );
};