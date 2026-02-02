
import * as React from 'react';
import { User, Shield, Bell, Settings, LogOut, ChevronRight, Activity } from 'lucide-react';

interface ProfileProps {
  user: any;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-slate-800 rounded-3xl overflow-hidden border border-slate-700">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-700" />
        <div className="px-8 pb-8">
           <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="relative">
                <img 
                  src={user.avatar} 
                  alt="Avatar" 
                  className="w-32 h-32 rounded-3xl bg-slate-700 border-4 border-slate-800 shadow-xl"
                />
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-slate-800 rounded-full" />
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all mb-2">
                Editar Perfil
              </button>
           </div>
           
           <div>
             <h2 className="text-3xl font-black">{user.username}</h2>
             <p className="text-slate-400 font-medium">Jogador Royale Nível 12 • Membro desde 2024</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
           <h3 className="text-lg font-bold px-2">Configurações da Conta</h3>
           <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden divide-y divide-slate-700">
              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-slate-300">
                      <User size={18} />
                   </div>
                   <span className="font-semibold">Informações Pessoais</span>
                </div>
                <ChevronRight size={18} className="text-slate-500" />
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-slate-300">
                      <Shield size={18} />
                   </div>
                   <span className="font-semibold">Segurança e Senha</span>
                </div>
                <ChevronRight size={18} className="text-slate-500" />
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-slate-300">
                      <Bell size={18} />
                   </div>
                   <span className="font-semibold">Notificações</span>
                </div>
                <ChevronRight size={18} className="text-slate-500" />
              </button>
           </div>
        </div>

        <div className="space-y-4">
           <h3 className="text-lg font-bold px-2">Preferências de Jogo</h3>
           <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden divide-y divide-slate-700">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-slate-300">
                      <Settings size={18} />
                   </div>
                   <span className="font-semibold">Efeitos Sonoros</span>
                </div>
                <div className="w-12 h-6 bg-indigo-600 rounded-full relative p-1 cursor-pointer">
                   <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-slate-300">
                      <Activity size={18} />
                   </div>
                   <span className="font-semibold">Modo de Exibição</span>
                </div>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">ESCURO</span>
              </div>
           </div>
           
           <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl border border-red-500/20 transition-all font-bold"
           >
              <LogOut size={18} />
              Encerrar Sessão
           </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
