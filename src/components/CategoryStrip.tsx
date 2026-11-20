import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FEATURED_CATEGORY_CARDS } from '../data/categories';
import { CategoryName } from '../types/jewellery';
import { ResilientImage } from './ResilientImage';

interface CategoryStripProps {
  activeSubcategory: string;
  onSelectCategoryCard: (category: CategoryName, subcategory: string) => void;
}

export const CategoryStrip: React.FC<CategoryStripProps> = ({
  activeSubcategory,
  onSelectCategoryCard,
}) => {
  return (
    <section
      aria-labelledby="shop-by-categories-heading"
      className="py-10 sm:py-12 border-b border-[#E6DEC8] bg-[#FDFBF7]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-medium text-[#9D7918] mb-1">
              Curated Subcategories
            </p>
            <h2
              id="shop-by-categories-heading"
              className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1A17]"
            >
              Shop by Categories
            </h2>
          </div>
          <p className="hidden sm:block text-sm text-[#635850]">
            Select any collection to filter the catalog below
          </p>
        </div>

        <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
          {FEATURED_CATEGORY_CARDS.map((card) => {
            const isSelected =
              activeSubcategory.toLowerCase() === card.subcategory.toLowerCase();
            return (
              <button
                key={card.id}
                type="button"
                onClick={() =>
                  onSelectCategoryCard(card.category, card.subcategory)
                }
                className={`group shrink-0 w-44 sm:w-52 snap-start text-left rounded-lg overflow-hidden border transition-all duration-200 ${
                  isSelected
                    ? 'border-[#5C162E] ring-1 ring-[#5C162E] bg-[#F6F1E7]'
                    : 'border-[#E6DEC8] bg-white hover:border-[#C59B27]'
                }`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#F6F1E7]">
                  <ResilientImage
                    src={card.imageUrl}
                    alt={card.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-serif text-sm font-semibold text-[#1F1A17] group-hover:text-[#5C162E] truncate">
                      {card.label}
                    </span>
                    <ArrowUpRight
                      className="w-3.5 h-3.5 text-[#9D7918] shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-xs text-[#635850] mt-0.5 truncate">
                    {card.caption}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
