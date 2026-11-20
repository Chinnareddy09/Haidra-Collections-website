import React from 'react';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types/jewellery';
import { formatINR } from '../utils/csvParser';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) => {
  const isOutOfStock = product.stockStatus === 'Out of Stock';

  return (
    <article className="group bg-white border border-[#E6DEC8] rounded-lg overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Image Frame */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F6F1E7]">
        <button
          type="button"
          onClick={() => onQuickView(product)}
          aria-label={`Quick view ${product.name}`}
          className="w-full h-full block text-left focus-visible:outline-2 focus-visible:outline-[#5C162E]"
        >
          <ResilientImage
            src={product.imageUrl}
            alt={product.name}
            fallbackLabel={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </button>

        {/* Wishlist Heart Toggle */}
        <button
          type="button"
          onClick={() => onToggleWishlist(product)}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-md flex items-center justify-center border transition-colors ${
            isWishlisted
              ? 'bg-[#5C162E] text-[#FDFBF7] border-[#5C162E]'
              : 'bg-[#FDFBF7]/90 text-[#1F1A17] border-[#E6DEC8] hover:border-[#5C162E] hover:text-[#5C162E]'
          }`}
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`}
            aria-hidden="true"
          />
        </button>

        {/* Single Quiet Stock Indicator */}
        <span
          className={`absolute bottom-2.5 left-2.5 px-2 py-0.5 text-[11px] font-medium rounded border ${
            product.stockStatus === 'In Stock'
              ? 'bg-[#FDFBF7]/95 text-[#1F1A17] border-[#E6DEC8]'
              : product.stockStatus === 'Pre-Order'
              ? 'bg-[#FDFBF7]/95 text-[#9D7918] border-[#C59B27]'
              : 'bg-[#1F1A17]/90 text-[#FDFBF7] border-[#1F1A17]'
          }`}
        >
          {product.stockStatus}
        </span>
      </div>

      {/* Product Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <p className="text-xs text-[#635850] truncate">
            <span>{product.category === 'MEN' ? 'Men' : 'Women'}</span>
            <span aria-hidden="true" className="mx-1.5">
              ·
            </span>
            <span>{product.subcategory}</span>
          </p>
          <h3 className="mt-1 font-serif text-base font-semibold text-[#1F1A17] leading-snug line-clamp-2">
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="text-left hover:text-[#5C162E] transition-colors"
            >
              {product.name}
            </button>
          </h3>
        </div>

        <div className="pt-2 border-t border-[#F0E9DA] space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-lg font-bold text-[#5C162E] tabular-nums">
              {formatINR(product.price)}
            </span>
            <span className="text-xs text-[#635850] tabular-nums">
              {product.id}
            </span>
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-2">
            <button
              type="button"
              onClick={() => onQuickView(product)}
              aria-label={`Quick view details for ${product.name}`}
              className="px-3 py-2 text-xs font-medium text-[#1F1A17] bg-[#F6F1E7] hover:bg-[#EAE1CF] border border-[#E6DEC8] rounded-md inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Quick View</span>
            </button>
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={() => onAddToCart(product)}
              aria-label={
                isOutOfStock
                  ? `${product.name} is out of stock`
                  : `Add ${product.name} to cart`
              }
              className={`px-3 py-2 text-xs font-semibold rounded-md inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
                isOutOfStock
                  ? 'bg-[#E6DEC8] text-[#635850] cursor-not-allowed'
                  : 'bg-[#5C162E] hover:bg-[#430F21] text-[#FDFBF7]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
