
export interface Product {
  id: string;
  name: string;
  category: string;
  code: string;
  buyingPrice: number;
  sellingPrice: number;
  quantity: number;
  minStockLevel: number;
  supplier: string;
  dateAdded: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  sellingPrice: number;
  buyingPrice: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  timestamp: string;
}

export interface DashboardStats {
  totalStockValue: number;
  totalProfit: number;
  salesToday: number;
  lowStockCount: number;
  bestSellers: { name: string; count: number }[];
}

export type AppView = 'dashboard' | 'inventory' | 'pos' | 'reports' | 'settings';
