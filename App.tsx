
import React, { useState, useCallback, useEffect } from 'react';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Bets from './pages/Bets';
import CreateBet from './pages/CreateBet';
import Wallet from './pages/Wallet';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import { User, GameResult } from './types';
import { socket } from './services/socketService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<GameResult[]>([]);

  const handleLogin = (username: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      username,
      balance: 1000.00,
      avatar: `https://picsum.photos/seed/${username}/200`
    };
    setUser(newUser);
    setIsLoggedIn(true);
    setActiveTab('inicio');
    socket.connect();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setHistory([]);
  };

  const handleGameComplete = useCallback((result: GameResult) => {
    // Emite via socket para que outros "clientes" vejam a atualização
    socket.send('GAME_COMPLETED', result);
  }, []);

  // Ouvir o socket para atualizações em tempo real
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const unsubscribeGame = socket.on('GAME_COMPLETED', (result: GameResult) => {
      // Adiciona ao histórico local
      setHistory(prev => [result, ...prev]);
      
      // Atualiza o saldo se o usuário participou dessa aposta
      // No fluxo do App, 'result' representa a partida que acabou de acontecer.
      // Se user for participante, balance atualiza.
      setUser(prev => {
        if (!prev) return null;
        // Simulamos que se o resultado vier pelo socket, o saldo do usuário corrente deve ser afetado
        // se ele for o ganhador ou perdedor daquela transação específica.
        const change = result.win ? result.amount : -result.amount;
        return {
          ...prev,
          balance: prev.balance + change
        };
      });
    });

    const unsubscribeBalance = socket.on('BALANCE_UPDATED', (amount: number) => {
      setUser(prev => {
        if (!prev) return null;
        return { ...prev, balance: prev.balance + amount };
      });
    });

    return () => {
      unsubscribeGame();
      unsubscribeBalance();
    };
  }, [isLoggedIn, user]);

  const handleUpdateBalance = (amount: number) => {
    socket.send('BALANCE_UPDATED', amount);
  };

  if (!isLoggedIn || !user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio': return <Home user={user} onNavigate={setActiveTab} />;
      case 'apostas': return <Bets history={history} user={user} onGameComplete={handleGameComplete} />;
      case 'criar': return <CreateBet user={user} onGameComplete={handleGameComplete} />;
      case 'carteira': return <Wallet user={user} onUpdateBalance={handleUpdateBalance} />;
      case 'estatisticas': return <Stats history={history} />;
      case 'perfil': return <Profile user={user} onLogout={handleLogout} />;
      default: return <Home user={user} onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      user={user} 
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
