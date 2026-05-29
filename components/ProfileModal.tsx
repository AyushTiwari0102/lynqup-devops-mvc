
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Trophy, MapPin, Zap, ShieldCheck, Activity, Calendar, History } from 'lucide-react';
import { Creator } from '../types';
import { sound } from '../services/sound';

interface ProfileModalProps {
  creator: Creator;
  onClose: () => void;
  onAdd: (c: Creator) => void;
  isAlreadyInBag: boolean;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ creator, onClose, onAdd, isAlreadyInBag }) => {
  const stats = useMemo(() => ({
    deployments: creator.deployments || Math.floor(Math.random() * 85) + 24,
    reliability: creator.reliability || 98.2,
    adherence: creator.adherence || 100,
    skills: creator.skills || ['Technical Lead', 'On-Site Ops', 'Protocol Native'],
    recent: creator.recent_loc || 'Verified Event: Bangalore Tech Park',
    frequency: 'High (4+ per month)'
  }), [creator]);

  const history = [
    { event: "Mumbai Global Summit", status: "Verified", date: "Feb 2024" },
    { event: "Goa Electronic Series", status: "Verified", date: "Dec 2023" },
    { event: "Delhi Tech Expo", status: "Verified", date: "Oct 2023" }
  ];

  const handleAdd = () => {
    sound.success();
    onAdd(creator);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/90 backdrop-blur-3xl p-0 sm:p-6"
      onClick={() => { sound.tick(); onClose(); }}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 280 }}
        className="bg-white w-full max-w-7xl h-[94vh] rounded-t-[4rem] sm:rounded-[4rem] overflow-hidden relative shadow-2xl flex flex-col lg:flex-row"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={() => { sound.tick(); onClose(); }}
          className="absolute top-10 right-10 z-50 p-4 bg-gray-100 rounded-full text-black hover:bg-gray-200 transition-all hover:rotate-90"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Side: Identity */}
        <div className="w-full lg:w-2/5 h-1/3 lg:h-full relative overflow-hidden bg-gray-900">
          <img 
            src={creator.image_url} 
            alt={creator.name}
            className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
            onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${creator.name}/800/1200`; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-10 left-10 right-10">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40">
                  <ShieldCheck className="text-white w-6 h-6" />
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                  <p className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">LYNQUP Verified</p>
                </div>
             </div>
             <h2 className="text-5xl font-bold text-white tracking-tighter mb-2">{creator.name}</h2>
             <p className="text-xl text-gray-300 font-light">{creator.role}</p>
          </div>
        </div>
        
        {/* Right Side: Execution Dashboard */}
        <div className="w-full lg:w-3/5 p-10 lg:p-20 overflow-y-auto bg-white text-black">
          <div className="mb-12 flex flex-wrap gap-3">
             <span className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full">
               Engine Ready: {creator.category}
             </span>
             <span className="bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full flex items-center gap-2">
               <Activity className="w-3 h-3 animate-pulse" /> Active Deployment
             </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100">
              <Trophy className="w-5 h-5 text-orange-500 mb-4" />
              <p className="text-3xl font-bold tracking-tighter">{stats.deployments}</p>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Verified Hires</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100">
              <Zap className="w-5 h-5 text-blue-500 mb-4" />
              <p className="text-3xl font-bold tracking-tighter">{stats.reliability}%</p>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Reliability Score</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100">
              <Calendar className="w-5 h-5 text-purple-500 mb-4" />
              <p className="text-lg font-bold">4.2/mo</p>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Frequency</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100">
              <ShieldCheck className="w-5 h-5 text-green-500 mb-4" />
              <p className="text-lg font-bold">100%</p>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Protocol Pass</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                <History className="w-4 h-4" /> Verified Execution Log
              </h4>
              <div className="space-y-4">
                {history.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                    <div>
                      <p className="font-bold text-sm">{item.event}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase">{item.date}</p>
                    </div>
                    <span className="text-[10px] font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase">Verified</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-10">
               <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Milestone Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {stats.skills.map(skill => (
                      <span key={skill} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-wide">
                        {skill}
                      </span>
                    ))}
                  </div>
               </div>
               <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Latest GPS Verified Site</h4>
                  <div className="p-5 bg-black text-white rounded-[2rem] flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-sm font-medium tracking-tight">{stats.recent}</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="mt-auto pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-10">
             <div className="flex-grow">
               <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Execution Fee Base</p>
               <p className="text-4xl font-bold tracking-tighter">₹{creator.price}</p>
             </div>
             
             <button 
                disabled={isAlreadyInBag}
                onClick={handleAdd}
                className={`w-full sm:w-auto px-16 py-7 rounded-full text-lg font-bold shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 ${
                  isAlreadyInBag ? 'bg-green-500 text-white cursor-default' : 'bg-black text-white hover:bg-blue-600 hover:shadow-blue-500/20'
                }`}
              >
                {isAlreadyInBag ? (
                  <><Check className="w-6 h-6" /> Partner Secured</>
                ) : (
                  'Add to Roster'
                )}
              </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileModal;
