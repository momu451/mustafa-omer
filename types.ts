export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  summary?: string;
  achievements: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  year?: string;
  details?: string;
}

export interface Certification {
  name: string;
  validity?: string;
}

export interface SkillMetric {
  subject: string;
  A: number;
  fullMark: number;
}

export interface ProjectItem {
  title: string;
  description: string;
  technologies: string[];
  context?: string; // Made optional as new data format might imply context in description
  link?: string;
  linkText?: string;
}

export interface OutcomeItem {
  value: string;
  label: string;
}

export interface ServiceArea {
  title: string;
  items: string[];
}