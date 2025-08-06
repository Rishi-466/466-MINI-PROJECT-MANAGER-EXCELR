import React from 'react';
import Button from './Button';
import { TagIcon } from './icons/Icons';

interface HomePageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToLogin, onNavigateToRegister }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 text-center">
      <div className="max-w-2xl w-full">
        <div className="flex justify-center mb-6">
          <TagIcon className="h-24 w-24 text-indigo-500" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome to the <span className="text-indigo-500">Product Manager</span>
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-lg text-slate-600 dark:text-slate-300">
          A sleek and powerful tool to effortlessly manage your e-commerce products. Add, edit, view, and delete your inventory with a simple, intuitive interface.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button onClick={onNavigateToRegister} variant="primary" className="w-full sm:w-auto text-lg px-8 py-3">
            Get Started
          </Button>
          <Button onClick={onNavigateToLogin} variant="secondary" className="w-full sm:w-auto text-lg px-8 py-3">
            Sign In
          </Button>
        </div>
      </div>
       <footer className="absolute bottom-4 text-slate-500 dark:text-slate-400 text-sm">
          <p>Built for performance and a great user experience.</p>
      </footer>
    </div>
  );
};

export default HomePage;
