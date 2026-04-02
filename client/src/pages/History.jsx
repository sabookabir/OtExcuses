import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Trash2 } from 'lucide-react';

export default function History() {
  const { user } = useStore();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setHistory(data);
    } else {
      console.error(error);
    }
    setLoading(false);
  };

  const deleteItem = async (id) => {
    const { error } = await supabase.from('history').delete().eq('id', id);
    if (!error) {
      setHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl flex items-center mb-12">
        <Link to="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Overthinking
        </Link>
      </header>

      <main className="w-full max-w-2xl flex flex-col gap-6">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-2">
          Your Past Trauma <Clock size={28} className="text-toxic-500" />
        </h1>
        <p className="text-zinc-400 mb-6">Everything you saved because you're obsessed with your own delusions.</p>

        {loading ? (
          <div className="text-center text-zinc-500 animate-pulse">Loading...</div>
        ) : history.length === 0 ? (
          <div className="text-center text-zinc-600 p-8 border border-zinc-800 border-dashed rounded-xl">
            You haven't saved anything yet. Go make some excuses.
          </div>
        ) : (
          <AnimatePresence>
            {history.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2 mb-2">
                    <span className="bg-zinc-800 text-xs px-2 py-1 rounded-sm uppercase font-bold text-zinc-400">{item.type}</span>
                    <span className="bg-drama-500/20 border border-drama-500/50 text-xs px-2 py-1 rounded-sm uppercase font-bold text-drama-500">{item.mode}</span>
                  </div>
                  <button onClick={() => deleteItem(item.id)} className="text-zinc-500 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <h3 className="text-sm font-semibold text-zinc-300 mb-2">Situation:</h3>
                <p className="border-l-2 border-toxic-500 pl-3 mb-4 text-zinc-200">{item.situation}</p>

                <h3 className="text-sm font-semibold text-zinc-300 mb-2">Response:</h3>
                <p className="text-zinc-100 whitespace-pre-wrap">{item.output}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
