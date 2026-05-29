
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { supabase } from '../services/supabase';
import { sound } from '../services/sound';

interface JoinModalProps {
  onClose: () => void;
}

const JoinModal: React.FC<JoinModalProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    category: 'Creators',
    price: '',
    image_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.tick();
    setLoading(true);
    try {
      const { error } = await supabase.from('creators').insert([{
        ...formData,
        is_approved: false
      }]);
      if (error) throw error;
      sound.success();
      alert("Application successfully submitted for review!");
      onClose();
    } catch (err: any) {
      sound.error();
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md px-6"
      onClick={() => { sound.tick(); onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-full max-w-xl rounded-[3rem] p-12 relative text-black shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={() => { sound.tick(); onClose(); }} className="absolute top-8 right-8 text-gray-400 hover:text-black transition">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-4xl font-bold mb-2 tracking-tighter">Join the Network.</h2>
        <p className="text-gray-400 mb-10 text-lg">Elite execution starts with elite talent.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            required 
            className="w-full p-5 bg-gray-100 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition-all"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Role (e.g. Lead DJ)" 
              required 
              className="p-5 bg-gray-100 rounded-2xl outline-none"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            />
            <select 
              className="p-5 bg-gray-100 rounded-2xl outline-none appearance-none"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option>DJs</option>
              <option>Speakers</option>
              <option>Creators</option>
              <option>Production</option>
            </select>
          </div>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
            <input 
              type="text" 
              placeholder="Starting Fee (e.g. 50,000)" 
              required 
              className="w-full p-5 pl-10 bg-gray-100 rounded-2xl outline-none"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>
          <input 
            type="url" 
            placeholder="High-Res Portrait URL" 
            required 
            className="w-full p-5 bg-gray-100 rounded-2xl outline-none"
            value={formData.image_url}
            onChange={e => setFormData({...formData, image_url: e.target.value})}
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-6 bg-black text-white rounded-2xl font-bold text-lg mt-6 shadow-lg hover:bg-gray-900 transition active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Apply to Join'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default JoinModal;
