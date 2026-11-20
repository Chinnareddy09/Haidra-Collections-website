import React, { useEffect, useState } from 'react';
import {
  ChevronRight,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  X,
} from 'lucide-react';
import { Product } from '../types/jewellery';
import { buildProductWhatsAppUrl, formatINR } from '../utils/csvParser';
import { ResilientImage } from './ResilientImage';

interface QuickViewModalProps {
  product: Product | null;
  storeName: string;
  whatsappNumber: string;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (
    product: Product,
    size: string,
    color: string,
    quantity: number
  ) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  storeName,
  whatsappNumber,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.availableSizes[0] || 'Free Size');
      setSelectedColor(product.availableColors[0] || 'Antique Gold');
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      window.addEventListener('keydown', onKeyDown);
    }
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const isOutOfStock = product.stockStatus === 'Out of Stock';
  const whatsappHref = buildProductWhatsAppUrl({
    whatsappNumber,
    storeName,
    product,
    selectedSize: selectedSize || product.availableSizes[0] || 'Free Size',
    selectedColor: selectedColor || product.availableColors[0] || 'Antique Gold',
    quantity,
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div
        className="fixed inset-0 bg-[#1F1A17]/65 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-[#FDFBF7] border border-[#E6DEC8] rounded-xl shadow-2xl overflow-hidden my-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product quick view"
          className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-md bg-white/95 border border-[#E6DEC8] flex items-center justify-center text-[#1F1A17] hover:text-[#5C162E] transition-colors"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
          {/* Left: Product Image */}
          <div className="bg-[#F6F1E7] aspect-[4/3] md:aspect-auto md:min-h-[440px] relative">
            <ResilientImage
              src={product.imageUrl}
              alt={product.name}
              fallbackLabel={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between gap-5 max-h-[85vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Breadcrumb & Product ID */}
              <div className="flex flex-wrap items-center justify-between gap-2 pr-8 text-xs text-[#635850]">
                <span className="inline-flex items-center gap-1">
                  <span>{product.category}</span>
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="text-[#5C162E] font-medium">
                    {product.subcategory}
                  </span>
                </span>
                <span className="font-mono tabular-nums">
                  ID: {product.id}
                </span>
              </div>

              <div>
                <h2
                  id="quick-view-title"
                  className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1A17] leading-tight"
                >
                  {product.name}
                </h2>
                <div className="mt-2.5 flex items-center gap-3">
                  <span className="text-2xl font-bold text-[#5C162E] tabular-nums">
                    {formatINR(product.price)}
                  </span>
                  <span className="text-xs text-[#635850]">·</span>
                  <span
                    className={`text-xs font-semibold ${
                      product.stockStatus === 'In Stock'
                        ? 'text-[#1F1A17]'
                        : product.stockStatus === 'Pre-Order'
                        ? 'text-[#9D7918]'
                        : 'text-[#991B1B]'
                    }`}
                  >
                    {product.stockStatus}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#4A423C] leading-relaxed">
                {product.description}
              </p>

              {/* Selectable Available Sizes */}
              <div>
                <p className="text-xs font-semibold text-[#1F1A17] mb-2">
                  Available Sizes:{' '}
                  <span className="font-normal text-[#635850]">
                    {selectedSize}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size) => {
                    const active = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                          active
                            ? 'bg-[#5C162E] text-[#FDFBF7] border-[#5C162E]'
                            : 'bg-white text-[#1F1A17] border-[#E6DEC8] hover:border-[#C59B27]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selectable Available Colors */}
              <div>
                <p className="text-xs font-semibold text-[#1F1A17] mb-2">
                  Finish / Color:{' '}
                  <span className="font-normal text-[#635850]">
                    {selectedColor}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.availableColors.map((color) => {
                    const active = selectedColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                          active
                            ? 'bg-[#C59B27] text-[#1F1A17] border-[#9D7918] font-semibold'
                            : 'bg-white text-[#1F1A17] border-[#E6DEC8] hover:border-[#C59B27]'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 pt-1">
                <span className="text-xs font-semibold text-[#1F1A17]">
                  Quantity
                </span>
                <div className="inline-flex items-center border border-[#E6DEC8] rounded-md bg-white">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-[#1F1A17] hover:bg-[#F6F1E7]"
                  >
                    <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <span className="px-4 text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    className="p-2 text-[#1F1A17] hover:bg-[#F6F1E7]"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#E6DEC8] space-y-2.5">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => {
                    onAddToCart(
                      product,
                      selectedSize || product.availableSizes[0] || 'Free Size',
                      selectedColor ||
                        product.availableColors[0] ||
                        'Antique Gold',
                      quantity
                    );
                    onClose();
                  }}
                  className={`flex-1 py-3 px-4 text-sm font-semibold rounded-md inline-flex items-center justify-center gap-2 transition-colors ${
                    isOutOfStock
                      ? 'bg-[#E6DEC8] text-[#635850] cursor-not-allowed'
                      : 'bg-[#5C162E] hover:bg-[#430F21] text-[#FDFBF7]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {isOutOfStock
                      ? 'Currently Out of Stock'
                      : `Add to Cart · ${formatINR(product.price * quantity)}`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  aria-label={
                    isWishlisted
                      ? `Remove ${product.name} from wishlist`
                      : `Save ${product.name} to wishlist`
                  }
                  className={`p-3 rounded-md border transition-colors ${
                    isWishlisted
                      ? 'bg-[#5C162E] text-[#FDFBF7] border-[#5C162E]'
                      : 'bg-white text-[#1F1A17] border-[#E6DEC8] hover:border-[#5C162E]'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
                    aria-hidden="true"
                  />
                </button>
              </div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 text-sm font-semibold rounded-md border border-[#1E6B43] bg-[#EFF8F3] hover:bg-[#DFF2E7] text-[#145332] inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
