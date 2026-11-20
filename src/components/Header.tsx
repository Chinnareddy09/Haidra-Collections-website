import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Heart,
  Menu,
  PackageSearch,
  Search,
  Settings,
  ShoppingBag,
  X,
} from 'lucide-react';
import {
  MEN_SUBCATEGORIES,
  WOMEN_MEGA_MENU_GROUPS,
} from '../data/categories';
import { CatalogTab, CategoryName } from '../types/jewellery';

interface HeaderProps {
  storeName: string;
  announcementText: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectHome: () => void;
  onSelectTab: (tab: CatalogTab) => void;
  onSelectSubcategory: (category: CategoryName, subcategory: string) => void;
  wishlistCount: number;
  cartCount: number;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  onOpenSettings: () => void;
  onOpenTrackOrder: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  storeName,
  announcementText,
  searchQuery,
  onSearchChange,
  onSelectHome,
  onSelectTab,
  onSelectSubcategory,
  wishlistCount,
  cartCount,
  onOpenWishlist,
  onOpenCart,
  onOpenSettings,
  onOpenTrackOrder,
}) => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [activeMenu, setActiveMenu] = useState<'MEN' | 'WOMEN' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<'MEN' | 'WOMEN' | null>('WOMEN');
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleSubcategoryClick = (category: CategoryName, subcategory: string) => {
    onSelectSubcategory(category, subcategory);
    setActiveMenu(null);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Slim Non-Sticky Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-[#5C162E] text-[#FDFBF7] text-xs py-2 px-4 flex items-center justify-center relative border-b border-[#C59B27]/30 z-40">
          <p className="text-center font-medium tracking-wide truncate pr-8">
            {announcementText}
          </p>
          <button
            type="button"
            onClick={() => setShowAnnouncement(false)}
            aria-label="Dismiss announcement"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#FDFBF7]/80 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Main Sticky Header */}
      <header
        ref={headerRef}
        className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E6DEC8]"
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4 xl:gap-6">
          {/* Zone 1: Brand Logo & Name */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 lg:flex-initial">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-1.5 -ml-1 text-[#1F1A17] hover:text-[#5C162E] rounded-md shrink-0 focus-visible:outline-2 focus-visible:outline-[#5C162E]"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                onSelectHome();
              }}
              className="flex items-center gap-2 min-w-0 group focus-visible:outline-2 focus-visible:outline-[#5C162E] rounded-md"
            >
              <img
                src="/assets/aistudio/Haridra_Lgo_b038aa37.jpg"
                alt={`${storeName} logo`}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-md object-cover border border-[#C59B27]/50 bg-white shrink-0"
              />
              <span className="font-serif text-sm sm:text-base xl:text-lg font-bold text-[#1F1A17] group-hover:text-[#5C162E] transition-colors whitespace-nowrap truncate max-w-[155px] sm:max-w-[230px] lg:max-w-[215px] xl:max-w-[285px]">
                {storeName}
              </span>
            </a>
          </div>

          {/* Zone 2: Desktop Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-4 xl:gap-6 text-[13px] xl:text-sm font-medium text-[#1F1A17] shrink-0"
          >
            <button
              type="button"
              onClick={onSelectHome}
              className="whitespace-nowrap shrink-0 py-1 hover:text-[#5C162E] border-b-2 border-transparent hover:border-[#C59B27] transition-colors"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('NEW_ARRIVALS')}
              className="whitespace-nowrap shrink-0 py-1 hover:text-[#5C162E] border-b-2 border-transparent hover:border-[#C59B27] transition-colors"
            >
              New Arrivals
            </button>

            {/* MEN Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMenu('MEN')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                type="button"
                aria-expanded={activeMenu === 'MEN'}
                onClick={() => {
                  if (activeMenu === 'MEN') {
                    onSelectTab('MEN');
                    setActiveMenu(null);
                  } else {
                    setActiveMenu('MEN');
                  }
                }}
                className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-1 hover:text-[#5C162E] border-b-2 border-transparent hover:border-[#C59B27] transition-colors"
              >
                <span>Men</span>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              {activeMenu === 'MEN' && (
                <div className="absolute left-0 top-full pt-2 w-72">
                  <div className="bg-[#FDFBF7] border border-[#E6DEC8] shadow-xl rounded-lg p-4">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E6DEC8]">
                      <span className="font-serif text-sm font-semibold text-[#5C162E]">
                        Men&apos;s 1-Gram Gold
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('MEN');
                          setActiveMenu(null);
                        }}
                        className="text-xs font-medium text-[#9D7918] hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    <ul className="space-y-1">
                      {MEN_SUBCATEGORIES.map((sub) => (
                        <li key={sub}>
                          <button
                            type="button"
                            onClick={() => handleSubcategoryClick('MEN', sub)}
                            className="w-full text-left text-sm text-[#1F1A17] hover:text-[#5C162E] hover:bg-[#F6F1E7] px-2.5 py-2 rounded-md transition-colors"
                          >
                            {sub}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* WOMEN Mega Menu */}
            <div
              className="static"
              onMouseEnter={() => setActiveMenu('WOMEN')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                type="button"
                aria-expanded={activeMenu === 'WOMEN'}
                onClick={() => {
                  if (activeMenu === 'WOMEN') {
                    onSelectTab('WOMEN');
                    setActiveMenu(null);
                  } else {
                    setActiveMenu('WOMEN');
                  }
                }}
                className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-1 hover:text-[#5C162E] border-b-2 border-transparent hover:border-[#C59B27] transition-colors"
              >
                <span>Women</span>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              {activeMenu === 'WOMEN' && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 w-[min(92vw,960px)] z-50">
                  <div className="bg-[#FDFBF7] border border-[#E6DEC8] shadow-2xl rounded-lg p-6">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E6DEC8]">
                      <div>
                        <h3 className="font-serif text-base font-semibold text-[#5C162E]">
                          Women&apos;s Traditional &amp; Bridal Collections
                        </h3>
                        <p className="text-xs text-[#635850]">
                          22 curated subcategories across temple, matte, CZ, and daily wear jewellery
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('WOMEN');
                          setActiveMenu(null);
                        }}
                        className="px-3 py-1.5 text-xs font-medium bg-[#5C162E] text-[#FDFBF7] rounded-md hover:bg-[#430F21] transition-colors whitespace-nowrap shrink-0"
                      >
                        Shop All Women
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                      {WOMEN_MEGA_MENU_GROUPS.map((group) => (
                        <div key={group.title}>
                          <h4 className="text-xs font-semibold tracking-wide text-[#9D7918] mb-2.5 pb-1 border-b border-[#E6DEC8]">
                            {group.title}
                          </h4>
                          <ul className="space-y-1">
                            {group.items.map((sub) => (
                              <li key={sub}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSubcategoryClick('WOMEN', sub)
                                  }
                                  className="w-full text-left text-[13px] leading-snug text-[#1F1A17] hover:text-[#5C162E] hover:bg-[#F6F1E7] px-2 py-1.5 rounded transition-colors"
                                >
                                  {sub}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onSelectTab('BRIDAL')}
              className="whitespace-nowrap shrink-0 py-1 hover:text-[#5C162E] border-b-2 border-transparent hover:border-[#C59B27] transition-colors"
            >
              Bridal Collection
            </button>
            <button
              type="button"
              onClick={onOpenTrackOrder}
              className="whitespace-nowrap shrink-0 py-1 hover:text-[#5C162E] border-b-2 border-transparent hover:border-[#C59B27] transition-colors"
            >
              Track Order
            </button>
          </nav>

          {/* Zone 3: Live Search & Action Icons */}
          <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
            <div className="hidden md:flex items-center relative mr-1">
              <Search
                className="w-4 h-4 text-[#635850] absolute left-3 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search harams, vaddanam..."
                aria-label="Search jewellery catalog"
                className="w-36 lg:w-40 xl:w-48 pl-9 pr-3 py-1.5 text-sm bg-[#F6F1E7] border border-[#E6DEC8] rounded-md text-[#1F1A17] placeholder:text-[#635850] focus:outline-none focus:border-[#5C162E] focus:bg-white transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              aria-label="Toggle search bar"
              className="md:hidden p-1.5 text-[#1F1A17] hover:text-[#5C162E] rounded-md"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onOpenWishlist}
              aria-label={`Open wishlist (${wishlistCount} items)`}
              className="relative p-1.5 sm:p-2 text-[#1F1A17] hover:text-[#5C162E] rounded-md transition-colors"
            >
              <Heart className="w-5 h-5" aria-hidden="true" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#5C162E] text-[#FDFBF7] text-[10px] font-semibold tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Open shopping cart (${cartCount} items)`}
              className="relative p-1.5 sm:p-2 text-[#1F1A17] hover:text-[#5C162E] rounded-md transition-colors"
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#C59B27] text-[#1F1A17] text-[10px] font-bold tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="Store & Google Sheets CSV Settings"
              title="CSV Feed & Store Settings"
              className="p-1.5 sm:p-2 text-[#1F1A17] hover:text-[#5C162E] rounded-md transition-colors"
            >
              <Settings className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden px-4 pb-3 pt-1 border-t border-[#E6DEC8] bg-[#FDFBF7]">
            <div className="relative flex items-center">
              <Search
                className="w-4 h-4 text-[#635850] absolute left-3 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search harams, vaddanam, chains..."
                aria-label="Search jewellery catalog mobile"
                className="w-full pl-9 pr-8 py-2 text-sm bg-[#F6F1E7] border border-[#E6DEC8] rounded-md text-[#1F1A17] placeholder:text-[#635850] focus:outline-none focus:border-[#5C162E]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 p-1 text-[#635850]"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 lg:hidden flex"
        >
          <div
            className="fixed inset-0 bg-[#1F1A17]/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-[#FDFBF7] h-full shadow-2xl flex flex-col overflow-hidden border-r border-[#E6DEC8]">
            <div className="px-4 py-4 border-b border-[#E6DEC8] flex items-center justify-between bg-[#F6F1E7]">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src="/assets/aistudio/Haridra_Lgo_b038aa37.jpg"
                  alt={storeName}
                  className="w-8 h-8 rounded object-cover border border-[#C59B27]/50 bg-white shrink-0"
                />
                <span className="font-serif text-sm font-bold text-[#1F1A17] truncate">
                  {storeName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-1.5 text-[#1F1A17] hover:text-[#5C162E]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
              <button
                type="button"
                onClick={() => {
                  onSelectHome();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-[#1F1A17] hover:bg-[#F6F1E7] rounded-md"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectTab('NEW_ARRIVALS');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-[#1F1A17] hover:bg-[#F6F1E7] rounded-md"
              >
                New Arrivals
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectTab('BRIDAL');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-[#1F1A17] hover:bg-[#F6F1E7] rounded-md"
              >
                Bridal Collection
              </button>

              {/* Mobile MEN Accordion */}
              <div className="border-t border-[#E6DEC8] pt-2">
                <button
                  type="button"
                  aria-expanded={mobileAccordion === 'MEN'}
                  onClick={() =>
                    setMobileAccordion((prev) => (prev === 'MEN' ? null : 'MEN'))
                  }
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-[#5C162E]"
                >
                  <span>Men (3)</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileAccordion === 'MEN' ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {mobileAccordion === 'MEN' && (
                  <div className="pl-3 space-y-1 pb-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTab('MEN');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-[#9D7918]"
                    >
                      View All Men&apos;s Jewellery
                    </button>
                    {MEN_SUBCATEGORIES.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => handleSubcategoryClick('MEN', sub)}
                        className="w-full text-left px-3 py-2 text-sm text-[#1F1A17] hover:bg-[#F6F1E7] rounded-md"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile WOMEN Accordion */}
              <div className="border-t border-[#E6DEC8] pt-2">
                <button
                  type="button"
                  aria-expanded={mobileAccordion === 'WOMEN'}
                  onClick={() =>
                    setMobileAccordion((prev) =>
                      prev === 'WOMEN' ? null : 'WOMEN'
                    )
                  }
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-[#5C162E]"
                >
                  <span>Women (22)</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileAccordion === 'WOMEN' ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {mobileAccordion === 'WOMEN' && (
                  <div className="pl-3 space-y-3 pb-3">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTab('WOMEN');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs font-semibold text-[#9D7918]"
                    >
                      View All Women&apos;s Jewellery
                    </button>
                    {WOMEN_MEGA_MENU_GROUPS.map((group) => (
                      <div key={group.title}>
                        <p className="px-3 text-[11px] font-semibold text-[#635850] mb-1">
                          {group.title}
                        </p>
                        {group.items.map((sub) => (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => handleSubcategoryClick('WOMEN', sub)}
                            className="w-full text-left px-3 py-1.5 text-sm text-[#1F1A17] hover:bg-[#F6F1E7] rounded-md"
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-[#E6DEC8] pt-3 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    onOpenTrackOrder();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-[#1F1A17] hover:bg-[#F6F1E7] rounded-md"
                >
                  <PackageSearch className="w-4 h-4 text-[#5C162E]" aria-hidden="true" />
                  <span>Track Order</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenSettings();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-[#1F1A17] hover:bg-[#F6F1E7] rounded-md"
                >
                  <Settings className="w-4 h-4 text-[#5C162E]" aria-hidden="true" />
                  <span>Google Sheet CSV Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
