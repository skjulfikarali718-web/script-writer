import React, { useState, useCallback, useEffect } from 'react';
import { ScriptType, Language, GroundingChunk, HistoryItem } from './types';
import { generateScriptStream } from './services/geminiService';
import Header from './components/Header';
import ScriptInputForm from './components/ScriptInputForm';
import ScriptOutput from './components/ScriptOutput';
import HistoryPanel from './components/HistoryPanel';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [submittedPrompt, setSubmittedPrompt] = useState<string>('');
  const [scriptType, setScriptType] = useState<ScriptType>(ScriptType.EXPLAINER);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedPrompt = localStorage.getItem('scriptWriterPrompt');
      if (savedPrompt) {
        setPrompt(savedPrompt);
      }
      const savedHistory = localStorage.getItem('scriptWriterHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
  }, []);

  // Save prompt to localStorage whenever it changes
  useEffect(() => {
    try {
        localStorage.setItem('scriptWriterPrompt', prompt);
    } catch (e) {
        console.error("Failed to save prompt to localStorage", e);
    }
  }, [prompt]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('scriptWriterHistory', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  }, [history]);

  const handleGenerateScript = useCallback(async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setSubmittedPrompt(prompt);

    let isFirstChunk = true;
    let fullScript = '';
    let finalSources: GroundingChunk[] = [];

    await generateScriptStream(
      prompt,
      scriptType,
      language,
      (chunk: string) => {
        if (isFirstChunk) {
          setGeneratedScript(chunk); // Overwrite with the first chunk
          setSources([]);
          isFirstChunk = false;
        } else {
          setGeneratedScript((prev) => prev + chunk); // Append subsequent chunks
        }
        fullScript += chunk;
      },
      (fetchedSources: GroundingChunk[]) => {
        setSources(fetchedSources);
        finalSources = fetchedSources;
      },
      (err: string) => {
        setError(err);
      }
    );

    setIsLoading(false);

    if (fullScript.trim() && !error) {
        const newHistoryItem: HistoryItem = {
            id: crypto.randomUUID(),
            prompt,
            scriptType,
            language,
            generatedScript: fullScript,
            sources: finalSources,
            timestamp: Date.now(),
        };
        setHistory(prev => [newHistoryItem, ...prev]);
    }

  }, [prompt, scriptType, language, error]);

  const loadFromHistory = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setSubmittedPrompt(item.prompt);
    setScriptType(item.scriptType);
    setLanguage(item.language);
    setGeneratedScript(item.generatedScript);
    setSources(item.sources);
    setError(null);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const isDirty = prompt !== submittedPrompt && submittedPrompt !== '';

  return (
    <div className="min-h-screen bg-brand-bg px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl shadow-2xl border border-blue-900">
            <ScriptInputForm
              prompt={prompt}
              setPrompt={setPrompt}
              scriptType={scriptType}
              setScriptType={setScriptType}
              language={language}
              setLanguage={setLanguage}
              onSubmit={handleGenerateScript}
              isLoading={isLoading}
              isDirty={isDirty}
            />
            <ScriptOutput
              script={generatedScript}
              sources={sources}
              isLoading={isLoading}
              error={error}
            />
          </div>
          <HistoryPanel 
            history={history}
            onLoad={loadFromHistory}
            onDelete={deleteHistoryItem}
            onClear={clearHistory}
          />
        </main>
        <footer className="text-center mt-8 text-sm text-gray-500">
            <p>Powered by Google Gemini. For informational and creative purposes only.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
