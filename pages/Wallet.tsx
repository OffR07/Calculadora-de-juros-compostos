
import * as React from 'react';
import { useState } from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Plus, DollarSign } from 'lucide-react';

interface WalletProps {
  user: any;
  onUpdateBalance: (amount: number) => void;
}

const Wallet: React.FC<WalletProps> = ({ user, onUpdateBalance }) => {
  const [depositAmount, setDepositAmount] = useState(100);

  const handleDeposit = () => {
    onUpdateBalance(depositAmount);
    alert(`R$ ${depositAmount.toFixed(2)} depositados com sucesso!`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card and Balance */}
        <div className="space-y-6">
          <div className="relative h-56 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-800 p-8 shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <CreditCard size={24} className="text-white" />
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Royale Bank</p>
                  <p className="text-white font-bold">Premium Tier</p>
                </div>
              </div>
              
              <div>
                <p className="text-white/60 text-sm font-medium mb-1">Saldo em Conta</p>
                <p className="text-4xl font-black text-white">R$ {user.balance.toFixed(2)}</p>
              </div>
              
              <div className="flex justify-between items-end">
                <p className="text-white/80 font-mono tracking-widest text-sm">**** **** **** 4096</p>
                <div className="flex gap-1">
                   <div className="w-6 h-6 bg-red-500/80 rounded-full" />
                   <div className="w-6 h-6 bg-yellow-500/80 rounded-full -ml-3" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700">
             <h3 className="font-bold mb-4">Ações Rápidas</h3>
             <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-900/50 hover:bg-slate-700 rounded-2xl border border-slate-700 transition-all">
                   <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center">
                      <ArrowDownLeft size={20} />
                   </div>
                   <span className="text-sm font-bold">Sacar</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-900/50 hover:bg-slate-700 rounded-2xl border border-slate-700 transition-all">
                   <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                      <DollarSign size={20} />
                   </div>
                   <span className="text-sm font-bold">Transferir</span>
                </button>
             </div>
          </div>
        </div>

        {/* Deposit Area */}
        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
          <h3 className="text-xl font-bold mb-6">Recarregar Saldo</h3>
          <p className="text-slate-400 text-sm mb-6">Seu saldo é fictício para fins de demonstração do jogo. Recarregue para continuar apostando.</p>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase px-1">Valor do Depósito</label>
              <div className="relative">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                 <input 
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl py-4 pl-12 pr-4 text-2xl font-black outline-none transition-colors"
                 />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
               {[50, 100, 200, 500].map(val => (
                 <button 
                  key={val}
                  onClick={() => setDepositAmount(val)}
                  className={`py-3 rounded-xl text-sm font-bold transition-all ${depositAmount === val ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                 >
                   {val}
                 </button>
               ))}
            </div>

            <button 
              onClick={handleDeposit}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Confirmar Depósito
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-700">
            <h4 className="font-bold text-slate-400 text-sm uppercase tracking-wider mb-4">Métodos Salvos</h4>
            <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
               <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-900 font-bold">PIX</div>
               <div className="flex-1">
                 <p className="text-sm font-bold">pix-royale-user@app.com</p>
                 <p className="text-xs text-slate-500">Chave Aleatória</p>
               </div>
               <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
