
import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { GameResult, BetChallenge } from '../types';
import { FingerIcon } from '../components/FingerIcon';
import { 
  Clock, TrendingUp, TrendingDown, Filter, Calendar, 
  Search, Users, ArrowRight, Zap, History as HistoryIcon, 
  LayoutGrid, Sparkles 
} from 'lucide-react';
import { getGameResponse } from '../services/geminiService';
import { socket } from '../services/socketService';

interface BetsProps {
  history: GameResult[];
  user: any;
  onGameComplete: (result: GameResult) => void;
}

const Bets: React.FC<BetsProps> = ({ history, user, onGameComplete }) => {
  const [view, setView] = useState<'lobby' | 'history'>('lobby');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState<BetChallenge | null>(null);
  const [userNumber, setUserNumber] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeChallenges, setActiveChallenges] = useState<BetChallenge[]>([]);

  // Gerar 100 apostas fictícias para o Lobby inicial
  const fictitiousBets: BetChallenge[] = useMemo(() => {
    const names = ['André_99', 'Marta_Sortuda', 'Rei_do_PI', 'BetMaster', 'Ninja_das_Maos', 'Gusta_Win', 'Lia_Aposta', 'Crypto_King', 'Sorte_Pura', 'Mestre_Royale'];
    const challenges: BetChallenge[] = [];
    for (let i = 0; i < 100; i++) {
      const name = names[Math.floor(Math.random() * names.length)] + '_' + (i + 1);
      challenges.push({
        id: `fictitious-${i}`,
        username: name,
        amount: [10, 20, 50, 100, 200, 500][Math.floor(Math.random() * 6)],
        betType: Math.random() > 0.5 ? 'par' : 'impar',
        timestamp: Date.now() - Math.floor(Math.random() * 10000000),
        avatar: `https://picsum.photos/seed/${name}/100`,
        hiddenFingers: Math.floor(Math.random() * 6) // Agora pode ser de 0 a 5
      });
    }
    return challenges;
  }, []);

  useEffect(() => {
    // Escuta novas apostas reais criadas por outros usuários via WebSocket
    const unsubscribe = socket.on('CHALLENGE_CREATED', (challenge: BetChallenge) => {
      setActiveChallenges(prev => [challenge, ...prev]);
    });
    return () => unsubscribe();
  }, []);

  const allLobbyBets = useMemo(() => {
    return [...activeChallenges, ...fictitiousBets].sort((a, b) => b.timestamp - a.timestamp);
  }, [activeChallenges, fictitiousBets]);

  const filteredLobby = allLobbyBets.filter(b => b.username.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredHistory = history.filter(h => h.opponentName.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAcceptBet = async () => {
    if (!selectedChallenge) return;
    if (selectedChallenge.amount > user.balance) {
      alert("Saldo insuficiente!");
      return;
    }

    setIsProcessing(true);
    try {
      const aiResponse = await getGameResponse(userNumber, selectedChallenge.betType, selectedChallenge.amount);
      const sum = userNumber + selectedChallenge.hiddenFingers;
      const isSumPar = sum % 2 === 0;
      const creatorWon = (selectedChallenge.betType === 'par' && isSumPar) || (selectedChallenge.betType === 'impar' && !isSumPar);
      const userWon = !creatorWon;

      const result: GameResult = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        userNumber,
        opponentNumber: selectedChallenge.hiddenFingers,
        opponentName: selectedChallenge.username,
        sum,
        betType: selectedChallenge.betType === 'par' ? 'impar' : 'par',
        win: userWon,
        amount: selectedChallenge.amount,
        comment: aiResponse.comment
      };

      onGameComplete(result);
      setSelectedChallenge(null);
      // Remove do lobby se for uma aposta real
      setActiveChallenges(prev => prev.filter(c => c.id !== selectedChallenge.id));
    } catch (error) {
      alert("Erro ao processar duelo.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black mb-2">{view === 'lobby' ? 'Lobby de Apostas' : 'Seu Histórico'}</h2>
          <p className="text-slate-400 font-medium">
            {view === 'lobby' ? 'Enfrente usuários reais e apostas do sistema' : 'Veja como foi seu desempenho nas últimas partidas'}
          </p>
        </div>
        <div className="flex bg-slate-800 p-1.5 rounded-[20px] border border-slate-700 shadow-inner">
          <button 
            onClick={() => setView('lobby')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all ${view === 'lobby' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'}`}
          >
            <LayoutGrid size={18} /> LOBBY
          </button>
          <button 
            onClick={() => setView('history')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all ${view === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'}`}
          >
            <HistoryIcon size={18} /> HISTÓRICO
          </button>
        </div>
      </div>

      {/* Challenge Acceptance UI */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-800 w-full max-w-2xl rounded-[40px] border-4 border-indigo-500/30 p-8 md:p-12 shadow-2xl relative">
             <button 
              onClick={() => setSelectedChallenge(null)}
              className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
             >
               <HistoryIcon className="rotate-45" size={32} />
             </button>
             
             <div className="text-center mb-10">
                <img src={selectedChallenge.avatar} className="w-24 h-24 rounded-[2rem] mx-auto mb-4 border-4 border-indigo-500 shadow-2xl" alt="Avatar" />
                <h3 className="text-3xl font-black mb-2">Desafio contra <span className="text-indigo-400">@{selectedChallenge.username}</span></h3>
                <div className="inline-flex items-center gap-2 bg-slate-900 px-8 py-3 rounded-2xl border border-slate-700">
                   <Zap size={20} className="text-yellow-400 fill-yellow-400" />
                   <span className="font-black text-2xl text-emerald-400">R$ {selectedChallenge.amount.toFixed(2)}</span>
                </div>
             </div>

             <div className="space-y-12">
                <section>
                  <p className="text-center text-slate-500 font-black uppercase tracking-[0.2em] mb-8">Coloque sua mão</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {[0, 1, 2, 3, 4, 5].map(n => (
                      <button key={n} onClick={() => setUserNumber(n)} className="focus:outline-none">
                        <FingerIcon number={n} active={userNumber === n} />
                      </button>
                    ))}
                  </div>
                </section>
                
                <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-700 text-center shadow-inner">
                   <p className="text-slate-400 font-bold mb-1">Oponente apostou em: <span className="text-white uppercase font-black">{selectedChallenge.betType}</span></p>
                   <p className="text-slate-400 font-bold">Você jogará pelo: <span className="text-indigo-400 uppercase font-black">{selectedChallenge.betType === 'par' ? 'ÍMPAR' : 'PAR'}</span></p>
                </div>

                <button 
                  disabled={isProcessing}
                  onClick={handleAcceptBet}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-7 rounded-[30px] shadow-2xl shadow-indigo-600/40 transition-all transform active:scale-95 text-2xl flex items-center justify-center gap-3"
                >
                  {isProcessing ? <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : <>DUELAR AGORA <Sparkles size={28} /></>}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Main List */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-[40px] p-8 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col md:flex-row gap-6 mb-10">
           <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
              <input 
                type="text" 
                placeholder={view === 'lobby' ? "Buscar usuários no lobby..." : "Buscar em suas partidas..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/90 border-2 border-slate-700 rounded-3xl py-5 pl-16 pr-6 outline-none focus:border-indigo-500 transition-all font-black text-lg"
              />
           </div>
           {view === 'lobby' && (
             <div className="flex items-center gap-4 bg-slate-900 px-8 py-5 rounded-3xl border border-slate-700 shadow-inner">
                <Users className="text-indigo-400" size={24} />
                <span className="font-black text-slate-200">1.284 JOGADORES</span>
             </div>
           )}
        </div>

        {view === 'lobby' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLobby.map((bet) => (
              <div key={bet.id} className="group bg-slate-800 border-2 border-slate-700 p-8 rounded-[40px] hover:border-indigo-500 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 relative overflow-hidden">
                <div className="flex items-center gap-5 mb-8">
                    <img src={bet.avatar} className="w-16 h-16 rounded-[1.5rem] border-2 border-slate-700 shadow-xl" alt="User" />
                    <div>
                      <h4 className="font-black text-xl text-white group-hover:text-indigo-400 transition-colors">@{bet.username}</h4>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Nível {Math.floor(Math.random()*10)+1}</p>
                    </div>
                </div>
                <div className="flex items-center justify-between mb-8 bg-slate-900/80 p-5 rounded-3xl border border-slate-700 shadow-inner">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-tighter">Prêmio</p>
                      <p className="text-2xl font-black text-emerald-400">R$ {bet.amount.toFixed(2)}</p>
                    </div>
                    <div className="w-px h-10 bg-slate-700" />
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-tighter">Lado dele</p>
                      <p className={`text-2xl font-black uppercase ${bet.betType === 'par' ? 'text-indigo-400' : 'text-purple-400'}`}>{bet.betType}</p>
                    </div>
                </div>
                <button 
                  onClick={() => setSelectedChallenge(bet)}
                  className="w-full bg-slate-700 group-hover:bg-indigo-600 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  ACEITAR DUELO <ArrowRight size={20} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredHistory.map((game) => (
              <div key={game.id} className="bg-slate-800 border-2 border-slate-700 rounded-[35px] overflow-hidden hover:border-indigo-500/50 transition-all group p-8 flex flex-wrap items-center justify-between gap-10">
                 <div className="flex items-center gap-8">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transform transition-transform group-hover:rotate-6 ${game.win ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/20 text-red-500 border border-red-500/20'}`}>
                      {game.win ? <TrendingUp size={40} /> : <TrendingDown size={40} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-4">
                         <p className="font-black text-3xl tracking-tighter">{game.win ? 'VITÓRIA' : 'DERROTA'}</p>
                         <span className={`text-xs font-black px-4 py-1.5 rounded-full uppercase ${game.betType === 'par' ? 'bg-indigo-500 text-white' : 'bg-purple-500 text-white'}`}>
                            {game.betType}
                         </span>
                      </div>
                      <p className="text-lg font-bold text-slate-500 mt-2">Vs @{game.opponentName}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-10 bg-slate-900/80 px-10 py-6 rounded-[30px] border-2 border-slate-700 shadow-inner">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase mb-4">Você</span>
                      <FingerIcon number={game.userNumber} className="scale-75 !m-0 !p-0" />
                    </div>
                    <div className="text-slate-700 font-black text-4xl pt-8">+</div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase mb-4">@{game.opponentName}</span>
                      <FingerIcon number={game.opponentNumber} className="scale-75 !m-0 !p-0" />
                    </div>
                    <div className="w-px h-16 bg-slate-700 mx-4 mt-8" />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase mb-4">Total</span>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-3xl border-4 ${game.sum % 2 === 0 ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-purple-500 text-purple-400 bg-purple-500/10'}`}>
                        {game.sum}
                      </div>
                    </div>
                 </div>

                 <div className="text-right">
                    <p className={`text-4xl font-black ${game.win ? 'text-emerald-500' : 'text-red-500'}`}>
                      {game.win ? `+ R$ ${game.amount.toFixed(2)}` : `- R$ ${game.amount.toFixed(2)}`}
                    </p>
                    <p className="text-sm font-black text-slate-500 uppercase mt-2 tracking-widest">{new Date(game.timestamp).toLocaleDateString('pt-BR')}</p>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bets;
