import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { HistoryIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from './icons';

interface HistoryPanelProps {
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoad, onDelete, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);

  const confirmAndClear = () => {
    if (window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      onClear();
    }
  }

  return (
    <div className="mt-8 bg-slate-900/50 rounded-2xl shadow-2xl border border-blue-900">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left text-blue-200 hover:bg-slate-800/50 rounded-t-2xl"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <HistoryIcon className="w-6 h-6" />
          <h2 className="text-xl font-bold">History</h2>
        </div>
        {isOpen ? <ChevronUpIcon className="w-6 h-6" /> : <ChevronDownIcon className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-blue-900">
          {history.length === 0 ? (
            <p className="text-center text-gray-400 py-4">No history yet. Generate a script to get started!</p>
          ) : (
            <>
              <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {history.map((item) => (
                  <li key={item.id} className="p-3 bg-brand-dark rounded-lg flex justify-between items-center gap-2">
                    <div className="flex-grow overflow-hidden">
                      <p className="font-semibold truncate text-white">{item.prompt}</p>
                      <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <button 
                        onClick={() => onLoad(item)}
                        className="px-3 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        Load
                      </button>
                      <button 
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 rounded-md bg-red-800 hover:bg-red-700 text-white transition-colors"
                        aria-label="Delete item"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-blue-800 text-center">
                <button
                  onClick={confirmAndClear}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-300 bg-red-900/50 hover:bg-red-900 rounded-md transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                  Clear All History
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
