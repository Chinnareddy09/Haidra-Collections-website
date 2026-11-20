import React, { useEffect } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { CartItem } from '../types/jewellery';
import { formatINR } from '../utils/csvParser';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  freeShippingThreshold: number;
  onClose: () => void;
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  freeShippingThreshold,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
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

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const amountRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(
    100,
    Math.round((subtotal / Math.max(1, freeShippingThreshold)) * 100)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 flex justify-end"
    >
      <div
        className="fixed inset-0 bg-[#1F1A17]/55 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl border-l border-[#E6DEC8] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E6DEC8] bg-[#F6F1E7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#5C162E]" aria-hidden="true" />
            <h2
              id="cart-drawer-title"
              className="font-serif text-lg font-bold text-[#1F1A17]"
            >
              Your Jewellery Bag
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping cart"
            className="p-1.5 text-[#1F1A17] hover:text-[#5C162E] rounded-md"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Free Shipping Bar */}
        {items.length > 0 && (
          <div className="px-5 py-3 bg-white border-b border-[#E6DEC8]">
            <div className="flex items-center gap-2 text-xs font-medium text-[#1F1A17]">
              <Truck className="w-4 h-4 text-[#C59B27] shrink-0" aria-hidden="true" />
              {amountRemaining === 0 ? (
                <span className="text-[#145332]">
                  Free Insured Pan-India Delivery unlocked
                </span>
              ) : (
                <span>
                  Add <strong className="tabular-nums">{formatINR(amountRemaining)}</strong>{' '}
                  more for Free Delivery
                </span>
              )}
            </div>
            <div className="mt-2 h-1.5 w-full bg-[#F6F1E7] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C59B27] transition-all duration-300"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag
                className="w-10 h-10 text-[#C59B27] mb-3"
                aria-hidden="true"
              />
              <p className="font-serif text-lg font-semibold text-[#1F1A17]">
                Your jewellery bag is empty
              </p>
              <p className="text-sm text-[#635850] mt-1 max-w-xs">
                Explore our 1-gram gold harams, bridal vaddanams, and daily wear chains.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 px-5 py-2.5 bg-[#5C162E] text-[#FDFBF7] text-sm font-semibold rounded-md hover:bg-[#430F21]"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.key}
                className="flex gap-3.5 p-3 bg-white border border-[#E6DEC8] rounded-lg"
              >
                <div className="w-20 h-20 rounded-md overflow-hidden bg-[#F6F1E7] shrink-0">
                  <ResilientImage
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-serif text-sm font-semibold text-[#1F1A17] truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-[#635850] mt-0.5 truncate">
                        {item.selectedSize} · {item.selectedColor}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.key)}
                      aria-label={`Remove ${item.product.name} from cart`}
                      className="p-1 text-[#635850] hover:text-[#991B1B]"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2">
                    <div className="inline-flex items-center border border-[#E6DEC8] rounded bg-[#FDFBF7]">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.product.name}`}
                        onClick={() => onUpdateQuantity(item.key, -1)}
                        className="p-1.5 text-[#1F1A17] hover:bg-[#F6F1E7]"
                      >
                        <Minus className="w-3 h-3" aria-hidden="true" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.product.name}`}
                        onClick={() => onUpdateQuantity(item.key, 1)}
                        className="p-1.5 text-[#1F1A17] hover:bg-[#F6F1E7]"
                      >
                        <Plus className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-[#5C162E] tabular-nums">
                      {formatINR(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E6DEC8] bg-[#F6F1E7] space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#635850]">Subtotal</span>
              <span className="text-lg font-bold text-[#1F1A17] tabular-nums">
                {formatINR(subtotal)}
              </span>
            </div>
            <p className="text-xs text-[#635850]">
              Cash on Delivery &amp; UPI accepted. Direct workshop packaging.
            </p>
            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-3 px-4 bg-[#5C162E] hover:bg-[#430F21] text-[#FDFBF7] text-sm font-semibold rounded-md transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
