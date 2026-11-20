import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Award, Check, RefreshCw, ShieldCheck, Truck, X } from 'lucide-react';
import { CartDrawer } from './components/CartDrawer';
import { CatalogSection } from './components/CatalogSection';
import { CategoryStrip } from './components/CategoryStrip';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { QuickViewModal } from './components/QuickViewModal';
import { SettingsModal } from './components/SettingsModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { HeroSlide } from './data/categories';
import { SAMPLE_JEWELLERY_CATALOG } from './data/sampleCatalog';
import {
  CartItem,
  CatalogFilterState,
  CatalogTab,
  CategoryName,
  OrderRecord,
  Product,
  SortOption,
  StoreSettings,
} from './types/jewellery';
import {
  filterAndSortProducts,
  parseProductsFromCsv,
} from './utils/csvParser';

// Paste your published Google Sheets CSV URL here (or update anytime via the Settings gear icon in the header)
export const GOOGLE_SHEET_CSV_URL = '';

const STORAGE_KEYS = {
  SETTINGS: 'sr_gold_store_settings_v1',
  CART: 'sr_gold_cart_v1',
  WISHLIST: 'sr_gold_wishlist_v1',
  ORDERS: 'sr_gold_orders_v1',
};

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Sri Haridra Collections',
  csvUrl: GOOGLE_SHEET_CSV_URL,
  whatsappNumber: '916305085353',
  announcementText:
    'Free Shipping on Orders Above ₹999 | Cash on Delivery Available | Direct Factory Prices',
  freeShippingThreshold: 999,
};

function loadJsonStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadStoreSettings(): StoreSettings {
  const stored = loadJsonStorage<StoreSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  );
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    storeName:
      !stored.storeName ||
      stored.storeName === 'SR Gold Covering & Imitation Jewellery'
        ? DEFAULT_SETTINGS.storeName
        : stored.storeName,
    whatsappNumber:
      !stored.whatsappNumber || stored.whatsappNumber === '919848012345'
        ? DEFAULT_SETTINGS.whatsappNumber
        : stored.whatsappNumber,
  };
}

