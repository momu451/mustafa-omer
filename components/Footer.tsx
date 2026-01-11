import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-500 py-8 border-t border-slate-900">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-2">&copy; {new Date().getFullYear()} Omer Mustafa. All rights reserved.</p>
        <p className="text-sm">Built with React & Tailwind CSS.</p>
      </div>
    </footer>
  );
};

export default Footer;