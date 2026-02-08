
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Product, Sale } from '../types';
import { getBusinessInsights } from '../services/geminiService';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Coins,
  Sparkles,
  RefreshCw
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    setProducts(db.getProducts());
    setSales(db.getSales());
  }, []);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    const result = await getBusinessInsights(products, sales);
    setInsights(result);
    setLoadingInsights(false);
  };

  const today = new Date().toISOString().split('T')[0];
  const salesToday = sales.filter(s => s.timestamp.startsWith(today));
  const totalRevenueToday = salesToday.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalProfitToday = salesToday.reduce((sum, s) => sum + s.totalProfit, 0);
  const lowStockProducts = products.filter(p => p.quantity <= p.minStockLevel);
  const outOfStock = products.filter(p => p.quantity === 0);

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const daySales = sales.filter(s => s.timestamp.startsWith(dateStr));
    return {
      name: dateStr.split('-').slice(1).reverse().join('/'),
      revenue: daySales.reduce((sum, s) => sum + s.totalRevenue, 0),
      profit: daySales.reduce((sum, s) => sum + s.totalProfit, 0)
    };
  }).reverse();

  return (
    <div className="space-y-8">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Revenue Today" 
          value={`K ${totalRevenueToday.toLocaleString()}`} 
          icon={<Coins className="text-blue-600" />} 
          color="blue"
          trend="+12%"
        />
        <StatCard 
          title="Profit Today" 
          value={`K ${totalProfitToday.toLocaleString()}`} 
          icon={<TrendingUp className="text-emerald-600" />} 
          color="emerald"
          trend="+5%"
        />
        <StatCard 
          title="Low Stock" 
          value={lowStockProducts.length.toString()} 
          icon={<AlertTriangle className="text-amber-600" />} 
          color="amber"
          subtitle={`${outOfStock.length} out of stock`}
        />
        <StatCard 
          title="Total Products" 
          value={products.length.toString()} 
          icon={<Package className="text-red-600" />} 
          color="red"
          subtitle="Managed inventory items"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Sales & Profit Trends (K)</h3>
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded">Last 7 Days</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7Days}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  formatter={(value: any) => `K ${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#ef4444" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights & Alerts */}
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-red-200" />
                  <h3 className="font-bold">Rwibasira Insights</h3>
                </div>
                <button 
                  onClick={fetchInsights}
                  disabled={loadingInsights}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingInsights ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="text-sm text-red-50 mt-2 leading-relaxed min-h-[100px]">
                {loadingInsights ? (
                  <div className="flex flex-col gap-2">
                    <div className="h-4 bg-white/20 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-white/20 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-white/20 rounded animate-pulse w-2/3"></div>
                  </div>
                ) : insights ? (
                  <p className="whitespace-pre-wrap">{insights}</p>
                ) : (
                  <p>Generate smart business analysis for your shop in Kwacha.</p>
                )}
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-1">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Low Stock Alerts
            </h3>
            <div className="space-y-3">
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">Stock levels are healthy.</p>
              ) : (
                lowStockProducts.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{p.name}</p>
                      <p className="text-xs text-slate-400">Current: {p.quantity} | Min: {p.minStockLevel}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${p.quantity === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                      {p.quantity === 0 ? 'Out' : 'Low'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend, subtitle }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group hover:border-red-200 transition-colors">
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-xl bg-${color}-50 transition-colors group-hover:bg-red-50`}>
        {icon}
      </div>
      {trend && (
        <span className={`flex items-center text-xs font-bold ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {trend}
        </span>
      )}
    </div>
    <div className="mt-4">
      <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
      <h4 className="text-2xl font-bold text-slate-800 mt-1">{value}</h4>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  </div>
);

export default Dashboard;
