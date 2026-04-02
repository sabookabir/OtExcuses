import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Download, CheckCircle2, Bookmark } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

export default function ResultCard({ content, situation, type, mode }) {
  const [displayedText, setDisplayedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const cardRef = useRef(null);
  const { user } = useStore();

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    
    // Typing effect logic
    const interval = setInterval(() => {
      if (index < content.length) {
        setDisplayedText((prev) => prev + content.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15); // Adjust speed to 15ms per character for standard GenZ reading speed

    return () => clearInterval(interval);
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMeme = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { backgroundColor: '#09090b', style: { padding: '20px' } });
      const link = document.createElement('a');
      link.download = 'overthinker-meme.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to generate image', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase.from('history').insert({
      user_id: user.id,
      situation: situation || 'Unknown situation',
      output: content,
      type: type || 'combo',
      mode: mode || 'toxic'
    });
    if (!error) {
      setSaved(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card flex flex-col overflow-hidden"
    >
      {/* Meme Export Target */}
      <div 
        ref={cardRef} 
        className="p-6 pb-4 bg-zinc-900/80"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-toxic-500 animate-pulse"></div>
          <span className="text-xs font-bold tracking-widest text-zinc-500">AI RESPONSE GENERATED</span>
        </div>
        
        <div className="text-zinc-200 text-lg leading-relaxed whitespace-pre-wrap font-medium">
          {displayedText}
          {displayedText.length < content.length && (
            <span className="inline-block w-2 h-5 ml-1 bg-toxic-500 animate-typing translate-y-1"></span>
          )}
        </div>
      </div>

      <div className="bg-zinc-950 p-4 border-t border-zinc-800 flex justify-between items-center">
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-sm font-semibold transition-colors"
          >
            {copied ? <CheckCircle2 size={16} className="text-toxic-500"/> : <Copy size={16} />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          
          <button 
            onClick={handleSave}
            disabled={saved}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${saved ? 'bg-toxic-500/20 text-toxic-500 cursor-not-allowed' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'}`}
          >
            {saved ? <CheckCircle2 size={16} /> : <Bookmark size={16} />}
            <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        <button 
          onClick={handleDownloadMeme}
          className="flex items-center gap-2 px-4 py-2 bg-drama-500/20 text-drama-500 hover:bg-drama-500 hover:text-white rounded-lg text-sm font-semibold transition-all border border-drama-500/30 hover:shadow-[0_0_15px_rgba(255,0,127,0.4)]"
        >
          <Download size={16} />
          Save Meme
        </button>
      </div>
    </motion.div>
  );
}
