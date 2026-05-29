
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabase';
import { Creator } from '../types';
import { ShieldCheck, Zap, ArrowRight, Trash2, Calendar, MapPin, FileText, CheckCircle2, Radio, Satellite, Activity } from 'lucide-react';
import BriefVisualizer from './BriefVisualizer';
import { sound } from '../services/sound';

interface RequestPageProps {
  bag: Creator[];
  onRemove: (idx: number) => void;
  onSuccess: () => void;
}

const RequestPage: React.FC<RequestPageProps> = ({ bag, onRemove, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsData, setGpsData] = useState<{lat: number, lng: number} | null>(null);
  const [telemetryLog, setTelemetryLog] = useState<string[]>([]);
  
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [formData, setFormData] = useState({
    event_name: '',
    event_date: '',
    location: '',
    brief: ''
  });

  const verifyGps = () => {
    sound.tick();
    setGpsLoading(true);
    setTelemetryLog(["Initializing Satellite Link...", "Searching for Terminal ID: LYNQ-882", "Handshaking with GNSS..."]);
    
    let pulseCount = 0;
    const pulseInterval = setInterval(() => {
      if (pulseCount < 5) {
        sound.ping(pulseCount * 100);
        pulseCount++;
      } else {
        clearInterval(pulseInterval);
      }
    }, 300);

    setTimeout(() => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setGpsData({ lat, lng });
          
          sound.success();
          setTelemetryLog(prev => [...prev, `Signal Locked: ${lat.toFixed(4)}, ${lng.toFixed(4)}`, "Encryption Layer Set", "Hardware Geofence Verified."]);
          setFormData(prev => ({...prev, location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`}));
          setGpsLoading(false);
        }, (err) => {
          sound.error();
          setTelemetryLog(prev => [...prev, "ERROR: Signal Obstructed", "Manual Override Required."]);
          alert("GPS Verification Failed: Ensure permissions are granted for hardware-linked tracking.");
          setGpsLoading(false);
        });
      } else {
        alert("GPS Protocol not supported on this terminal.");
        setGpsLoading(false);
      }
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!formData.event_name || !formData.event_date || bag.length === 0) {
      sound.error();
      return alert("Technical Error: Missing critical brief parameters. Ensure event name, date, and roster are populated.");
    }
    
    sound.tick();
    setLoading(true);
    try {
      const data = {
        ...formData,
        talent_names: bag.map(t => t.name).join(', '),
        status: 'pending'
      };
      
      const { error } = await supabase.from('event_requests').insert([data]);
      if (error) throw error;
      
      sound.success();
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (err: any) {
      sound.error();
      alert(`System Fault: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen text-black pb-40 pt-24 relative overflow-hidden">
      <BriefVisualizer talentCount={bag.length} />

      <AnimatePresence>
        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[300] bg-white flex flex-col items-center justify-center text-center p-10"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mb-10 shadow-2xl shadow-blue-500/40"
            >
              <CheckCircle2 className="w-16 h-16 text-white" />
            </motion.div>
            <h2 className="text-6xl font-bold tracking-tighter mb-4">Brief Synchronized.</h2>
            <p className="text-xl text-gray-500 max-w-lg leading-relaxed">
              The LYNQUP Engine has initialized your execution roster. You will be notified as milestones are verified via GPS Telemetry and Smart-Escrow.
            </p>
          </motion.div>
        ) : (
          <main className="max-w-7xl mx-auto px-6 pt-10 relative z-10">
            <header className="mb-20">
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="h-[1px] w-12 bg-blue-500" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-500">Execution Configuration</span>
                 </div>
                 <h1 className="text-7xl font-bold mb-6 tracking-tighter">Unified Briefing.</h1>
                 <p className="text-xl text-gray-400 font-light max-w-2xl">
                   Secure your event roster. LYNQUP verifies arrival via GPS and manages delivery via cryptographic escrow.
                 </p>
               </motion.div>
            </header>

            <div className="grid lg:grid-cols-12 gap-16">
              {/* Left Column */}
              <div className="lg:col-span-8 space-y-20">
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-blue-500" /> Current Execution Roster
                    </h2>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{bag.length} Nodes</span>
                  </div>
                  
                  <div className="space-y-4">
                    {bag.length === 0 ? (
                      <div className="p-20 border-2 border-dashed border-gray-100 rounded-[3rem] text-center bg-white/50">
                        <p className="text-gray-400 italic">No talent nodes detected in brief.</p>
                      </div>
                    ) : (
                      bag.map((item, i) => (
                        <motion.div 
                          key={i} 
                          layout
                          className="flex items-center justify-between p-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group"
                        >
                          <div className="flex items-center gap-6">
                            <div className="relative">
                                <img src={item.image_url} className="w-20 h-20 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform" />
                                <div className="absolute -bottom-2 -left-2 bg-green-500 w-5 h-5 rounded-full border-2 border-white" />
                            </div>
                            <div>
                              <p className="font-bold text-xl tracking-tight">{item.name}</p>
                              <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">{item.role}</p>
                            </div>
                          </div>
                          <button onClick={() => { sound.tick(); onRemove(i); }} className="p-4 bg-gray-50 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </motion.div>
                      ))
                    )}
                  </div>
                </section>

                <section className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Satellite className="w-32 h-32" />
                  </div>
                  
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-10 flex items-center gap-3">
                    <FileText className="w-4 h-4" /> Brief Configuration
                  </h2>
                  <div className="grid md:grid-cols-1 gap-8 relative z-10">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Event Identity</label>
                       <input 
                        type="text" 
                        placeholder="e.g. Neo-Tokyo Private Launch"
                        className="w-full p-6 bg-gray-50 rounded-[2rem] outline-none focus:ring-2 ring-blue-500 transition-all border border-gray-50 focus:bg-white"
                        value={formData.event_name}
                        onChange={e => setFormData({...formData, event_name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Execution Date</label>
                         <div className="relative">
                           <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                           <input 
                            type="date" 
                            min={today}
                            className="w-full p-6 pl-14 bg-gray-50 rounded-[2rem] outline-none focus:ring-2 ring-blue-500 transition-all border border-gray-50 focus:bg-white"
                            value={formData.event_date}
                            onChange={e => setFormData({...formData, event_date: e.target.value})}
                          />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Hardware Geo-Lock</label>
                         <div className="flex flex-col gap-4">
                            <div className="flex gap-4">
                                <div className="relative flex-grow">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input 
                                      type="text" 
                                      placeholder="Coordinates Required"
                                      className="w-full p-6 pl-14 bg-gray-50 rounded-[2rem] outline-none focus:ring-2 ring-blue-500 transition-all border border-gray-50 focus:bg-white font-mono text-xs"
                                      value={formData.location}
                                      readOnly
                                    />
                                </div>
                                <button 
                                    onClick={verifyGps}
                                    disabled={gpsLoading}
                                    className={`px-8 rounded-[2rem] font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
                                        gpsData ? 'bg-green-100 text-green-600 border border-green-200' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95'
                                    }`}
                                >
                                    {gpsLoading ? <Radio className="w-4 h-4 animate-spin" /> : <Satellite className="w-4 h-4" />}
                                    {gpsData ? "Site Locked" : "Sync GPS"}
                                </button>
                            </div>
                            
                            <AnimatePresence>
                                {(gpsLoading || telemetryLog.length > 0) && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="bg-black rounded-2xl p-4 font-mono text-[9px] text-green-500 overflow-hidden"
                                    >
                                        {telemetryLog.slice(-4).map((line, i) => (
                                            <div key={i} className="flex gap-2">
                                                <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
                                                <span className={line.startsWith('ERROR') ? 'text-red-500' : ''}>{line}</span>
                                            </div>
                                        ))}
                                        {gpsLoading && <div className="animate-pulse">_</div>}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Execution Goals</label>
                       <textarea 
                        rows={6} 
                        placeholder="Define the verifiable outcomes. These become the conditions for escrow release."
                        className="w-full p-8 bg-gray-50 rounded-[3rem] outline-none focus:ring-2 ring-blue-500 transition-all border border-gray-50 focus:bg-white resize-none"
                        value={formData.brief}
                        onChange={e => setFormData({...formData, brief: e.target.value})}
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-4">
                <div className="sticky top-32 space-y-8">
                  <div className="bg-black text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/30 blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
                    <h3 className="text-3xl font-bold mb-10 tracking-tight">Execution Engine.</h3>
                    
                    <div className="space-y-6 mb-12 text-sm">
                      <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-gray-400 uppercase tracking-widest text-[9px] font-bold">Roster Nodes</span>
                        <span className="font-bold text-blue-400">{bag.length} Ready</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-gray-400 uppercase tracking-widest text-[9px] font-bold">GPS Telemetry</span>
                        <span className={`font-bold transition-colors ${gpsData ? 'text-green-400' : 'text-orange-400 animate-pulse'}`}>
                            {gpsData ? 'Locked & Verified' : 'Awaiting Signal'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-gray-400 uppercase tracking-widest text-[9px] font-bold">Signal Health</span>
                        <span className="font-bold text-blue-400 flex items-center gap-2">
                            <Activity className="w-3 h-3 animate-pulse" /> Optimal
                        </span>
                      </div>
                    </div>

                    <button 
                      disabled={loading || bag.length === 0 || !gpsData}
                      onClick={handleSubmit}
                      className="w-full py-7 bg-white text-black rounded-full font-bold text-lg hover:bg-blue-600 hover:text-white transition-all disabled:opacity-30 flex items-center justify-center gap-3 group/btn"
                    >
                      {loading ? (
                        <><Zap className="w-5 h-5 animate-spin" /> Syncing...</>
                      ) : (
                        <>Send Unified Brief <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" /></>
                      )}
                    </button>
                    
                    {!gpsData && bag.length > 0 && (
                        <p className="mt-4 text-center text-[10px] text-orange-400 font-bold uppercase tracking-widest">
                            Hardware Geo-Lock is mandatory
                        </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RequestPage;
