
import React, { useEffect, useState } from 'react';
import { AppView } from '../types';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView, onLogout }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [activeView]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'Sales Terminal', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen md:h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col h-full shadow-xl z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-white p-1 rounded-lg overflow-hidden w-10 h-10 flex items-center justify-center">
            <img src="/logo.png" alt="Rwibasira Logo" className="w-full h-full object-contain" onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=R';
            }} />
          </div>
          <span className="font-bold text-lg tracking-tight">Rwibasira</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as AppView)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden transition-opacity ${isMobileNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-950/50" onClick={() => setIsMobileNavOpen(false)}></div>
        <aside className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-slate-900 text-white flex flex-col shadow-xl transition-transform ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-lg overflow-hidden w-10 h-10 flex items-center justify-center">
                <img src="/logo.png" alt="Rwibasira Logo" className="w-full h-full object-contain" onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=R';
                }} />
              </div>
              <span className="font-bold text-lg tracking-tight">Rwibasira</span>
            </div>
            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as AppView)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex min-w-0 flex-col overflow-hidden">
        <header className="h-14 sm:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold capitalize text-slate-800 truncate">
              {activeView === 'pos' ? 'Sales Terminal' : activeView}
            </h2>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700">Administrator</p>
              <p className="text-xs text-slate-400">Rwibasira Main Branch</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-700 font-bold border-2 border-white shadow-sm">
              RW
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
