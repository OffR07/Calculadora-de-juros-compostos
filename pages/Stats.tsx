
import * as React from 'react';
import { GameResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Trophy, TrendingUp, Target, Activity } from 'lucide-react';

interface StatsProps {
  history: GameResult[];
}

const Stats: React.FC<StatsProps> = ({ history }) => {
  const wins = history.filter(g => g.win).length;
  const losses = history.length - wins;
  const winRate = history.length > 0 ? (wins / history.length) * 100 : 0;
  
  const totalBet = history.reduce((acc, g) => acc + g.amount, 0);
  const totalProfit = history.reduce((acc, g) => acc + (g.win ? g.amount : -g.amount), 0);

  const chartData = [
    { name: 'Vitórias', value: wins, color: '#10b981' },
    { name: 'Derrotas', value: losses, color: '#ef4444' }
  ];

  // Daily profit data (simplified)
  const profitData = history.slice(-10).map((g, i) => ({
    name: i + 1,
    profit: g.win ? g.amount : -g.amount
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
              <Activity size={20} />
            </div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Jogos</span>
          </div>
          <p className="text-3xl font-black">{history.length}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
              <Target size={20} />
            </div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Win Rate</span>
          </div>
          <p className="text-3xl font-black">{winRate.toFixed(1)}%</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-500/10 text-yellow-500 rounded-xl flex items-center justify-center">
              <Trophy size={20} />
            </div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Maior Lucro</span>
          </div>
          <p className="text-3xl font-black">R$ {Math.max(0, ...history.map(g => g.win ? g.amount : 0)).toFixed(2)}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Lucro Líquido</span>
          </div>
          <p className={`text-3xl font-black ${totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            R$ {totalProfit.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
          <h3 className="text-xl font-bold mb-8">Performance Geral</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-slate-400">Vitórias ({wins})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-slate-400">Derrotas ({losses})</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
          <h3 className="text-xl font-bold mb-8">Lucro por Últimas Jogadas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                />
                <Bar dataKey="profit" radius={[4, 4, 4, 4]}>
                  {profitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
