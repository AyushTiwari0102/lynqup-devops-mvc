
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Zap, Terminal, Cpu, Radio, Sparkles } from 'lucide-react';
import { sound } from '../services/sound';

interface HelpBotProps {
  isOpen: boolean;
  onClose: () => void;
  isThinking: boolean;
  setIsThinking: (v: boolean) => void;
}

const TypewriterText: React.FC<{ text: string; isStreaming?: boolean }> = ({ text, isStreaming }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const fullTextRef = useRef(text);

  useEffect(() => {
    fullTextRef.current = text;
    if (text.length > displayedText.length) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        const nextCharCount = Math.min(displayedText.length + 2, text.length);
        setDisplayedText(text.slice(0, nextCharCount));
        
        if (displayedText.length % 4 === 0) {
          sound.chatter();
        }
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [text, displayedText]);

  return (
    <div className="relative">
      <span className="whitespace-pre-wrap">{displayedText}</span>
      {isStreaming && isTyping && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-1.5 h-4 ml-1 bg-blue-500 translate-y-0.5"
        />
      )}
    </div>
  );
};

const HelpBot: React.FC<HelpBotProps> = ({ isOpen, onClose, isThinking, setIsThinking }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: "Protocol initialized. I am LynqSwift. How can I assist your Indian event execution today? ⚡" }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Responsive & Resizable dimension state
  const [size, setSize] = useState({ width: 400, height: 580 });
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // Initialize and scale dimensions when viewport changes
  useEffect(() => {
    const handleViewport = () => {
      // Don't resize if user is actively dragging
      if (isResizing.current) return;
      
      const maxW = Math.min(window.innerWidth - 32, 400);
      const maxH = Math.min(window.innerHeight - 150, 580);
      setSize({
        width: Math.max(320, maxW),
        height: Math.max(400, maxH),
      });
    };
    handleViewport();
    window.addEventListener('resize', handleViewport);
    return () => window.removeEventListener('resize', handleViewport);
  }, []);

  const handleResizeStart = (e: React.MouseEvent, direction: 'left' | 'top' | 'top-left') => {
    e.preventDefault();
    isResizing.current = true;
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      w: size.width,
      h: size.height
    };

    const handleMouseMove = (mvEvent: MouseEvent) => {
      if (!isResizing.current) return;
      const deltaX = startPos.current.x - mvEvent.clientX; // drag left to grow width
      const deltaY = startPos.current.y - mvEvent.clientY; // drag up to grow height

      let newWidth = startPos.current.w;
      let newHeight = startPos.current.h;

      if (direction === 'left' || direction === 'top-left') {
        newWidth = Math.max(320, Math.min(window.innerWidth - 16, startPos.current.w + deltaX));
      }
      if (direction === 'top' || direction === 'top-left') {
        newHeight = Math.max(380, Math.min(window.innerHeight - 80, startPos.current.h + deltaY));
      }

      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeTouch = (e: React.TouchEvent, direction: 'left' | 'top' | 'top-left') => {
    isResizing.current = true;
    const touch = e.touches[0];
    startPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      w: size.width,
      h: size.height
    };

    const handleTouchMove = (mvEvent: TouchEvent) => {
      if (!isResizing.current) return;
      const curTouch = mvEvent.touches[0];
      const deltaX = startPos.current.x - curTouch.clientX;
      const deltaY = startPos.current.y - curTouch.clientY;

      let newWidth = startPos.current.w;
      let newHeight = startPos.current.h;

      if (direction === 'left' || direction === 'top-left') {
        newWidth = Math.max(320, Math.min(window.innerWidth - 16, startPos.current.w + deltaX));
      }
      if (direction === 'top' || direction === 'top-left') {
        newHeight = Math.max(380, Math.min(window.innerHeight - 80, startPos.current.h + deltaY));
      }

      setSize({ width: newWidth, height: newHeight });
    };

    const handleTouchEnd = () => {
      isResizing.current = false;
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
  };
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input.trim();
    if (!textToSend || isThinking) return;

    sound.tick();
    setInput('');
    const userMessage = { role: 'user' as const, text: textToSend };
    
    // Track conversation history before pushing the new user input
    const currentHistory = [...messages];
    
    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: currentHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      if (!reader) throw new Error('No stream reader available');

      let fullResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          
          const rawData = trimmed.slice(6);
          if (rawData === '[DONE]') continue;

          try {
            const parsed = JSON.parse(rawData);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.text) {
              fullResponse += parsed.text;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'model', text: fullResponse };
                return updated;
              });
            }
          } catch (e) {
            console.error('SSE parsing error', e);
          }
        }
      }
    } catch (error) {
      sound.error();
      setMessages(prev => [...prev, { role: 'model', text: "Signal degradation detected. Please retry execution query. ⚠️" }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: 20, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{ width: `${size.width}px`, height: `${size.height}px` }}
          className="fixed bottom-24 right-4 md:right-16 bg-white/95 backdrop-blur-3xl rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] z-[200] border border-white/50 flex flex-col overflow-hidden select-none"
        >
          {/* Edge drag handle: Left */}
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'left')}
            onTouchStart={(e) => handleResizeTouch(e, 'left')}
            className="absolute left-0 top-0 bottom-0 w-2.5 cursor-w-resize z-[210] hover:bg-blue-500/10 transition-colors"
          />

          {/* Edge drag handle: Top */}
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'top')}
            onTouchStart={(e) => handleResizeTouch(e, 'top')}
            className="absolute left-0 right-0 top-0 h-2.5 cursor-n-resize z-[210] hover:bg-blue-500/10 transition-colors"
          />

          {/* Corner drag handle: Top-Left */}
          <div 
            onMouseDown={(e) => handleResizeStart(e, 'top-left')}
            onTouchStart={(e) => handleResizeTouch(e, 'top-left')}
            className="absolute left-0 top-0 w-6 h-6 cursor-nw-resize z-[220] flex items-center justify-center group"
            title="Drag to resize"
          >
            <div className="w-2.5 h-2.5 border-l-2 border-t-2 border-gray-300 group-hover:border-blue-500 transition-colors rounded-tl" />
          </div>

          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/60 pl-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg group">
                <Cpu className="w-6 h-6 text-blue-500 group-hover:rotate-90 transition-transform duration-500" />
              </div>
              <div>
                <h4 className="font-bold text-base text-black tracking-tight flex items-center gap-2">
                  LynqSwift v1.2 <Sparkles className="w-4 h-4 text-blue-500" />
                </h4>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isThinking ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`} />
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {isThinking ? 'Processing Signal' : 'Neural Link Active'}
                  </p>
                </div>
              </div>
            </div>
            <button onClick={() => { sound.tick(); onClose(); }} className="p-2 hover:bg-gray-100 rounded-2xl transition-all text-gray-400 hover:text-black">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-6 scrollbar-hide bg-gradient-to-b from-white/0 to-gray-50/50">
            {messages.map((m, i) => (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[90%] p-5 rounded-[1.8rem] text-[14px] leading-relaxed shadow-sm transition-all ${
                  m.role === 'user' 
                  ? 'bg-black text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-xl shadow-gray-200/20'
                }`}>
                  {m.role === 'model' ? (
                    <TypewriterText text={m.text} isStreaming={isThinking && i === messages.length - 1} />
                  ) : (
                    <span className="whitespace-pre-wrap">{m.text}</span>
                  )}
                </div>
              </motion.div>
            ))}
            {isThinking && messages[messages.length-1].text === '' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-blue-50 text-blue-600 p-5 rounded-[1.8rem] rounded-tl-none border border-blue-100 flex items-center gap-3">
                  <Radio className="w-5 h-5 animate-pulse" />
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase">Securing Uplink...</span>
                </div>
              </motion.div>
            )}
          </div>

          <div className="px-6 pb-4 flex flex-wrap gap-2">
            {[ "GPS Workflow", "₹ Escrow Protocol", "Messaging Debt" ].map(t => (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={t}
                onClick={() => handleSend(t)}
                className="text-[10px] font-bold bg-white text-gray-500 border border-gray-100 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm flex items-center gap-2"
              >
                <Zap className="w-3 h-3" /> {t}
              </motion.button>
            ))}
          </div>

          <div className="p-6 bg-white border-t border-gray-100">
            <div className="relative flex items-center gap-3">
              <div className="relative flex-grow">
                <input 
                  type="text"
                  placeholder="Initiate execution query..."
                  className="w-full p-5 bg-gray-50 rounded-[1.5rem] pr-14 text-sm outline-none focus:ring-2 ring-blue-500/50 transition-all text-black border border-gray-100 placeholder:text-gray-400"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isThinking || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black text-white rounded-[1.2rem] disabled:opacity-30 hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HelpBot;
