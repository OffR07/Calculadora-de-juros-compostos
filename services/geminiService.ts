
import { GoogleGenAI, Type } from "@google/genai";

// Instantiate GoogleGenAI inside the function to ensure it uses the latest API key from the environment
export const getGameResponse = async (userNumber: number, betType: 'par' | 'impar', amount: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `O usuário escolheu o número ${userNumber}, a aposta é ${betType} e o valor é R$${amount}. 
               Decida um número de 0 a 5 para o bot (onde 0 é o punho fechado). 
               Verifique quem ganhou (soma par ou ímpar). Lembre-se que zero é neutro na soma, mas conta para paridade do total.
               Crie um comentário divertido e provocador em Português do Brasil sobre o resultado.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          aiNumber: { type: Type.INTEGER, description: "Número do bot de 0 a 5" },
          comment: { type: Type.STRING, description: "Comentário do bot" },
          winner: { type: Type.STRING, enum: ["user", "ai"], description: "Quem venceu a rodada" }
        },
        required: ["aiNumber", "comment", "winner"]
      }
    }
  });

  try {
    // Extract text and trim before parsing as per guidelines
    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
  } catch (e) {
    // Fallback logic in case of parsing errors
    const aiNum = Math.floor(Math.random() * 6); // 0 a 5
    const sum = userNumber + aiNum;
    const isSumPar = sum % 2 === 0;
    const userWon = (betType === 'par' && isSumPar) || (betType === 'impar' && !isSumPar);
    
    return {
      aiNumber: aiNum,
      comment: userWon ? "Dessa vez você teve sorte, humano! Esse zero aí me confundiu." : "Haha! Ganhei de você! Meu punho fechado foi implacável.",
      winner: userWon ? "user" : "ai"
    };
  }
};