export default function App() {
  const [settings, setSettings] = useState<StoreSettings>(loadStoreSettings);
  const [products, setProducts] = useState<Product[]>(SAMPLE_JEWELLERY_CATALOG);
  const [isLiveCsv, setIsLiveCsv] = useState(false);
  const [isSyncingCsv, setIsSyncingCsv] = useState(false);
  const [csvError, setCsvError] = useState('');
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  const [cart, setCart] = useState<CartItem[]>(() =>
    loadJsonStorage<CartItem[]>(STORAGE_KEYS.CART, [])
  );
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    loadJsonStorage<string[]>(STORAGE_KEYS.WISHLIST, [])
  );
  const [orders, setOrders] = useState<OrderRecord[]>(() =>
    loadJsonStorage<OrderRecord[]>(STORAGE_KEYS.ORDERS, [])
  );

  const [filters, setFilters] = useState<CatalogFilterState>({
    tab: 'ALL',
    category: 'ALL',
    subcategory: '',
    searchQuery: '',
    sortBy: 'featured',
    inStockOnly: false,
  });

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Persist user data
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore storage quota errors
    }
  }, [settings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.WISHLIST,
        JSON.stringify(wishlistIds)
      );
    } catch {
      // Ignore
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [orders]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const loadCsvCatalog = useCallback(async (urlToFetch: string) => {
    const trimmed = urlToFetch.trim();
    if (!trimmed) {
      setProducts(SAMPLE_JEWELLERY_CATALOG);
      setIsLiveCsv(false);
      setCsvError('');
      return;
    }

    setIsSyncingCsv(true);
    setCsvError('');
    try {
      const response = await fetch(trimmed, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const csvText = await response.text();
      const parsed = parseProductsFromCsv(csvText);
      if (parsed.length === 0) {
        throw new Error(
          'No valid products found. Verify headers include Product Name and Product Price.'
        );
      }
      setProducts(parsed);
      setIsLiveCsv(true);
      setShowDemoBanner(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to fetch Google Sheets CSV.';
      setProducts(SAMPLE_JEWELLERY_CATALOG);
      setIsLiveCsv(false);
      setCsvError(
        `Could not load live CSV (${message}). Showing sample jewellery catalog.`
      );
      setShowDemoBanner(true);
    } finally {
      setIsSyncingCsv(false);
    }
  }, []);

  useEffect(() => {
    if (settings.csvUrl.trim()) {
      void loadCsvCatalog(settings.csvUrl);
    }
  }, [settings.csvUrl, loadCsvCatalog]);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectHome = () => {
    setFilters({
      tab: 'ALL',
      category: 'ALL',
      subcategory: '',
      searchQuery: '',
      sortBy: 'featured',
      inStockOnly: false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTab = (tab: CatalogTab) => {
    setFilters((prev) => ({
      ...prev,
      tab,
      category: tab === 'MEN' ? 'MEN' : tab === 'WOMEN' || tab === 'BRIDAL' ? 'WOMEN' : 'ALL',
      subcategory: '',
    }));
    scrollToCatalog();
  };

  const handleSelectSubcategory = (
    category: CategoryName | 'ALL',
    subcategory: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      tab: category === 'MEN' ? 'MEN' : category === 'WOMEN' ? 'WOMEN' : prev.tab,
      category,
      subcategory,
    }));
    scrollToCatalog();
  };

  const handleHeroAction = (slide: HeroSlide) => {
    setFilters((prev) => ({
      ...prev,
      tab: slide.filterTab,
      category: slide.filterCategory,
      subcategory: slide.filterSubcategory,
    }));
    scrollToCatalog();
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: value,
    }));
    if (value.trim().length === 1) {
      scrollToCatalog();
    }
  };

  const handleAddToCart = (
    product: Product,
    size?: string,
    color?: string,
    qty = 1
  ) => {
    if (product.stockStatus === 'Out of Stock') return;
    const chosenSize = size || product.availableSizes[0] || 'Free Size';
    const chosenColor = color || product.availableColors[0] || 'Antique Gold';
    const key = `${product.id}__${chosenSize}__${chosenColor}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? { ...item, quantity: Math.min(20, item.quantity + qty) }
            : item
        );
      }
      return [
        ...prev,
        {
          key,
          product,
          selectedSize: chosenSize,
          selectedColor: chosenColor,
          quantity: qty,
        },
      ];
    });
    showToast(`Added "${product.name}" to your bag`);
  };

  const handleUpdateCartQuantity = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from wishlist`);
        return prev.filter((id) => id !== product.id);
      }
      showToast(`Saved "${product.name}" to wishlist`);
      return [...prev, product.id];
    });
  };

  const handleConfirmOrder = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
  };

  const handleSaveSettings = async (next: StoreSettings) => {
    setSettings(next);
    await loadCsvCatalog(next.csvUrl);
    if (!next.csvUrl.trim()) {
      showToast('Settings saved (Demo Catalog active)');
      setIsSettingsOpen(false);
    } else {
      showToast('Store settings saved & CSV feed synced');
    }
  };

  const handleResetToDemo = () => {
    const next = { ...settings, csvUrl: '' };
    setSettings(next);
    setProducts(SAMPLE_JEWELLERY_CATALOG);
    setIsLiveCsv(false);
    setCsvError('');
    setShowDemoBanner(true);
    showToast('Switched to built-in sample jewellery catalog');
  };

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters]
  );

  const wishlistIdSet = useMemo(() => new Set(wishlistIds), [wishlistIds]);
  const wishlistProducts = useMemo(
    () => products.filter((p) => wishlistIdSet.has(p.id)),
    [products, wishlistIdSet]
  );

  const totalCartItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1F1A17]">
      <Header
        storeName={settings.storeName}
        announcementText={settings.announcementText}
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
        onSelectHome={handleSelectHome}
        onSelectTab={handleSelectTab}
        onSelectSubcategory={handleSelectSubcategory}
        wishlistCount={wishlistProducts.length}
        cartCount={totalCartItems}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
      />

      {/* Subtle Demo Mode / CSV Error Notice */}
      {!isLiveCsv && showDemoBanner && (
        <div
          role="status"
          className="bg-[#F6F1E7] border-b border-[#E6DEC8] px-4 py-2 text-xs text-[#1F1A17]"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <p className="truncate">
              {csvError ? (
                <span className="text-[#991B1B] font-medium">{csvError}</span>
              ) : (
                <span>
                  <strong>Demo Mode:</strong> Displaying sample 1-gram gold jewellery catalog. Connect your Google Sheets CSV anytime.
                </span>
              )}
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="inline-flex items-center gap-1 font-semibold text-[#5C162E] hover:underline whitespace-nowrap"
              >
                <RefreshCw className="w-3 h-3" aria-hidden="true" />
                <span>Connect CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDemoBanner(false)}
                aria-label="Dismiss demo mode notice"
                className="p-0.5 text-[#635850] hover:text-[#1F1A17]"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        <HeroCarousel onSelectSlideAction={handleHeroAction} />

        <CategoryStrip
          activeSubcategory={filters.subcategory}
          onSelectCategoryCard={handleSelectSubcategory}
        />

        <CatalogSection
          products={filteredProducts}
          totalCatalogCount={products.length}
          filters={filters}
          wishlistIds={wishlistIdSet}
          onChangeTab={handleSelectTab}
          onChangeSubcategory={handleSelectSubcategory}
          onChangeSort={(sortBy: SortOption) =>
            setFilters((prev) => ({ ...prev, sortBy }))
          }
          onToggleInStockOnly={() =>
            setFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))
          }
          onResetFilters={() =>
            setFilters({
              tab: 'ALL',
              category: 'ALL',
              subcategory: '',
              searchQuery: '',
              sortBy: 'featured',
              inStockOnly: false,
            })
          }
          onToggleWishlist={handleToggleWishlist}
          onQuickView={(product) => setQuickViewProduct(product)}
          onAddToCart={(product) => handleAddToCart(product)}
        />

        {/* Heritage Craftsmanship Guarantee Section */}
        <section
          aria-labelledby="craftsmanship-heading"
          className="py-12 sm:py-16 bg-[#F6F1E7] border-t border-[#E6DEC8]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <p className="text-xs font-medium text-[#9D7918] mb-1">
                Direct Workshop Assurance
              </p>
              <h2
                id="craftsmanship-heading"
                className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1A17]"
              >
                Crafted Like 22K Gold, Priced for Every Celebration
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-[#FDFBF7] border border-[#E6DEC8] rounded-lg space-y-2">
                <Award className="w-6 h-6 text-[#C59B27]" aria-hidden="true" />
                <h3 className="font-serif text-lg font-semibold text-[#1F1A17]">
                  1-Gram Micro Gold Finish
                </h3>
                <p className="text-sm text-[#635850] leading-relaxed">
                  Multi-layered micro gold plating over copper-alloy base with genuine kemp stones and freshwater pearls for indistinguishable 22K lustre.
                </p>
              </div>

              <div className="p-6 bg-[#FDFBF7] border border-[#E6DEC8] rounded-lg space-y-2">
                <ShieldCheck
                  className="w-6 h-6 text-[#5C162E]"
                  aria-hidden="true"
                />
                <h3 className="font-serif text-lg font-semibold text-[#1F1A17]">
                  Direct Factory Pricing
                </h3>
                <p className="text-sm text-[#635850] leading-relaxed">
                  Sourced directly from traditional Machilipatnam and South Indian covering workshops without middlemen markups.
                </p>
              </div>

              <div className="p-6 bg-[#FDFBF7] border border-[#E6DEC8] rounded-lg space-y-2">
                <Truck className="w-6 h-6 text-[#C59B27]" aria-hidden="true" />
                <h3 className="font-serif text-lg font-semibold text-[#1F1A17]">
                  Safe Pan-India COD &amp; Dispatch
                </h3>
                <p className="text-sm text-[#635850] leading-relaxed">
                  Cash on Delivery and UPI supported across India with cushioned jewellery boxes and free insured shipping above ₹999.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        storeName={settings.storeName}
        whatsappNumber={settings.whatsappNumber}
        onSelectTab={handleSelectTab}
        onSelectSubcategory={handleSelectSubcategory}
      />

      {/* Modals & Drawers */}
      <QuickViewModal
        product={quickViewProduct}
        storeName={settings.storeName}
        whatsappNumber={settings.whatsappNumber}
        isWishlisted={
          quickViewProduct ? wishlistIdSet.has(quickViewProduct.id) : false
        }
        onClose={() => setQuickViewProduct(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        freeShippingThreshold={settings.freeShippingThreshold}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        items={wishlistProducts}
        onClose={() => setIsWishlistOpen(false)}
        onRemove={handleToggleWishlist}
        onMoveToCart={(product) => {
          handleAddToCart(product);
          setWishlistIds((prev) => prev.filter((id) => id !== product.id));
        }}
        onQuickView={(product) => setQuickViewProduct(product)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        items={cart}
        storeName={settings.storeName}
        whatsappNumber={settings.whatsappNumber}
        freeShippingThreshold={settings.freeShippingThreshold}
        onClose={() => setIsCheckoutOpen(false)}
        onConfirmOrder={handleConfirmOrder}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        isLiveMode={isLiveCsv}
        isSyncing={isSyncingCsv}
        syncError={csvError}
        sampleProducts={SAMPLE_JEWELLERY_CATALOG}
        onClose={() => setIsSettingsOpen(false)}
        onSaveSettings={handleSaveSettings}
        onResetToDemo={handleResetToDemo}
      />

      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        orders={orders}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      {/* Subtle Toast Confirmation */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg bg-[#1F1A17] text-[#FDFBF7] border border-[#C59B27]/50 shadow-xl flex items-center gap-2.5 text-sm"
        >
          <Check className="w-4 h-4 text-[#C59B27] shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
