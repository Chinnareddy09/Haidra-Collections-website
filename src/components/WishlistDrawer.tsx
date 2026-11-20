import React, { useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, X } from 'lucide-react';
import { Product } from '../types/jewellery';
import { formatINR } from '../utils/csvParser';
import { ResilientImage } from './ResilientImage';

interface WishlistDrawerProps {
  isOpen: boolean;
  items: Product[];
  onClose: () => void;
  onRemove: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onRemove,
  onMoveToCart,
  onQuickView,
}) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);
    }
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-drawer-title"
      className="fixed inset-0 z-50 flex justify-end"
    >
      <div
        className="fixed inset-0 bg-[#1F1A17]/55 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl border-l border-[#E6DEC8] flex flex-col">
        <div className="px-5 py-4 border-b border-[#E6DEC8] bg-[#F6F1E7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-[#5C162E]" aria-hidden="true" />
            <h2
              id="wishlist-drawer-title"
              className="font-serif text-lg font-bold text-[#1F1A17]"
            >
              Saved Wishlist ({items.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close wishlist"
            className="p-1.5 text-[#1F1A17] hover:text-[#5C162E] rounded-md"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <Heart
                className="w-10 h-10 text-[#C59B27] mb-3"
                aria-hidden="true"
              />
              <p className="font-serif text-lg font-semibold text-[#1F1A17]">
                No saved items yet
              </p>
              <p className="text-sm text-[#635850] mt-1 max-w-xs">
                Tap the heart icon on any design to save your bridal and festive favorites here.
              </p>
            </div>
          ) : (
            items.map((product) => {
              const outOfStock = product.stockStatus === 'Out of Stock';
              return (
                <div
                  key={product.id}
                  className="flex gap-3.5 p-3 bg-white border border-[#E6DEC8] rounded-lg"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onQuickView(product);
                    }}
                    className="w-20 h-20 rounded-md overflow-hidden bg-[#F6F1E7] shrink-0"
                  >
                    <ResilientImage
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-serif text-sm font-semibold text-[#1F1A17] truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#635850] mt-0.5 truncate">
                          {product.subcategory}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(product)}
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="p-1 text-[#635850] hover:text-[#991B1B]"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2">
                      <span className="text-sm font-bold text-[#5C162E] tabular-nums">
                        {formatINR(product.price)}
                      </span>
                      <button
                        type="button"
                        disabled={outOfStock}
                        onClick={() => onMoveToCart(product)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md inline-flex items-center gap-1.5 ${
                          outOfStock
                            ? 'bg-[#E6DEC8] text-[#635850] cursor-not-allowed'
                            : 'bg-[#5C162E] hover:bg-[#430F21] text-[#FDFBF7]'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{outOfStock ? 'Out of Stock' : 'Move to Cart'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
