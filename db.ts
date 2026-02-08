
import { Product, Sale } from './types';

const PRODUCTS_KEY = 'superstock_products';
const SALES_KEY = 'superstock_sales';

const initialProducts: Product[] = [
  { id: '1', name: 'Premium Milk 1L', category: 'Dairy', code: 'DAI001', buyingPrice: 1.2, sellingPrice: 1.8, quantity: 50, minStockLevel: 10, supplier: 'Local Dairy Co', dateAdded: new Date().toISOString() },
  { id: '2', name: 'Whole Wheat Bread', category: 'Bakery', code: 'BAK001', buyingPrice: 0.8, sellingPrice: 1.5, quantity: 5, minStockLevel: 8, supplier: 'SunBake', dateAdded: new Date().toISOString() },
  { id: '3', name: 'Eggs (Dozen)', category: 'Dairy', code: 'DAI002', buyingPrice: 2.5, sellingPrice: 3.5, quantity: 30, minStockLevel: 12, supplier: 'Happy Hen Farms', dateAdded: new Date().toISOString() },
];

export const db = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (!data) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }
    return JSON.parse(data);
  },
  saveProducts: (products: Product[]) => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },
  getSales: (): Sale[] => {
    const data = localStorage.getItem(SALES_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveSale: (sale: Sale) => {
    const sales = db.getSales();
    sales.push(sale);
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
    
    // Update stock levels
    const products = db.getProducts();
    sale.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        product.quantity -= item.quantity;
      }
    });
    db.saveProducts(products);
  }
};
