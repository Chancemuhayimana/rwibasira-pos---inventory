
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Product, Sale, SaleItem } from '../types';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle2,
  Receipt,
  AlertCircle
} from 'lucide-react';

const POS: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    setProducts(db.getProducts());
  }, []);

  const addToCart = (product: Product) => {
    if (product.quantity <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.quantity) return prev;
        return prev.map(item => item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        quantity: 1,
        sellingPrice: product.sellingPrice,
        buyingPrice: product.buyingPrice
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const product = products.find(p => p.id === productId);
        const newQty = item.quantity + delta;
        if (newQty > 0 && product && newQty <= product.quantity) {
          return { ...item, quantity: newQty };
        }
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const totalRevenue = total;
    const totalCost = cart.reduce((sum, item) => sum + (item.buyingPrice * item.quantity), 0);
    const totalProfit = totalRevenue - totalCost;

    const newSale: Sale = {
      id: `RW-${Date.now()}`,
      items: [...cart],
      totalRevenue,
      totalCost,
      totalProfit,
      timestamp: new Date().toISOString()
    };

    db.saveSale(newSale);
    setCart([]);
    setProducts(db.getProducts());
    setCheckoutSuccess(true);
    setTimeout(() => setCheckoutSuccess(false), 3000);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-10rem)]">
      {/* Product Selection */}
      <div className="lg:col-span-7 flex flex-col h-full space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search products by name or SKU..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500/20 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map(p => (
            <button 
              key={p.id}
              onClick={() => addToCart(p)}
              disabled={p.quantity <= 0}
              className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between h-36 ${
                p.quantity <= 0 
                  ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed' 
                  : 'bg-white border-slate-200 hover:border-red-400 hover:shadow-md'
              }`}
            >
              <div>
                <p className="font-bold text-slate-800 line-clamp-1">{p.name}</p>
                <p className="text-xs text-slate-400 mt-1">{p.category}</p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-lg font-bold text-red-600">K {p.sellingPrice.toFixed(2)}</p>
                  <p className={`text-[10px] font-bold ${p.quantity <= p.minStockLevel ? 'text-amber-500' : 'text-slate-400'}`}>
                    Stock: {p.quantity}
                  </p>
                </div>
                {p.quantity > 0 && <Plus className="w-5 h-5 text-red-600" />}
                {p.quantity <= 0 && <AlertCircle className="w-5 h-5 text-red-400" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart / Checkout */}
      <div className="lg:col-span-5 flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-red-600" />
            <h3 className="font-bold text-lg text-slate-800">Current Order</h3>
          </div>
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
            {cart.reduce((s, i) => s + i.quantity, 0)} Items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
              <div className="p-6 bg-slate-50 rounded-full">
                <Receipt className="w-12 h-12 opacity-20" />
              </div>
              <p className="font-medium">Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="flex items-center justify-between group">
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{item.name}</p>
                  <p className="text-sm text-slate-400">K {item.sellingPrice.toFixed(2)} / unit</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-slate-100 rounded-lg p-1">
                    <button 
                      onClick={() => updateCartQty(item.productId, -1)}
                      className="p-1 hover:bg-white rounded transition-colors text-slate-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-slate-700">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQty(item.productId, 1)}
                      className="p-1 hover:bg-white rounded transition-colors text-slate-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between text-slate-500">
            <span>Subtotal</span>
            <span>K {total.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xl font-bold text-slate-800">Total Due</span>
            <span className="text-2xl font-black text-red-600">K {total.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
              checkoutSuccess 
                ? 'bg-emerald-500 text-white' 
                : cart.length > 0 
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-200' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {checkoutSuccess ? (
              <>
                <CheckCircle2 className="w-6 h-6" /> Sale Saved
              </>
            ) : (
              <>Complete Sale</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
