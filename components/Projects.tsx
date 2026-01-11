import React, { useState, useMemo } from 'react';
import { PROJECTS_DATA } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowUpRight, Filter, X } from 'lucide-react';

const Projects: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Extract unique technologies from all projects
  const uniqueTechnologies = useMemo(() => {
    const techs = new Set<string>();
    PROJECTS_DATA.forEach(project => {
      project.technologies.forEach(tech => techs.add(tech));
    });
    return Array.from(techs).sort();
  }, []);

  // Filter projects based on selected technology
  const filteredProjects = useMemo(() => {
    if (!selectedTech) return PROJECTS_DATA;
    return PROJECTS_DATA.filter(project => 
      project.technologies.includes(selectedTech)
    );
  }, [selectedTech]);

  return (
    <section id="projects" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Key Projects & Initiatives</h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto rounded"></div>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Selected highlights focusing on risk reduction, operational resilience, and strategic transformation.
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-4 text-slate-500 text-sm font-medium">
            <Filter className="w-4 h-4" aria-hidden="true" />
            <span id="filter-label">Filter by Technology:</span>
          </div>
          
          <div 
            className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto" 
            role="group" 
            aria-labelledby="filter-label"
          >
            <button
              onClick={() => setSelectedTech(null)}
              aria-pressed={selectedTech === null}
              aria-label="Show all projects"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                selectedTech === null
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md transform scale-105'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              All
            </button>
            
            {uniqueTechnologies.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech === selectedTech ? null : tech)}
                aria-pressed={selectedTech === tech}
                aria-label={`Filter projects by ${tech}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  selectedTech === tech
                    ? 'bg-primary-600 text-white border-primary-600 shadow-md transform scale-105'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project) => (
              <motion.div 
                layout
                key={project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.2 } 
                }}
                className="bg-gradient-to-br from-white to-primary-50 rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                      <Layers className="w-6 h-6" aria-hidden="true" />
                    </div>
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-slate-400 hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1"
                        aria-label={`Visit ${project.title}`}
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{project.title}</h3>
                  <p className="text-sm font-medium text-primary-600 mb-4">{project.context}</p>
                  
                  <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="p-6 bg-slate-50/50 border-t border-slate-100 mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <button 
                        key={i} 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTech(selectedTech === tech ? null : tech);
                        }}
                        aria-pressed={selectedTech === tech}
                        aria-label={`Filter by ${tech}`}
                        className={`text-xs font-medium px-3 py-1 border rounded-full shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 ${
                          selectedTech === tech 
                            ? 'bg-primary-100 text-primary-700 border-primary-200' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-600 cursor-pointer'
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredProjects.length === 0 && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="text-center py-12 text-slate-500"
             role="status"
           >
             <p>No projects found with the selected technology.</p>
             <button 
               onClick={() => setSelectedTech(null)}
               className="mt-4 text-primary-600 font-medium hover:underline flex items-center justify-center gap-1 mx-auto focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
             >
               <X className="w-4 h-4" aria-hidden="true" /> Clear filter
             </button>
           </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;