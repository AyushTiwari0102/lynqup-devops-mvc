
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ShieldCheck, RefreshCw } from 'lucide-react';

const EngineSection: React.FC = () => {
  const features = [
    {
      icon: <MapPin className="w-10 h-10 text-blue-500" />,
      title: "GPS Verification",
      desc: "On-site talent payments are triggered by geo-located arrival and departure logs."
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-green-500" />,
      title: "Escrow Protection",
      desc: "Funds are secured upfront, ensuring creators are paid and brands are protected."
    },
    {
      icon: <RefreshCw className="w-10 h-10 text-orange-500" />,
      title: "Automated Workflow",
      desc: "Status updates are pushed to all stakeholders the moment a milestone is executed."
    }
  ];

  return (
    <section id="engine" className="py-40 bg-black text-white relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-5xl md:text-6xl font-bold tracking-tighter"
          >
            The Milestone Engine.
          </motion.h3>
          <p className="text-gray-500 text-xl mt-6">Guaranteed delivery through technical verification.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white/5 border border-white/10 p-12 rounded-[3rem] backdrop-blur-xl hover:border-white/30 transition-all group"
            >
              <div className="mb-8 transform group-hover:scale-110 transition-transform">{f.icon}</div>
              <h5 className="text-2xl font-bold mb-4">{f.title}</h5>
              <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EngineSection;
