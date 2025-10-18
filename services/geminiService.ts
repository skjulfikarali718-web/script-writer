
import { GoogleGenAI, Chat, GenerateContentResponse, GroundingChunk as GenAIGroundingChunk } from "@google/genai";
import { ScriptType, Language, GroundingChunk } from '../types';
import { getSystemInstruction } from '../constants';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateScriptStream = async (
  prompt: string,
  scriptType: ScriptType,
  language: Language,
  onChunk: (chunk: string) => void,
  onSources: (sources: GroundingChunk[]) => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    const systemInstruction = getSystemInstruction(scriptType, language);

    const chat: Chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const fullPrompt = `Please generate a script based on the following topic: "${prompt}"`;
    const resultStream = await chat.sendMessageStream({ message: fullPrompt });

    let finalResponse: GenerateContentResponse | null = null;
    for await (const chunk of resultStream) {
      onChunk(chunk.text);
      finalResponse = chunk;
    }
    
    if (finalResponse?.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        const rawSources = finalResponse.candidates[0].groundingMetadata.groundingChunks as GenAIGroundingChunk[];
        const formattedSources: GroundingChunk[] = rawSources
            .filter(s => s.web && s.web.uri && s.web.title)
            .map(s => ({
                web: {
                    uri: s.web!.uri,
                    title: s.web!.title,
                }
            }));
        onSources(formattedSources);
    }


  } catch (e) {
    console.error(e);
    onError(e instanceof Error ? e.message : 'An unknown error occurred.');
  }
};
