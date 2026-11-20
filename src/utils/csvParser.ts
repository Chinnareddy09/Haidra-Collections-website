import {
  BRIDAL_SUBCATEGORIES,
  MEN_SUBCATEGORIES,
  WOMEN_SUBCATEGORIES,
} from '../data/categories';
import {
  CatalogFilterState,
  CategoryName,
  OrderRecord,
  Product,
  StockStatus,
} from '../types/jewellery';

export const EXPECTED_CSV_HEADERS = [
  'Product ID',
  'Product Name',
  'Category',
  'Subcategory',
  'Product Price',
  'Product Image URL',
  'Product Description',
  'Available Sizes',
  'Available Colors',
  'Stock Status',
] as const;

/**
 * RFC-4180 compliant CSV parser handling quoted fields, embedded commas,
 * newlines inside quotes, and escaped double quotes ("").
 */
export function parseCsvRows(csvText: string): string[][] {
  const cleaned = csvText.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < cleaned.length; i += 1) {
    const char = cleaned[i];
    const nextChar = cleaned[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if (char === '\r' && nextChar === '\n') {
      currentRow.push(currentField.trim());
      if (currentRow.some((cell) => cell !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
      i += 1;
    } else if (char === '\n' || char === '\r') {
      currentRow.push(currentField.trim());
      if (currentRow.some((cell) => cell !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((cell) => cell !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function parsePriceValue(rawPrice: string): number {
  if (!rawPrice) return NaN;
  const numeric = rawPrice.replace(/[₹,\s]/g, '').replace(/[^0-9.]/g, '');
  if (!numeric) return NaN;
  const parsed = Number.parseFloat(numeric);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : NaN;
}

export function splitMultiValue(raw: string, fallback: string[]): string[] {
  if (!raw || !raw.trim()) return fallback;
  const parts = raw
    .split(/[|;/,]/)
    .map((item) => item.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : fallback;
}

export function normalizeCategory(raw: string): CategoryName {
  const upper = raw.trim().toUpperCase();
  if (upper === 'MEN' || upper === 'MENS' || upper === "MEN'S") {
    return 'MEN';
  }
  return 'WOMEN';
}

export function normalizeSubcategory(
  rawSubcategory: string,
  category: CategoryName
): string {
  const trimmed = rawSubcategory.trim();
  if (!trimmed) {
    return category === 'MEN' ? MEN_SUBCATEGORIES[0] : WOMEN_SUBCATEGORIES[0];
  }
  const pool = category === 'MEN' ? MEN_SUBCATEGORIES : WOMEN_SUBCATEGORIES;
  const exactMatch = pool.find(
    (sub) => sub.toLowerCase() === trimmed.toLowerCase()
  );
  return exactMatch ?? trimmed;
}

export function normalizeStockStatus(raw: string): StockStatus {
  const lower = raw.trim().toLowerCase();
  if (lower.includes('out')) return 'Out of Stock';
  if (lower.includes('pre')) return 'Pre-Order';
  return 'In Stock';
}

export function parseProductsFromCsv(csvText: string): Product[] {
  const rows = parseCsvRows(csvText);
  if (rows.length < 2) return [];

  const headerRow = rows[0].map(normalizeHeader);
  const colIndex = (target: string): number =>
    headerRow.indexOf(normalizeHeader(target));

  const idIdx = colIndex('Product ID');
  const nameIdx = colIndex('Product Name');
  const categoryIdx = colIndex('Category');
  const subcategoryIdx = colIndex('Subcategory');
  const priceIdx = colIndex('Product Price');
  const imageIdx = colIndex('Product Image URL');
  const descIdx = colIndex('Product Description');
  const sizesIdx = colIndex('Available Sizes');
  const colorsIdx = colIndex('Available Colors');
  const stockIdx = colIndex('Stock Status');

  if (nameIdx === -1 || priceIdx === -1) {
    return [];
  }

  const products: Product[] = [];

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const name = (row[nameIdx] ?? '').trim();
    const rawPrice = (row[priceIdx] ?? '').trim();
    const price = parsePriceValue(rawPrice);

    // Filter out rows where Product Name or Product Price is empty/invalid
    if (!name || Number.isNaN(price)) {
      continue;
    }

    const category = normalizeCategory(
      categoryIdx >= 0 ? row[categoryIdx] ?? '' : 'WOMEN'
    );
    const subcategory = normalizeSubcategory(
      subcategoryIdx >= 0 ? row[subcategoryIdx] ?? '' : '',
      category
    );
    const rawId = idIdx >= 0 ? (row[idIdx] ?? '').trim() : '';
    const id = rawId || `SR-${category.slice(0, 1)}-${String(i).padStart(3, '0')}`;
    const imageUrl =
      imageIdx >= 0 && (row[imageIdx] ?? '').trim()
        ? row[imageIdx].trim()
        : '/src/assets/images/product_choker_jhumka_1795165948254.jpg';
    const description =
      descIdx >= 0 && (row[descIdx] ?? '').trim()
        ? row[descIdx].trim()
        : `Authentic 1-gram micro gold plated ${subcategory} crafted with traditional South Indian detailing.`;
    const availableSizes = splitMultiValue(
      sizesIdx >= 0 ? row[sizesIdx] ?? '' : '',
      ['Free Size']
    );
    const availableColors = splitMultiValue(
      colorsIdx >= 0 ? row[colorsIdx] ?? '' : '',
      ['Antique Gold']
    );
    const stockStatus = normalizeStockStatus(
      stockIdx >= 0 ? row[stockIdx] ?? '' : 'In Stock'
    );

    products.push({
      id,
      name,
      category,
      subcategory,
      price,
      imageUrl,
      description,
      availableSizes,
      availableColors,
      stockStatus,
      isNewArrival: i <= 6,
    });
  }

  return products;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function filterAndSortProducts(
  products: Product[],
  filters: CatalogFilterState
): Product[] {
  const query = filters.searchQuery.trim().toLowerCase();

  const filtered = products.filter((product) => {
    if (filters.inStockOnly && product.stockStatus !== 'In Stock') {
      return false;
    }

    if (filters.tab === 'MEN' && product.category !== 'MEN') {
      return false;
    }
    if (filters.tab === 'WOMEN' && product.category !== 'WOMEN') {
      return false;
    }
    if (
      filters.tab === 'BRIDAL' &&
      !(
        product.category === 'WOMEN' &&
        BRIDAL_SUBCATEGORIES.has(product.subcategory)
      )
    ) {
      return false;
    }
    if (filters.tab === 'NEW_ARRIVALS' && !product.isNewArrival) {
      return false;
    }

    if (filters.category !== 'ALL' && product.category !== filters.category) {
      return false;
    }

    if (
      filters.subcategory &&
      product.subcategory.toLowerCase() !== filters.subcategory.toLowerCase()
    ) {
      return false;
    }

    if (query) {
      const haystack = `${product.id} ${product.name} ${product.category} ${product.subcategory} ${product.description}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }

    return true;
  });

  if (filters.sortBy === 'price-asc') {
    return [...filtered].sort((a, b) => a.price - b.price);
  }
  if (filters.sortBy === 'price-desc') {
    return [...filtered].sort((a, b) => b.price - a.price);
  }
  return filtered;
}

export function buildProductWhatsAppUrl(params: {
  whatsappNumber: string;
  storeName: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}): string {
  const cleanPhone = params.whatsappNumber.replace(/[^0-9]/g, '') || '916305085353';
  const total = params.product.price * params.quantity;
  const message = [
    `Namaskaram ${params.storeName}! I would like to order:`,
    `• Product: ${params.product.name}`,
    `• Product ID: ${params.product.id}`,
    `• Size: ${params.selectedSize}`,
    `• Color: ${params.selectedColor}`,
    `• Quantity: ${params.quantity}`,
    `• Price: ${formatINR(total)}`,
    `Please confirm availability and dispatch details.`,
  ].join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function buildOrderWhatsAppUrl(
  whatsappNumber: string,
  storeName: string,
  order: OrderRecord
): string {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '') || '916305085353';
  const itemLines = order.items.map(
    (item, idx) =>
      `${idx + 1}. ${item.name} (${item.id}) — Size: ${item.size}, Color: ${item.color} × ${item.quantity} = ${formatINR(item.price * item.quantity)}`
  );

  const message = [
    `New Order at ${storeName}`,
    `Order ID: ${order.orderId}`,
    `Customer: ${order.customerName}`,
    `Phone: ${order.phone}`,
    `Address: ${order.address}`,
    `Payment Mode: ${order.paymentMode}`,
    ``,
    `Items:`,
    ...itemLines,
    ``,
    `Subtotal: ${formatINR(order.subtotal)}`,
    `Shipping: ${order.shippingFee === 0 ? 'FREE' : formatINR(order.shippingFee)}`,
    `Total Payable: ${formatINR(order.total)}`,
  ].join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateSampleCsvTemplate(products: Product[]): string {
  const escapeCell = (val: string): string => {
    if (/[",\n\r]/.test(val)) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const lines = [EXPECTED_CSV_HEADERS.join(',')];
  for (const p of products.slice(0, 8)) {
    lines.push(
      [
        p.id,
        p.name,
        p.category,
        p.subcategory,
        String(p.price),
        p.imageUrl,
        p.description,
        p.availableSizes.join(' | '),
        p.availableColors.join(' | '),
        p.stockStatus,
      ]
        .map(escapeCell)
        .join(',')
    );
  }
  return lines.join('\n');
}
