
import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden px-6">
      <div className="relative z-10 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.2, 1, 0.3, 1] }}
        >
          <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold mb-8 leading-[1.05] tracking-tight">
            Execution is the <br /> <span className="text-blue-500">only metric</span> that matters.
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.2, 1, 0.3, 1] }}
          className="text-lg md:text-2xl text-gray-400 font-light mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          LYNQUP replaces the chaos of fragmented chats with a single, structured system for elite event collaborations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <button 
            onClick={() => document.getElementById('store')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-black py-4 px-12 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform"
          >
            Browse Talent
          </button>
          <button 
            onClick={() => document.getElementById('logic')?.scrollIntoView({ behavior: 'smooth' })}
            className="border border-white/20 hover:bg-white/5 backdrop-blur-md rounded-full px-12 py-4 text-sm font-bold uppercase tracking-widest transition"
          >
            How it Works
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
