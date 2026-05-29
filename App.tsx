
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Check, MapPin, ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';
import ThreeBackground from './components/ThreeBackground';
import PointerAvatar from './components/PointerAvatar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LogicSection from './components/LogicSection';
import ExecutionSteps from './components/ExecutionSteps';
import StoreSection from './components/StoreSection';
import EngineSection from './components/EngineSection';
import ProfileModal from './components/ProfileModal';
import JoinModal from './components/JoinModal';
import RequestPage from './components/RequestPage';
import HelpBot from './components/HelpBot';
import { Creator, AppView } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [bag, setBag] = useState<Creator[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  
  // Help Bot States
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    const savedBag = localStorage.getItem('lynqup_bag');
    if (savedBag) setBag(JSON.parse(savedBag));
  }, []);

  const addToBag = useCallback((creator: Creator) => {
    setBag(prev => {
      if (prev.some(c => c.name === creator.name)) return prev;
      const newBag = [...prev, creator];
      localStorage.setItem('lynqup_bag', JSON.stringify(newBag));
      return newBag;
    });
    setSelectedCreator(null);
  }, []);

  const removeFromBag = useCallback((index: number) => {
    setBag(prev => {
      const newBag = prev.filter((_, i) => i !== index);
      localStorage.setItem('lynqup_bag', JSON.stringify(newBag));
      return newBag;
    });
  }, []);

  const clearBag = useCallback(() => {
    setBag([]);
    localStorage.removeItem('lynqup_bag');
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-blue-500/30">
      <ThreeBackground />
      
      <PointerAvatar 
        onToggleChat={() => setIsHelpOpen(!isHelpOpen)} 
        isChatOpen={isHelpOpen}
        isThinking={isThinking}
      />
      
      <Navbar 
        bagCount={bag.length} 
        onViewChange={setView} 
        onJoinClick={() => setIsJoinModalOpen(true)}
      />

      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10"
          >
            <Hero />
            <StoreSection onSelectCreator={setSelectedCreator} />
            <LogicSection />
            <ExecutionSteps />
            <EngineSection />
            
            <footer className="py-20 text-center text-gray-500 text-[10px] tracking-[0.2em] uppercase">
              © 2024 LYNQUP. Execution through Architecture.
            </footer>
          </motion.main>
        ) : (
          <motion.div
            key="request"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative z-20"
          >
            <RequestPage 
              bag={bag} 
              onRemove={removeFromBag} 
              onSuccess={() => {
                clearBag();
                setView('home');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <HelpBot 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        isThinking={isThinking}
        setIsThinking={setIsThinking}
      />

      <AnimatePresence>
        {selectedCreator && (
          <ProfileModal 
            creator={selectedCreator} 
            onClose={() => setSelectedCreator(null)} 
            onAdd={addToBag}
            isAlreadyInBag={bag.some(c => c.name === selectedCreator.name)}
          />
        )}
        
        {isJoinModalOpen && (
          <JoinModal onClose={() => setIsJoinModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
