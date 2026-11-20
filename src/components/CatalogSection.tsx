import React from 'react';
import { ArrowUpDown, RotateCcw, SlidersHorizontal } from 'lucide-react';
import {
  BRIDAL_SUBCATEGORIES,
  MEN_SUBCATEGORIES,
  WOMEN_SUBCATEGORIES,
} from '../data/categories';
import {
  CatalogFilterState,
  CatalogTab,
  CategoryName,
  Product,
  SortOption,
} from '../types/jewellery';
import { ProductCard } from './ProductCard';

interface CatalogSectionProps {
  products: Product[];
  totalCatalogCount: number;
  filters: CatalogFilterState;
  wishlistIds: Set<string>;
  onChangeTab: (tab: CatalogTab) => void;
  onChangeSubcategory: (category: CategoryName | 'ALL', subcategory: string) => void;
  onChangeSort: (sort: SortOption) => void;
  onToggleInStockOnly: () => void;
  onResetFilters: () => void;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const TABS: { id: CatalogTab; label: string }[] = [
  { id: 'ALL', label: 'All Products' },
  { id: 'WOMEN', label: 'Women' },
  { id: 'MEN', label: 'Men' },
  { id: 'BRIDAL', label: 'Bridal Collection' },
  { id: 'NEW_ARRIVALS', label: 'New Arrivals' },
];

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  totalCatalogCount,
  filters,
  wishlistIds,
  onChangeTab,
  onChangeSubcategory,
  onChangeSort,
  onToggleInStockOnly,
  onResetFilters,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) => {
  const activeSubcategoryOptions: { category: CategoryName; label: string }[] =
    React.useMemo(() => {
      if (filters.tab === 'MEN' || filters.category === 'MEN') {
        return MEN_SUBCATEGORIES.map((label) => ({ category: 'MEN', label }));
      }
      if (filters.tab === 'BRIDAL') {
        return WOMEN_SUBCATEGORIES.filter((s) =>
          BRIDAL_SUBCATEGORIES.has(s)
        ).map((label) => ({ category: 'WOMEN', label }));
      }
      if (filters.tab === 'WOMEN' || filters.category === 'WOMEN') {
        return WOMEN_SUBCATEGORIES.map((label) => ({ category: 'WOMEN', label }));
      }
      // For ALL / NEW_ARRIVALS show curated top subcategories + Men's
      return [
        ...WOMEN_SUBCATEGORIES.map((label) => ({
          category: 'WOMEN' as CategoryName,
          label,
        })),
        ...MEN_SUBCATEGORIES.filter((s) => s !== 'Rings').map((label) => ({
          category: 'MEN' as CategoryName,
          label,
        })),
      ];
    }, [filters.tab, filters.category]);

  const hasActiveFilters =
    filters.tab !== 'ALL' ||
    filters.category !== 'ALL' ||
    filters.subcategory !== '' ||
    filters.searchQuery.trim() !== '' ||
    filters.inStockOnly ||
    filters.sortBy !== 'featured';

  return (
    <section
      id="catalog-section"
      aria-labelledby="catalog-heading"
      className="py-12 sm:py-16 bg-[#FDFBF7]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E6DEC8]">
          <div>
            <p className="text-xs font-medium text-[#9D7918] mb-1">
              1-Gram Micro Gold Covering Collection
            </p>
            <h2
              id="catalog-heading"
              className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1A17]"
            >
              Signature Jewellery Catalog
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Stock Status Toggle */}
            <button
              type="button"
              onClick={onToggleInStockOnly}
              aria-pressed={filters.inStockOnly}
              className={`px-3.5 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
                filters.inStockOnly
                  ? 'bg-[#5C162E] text-[#FDFBF7] border-[#5C162E]'
                  : 'bg-white text-[#1F1A17] border-[#E6DEC8] hover:border-[#C59B27]'
              }`}
            >
              {filters.inStockOnly ? 'In Stock Only' : 'Show All Stock'}
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-2 bg-white border border-[#E6DEC8] rounded-md px-3 py-1.5">
              <ArrowUpDown
                className="w-3.5 h-3.5 text-[#635850]"
                aria-hidden="true"
              />
              <label htmlFor="catalog-sort" className="sr-only">
                Sort products by price
              </label>
              <select
                id="catalog-sort"
                value={filters.sortBy}
                onChange={(e) => onChangeSort(e.target.value as SortOption)}
                className="text-xs font-medium text-[#1F1A17] bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs Row */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Collection Tabs"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F6F1E7] border border-[#E6DEC8] rounded-lg"
          >
            {TABS.map((tab) => {
              const active = filters.tab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onChangeTab(tab.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#5C162E] text-[#FDFBF7] shadow-xs'
                      : 'text-[#1F1A17] hover:bg-white/70'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs text-[#635850]">
            <span className="tabular-nums">
              Showing <strong className="text-[#1F1A17]">{products.length}</strong>{' '}
              of <strong className="text-[#1F1A17]">{totalCatalogCount}</strong>{' '}
              designs
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#5C162E] hover:underline whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Subcategory Filter Buttons */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#635850] shrink-0 pr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Subcategory:</span>
          </span>
          <button
            type="button"
            onClick={() =>
              onChangeSubcategory(
                filters.tab === 'MEN'
                  ? 'MEN'
                  : filters.tab === 'WOMEN' || filters.tab === 'BRIDAL'
                  ? 'WOMEN'
                  : 'ALL',
                ''
              )
            }
            className={`px-3 py-1.5 text-xs font-medium rounded-md border shrink-0 whitespace-nowrap transition-colors ${
              filters.subcategory === ''
                ? 'bg-[#1F1A17] text-[#FDFBF7] border-[#1F1A17]'
                : 'bg-white text-[#1F1A17] border-[#E6DEC8] hover:border-[#C59B27]'
            }`}
          >
            All Subcategories
          </button>
          {activeSubcategoryOptions.map((item) => {
            const isSelected =
              filters.subcategory.toLowerCase() === item.label.toLowerCase() &&
              (filters.category === 'ALL' || filters.category === item.category);
            return (
              <button
                key={`${item.category}-${item.label}`}
                type="button"
                onClick={() => onChangeSubcategory(item.category, item.label)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border shrink-0 whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#C59B27] text-[#1F1A17] border-[#9D7918] font-semibold'
                    : 'bg-white text-[#1F1A17] border-[#E6DEC8] hover:border-[#C59B27]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Active Search Query Notice */}
        {filters.searchQuery.trim() && (
          <div className="mt-4 px-4 py-2.5 bg-[#F6F1E7] border border-[#E6DEC8] rounded-md flex items-center justify-between gap-3 text-sm">
            <span>
              Search results for{' '}
              <strong className="text-[#5C162E]">
                &ldquo;{filters.searchQuery.trim()}&rdquo;
              </strong>
            </span>
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs font-semibold text-[#5C162E] hover:underline whitespace-nowrap"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Product Grid or Empty State */}
        {products.length === 0 ? (
          <div className="mt-10 py-16 px-6 text-center bg-white border border-[#E6DEC8] rounded-lg">
            <h3 className="font-serif text-xl font-semibold text-[#1F1A17]">
              No matching jewellery found
            </h3>
            <p className="mt-2 text-sm text-[#635850] max-w-md mx-auto">
              Try clearing your search term or switching to another category or stock filter.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-5 px-5 py-2.5 bg-[#5C162E] hover:bg-[#430F21] text-[#FDFBF7] text-sm font-semibold rounded-md transition-colors"
            >
              View All Designs
            </button>
          </div>
        ) : (
          <div
            data-testid="product-grid"
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.has(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
