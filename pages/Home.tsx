
import * as React from 'react';
import { useState, useEffect } from 'react';
import { TrendingUp, Award, Zap, ArrowRight, Globe, Users } from 'lucide-react';
import { socket } from '../services/socketService';

interface HomeProps {
  user: any;
  onNavigate: (tab: string) => void;
}

const Home: React.FC<HomeProps> = ({ user, onNavigate }) => {
  const [liveBets, setLiveBets] = useState<any[]>([]);

  useEffect(() => {
    // Escuta novas apostas finalizadas no sistema via WebSocket
    const unsubscribe = socket.on('GAME_COMPLETED', (game) => {
      const newBet = {
        id: game.id,
        user: `@${game.opponentName}`,
        amount: game.amount,
        type: game.win ? 'Ganhou' : 'Perdeu',
        time: 'Agora'
      };
      setLiveBets(prev => [newBet, ...prev.slice(0, 4)]);
    });

    // Seed inicial simulado
    const names = ['@lucas_win', '@pedro_bet', '@maria_sorte', '@arena_king', '@bet_master'];
    const initialBets = Array.from({ length: 3 }).map((_, i) => ({
      id: `seed-${i}`,
      user: names[Math.floor(Math.random() * names.length)],
      amount: Math.floor(Math.random() * 200) + 10,
      type: Math.random() > 0.5 ? 'Ganhou' : 'Perdeu',
      time: 'Há 1min'
    }));
    setLiveBets(initialBets);

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            Bem-vindo ao Royale, <br/><span className="text-white/80">{user.username}!</span>
          </h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-md">
            O clássico jogo brasileiro, agora valendo dinheiro. Teste sua sorte.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('criar')}
              className="bg-white text-indigo-700 px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-indigo-50 transition-all transform hover:-translate-y-1 flex items-center gap-2"
            >
              Jogar Agora
              <Zap size={20} className="fill-indigo-700" />
            </button>
            <button 
              onClick={() => onNavigate('estatisticas')}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all"
            >
              Ver Ranking
            </button>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none hidden lg:block">
           <span className="text-[200px] leading-none select-none">✋</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Taxa de Vitória</h3>
              <p className="text-3xl font-black">64%</p>
              <p className="text-emerald-500 text-xs font-semibold mt-2">+5% esta semana</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Ganhos Totais</h3>
              <p className="text-3xl font-black">R$ 1.250,00</p>
              <p className="text-purple-500 text-xs font-semibold mt-2">Maior lucro: R$ 200,00</p>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-xl">Suas Últimas Rodadas</h3>
              <button onClick={() => onNavigate('apostas')} className="text-indigo-400 text-sm font-bold flex items-center gap-1 hover:text-indigo-300">
                Ver Tudo <ArrowRight size={16} />
              </button>
            </div>
            <div className="divide-y divide-slate-700">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 md:p-6 flex items-center justify-between hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i % 2 === 0 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                      {i % 2 === 0 ? 'V' : 'D'}
                    </div>
                    <div>
                      <p className="font-semibold">{i % 2 === 0 ? 'Vitória' : 'Derrota'}</p>
                      <p className="text-sm text-slate-400">Pelo WebSocket</p>
                    </div>
                  </div>
                  <p className={`font-bold ${i % 2 === 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {i % 2 === 0 ? '+R$ 50,00' : '-R$ 20,00'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Live Feed Sidebar */}
        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
             <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Globe size={18} className="text-indigo-400 animate-pulse" /> Arena Global
                </h3>
                <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                   <span className="text-[10px] font-black text-emerald-400 uppercase">Live</span>
                </div>
             </div>
             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <Users size={12} /> Real-time Feed
             </p>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-slate-700 max-h-[500px]">
             {liveBets.map((bet) => (
               <div key={bet.id} className="p-4 hover:bg-slate-700/30 transition-all animate-in slide-in-from-right-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-indigo-400 font-bold text-sm">{bet.user}</span>
                    <span className="text-[10px] text-slate-500 font-bold">{bet.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-xs text-slate-400 uppercase font-black">Ação</span>
                       <span className={`font-bold ${bet.type === 'Ganhou' ? 'text-emerald-400' : 'text-red-400'}`}>{bet.type}</span>
                    </div>
                    <div className="text-right">
                       <span className="text-xs text-slate-400 uppercase font-black">Valor</span>
                       <p className="text-slate-200 font-black font-mono">R$ {bet.amount.toFixed(2)}</p>
                    </div>
                  </div>
               </div>
             ))}
          </div>
          
          <div className="p-4 bg-slate-900/50 mt-auto">
             <button 
              onClick={() => onNavigate('criar')}
              className="w-full bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-400/30 py-3 rounded-xl text-sm font-bold transition-all"
             >
               Entrar no Lobby
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
