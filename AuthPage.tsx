import React, { useState, useEffect } from 'react';
import { TagIcon, EyeIcon, EyeOffIcon } from './icons/Icons';
import Button from './Button';

interface AuthPageProps {
  initialView: 'login' | 'register';
  onLogin: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  onRegister: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  onBackToHome: () => void;
}

// A more robust InputField component, defined outside the main component to avoid re-creation on renders.
const InputField: React.FC<{
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  endAdornment?: React.ReactNode;
}> = ({ label, id, endAdornment, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        {...props}
        className={`w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-200 placeholder-slate-400 dark:placeholder-slate-500 ${endAdornment ? 'pr-10' : ''}`}
      />
      {endAdornment && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
          {endAdornment}
        </div>
      )}
    </div>
  </div>
);


const AuthPage: React.FC<AuthPageProps> = ({ initialView, onLogin, onRegister, onBackToHome }) => {
  const [isRegisterView, setIsRegisterView] = useState(initialView === 'register');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setIsRegisterView(initialView === 'register');
    setError('');
    setUsername('');
    setPassword('');
    setShowPassword(false);
  }, [initialView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const action = isRegisterView ? onRegister : onLogin;
    const result = await action(username, password);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };
  
  const toggleView = () => {
    setIsRegisterView(!isRegisterView);
    setError('');
    setUsername('');
    setPassword('');
    setShowPassword(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 relative">
        <div className="absolute top-4 left-4">
             <Button onClick={onBackToHome} variant="secondary">
                &larr; Back to Home
            </Button>
        </div>
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div>
          <div className="flex justify-center">
            <TagIcon className="h-12 w-12 text-indigo-500" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
            {isRegisterView ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <InputField 
                id="username" 
                label="Username" 
                type="text" 
                placeholder="Enter your username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                autoComplete="username" />
            <InputField 
                id="password" 
                label="Password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                autoComplete={isRegisterView ? "new-password" : "current-password"} 
                endAdornment={
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100 focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                }
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <div>
            <Button type="submit" variant="primary" className="w-full" disabled={loading || !username || !password}>
              {loading ? 'Processing...' : (isRegisterView ? 'Register' : 'Sign In')}
            </Button>
          </div>
        </form>
        <div className="text-sm text-center">
          <button
            onClick={toggleView}
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {isRegisterView ? 'Already have an account? Sign in' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;