
import React, { useState } from 'react';
import { ShoppingBag, Volume2, VolumeX } from 'lucide-react';
import { AppView } from '../types';
import { sound } from '../services/sound';

interface NavbarProps {
  bagCount: number;
  onViewChange: (view: AppView) => void;
  onJoinClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ bagCount, onViewChange, onJoinClick }) => {
  const [isMuted, setIsMuted] = useState(!sound.isEnabled());

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    sound.setEnabled(!newState);
    if (!newState) sound.tick();
  };

  const handleNavClick = (view: AppView) => {
    sound.tick();
    onViewChange(view);
  };

  return (
    <nav className="fixed top-0 w-full z-[100] glass">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          onClick={() => handleNavClick('home')}
          className="text-2xl font-bold tracking-tighter uppercase cursor-pointer hover:opacity-80 transition flex items-center gap-2"
        >
          LYNQUP
        </div>
        
        <div className="hidden md:flex space-x-12 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
          <a href="#logic" onClick={() => sound.tick()} className="hover:text-white transition-colors">The Logic</a>
          <a href="#store" onClick={() => sound.tick()} className="hover:text-white transition-colors">Shelf</a>
          <a href="#engine" onClick={() => sound.tick()} className="hover:text-white transition-colors">Engine</a>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={toggleMute}
            className="p-2 text-gray-500 hover:text-white transition-colors flex items-center gap-2"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : (
              <div className="flex items-end gap-[2px] h-3">
                {[0.4, 0.8, 0.5, 0.9].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-[2px] bg-blue-500 animate-pulse" 
                    style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s` }} 
                  />
                ))}
              </div>
            )}
          </button>

          <button 
            onClick={() => handleNavClick('request')}
            className="relative p-2 text-gray-400 hover:text-white transition group"
          >
            <ShoppingBag className="w-5 h-5" />
            {bagCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                {bagCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => { sound.tick(); onJoinClick(); }}
            className="hidden sm:block bg-white text-black px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition active:scale-95"
          >
            Join Network
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
