import React, { useState } from 'react';
import { Product } from '../types';
import { Edit3, Trash2, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onReact: (productId: string, emoji: string) => void;
  users: any[];
  getUserById?: (userId: string) => any;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onReact,
  users,
  getUserById
}) => {
  const { user } = useAuth();
  const [showReactions, setShowReactions] = useState(false);
  
  const addedByUser = getUserById ? getUserById(product.addedBy) : users.find(u => (u._id || u.id) === product.addedBy);

  const reactions = ['❤️', '👍', '🔥', '😍', '🎉'];

  const canEdit = user?.id === product.addedBy || user?.id === (product.addedBy as any)?._id;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
      <div className="aspect-w-16 aspect-h-9 bg-white/5">
        <img
          src={product.imageUrl || 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400';
          }}
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white truncate">{product.name}</h3>
          <div className="flex space-x-2">
            {canEdit && (
              <>
                <button
                  onClick={() => onEdit(product)}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 text-white/60 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
        
        <p className="text-white/70 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-green-400">${product.price}</span>
          <span className="text-xs text-white/60">
            Added by {addedByUser?.name || 'Unknown'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="flex items-center space-x-1 px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-xs text-white">{product.reactions?.length || 0}</span>
              </button>
              
              {showReactions && (
                <div className="absolute bottom-full mb-2 left-0 bg-black/80 backdrop-blur-md rounded-lg p-2 flex space-x-1 z-10">
                  {reactions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        onReact(product.id, emoji);
                        setShowReactions(false);
                      }}
                      className="hover:bg-white/20 rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex space-x-1">
              {product.reactions?.slice(0, 3).map((reaction, index) => (
                <span key={index} className="text-sm">
                  {reaction.emoji}
                </span>
              ))}
            </div>
          </div>
          
          <button className="flex items-center space-x-1 text-white/60 hover:text-white transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">{product.comments?.length || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
};