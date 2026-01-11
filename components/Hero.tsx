import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileText, Mail, TrendingUp } from 'lucide-react';
import { COMMERCIAL_OUTCOMES } from '../constants';

const Hero: React.FC = () => {
  return (
    <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-24 md:pt-16 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-center lg:text-left"
          >
            <h2 className="text-primary-400 font-semibold tracking-wider uppercase mb-4 text-sm md:text-base">
              Operator Profile
            </h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
              Omer Mustafa
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-6 font-medium">
              Third-party risk, vendor governance, and digital operations leader.
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Senior operator with 20+ years across banking, financial services, technology, and retail. 
              I tighten controls, stabilize vendor ecosystems, and protect revenue through measurable commercial outcomes.
            </p>

            <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
              {["Third-party risk", "Vendor governance", "Operational resilience", "Contract & SLA design"].map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-full text-xs md:text-sm text-slate-300">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <button 
                onClick={() => window.alert('CV PDF download')}
                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Download CV (PDF)
              </button>
              <a 
                href="#contact" 
                className="px-8 py-3 bg-transparent border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Contact
              </a>
            </div>
          </motion.div>

          {/* Right Column: Outcomes Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Commercial Outcomes</h3>
              </div>
              
              <ul className="space-y-4">
                {COMMERCIAL_OUTCOMES.map((outcome, index) => (
                  <li key={index} className="flex items-start justify-between gap-4">
                    <span className="text-slate-300 text-sm md:text-base">{outcome.label}</span>
                    <span className="text-white font-bold text-lg md:text-xl whitespace-nowrap">{outcome.value}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-500 text-center">
                FX conversion to GBP approx 0.8
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden md:block"
        >
          <a href="#about" className="text-slate-500 hover:text-white transition-colors animate-bounce">
            <ArrowDown className="w-6 h-6" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;