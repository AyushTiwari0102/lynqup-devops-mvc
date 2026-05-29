
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabase';
import { Creator } from '../types';
import ShelfVisualizer from './ShelfVisualizer';
import { sound } from '../services/sound';

interface StoreSectionProps {
  onSelectCreator: (creator: Creator) => void;
}

interface ShelfProps {
  title: string;
  subtitle: string;
  items: Creator[];
  onSelect: (creator: Creator) => void;
  index: number;
  categoryKey: string;
  verificationType: string;
}

const CategoryShelf: React.FC<ShelfProps> = ({ title, subtitle, items, onSelect, index, categoryKey, verificationType }) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-32 last:mb-0 relative">
      <div className="max-w-7xl mx-auto px-6 mb-12 relative">
        <ShelfVisualizer category={categoryKey} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="relative z-10"
        >
          <div className="flex items-baseline gap-4">
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter">{title}</h3>
            <span className="text-blue-500 font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">
              {items.length} Available
            </span>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <p className="text-gray-500 text-lg max-w-xl">{subtitle}</p>
            <div className="h-[1px] flex-grow bg-gray-200 hidden md:block mx-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-4 py-2 rounded-lg">
              {verificationType}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="flex overflow-x-auto gap-8 px-6 md:px-[calc((100vw-1280px)/2)] pb-10 scrollbar-hide snap-x snap-mandatory">
        {items.map((item, i) => (
          <motion.div
            key={item.id || i}
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -15, scale: 1.02 }}
            onMouseEnter={() => sound.tick()}
            onClick={() => { sound.tick(); onSelect(item); }}
            className="flex-shrink-0 w-[300px] sm:w-[360px] h-[500px] sm:h-[540px] bg-white rounded-[3.5rem] p-12 cursor-pointer relative overflow-hidden shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-500 snap-start group"
          >
            <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full inline-block mb-6">
                {item.category}
              </span>
              <h3 className="text-3xl font-bold leading-tight group-hover:text-blue-600 transition-colors">{item.name}</h3>
              <p className="text-gray-400 font-medium text-sm mt-2">{item.role}</p>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
            
            <img 
              src={item.image_url} 
              alt={item.name}
              className="absolute bottom-0 right-0 w-full h-[85%] object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
              style={{ maskImage: 'linear-gradient(to top, black 80%, transparent 100%)' }}
              onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${item.name}/400/600`; }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const StoreSection: React.FC<StoreSectionProps> = ({ onSelectCreator }) => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error } = await supabase.from('creators').select('*');
        if (data) setCreators(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const djs = useMemo(() => creators.filter(c => c.category === 'DJs'), [creators]);
  const speakers = useMemo(() => creators.filter(c => c.category === 'Speakers'), [creators]);
  const creativeTalent = useMemo(() => creators.filter(c => c.category === 'Creators'), [creators]);
  const production = useMemo(() => creators.filter(c => c.category === 'Production'), [creators]);

  return (
    <section id="store" className="py-40 bg-[#f5f5f7] text-black overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-32 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xs font-bold tracking-[0.4em] text-gray-400 uppercase mb-6">The Shelf</h2>
          <h3 className="text-6xl md:text-7xl font-bold mb-8 tracking-tighter">Engine-Ready Talent.</h3>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
            Every professional on this shelf is pre-vetted for the LYNQUP Execution Protocol. 
            Choose your team to build your unified brief.
          </p>
        </motion.div>
      </div>

      {loading ? (
        <div className="w-full text-center py-40 text-gray-400 animate-pulse tracking-[0.3em] uppercase text-xs">
          Scanning Network Verticals...
        </div>
      ) : (
        <div className="space-y-16">
          <CategoryShelf 
            index={0}
            categoryKey="Creators"
            title="Creative Partners" 
            subtitle="Visual artists, content strategists, and creative leads."
            verificationType="Hash-Verified Delivery"
            items={creativeTalent}
            onSelect={onSelectCreator}
          />

          <CategoryShelf 
            index={1}
            categoryKey="Production"
            title="Production Masters" 
            subtitle="Technical directors, on-site leads, and logistics specialists."
            verificationType="GPS-Tracked Milestones"
            items={production}
            onSelect={onSelectCreator}
          />

          <CategoryShelf 
            index={2}
            categoryKey="Speakers"
            title="Keynote Speakers" 
            subtitle="Voices of authority for stages and boardrooms."
            verificationType="On-site Verification"
            items={speakers}
            onSelect={onSelectCreator}
          />

          <CategoryShelf 
            index={3}
            categoryKey="DJs"
            title="Sonic Curators" 
            subtitle="DJs and sound designers defining the event energy."
            verificationType="Live Set Tracking"
            items={djs}
            onSelect={onSelectCreator}
          />

          {creators.length === 0 && (
            <div className="text-center py-40">
              <p className="text-gray-400 italic">No talent currently active on the LYNQUP protocol.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default StoreSection;
