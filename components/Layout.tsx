
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Home, History, PlusCircle, Wallet, BarChart2, User, LogOut, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: any;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBalanceAnimating, setIsBalanceAnimating] = useState(false);
  const prevBalanceRef = useRef(user.balance);

  // Efeito visual para quando o saldo muda via WebSocket
  useEffect(() => {
    if (prevBalanceRef.current !== user.balance) {
      setIsBalanceAnimating(true);
      const timer = setTimeout(() => setIsBalanceAnimating(false), 1000);
      prevBalanceRef.current = user.balance;
      return () => clearTimeout(timer);
    }
  }, [user.balance]);

  const menuItems = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'apostas', label: 'Apostas', icon: History },
    { id: 'criar', label: 'Criar Aposta', icon: PlusCircle },
    { id: 'carteira', label: 'Carteira', icon: Wallet },
    { id: 'estatisticas', label: 'Estatísticas', icon: BarChart2 },
    { id: 'perfil', label: 'Perfil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:block`}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl">P</div>
            <h1 className="text-xl font-bold tracking-tight">Royale <span className="text-indigo-400">P/I</span></h1>
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-700">
            <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-slate-700/50 rounded-xl">
              <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-slate-600" />
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold truncate">{user.username}</p>
                <p className={`text-xs font-bold transition-all duration-300 ${isBalanceAnimating ? 'text-emerald-400 scale-110' : 'text-indigo-400'}`}>
                  R$ {user.balance.toFixed(2)}
                </p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900">
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
          <button className="md:hidden p-2 text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Saldo Atual</span>
              <span className={`text-sm font-bold transition-all duration-300 ${isBalanceAnimating ? 'text-emerald-400 scale-110' : 'text-emerald-400'}`}>
                R$ {user.balance.toFixed(2)}
              </span>
            </div>
            <button 
              onClick={() => onTabChange('carteira')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
            >
              Depositar
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
