import { useState } from 'react';
import { api, setAuthToken } from '../lib/api';

interface LoginProps {
  onSuccess: () => void;
}

export function Login({ onSuccess }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const response = await api.auth.login({ email, password });
        setAuthToken(response.token);
        onSuccess();
      } else {
        const response = await api.auth.signup({ email, password, name });
        setAuthToken(response.token);
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-notion-bg dark:bg-[#191919] px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">SINT Dashboard</h2>
          <p className="mt-2 text-sm text-notion-text-secondary">
            Track your AI agent tasks and costs
          </p>
        </div>

        <div className="bg-white dark:bg-[#2c2c2c] rounded-lg shadow-lg p-8">
          {/* Mode toggle */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-md transition-colors ${
                mode === 'login'
                  ? 'bg-notion-accent text-white'
                  : 'bg-notion-surface text-notion-text'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-md transition-colors ${
                mode === 'signup'
                  ? 'bg-notion-accent text-white'
                  : 'bg-notion-surface text-notion-text'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-notion-border rounded-md dark:bg-[#1f1f1f] dark:border-[#3f3f3f]"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-notion-border rounded-md dark:bg-[#1f1f1f] dark:border-[#3f3f3f]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-notion-border rounded-md dark:bg-[#1f1f1f] dark:border-[#3f3f3f]"
                required
                minLength={6}
              />
              {mode === 'signup' && (
                <p className="text-xs text-notion-text-secondary mt-1">
                  At least 6 characters
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign Up'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-notion-text-secondary">
          SQLite database • Zero setup • Data stored locally
        </p>
      </div>
    </div>
  );
}
