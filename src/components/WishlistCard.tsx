import React from 'react';
import { Wishlist } from '../types';
import { Calendar, Users, Package } from 'lucide-react';

interface WishlistCardProps {
  wishlist: Wishlist;
  onClick: () => void;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({ wishlist, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-white truncate">{wishlist.name}</h3>
        <div className="flex items-center space-x-1 text-white/60">
          <Package className="w-4 h-4" />
          <span className="text-sm">{wishlist.products.length}</span>
        </div>
      </div>
      
      <p className="text-white/70 text-sm mb-4 line-clamp-2">{wishlist.description}</p>
      
      <div className="flex items-center justify-between text-xs text-white/60">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(wishlist.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="w-3 h-3" />
          <span>{wishlist.collaborators.length + 1}</span>
        </div>
      </div>
    </div>
  );
};