import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { ShieldCheck, Award, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('hrmanager');
  const [password, setPassword] = useState('dummyhash');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.login(username, password);
      // Brief delay for visual loading satisfaction
      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard');
      }, 800);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-brand-bg text-brand-text px-4 transition-all duration-300">
      {/* Visual background details */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-1/4 -top-1/4 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute -right-1/4 -bottom-1/4 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-brand-bg border border-brand-border rounded-2xl shadow-xl overflow-hidden p-8 z-10">
        <div className="flex flex-col items-center justify-center text-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-accent flex items-center justify-center text-white shadow-lg shadow-brand-accent/20">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-heading tracking-tight leading-none">EMS Portal</h1>
            <p className="text-xs text-brand-text mt-1.5 font-medium">Enterprise HR Management System</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-500">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs font-medium leading-relaxed">{error}</div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-sm px-4 py-3 rounded-xl bg-brand-code border border-brand-border text-brand-heading focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-200"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm pl-4 pr-11 py-3 rounded-xl bg-brand-code border border-brand-border text-brand-heading focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-200"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-text hover:text-brand-heading transition-colors duration-150 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-brand-text/80 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded bg-brand-code border-brand-border text-brand-accent focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <span className="text-brand-accent hover:underline cursor-pointer font-medium">Forgot password?</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl text-sm font-semibold bg-brand-accent text-white shadow-lg shadow-brand-accent/25 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              isLoading ? 'opacity-80 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In to System</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] text-brand-text/50">
          Enforced by TLS 1.3 & AES 256. For internal authorized credentials only.
        </div>
      </div>
    </div>
  );
};

export default Login;
