import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bug, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

export default function Support() {
  const [type, setType] = useState('feedback');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { user } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    
    let tableName = type === 'bug' ? 'bug_reports' : 'feedback';
    
    const { error } = await supabase.from(tableName).insert({
      user_id: user.id,
      text: text
    });

    if (!error) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setText('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-2xl flex items-center mb-12">
        <Link to="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Overthinking
        </Link>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-xl p-8"
      >
        <h1 className="text-3xl font-black mb-6">Complain / Report 🚨</h1>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setType('feedback')}
            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${type === 'feedback' ? 'bg-toxic-500 text-zinc-900 shadow-[0_0_15px_rgba(57,255,20,0.4)]' : 'bg-zinc-800 text-zinc-400'}`}
          >
            <MessageSquare size={18} /> Feedback
          </button>
          <button 
            onClick={() => setType('bug')}
            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${type === 'bug' ? 'bg-drama-500 text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]' : 'bg-zinc-800 text-zinc-400'}`}
          >
            <Bug size={18} /> Bug Report
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 min-h-[150px] resize-none outline-none focus:border-toxic-500 transition-colors"
            placeholder={type === 'feedback' ? "Tell us what sucks..." : "What broke? Don't leave out details..."}
          />
          
          <button 
            type="submit"
            className="w-full bg-zinc-100 text-zinc-900 font-extrabold py-3 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
          >
            {submitted ? 'Sent! Thanks for complaining 🫡' : 'Submit to the Void'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
