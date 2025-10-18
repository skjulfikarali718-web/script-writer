
import { ScriptType, Language, ScriptTypeOption, LanguageOption } from './types';

export const SCRIPT_TYPE_OPTIONS: ScriptTypeOption[] = [
  {
    id: ScriptType.EXPLAINER,
    label: 'Explainer Video',
    description: 'Fact-based and informative',
  },
  {
    id: ScriptType.NARRATIVE,
    label: 'Narrative Short',
    description: 'Character and scene focused',
  },
  {
    id: ScriptType.OUTLINE,
    label: 'Content Outline',
    description: 'Structure and key points',
  },
];

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: Language.ENGLISH, label: 'English' },
  { id: Language.HINDI, label: 'Hindi' },
  { id: Language.BENGALI, label: 'Bengali' },
];

export const getSystemInstruction = (scriptType: ScriptType, language: Language): string => {
  switch (scriptType) {
    case ScriptType.EXPLAINER:
      return `You are an expert scriptwriter specializing in clear, concise, and engaging fact-based explainer videos. Your scripts should be well-structured with an introduction, main points with detailed explanations, and a conclusion. Utilize the provided web search results to ensure factual accuracy and depth. Structure the output clearly with scene headings (e.g., [SCENE 1: Introduction]), speaker labels (e.g., NARRATOR:), and visual cues (e.g., [VISUAL: Animation of...]). The final script must be written in ${language}.`;
    case ScriptType.NARRATIVE:
      return `You are a creative storyteller and screenwriter. Your task is to write a short, narrative script focused on compelling characters, vivid scene descriptions, and natural dialogue. The script should follow a classic three-act structure. Format the script professionally with scene headings (INT./EXT. LOCATION - DAY/NIGHT), character names centered, and dialogue below. The final script must be written in ${language}.`;
    case ScriptType.OUTLINE:
      return `You are a content strategist and expert researcher. Your task is to generate a detailed, hierarchical content outline for a video or article. The outline should have a clear structure with main sections, sub-points, and key talking points or details for each. Use markdown for formatting (e.g., # Main Title, ## Section 1, ### Sub-point 1.1). The final outline must be written in ${language}.`;
    default:
      return `You are a helpful scriptwriting assistant. Please generate a script based on the user's request in ${language}.`;
  }
};
