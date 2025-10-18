
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GroundingChunk } from '../types';
import { CopyIcon, CheckIcon } from './icons';

interface ScriptOutputProps {
  script: string;
  sources: GroundingChunk[];
  isLoading: boolean;
  error: string | null;
}

const ScriptOutput: React.FC<ScriptOutputProps> = ({ script, sources, isLoading, error }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
  };

  const hasContent = script.trim().length > 0;

  return (
    <div className="mt-8">
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {(hasContent || isLoading) && (
        <div className="bg-brand-dark border border-blue-800 rounded-lg shadow-lg mt-4 relative">
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-200">Generated Script</h3>
              {hasContent && !isLoading && (
                <button
                  onClick={handleCopy}
                  className="flex items-center px-3 py-1.5 text-sm rounded-md bg-slate-700 hover:bg-slate-600 text-blue-200 transition-colors"
                >
                  {copied ? (
                     <>
                        <CheckIcon className="w-4 h-4 mr-2" /> Copied!
                     </>
                  ) : (
                     <>
                        <CopyIcon className="w-4 h-4 mr-2" /> Copy
                     </>
                  )}
                </button>
              )}
            </div>
            <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-blue-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{script}</ReactMarkdown>
                {isLoading && !hasContent && <div className="text-center p-8 text-gray-400">Generating your script...</div>}
                {isLoading && hasContent && <div className="animate-pulse h-4 bg-slate-700 rounded w-1/4 mt-4"></div>}
            </div>
          </div>
          
          {sources.length > 0 && !isLoading && (
            <div className="border-t border-blue-800 px-4 py-3 sm:px-6">
                <h4 className="text-sm font-semibold text-blue-200 mb-2">Sources:</h4>
                <ul className="list-disc list-inside space-y-1">
                    {sources.map((source, index) => (
                        source.web && <li key={index}>
                            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline text-sm">
                                {source.web.title || source.web.uri}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScriptOutput;
