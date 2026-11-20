export type CategoryName = 'MEN' | 'WOMEN';

export type StockStatus = 'In Stock' | 'Out of Stock' | 'Pre-Order';

export interface Product {
  id: string;
  name: string;
  category: CategoryName;
  subcategory: string;
  price: number;
  imageUrl: string;
  description: string;
  availableSizes: string[];
  availableColors: string[];
  stockStatus: StockStatus;
  isNewArrival?: boolean;
}

export interface CartItem {
  key: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface StoreSettings {
  storeName: string;
  csvUrl: string;
  whatsappNumber: string;
  announcementText: string;
  freeShippingThreshold: number;
}

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  paymentMode: 'UPI' | 'COD';
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'Confirmed — Preparing Dispatch' | 'Packed' | 'In Transit';
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc';

export type CatalogTab = 'ALL' | 'MEN' | 'WOMEN' | 'BRIDAL' | 'NEW_ARRIVALS';

export interface CatalogFilterState {
  tab: CatalogTab;
  category: CategoryName | 'ALL';
  subcategory: string;
  searchQuery: string;
  sortBy: SortOption;
  inStockOnly: boolean;
}
