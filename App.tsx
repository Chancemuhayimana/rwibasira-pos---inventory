
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import POS from './components/POS';
import Reports from './components/Reports';
import { AppView } from './types';
import { Lock, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('superstock_session') === 'active';
  });
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsLoggedIn(true);
      localStorage.setItem('superstock_session', 'active');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('superstock_session');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-red-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>
          
          <div className="text-center mb-10 relative z-10">
            <div className="inline-flex items-center justify-center p-3 bg-white rounded-3xl shadow-2xl mb-6 w-24 h-24 overflow-hidden">
               <img src="/logo.png" alt="Rwibasira Logo" className="w-full h-full object-contain" onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=R';
              }} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Rwibasira</h1>
            <p className="text-slate-400 mt-3 text-base sm:text-lg font-medium italic">Efficiency in every transaction.</p>
          </div>
          
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative z-10 border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className="w-6 h-6 text-red-600" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">Branch Management</h2>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Terminal Security Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security key..."
                    className={`w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border ${loginError ? 'border-red-300 ring-4 ring-red-500/10' : 'border-slate-200'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all text-base sm:text-lg`}
                  />
                </div>
                {loginError && <p className="text-red-500 text-sm font-bold mt-2 ml-1 animate-pulse">Access code incorrect. (Try 'admin')</p>}
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 sm:py-4 rounded-2xl shadow-xl shadow-red-200 transition-all transform active:scale-[0.98] text-base sm:text-lg uppercase tracking-widest"
              >
                Access System
              </button>
            </form>
            
            <p className="text-center text-slate-400 text-xs mt-8">
              &copy; 2024 Rwibasira Supermarket Management System
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'pos': return <POS />;
      case 'reports': return <Reports />;
      case 'settings': return (
        <div className="bg-white p-6 sm:p-8 lg:p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800">Rwibasira System Config</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">Zambian branch configuration active.</p>
          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl text-left">
              <p className="text-xs font-bold text-slate-400 uppercase">Currency</p>
              <p className="font-bold text-slate-800">Zambian Kwacha (K)</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl text-left">
              <p className="text-xs font-bold text-slate-400 uppercase">Timezone</p>
              <p className="font-bold text-slate-800">Africa/Lusaka (GMT+2)</p>
            </div>
          </div>
        </div>
      );
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeView={activeView} setView={setActiveView} onLogout={handleLogout}>
      {renderView()}
    </Layout>
  );
};

export default App;
