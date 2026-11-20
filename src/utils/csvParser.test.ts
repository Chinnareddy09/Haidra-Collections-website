import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildProductWhatsAppUrl,
  filterAndSortProducts,
  formatINR,
  parseCsvRows,
  parseProductsFromCsv,
} from './csvParser';

const SAMPLE_CSV = [
  'Product ID,Product Name,Category,Subcategory,Product Price,Product Image URL,Product Description,Available Sizes,Available Colors,Stock Status',
  'SR-001,"Lakshmi Temple Haram, Ruby Kemp",WOMEN,Haram Sets,"₹2,450",https://example.com/haram.jpg,"Handcrafted ""1-gram"" gold haram, with pearls",22 Inches | 24 Inches,Antique Gold | Ruby Kemp,In Stock',
  'SR-002,"",WOMEN,Bangles,1200,https://example.com/bangles.jpg,Missing name row,2.4 | 2.6,Gold,In Stock',
  'SR-003,Missing Price Item,MEN,Rings,,https://example.com/ring.jpg,Should be filtered out,18,Gold,In Stock',
  'SR-004,Royal Lotus Chain,MEN,Chains(Long And Short Chais),1850,https://example.com/chain.jpg,Heavy lotus link chain,20 Inches | 24 Inches,22K Matte Gold,Pre-Order',
  'SR-005,Signet Lion Ring,MEN,Rings,650,https://example.com/ring2.jpg,Classic mens ring,18 | 20 | 22,Gold,Out of Stock',
  'SR-006,Kemp Stone Ring,WOMEN,Rings,550,https://example.com/ring3.jpg,Womens temple ring,Adjustable,Ruby Gold,In Stock',
].join('\n');

test('parseCsvRows handles quoted commas and escaped double quotes', () => {
  const rows = parseCsvRows(SAMPLE_CSV);
  assert.equal(rows.length, 7);
  assert.equal(rows[1][1], 'Lakshmi Temple Haram, Ruby Kemp');
  assert.equal(rows[1][6], 'Handcrafted "1-gram" gold haram, with pearls');
});

test('parseProductsFromCsv filters out empty Product Name or Product Price rows', () => {
  const products = parseProductsFromCsv(SAMPLE_CSV);
  assert.equal(products.length, 4);
  assert.equal(products[0].id, 'SR-001');
  assert.equal(products[0].price, 2450);
  assert.deepEqual(products[0].availableSizes, ['22 Inches', '24 Inches']);
  assert.deepEqual(products[0].availableColors, ['Antique Gold', 'Ruby Kemp']);
  assert.equal(products[1].stockStatus, 'Pre-Order');
  assert.equal(products[2].stockStatus, 'Out of Stock');
});

test('formatINR formats numbers in Indian Rupee notation', () => {
  assert.equal(formatINR(2450), '₹2,450');
  assert.equal(formatINR(12500), '₹12,500');
});

test('filterAndSortProducts separates MEN Rings vs WOMEN Rings and sorts by price', () => {
  const products = parseProductsFromCsv(SAMPLE_CSV);

  const menRings = filterAndSortProducts(products, {
    tab: 'MEN',
    category: 'MEN',
    subcategory: 'Rings',
    searchQuery: '',
    sortBy: 'featured',
    inStockOnly: false,
  });
  assert.equal(menRings.length, 1);
  assert.equal(menRings[0].id, 'SR-005');

  const inStockAsc = filterAndSortProducts(products, {
    tab: 'ALL',
    category: 'ALL',
    subcategory: '',
    searchQuery: '',
    sortBy: 'price-asc',
    inStockOnly: true,
  });
  assert.equal(inStockAsc.length, 2);
  assert.equal(inStockAsc[0].id, 'SR-006');
  assert.equal(inStockAsc[1].id, 'SR-001');
});

test('buildProductWhatsAppUrl pre-fills product details and price', () => {
  const products = parseProductsFromCsv(SAMPLE_CSV);
  const url = buildProductWhatsAppUrl({
    whatsappNumber: '+91 98480 12345',
    storeName: 'SR Gold Covering',
    product: products[0],
    selectedSize: '24 Inches',
    selectedColor: 'Ruby Kemp',
    quantity: 2,
  });

  assert.ok(url.startsWith('https://wa.me/919848012345?text='));
  const decoded = decodeURIComponent(url.split('?text=')[1]);
  assert.ok(decoded.includes('SR-001'));
  assert.ok(decoded.includes('24 Inches'));
  assert.ok(decoded.includes('Ruby Kemp'));
  assert.ok(decoded.includes('₹4,900'));
});
