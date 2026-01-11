import React from 'react';
import { EXPERIENCE_DATA } from '../constants';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Professional Experience</h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto rounded"></div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-slate-200"></div>

          <div className="space-y-12">
            {EXPERIENCE_DATA.map((job, index) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="relative pl-12 md:pl-24"
              >
                {/* Timeline Dot */}
                <div className="absolute left-2 md:left-6 -translate-x-1/2 top-1 w-4 h-4 rounded-full border-4 border-white bg-primary-600 shadow-sm z-10"></div>
                
                {/* Content */}
                <div className="bg-white">
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{job.role}</h3>
                    <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full mt-2 md:mt-0 w-fit">
                      {job.period}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 text-slate-600">
                    <Briefcase className="w-4 h-4" />
                    <span className="font-medium text-lg">{job.company}</span>
                  </div>

                  {job.summary && (
                    <p className="text-slate-600 italic mb-4 border-l-4 border-slate-200 pl-4 py-1">
                      {job.summary}
                    </p>
                  )}

                  <ul className="space-y-3">
                    {job.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0"></span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;