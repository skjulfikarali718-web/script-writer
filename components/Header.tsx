
import React from 'react';
import { SparklesIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="py-6 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center gap-3">
        <SparklesIcon className="w-10 h-10" />
        Script Writer AI
      </h1>
      <p className="mt-2 text-lg text-blue-200">Your AI-Powered Creative Partner</p>
    </header>
  );
};

export default Header;
