import React from 'react';
import { EDUCATION_DATA, CERTIFICATIONS } from '../constants';
import { GraduationCap, Award } from 'lucide-react';

const Education: React.FC = () => {
  return (
    <section id="education" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Education Column */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary-100 rounded-lg text-primary-600">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Education</h3>
              </div>

              <div className="space-y-6">
                {EDUCATION_DATA.map((edu, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{edu.degree}</h4>
                    <p className="text-slate-600">{edu.institution}</p>
                    {edu.year && <p className="text-sm text-slate-400 mt-2">{edu.year}</p>}
                    {edu.details && <p className="text-sm text-slate-500 mt-2">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Column */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary-100 rounded-lg text-primary-600">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Certifications</h3>
              </div>

              <div className="space-y-6">
                {CERTIFICATIONS.map((cert, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{cert.name}</h4>
                      {cert.validity && (
                        <span className="inline-block mt-2 text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 rounded-md border border-green-100">
                          {cert.validity}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;