
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Sale } from '../types';
import { 
  Download,
  TrendingUp,
  History,
  Trash2
} from 'lucide-react';

const Reports: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    setSales(db.getSales());
  }, []);

  const handleDeleteSale = (saleId: string) => {
    if (!confirm('Delete this completed sale and restore its stock quantities?')) return;
    db.deleteSale(saleId);
    setSales(db.getSales());
  };

  const filteredSales = sales.filter((sale) => {
    if (dateRange === 'all') return true;

    const saleDate = new Date(sale.timestamp);
    const now = new Date();

    if (dateRange === 'today') {
      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);
      const endOfToday = new Date(now);
      endOfToday.setHours(23, 59, 59, 999);
      return saleDate >= startOfToday && saleDate <= endOfToday;
    }

    if (dateRange === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return saleDate >= startOfMonth && saleDate <= endOfMonth;
    }

    return true;
  });

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalProfit = filteredSales.reduce((sum, s) => sum + s.totalProfit, 0);
  const totalMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-3 bg-white p-1 rounded-2xl border border-slate-200 min-w-max">
            <button
              onClick={() => setDateRange('all')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${dateRange === 'all' ? 'bg-red-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${dateRange === 'month' ? 'bg-red-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              This Month
            </button>
            <button
              onClick={() => setDateRange('today')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${dateRange === 'today' ? 'bg-red-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Today
            </button>
          </div>
        </div>
        <button className="w-full sm:w-auto justify-center flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg">
          <Download className="w-5 h-5" /> Export PDF Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 font-medium uppercase tracking-wider text-xs">Accumulated Revenue</p>
          <h4 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2 break-words">K {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Real-time tracking</span>
          </div>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 font-medium uppercase tracking-wider text-xs">Total Net Profit</p>
          <h4 className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2 break-words">K {totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
          <p className="mt-4 text-slate-400 text-sm">Excluding cost of goods</p>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 font-medium uppercase tracking-wider text-xs">Profit Margin</p>
          <h4 className="text-3xl font-black text-red-600 mt-2">{totalMargin.toFixed(1)}%</h4>
          <p className="mt-4 text-slate-400 text-sm">Performance rating</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-red-600" />
            Recent Transactions (K)
          </h3>
          <button className="text-red-600 text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Time</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Items</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Total Revenue</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Net Profit</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">No transactions recorded.</td>
                </tr>
              ) : (
                [...filteredSales].reverse().map(sale => (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{sale.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {new Date(sale.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">
                        {sale.items.length} {sale.items.length === 1 ? 'Item' : 'Items'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">
                      K {sale.totalRevenue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                        +K {sale.totalProfit.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteSale(sale.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                        title="Delete sale"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
