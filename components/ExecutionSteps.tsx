
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Lock, ShieldCheck, Zap } from 'lucide-react';

const steps = [
  {
    icon: <FileText className="w-8 h-8" />,
    title: "The Unified Brief",
    desc: "Discard fragmented DMs. One structured request defines the scope for your entire event roster, from DJs to Production leads.",
    color: "bg-blue-500"
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Secure Escrow",
    desc: "Funds are locked in our secure treasury before execution starts. Talent knows they are covered; Brands know their capital is safe.",
    color: "bg-purple-500"
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Hardware Verification",
    desc: "Our engine uses GPS telemetry for on-site staff and cryptographic hashing for digital deliverables to prove execution in real-time.",
    color: "bg-green-500"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Instant Settlement",
    desc: "Once verification thresholds are met, the engine releases funds autonomously. No invoices, no follow-ups, no delays.",
    color: "bg-orange-500"
  }
];

const ExecutionSteps: React.FC = () => {
  return (
    <section className="py-40 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24 text-center md:text-left">
          <h2 className="text-xs font-bold tracking-[0.4em] text-gray-500 uppercase mb-6">The Protocol</h2>
          <h3 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">How Execution Happens.</h3>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            LYNQUP isn't just a marketplace. It's an architecture that ensures every detail of your event is executed as promised.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="relative group p-10 bg-white/5 border border-white/10 rounded-[3rem] hover:bg-white/10 transition-all"
            >
              <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                {step.icon}
              </div>
              <h4 className="text-2xl font-bold mb-4">{step.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.desc}
              </p>
              
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[1px] bg-white/20 z-10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExecutionSteps;
