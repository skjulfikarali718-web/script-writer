export enum ScriptType {
  EXPLAINER = 'explainer',
  NARRATIVE = 'narrative',
  OUTLINE = 'outline',
}

export enum Language {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  BENGALI = 'Bengali',
}

export interface ScriptTypeOption {
  id: ScriptType;
  label: string;
  description: string;
}

export interface LanguageOption {
  id: Language;
  label: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface HistoryItem {
  id: string;
  prompt: string;
  scriptType: ScriptType;
  language: Language;
  generatedScript: string;
  sources: GroundingChunk[];
  timestamp: number;
}
