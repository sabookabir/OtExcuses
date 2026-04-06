import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { LogOut, Save, Share2, Sparkles, Skull, LifeBuoy, History as HistoryIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResultCard from '../components/ResultCard';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/ai';

export default function Home() {
  const { user, signOut, themeMode, setThemeMode } = useStore();
  const [situation, setSituation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [actionType, setActionType] = useState('combo');

  const handleGenerate = async () => {
    if (!situation.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const endpoint = `${API_BASE}/${actionType}`;
      const payload = { situation, mode: themeMode };

      const res = await axios.post(endpoint, payload);
      setResult(res.data.output);
    } catch (error) {
      console.error(error);
      setResult("Error: AI got distracted looking at memes. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center mb-12">
        <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
          OVERTHINKER <span className="text-toxic-500 neon-text-toxic">PRO MAX</span> <Skull size={24}/>
        </h1>
        <div className="flex gap-4">
          <Link to="/history" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <HistoryIcon size={18} /> <span className="hidden md:inline">History</span>
          </Link>
          <Link to="/support" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <LifeBuoy size={18} /> <span className="hidden md:inline">Complain</span>
          </Link>
          <button 
            onClick={signOut}
            className="flex items-center gap-2 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} /> <span className="hidden md:inline">Bail Out</span>
          </button>
        </div>
      </header>

      <main className="w-full max-w-2xl flex flex-col gap-6">
        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <label className="block text-lg font-bold mb-3 text-zinc-200">
            What's ruining your vibe right now? 🙄
          </label>
          <textarea
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 min-h-[120px] resize-none outline-none focus:border-toxic-500 transition-colors placeholder:text-zinc-600 mb-4"
            placeholder="e.g. My boss said 'we need to talk tomorrow'..."
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
          />

          <div className="flex flex-wrap gap-2 mb-6">
            {['combo', 'overthink', 'excuse'].map((type) => (
              <button
                key={type}
                onClick={() => setActionType(type)}
                className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                  actionType === type 
                    ? 'bg-toxic-500 text-toxic-900 shadow-[0_0_10px_rgba(57,255,20,0.5)]' 
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center bg-zinc-950 p-2 rounded-xl">
            <span className="text-xs font-semibold text-zinc-500 pl-2 uppercase tracking-wider">AI Persona:</span>
            <div className="flex gap-1">
              {['toxic', 'dramatic', 'delusional', 'motivational'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setThemeMode(mode)}
                  className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-colors ${
                    themeMode === mode ? 'bg-drama-500 text-white shadow-[0_0_8px_rgba(255,0,127,0.5)]' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !situation.trim()}
            className="w-full mt-6 bg-zinc-100 text-zinc-900 font-extrabold text-xl py-4 rounded-xl hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            {loading ? (
              <span className="animate-pulse">Consulting the void...</span>
            ) : (
              <>GENERATE <Sparkles size={20}/></>
            )}
          </button>
        </motion.div>

        <AnimatePresence>
          {result && !loading && (
            <ResultCard key="result" content={result} situation={situation} type={actionType} mode={themeMode} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
