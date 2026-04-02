import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  
  const { signIn, signUp } = useStore();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    let result;
    
    if (isLogin) {
      result = await signIn(email, password);
    } else {
      result = await signUp(email, password);
    }

    if (result?.error) {
      setError(result.error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 flex flex-col gap-6"
      >
        <div className="text-center">
          <h1 className="text-4xl font-black mb-2 tracking-tighter">
            OVERTHINKER <span className="text-toxic-500 neon-text-toxic">PRO MAX</span> 💀
          </h1>
          <p className="text-zinc-400">Join the chaos. Tell us your problems.</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-zinc-300">Email</label>
            <input 
              type="email"
              required
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 outline-none focus:border-toxic-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@delusional.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-zinc-300">Password</label>
            <input 
              type="password"
              required
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 outline-none focus:border-toxic-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-toxic-500 text-toxic-900 font-bold p-3 rounded-lg mt-2 hover:bg-toxic-400 transition-colors shadow-[0_0_15px_rgba(57,255,20,0.5)]"
          >
            {isLogin ? 'Enter The Void' : 'Join The Cult'}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-zinc-400 text-sm hover:text-white transition-colors"
        >
          {isLogin ? "Don't have an account? Sign up 🤡" : "Already suffering? Log in 💀"}
        </button>
      </motion.div>
    </div>
  );
}
