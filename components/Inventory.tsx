
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Product } from '../types';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Download
} from 'lucide-react';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    setProducts(db.getProducts());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter(p => p.id !== id);
      db.saveProducts(updated);
      setProducts(updated);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData: Partial<Product> = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      code: formData.get('code') as string,
      buyingPrice: parseFloat(formData.get('buyingPrice') as string),
      sellingPrice: parseFloat(formData.get('sellingPrice') as string),
      quantity: parseInt(formData.get('quantity') as string),
      minStockLevel: parseInt(formData.get('minStockLevel') as string),
      supplier: formData.get('supplier') as string,
    };

    if (editingProduct) {
      const updated = products.map(p => p.id === editingProduct.id ? { ...p, ...productData } as Product : p);
      db.saveProducts(updated);
      setProducts(updated);
    } else {
      const newProduct: Product = {
        ...productData as Product,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString()
      };
      const updated = [...products, newProduct];
      db.saveProducts(updated);
      setProducts(updated);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name, code, or category..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <button 
            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product Info</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price (Buy/Sell)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(p => {
                const isLow = p.quantity <= p.minStockLevel;
                const isOut = p.quantity === 0;
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-400 font-mono">{p.code}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">{p.quantity} units</span>
                        <span className={`text-[10px] font-bold uppercase ${isOut ? 'text-red-500' : isLow ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Healthy'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-800">K {p.sellingPrice.toFixed(2)}</p>
                      <p className="text-xs text-slate-400">Cost: K {p.buyingPrice.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingProduct(p); setIsModalOpen(true); }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Product Name</label>
                  <input name="name" defaultValue={editingProduct?.name} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Product Code / SKU</label>
                  <input name="code" defaultValue={editingProduct?.code} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Category</label>
                  <select name="category" defaultValue={editingProduct?.category} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20">
                    <option>Dairy</option>
                    <option>Bakery</option>
                    <option>Produce</option>
                    <option>Meat</option>
                    <option>Canned Goods</option>
                    <option>Beverages</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Supplier</label>
                  <input name="supplier" defaultValue={editingProduct?.supplier} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Buying Price (K)</label>
                  <input name="buyingPrice" type="number" step="0.01" defaultValue={editingProduct?.buyingPrice} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Selling Price (K)</label>
                  <input name="sellingPrice" type="number" step="0.01" defaultValue={editingProduct?.sellingPrice} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Quantity</label>
                  <input name="quantity" type="number" defaultValue={editingProduct?.quantity} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Min Stock Level</label>
                  <input name="minStockLevel" type="number" defaultValue={editingProduct?.minStockLevel} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-medium">Cancel</button>
                <button type="submit" className="px-8 py-2.5 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700">
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
