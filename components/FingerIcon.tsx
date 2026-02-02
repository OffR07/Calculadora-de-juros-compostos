
import * as React from 'react';

/**
 * Mapeamento de imagens de dedos (0 a 5)
 * Utilizando a biblioteca de ícones Color do Icons8 para um visual cartoon consistente.
 */
const getFingerSrc = (num: number) => {
  const assets: Record<number, string> = {
    0: 'https://img.icons8.com/color/144/clenched-fist.png', // Punho fechado (Zero)
    1: 'https://img.icons8.com/color/144/one-finger.png',
    2: 'https://img.icons8.com/color/144/two-fingers.png',
    3: 'https://img.icons8.com/color/144/three-fingers.png',
    4: 'https://img.icons8.com/color/144/four-fingers.png',
    5: 'https://img.icons8.com/color/144/hand.png', // Mão aberta
  };
  return assets[num] || '';
};

interface FingerIconProps {
  number: number;
  className?: string;
  active?: boolean;
}

export const FingerIcon: React.FC<FingerIconProps> = ({ number, className = "", active = false }) => {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div className={`flex flex-col items-center justify-center transition-all duration-300 transform ${active ? 'scale-110' : 'hover:scale-105'} ${className}`}>
      <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-white flex items-center justify-center transition-all shadow-2xl ${active ? 'ring-4 ring-indigo-500 shadow-indigo-500/40' : 'border-4 border-slate-700 hover:border-slate-500'}`}>
        
        {!hasError ? (
          <img 
            src={getFingerSrc(number)} 
            alt={`${number === 0 ? 'Punho' : number + ' dedos'}`}
            onError={() => setHasError(true)}
            className="w-16 h-16 md:w-20 md:h-20 object-contain select-none animate-in fade-in zoom-in duration-300"
          />
        ) : (
          <div className="text-slate-900 font-black text-4xl">{number}</div>
        )}

        {active && (
          <div className="absolute -top-4 bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg border-2 border-slate-900 animate-bounce">
            SELECIONADO
          </div>
        )}
      </div>
      <span className={`mt-4 font-black text-2xl tracking-tighter ${active ? 'text-indigo-400' : 'text-slate-500'}`}>
        {number === 0 ? 'ZERO' : `${number} ${number === 1 ? 'DEDO' : 'DEDOS'}`}
      </span>
    </div>
  );
};
