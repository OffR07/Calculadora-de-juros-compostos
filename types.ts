
export interface User {
  id: string;
  username: string;
  balance: number;
  avatar: string;
}

export type BetType = 'par' | 'impar';

export interface GameResult {
  id: string;
  timestamp: number;
  userNumber: number;
  opponentNumber: number;
  opponentName: string;
  sum: number;
  betType: BetType;
  win: boolean;
  amount: number;
  comment: string;
}

export interface BetChallenge {
  id: string;
  username: string;
  amount: number;
  betType: BetType; // O lado que o criador da aposta escolheu
  timestamp: number;
  avatar: string;
  hiddenFingers: number; // O número que o criador escolheu (escondido)
}

export interface Stats {
  totalGames: number;
  wins: number;
  losses: number;
  totalProfit: number;
}
