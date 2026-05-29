
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const LogicSection: React.FC = () => {
  return (
    <section id="logic" className="py-40 bg-white text-black relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24 items-start mb-40">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mb-4">The Problem</h2>
            <h3 className="text-5xl md:text-7xl font-bold mb-10 leading-tight tracking-tighter">Collaborations break in the DMs.</h3>
            <p className="text-xl text-gray-600 leading-relaxed mb-12 max-w-xl">
              Event production is currently buried in fragmented threads. Details are lost, payments are delayed, and accountability is verbal. We call this <span className="text-black font-bold italic">Messaging Debt.</span>
            </p>
            
            <div className="space-y-12">
              <div className="flex gap-8 group">
                <div className="w-16 h-16 rounded-full border border-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">01</div>
                <div>
                  <h4 className="text-2xl font-bold mb-2">Chaos to System</h4>
                  <p className="text-gray-500 leading-relaxed text-lg">Transform verbal agreements into verifiable milestones tracked by our hardware-linked engine.</p>
                </div>
              </div>
              <div className="flex gap-8 group">
                <div className="w-16 h-16 rounded-full border border-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">02</div>
                <div>
                  <h4 className="text-2xl font-bold mb-2">Discovery to Booking</h4>
                  <p className="text-gray-500 leading-relaxed text-lg">Browse a vetted shelf of talent, build your roster, and send one unified brief that syncs with our billing engine.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-black text-white p-12 md:p-20 rounded-[4rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[120px]" />
            <h4 className="text-3xl md:text-4xl font-light mb-10 italic leading-snug relative z-10">
              "Stop managing through hope. <br /> Start managing through architecture."
            </h4>
            <div className="space-y-6 text-gray-400 leading-relaxed text-lg relative z-10">
              <p>
                When you book through LYNQUP, we generate <span className="text-white font-medium">GPS check-ins</span> for on-site talent and <span className="text-white font-medium">content-hashing</span> for creators. 
              </p>
              <p>
                Funds are secured in escrow and released only upon technical verification of delivery.
              </p>
            </div>
          </motion.div>
        </div>

        {/* The Comparison Grid */}
        <div className="pt-20 border-t border-gray-100">
          <h3 className="text-3xl font-bold mb-16 text-center tracking-tight">The LYNQUP Difference.</h3>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-50 p-12 rounded-[3rem]">
              <div className="flex items-center gap-3 text-red-500 font-bold uppercase tracking-widest text-xs mb-8">
                <AlertCircle className="w-4 h-4" /> The Old Way
              </div>
              <ul className="space-y-6">
                <li className="flex gap-4 text-gray-500">
                  <span className="text-red-300">✕</span> "Checking in" via WhatsApp messages
                </li>
                <li className="flex gap-4 text-gray-500">
                  <span className="text-red-300">✕</span> Manual invoicing and 30-day delays
                </li>
                <li className="flex gap-4 text-gray-500">
                  <span className="text-red-300">✕</span> Verbal delivery agreements
                </li>
                <li className="flex gap-4 text-gray-500">
                  <span className="text-red-300">✕</span> Chasing creators for assets
                </li>
              </ul>
            </div>

            <div className="bg-blue-600 p-12 rounded-[3rem] text-white shadow-xl shadow-blue-500/20">
              <div className="flex items-center gap-3 text-blue-100 font-bold uppercase tracking-widest text-xs mb-8">
                <CheckCircle2 className="w-4 h-4" /> The LYNQUP Way
              </div>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <span className="text-blue-300 font-bold">✓</span> Telemetry-backed GPS verification
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-300 font-bold">✓</span> Automated smart-escrow payouts
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-300 font-bold">✓</span> Immutable milestone tracking
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-300 font-bold">✓</span> Hash-verified digital delivery
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogicSection;
