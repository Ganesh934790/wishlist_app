import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { AddProductModal } from '../components/AddProductModal';
import { InviteModal } from '../components/InviteModal';
import { Wishlist, Product } from '../types';
import { api } from '../services/api';
import { wsService } from '../services/websocket';
import { useAuth } from '../contexts/AuthContext';
import { Plus, UserPlus, ArrowLeft } from 'lucide-react';

interface WishlistViewProps {
  wishlistId: string;
}

export const WishlistView: React.FC<WishlistViewProps> = ({ wishlistId }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
    loadUsers();
    
    if (user) {
      wsService.on('product_added', handleProductAdded);
      wsService.on('product_updated', handleProductUpdated);
      wsService.on('product_deleted', handleProductDeleted);
      wsService.on('reaction_added', handleReactionAdded);
    }

    return () => {
      wsService.off('product_added', handleProductAdded);
      wsService.off('product_updated', handleProductUpdated);
      wsService.off('product_deleted', handleProductDeleted);
      wsService.off('reaction_added', handleReactionAdded);
    };
  }, [user, wishlistId]);

  const loadWishlist = async () => {
    try {
      const data = await api.get(`/wishlists/${wishlistId}`);
      setWishlist(data);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleProductAdded = (data: any) => {
    if (data.wishlistId === wishlistId) {
      setWishlist(prev => prev ? {
        ...prev,
        products: [...prev.products, data.product]
      } : null);
    }
  };

  const handleProductUpdated = (data: any) => {
    if (data.wishlistId === wishlistId) {
      setWishlist(prev => prev ? {
        ...prev,
        products: prev.products.map(p => p.id === data.product.id ? data.product : p)
      } : null);
    }
  };

  const handleProductDeleted = (data: any) => {
    if (data.wishlistId === wishlistId) {
      setWishlist(prev => prev ? {
        ...prev,
        products: prev.products.filter(p => p.id !== data.productId)
      } : null);
    }
  };

  const handleReactionAdded = (data: any) => {
    if (data.wishlistId === wishlistId) {
      setWishlist(prev => prev ? {
        ...prev,
        products: prev.products.map(p => {
          if (p.id === data.productId) {
            const reactions = p.reactions.filter(r => r.userId !== data.userId);
            reactions.push({ userId: data.userId, emoji: data.emoji, createdAt: new Date().toISOString() });
            return { ...p, reactions };
          }
          return p;
        })
      } : null);
    }
  };

  const handleAddProduct = async (productData: Partial<Product>) => {
    try {
      const product = await api.post(`/wishlists/${wishlistId}/products`, productData);
      setWishlist(prev => prev ? {
        ...prev,
        products: [...prev.products, product]
      } : null);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async (productData: Partial<Product>) => {
    if (!editingProduct) return;
    
    try {
      const product = await api.put(`/wishlists/${wishlistId}/products/${editingProduct.id}`, productData);
      setWishlist(prev => prev ? {
        ...prev,
        products: prev.products.map(p => p.id === editingProduct.id ? product : p)
      } : null);
      setEditingProduct(undefined);
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await api.delete(`/wishlists/${wishlistId}/products/${productId}`);
      setWishlist(prev => prev ? {
        ...prev,
        products: prev.products.filter(p => p.id !== productId)
      } : null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleReact = async (productId: string, emoji: string) => {
    try {
      await api.post(`/wishlists/${wishlistId}/products/${productId}/reactions`, { emoji });
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleInvite = async (email: string) => {
    try {
      await api.post(`/wishlists/${wishlistId}/invite`, { email });
      // Reload wishlist to show new collaborator
      loadWishlist();
    } catch (error) {
      console.error('Error inviting user:', error);
      alert('Error inviting user. Please make sure the email is registered.');
    }
  };

  const getUserById = (userId: string) => {
    return users.find(u => u._id === userId || u.id === userId);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </Layout>
    );
  }

  if (!wishlist) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-white/60 text-lg">Wishlist not found</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Wishlists</span>
            </button>
            <h1 className="text-3xl font-bold text-white">{wishlist.name}</h1>
            <p className="text-white/70 mt-1">{wishlist.description}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-white/60">
              <span>Created by: {wishlist.createdBy?.name || 'Unknown'}</span>
              <span>•</span>
              <span>Collaborators: {wishlist.collaborators.length}</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {wishlist.products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg mb-4">No products in this wishlist yet.</div>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Add the first product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.products.map(product => (
              <ProductCard
                key={product._id || product.id}
                product={{
                  ...product,
                  id: product._id || product.id
                }}
                onEdit={(product) => {
                  setEditingProduct(product);
                  setShowAddModal(true);
                }}
                onDelete={handleDeleteProduct}
                onReact={handleReact}
                users={users}
                getUserById={getUserById}
              />
            ))}
          </div>
        )}
      </div>

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingProduct(undefined);
        }}
        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
        editingProduct={editingProduct}
      />

      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInvite}
      />
    </Layout>
  );
};