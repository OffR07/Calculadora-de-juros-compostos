
import { GameResult } from '../types';

type SocketCallback = (data: any) => void;

class SocketService {
  private listeners: Record<string, SocketCallback[]> = {};

  // Simula a conexão com o servidor de WebSocket
  connect() {
    console.log("Conectado ao Royale WebSocket Server");
  }

  // Registra um ouvinte para um evento específico
  on(event: string, callback: SocketCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  // Remove um ouvinte
  off(event: string, callback: SocketCallback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  // Emite um evento (simula o servidor enviando dados para o cliente)
  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // Simulação de transação de rede
  async send(event: string, data: any) {
    // Aqui seria o ws.send(JSON.stringify({event, data}))
    console.log(`[WS SEND]: ${event}`, data);
    
    // Simula o servidor processando e devolvendo para todos
    setTimeout(() => {
      this.emit(event, data);
    }, 100);
  }
}

export const socket = new SocketService();
