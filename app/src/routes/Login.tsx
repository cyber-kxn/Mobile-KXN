import { useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { Icon } from '@/components/ui/Icon';

export function Login() {
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'login') await login(email || 'operator@nethex.io', password);
    else await register(handle || 'operator', email || 'operator@nethex.io', password);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyber/10 blur-[120px]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet to-cyber shadow-glow">
            <span className="font-mono text-2xl font-extrabold text-white">N</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">NETHEX</h1>
          <p className="text-sm text-slate-400">Enter the cyber range.</p>
        </div>

        <form onSubmit={submit} className="glass space-y-4 p-6">
          <div className="flex rounded-xl border border-white/10 bg-white/[0.02] p-1">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition-colors ${
                  mode === m ? 'bg-violet/20 text-violet-glow' : 'text-slate-400'
                }`}
              >
                {m === 'login' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          {mode === 'register' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Handle</label>
              <input value={handle} onChange={(e) => setHandle(e.target.value)} className="input" placeholder="zer0cool" />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@domain.io" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Authenticating…' : mode === 'login' ? 'Sign in' : 'Create account'}
            <Icon name="chevron" size={16} />
          </button>

          <p className="text-center text-xs text-slate-500">
            No backend running? You'll be signed into a local demo session automatically.
          </p>
        </form>
      </div>
    </div>
  );
}
