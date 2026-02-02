
import * as React from 'react';
import { useState } from 'react';
import { FingerIcon } from '../components/FingerIcon';
import { Plus, Sparkles, Zap, ShieldCheck, Clock, Trash2, User as UserIcon } from 'lucide-react';
import { BetChallenge } from '../types';
import { socket } from '../services/socketService';

interface CreateBetProps {
  user: any;
  onGameComplete: (result: any) => void;
}

const CreateBet: React.FC<CreateBetProps> = ({ user, onGameComplete }) => {
  const [amount, setAmount] = useState(20);
  const [betType, setBetType] = useState<'par' | 'impar'>('par');
  const [userNumber, setUserNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Lista local para exibição apenas das apostas deste usuário
  const [myActiveBets, setMyActiveBets] = useState<BetChallenge[]>([]);

  const handleCreateBet = () => {
    if (amount > user.balance) {
      alert("Saldo insuficiente!");
      return;
    }
    
    setIsLoading(true);
    
    const newChallenge: BetChallenge = {
      id: Math.random().toString(36).substr(2, 9),
      username: user.username,
      amount,
      betType,
      timestamp: Date.now(),
      avatar: user.avatar,
      hiddenFingers: userNumber
    };

    // Simula emissão via socket para aparecer no Lobby Global
    setTimeout(() => {
      socket.send('CHALLENGE_CREATED', newChallenge);
      setMyActiveBets(prev => [newChallenge, ...prev]);
      setIsLoading(false);
      alert("Aposta publicada! Ela já está visível no Lobby para outros jogadores.");
      setAmount(20);
    }, 1000);
  };

  const handleCancelBet = (id: string) => {
    setMyActiveBets(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div>
        <h2 className="text-5xl font-black mb-2">Novo Desafio</h2>
        <p className="text-slate-400 font-medium text-lg">Defina os termos e aguarde um oponente na arena</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-slate-800 p-10 md:p-14 rounded-[50px] border-2 border-slate-700 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Plus size={200} />
            </div>

            <div className="space-y-12 relative z-10">
              {/* Hands Selection */}
              <div>
                <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-white">
                  <span className="w-10 h-10 bg-indigo-600 rounded-2xl text-sm flex items-center justify-center shadow-xl shadow-indigo-600/30">1</span>
                  Escolha sua jogada (oculta)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-6">
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setUserNumber(n)} className="focus:outline-none">
                      <FingerIcon number={n} active={userNumber === n} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Side and Value */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-black flex items-center gap-4 text-white">
                    <span className="w-10 h-10 bg-indigo-600 rounded-2xl text-sm flex items-center justify-center shadow-xl shadow-indigo-600/30">2</span>
                    Lado da Aposta
                  </h3>
                  <div className="grid grid-cols-2 gap-5">
                    <button 
                      onClick={() => setBetType('par')}
                      className={`py-8 rounded-3xl border-4 font-black text-2xl transition-all ${betType === 'par' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-2xl shadow-emerald-500/10' : 'border-slate-700 bg-slate-900/50 text-slate-500 hover:border-slate-600'}`}
                    >PAR</button>
                    <button 
                      onClick={() => setBetType('impar')}
                      className={`py-8 rounded-3xl border-4 font-black text-2xl transition-all ${betType === 'impar' ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-2xl shadow-purple-500/10' : 'border-slate-700 bg-slate-900/50 text-slate-500 hover:border-slate-600'}`}
                    >ÍMPAR</button>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-black flex items-center gap-4 text-white">
                    <span className="w-10 h-10 bg-indigo-600 rounded-2xl text-sm flex items-center justify-center shadow-xl shadow-indigo-600/30">3</span>
                    Valor do Montante
                  </h3>
                  <div className="relative group">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-slate-500 text-3xl">R$</span>
                    <input 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full bg-slate-900 border-4 border-slate-700 rounded-[40px] py-8 pl-20 pr-8 text-4xl font-black outline-none focus:border-indigo-500 transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <button 
                disabled={isLoading || amount <= 0}
                onClick={handleCreateBet}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-8 rounded-[40px] shadow-2xl shadow-indigo-600/40 transition-all transform active:scale-95 text-3xl flex items-center justify-center gap-5"
              >
                {isLoading ? <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : <>PUBLICAR NO LOBBY <Zap size={32} className="fill-white" /></>}
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar My Active Bets */}
        <div className="space-y-8">
           <div className="bg-slate-800 p-8 rounded-[45px] border-2 border-slate-700 shadow-2xl">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                <UserIcon className="text-indigo-400" size={24} />
                Minhas Apostas
              </h3>
              
              {myActiveBets.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-slate-700 rounded-[35px] bg-slate-900/30">
                   <Clock size={40} className="mx-auto text-slate-700 mb-4 opacity-30" />
                   <p className="text-slate-500 font-bold max-w-[150px] mx-auto">Você não tem apostas ativas no lobby</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {myActiveBets.map((bet) => (
                    <div key={bet.id} className="bg-slate-900 border-2 border-slate-700 p-6 rounded-[35px] hover:border-indigo-500 transition-all shadow-xl group">
                       <div className="flex justify-between items-center mb-5">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(bet.timestamp).toLocaleTimeString()}</span>
                          <span className={`text-xs font-black px-4 py-1.5 rounded-full uppercase ${bet.betType === 'par' ? 'bg-emerald-500 text-white' : 'bg-purple-500 text-white'}`}>{bet.betType}</span>
                       </div>
                       <div className="flex items-center justify-between mb-6">
                          <div>
                             <p className="text-3xl font-black text-white">R$ {bet.amount.toFixed(2)}</p>
                             <p className="text-xs font-black text-slate-500 mt-1">Sua mão: {bet.hiddenFingers} dedos</p>
                          </div>
                          <FingerIcon number={bet.hiddenFingers} className="scale-[0.4] !m-0 !p-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                       </div>
                       <button 
                        onClick={() => handleCancelBet(bet.id)}
                        className="w-full py-3.5 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-2 border-red-500/20 text-sm font-black transition-all flex items-center justify-center gap-2"
                       >
                         <Trash2 size={16} /> CANCELAR
                       </button>
                    </div>
                  ))}
                </div>
              )}
           </div>

           <div className="bg-indigo-600/10 p-10 rounded-[45px] border-2 border-indigo-500/20 shadow-inner">
              <ShieldCheck className="text-indigo-400 mb-6" size={40} />
              <h4 className="font-black text-white text-xl mb-3">Segurança Total</h4>
              <p className="text-slate-400 leading-relaxed font-bold">Ao criar uma aposta, seu saldo é reservado e garantido pelo Royale Bank. O saque é imediato após a vitória.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBet;
