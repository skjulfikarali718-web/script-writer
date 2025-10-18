import React from 'react';
import { ScriptType, Language } from '../types';
import { SCRIPT_TYPE_OPTIONS, LANGUAGE_OPTIONS } from '../constants';
import { LoadingSpinner } from './icons';

interface ScriptInputFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  scriptType: ScriptType;
  setScriptType: (type: ScriptType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isDirty: boolean;
}

const ScriptInputForm: React.FC<ScriptInputFormProps> = ({
  prompt,
  setPrompt,
  scriptType,
  setScriptType,
  language,
  setLanguage,
  onSubmit,
  isLoading,
  isDirty,
}) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && prompt.trim()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-blue-200 mb-2">
          What is your script about?
        </label>
        <textarea
          id="prompt"
          rows={4}
          className="w-full bg-brand-dark border border-blue-800 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary p-3 text-white placeholder-gray-500 transition-colors"
          placeholder="e.g., A documentary on the history of space exploration"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-blue-200 mb-3">Choose a script type:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SCRIPT_TYPE_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.id}
              onClick={() => !isLoading && setScriptType(option.id)}
              className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                scriptType === option.id
                  ? 'bg-brand-secondary border-blue-400 ring-2 ring-blue-300'
                  : 'bg-brand-dark border-blue-800 hover:bg-slate-800 hover:border-blue-700'
              }`}
              disabled={isLoading}
            >
              <p className="font-semibold">{option.label}</p>
              <p className="text-sm text-blue-200">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-blue-200 mb-2">
          Select language:
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          disabled={isLoading}
          className="w-full bg-brand-dark border border-blue-800 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary p-3 text-white"
        >
          {LANGUAGE_OPTIONS.map((lang) => (
            <option key={lang.id} value={lang.id}>{lang.label}</option>
          ))}
        </select>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Generating...
            </>
          ) : isDirty ? (
            'Update Script'
          ) : (
            'Generate Script'
          )}
        </button>
      </div>
    </form>
  );
};

export default ScriptInputForm;
