import React from 'react';
import { PROFILE_SUMMARY, PROFILE_SUBTEXT, SERVICE_AREAS } from '../constants';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Users } from 'lucide-react';

const About: React.FC = () => {
  const icons = [
    <ShieldCheck className="w-6 h-6 text-primary-600" />,
    <TrendingUp className="w-6 h-6 text-primary-600" />,
    <Users className="w-6 h-6 text-primary-600" />
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Positioning Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Positioning</h2>
              <div className="w-20 h-1 bg-primary-600 mx-auto rounded"></div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-8 shadow-sm"
            >
              <p className="text-lg md:text-xl text-slate-800 mb-6 font-medium leading-relaxed">
                {PROFILE_SUMMARY}
              </p>
              <p className="text-slate-600 leading-relaxed border-t border-slate-200 pt-6">
                {PROFILE_SUBTEXT}
              </p>
            </motion.div>
          </div>

          {/* Service Areas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICE_AREAS.map((area, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    {icons[index]}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{area.title}</h3>
                </div>
                
                <ul className="space-y-3 flex-grow">
                  {area.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;