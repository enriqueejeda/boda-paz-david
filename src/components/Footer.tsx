import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-200/60 py-12 text-center">
      <div className="container mx-auto px-6">
        <h2 className="font-serif text-3xl text-white mb-4">Paz & David</h2>
        <p className="mb-8 font-sanz italic text-sm">Gracias por formar parte de este día tan importante para nosotros</p>
        <div className="w-12 h-px bg-white mx-auto mb-8"></div>
        <p className="text-xs">
          © {new Date().getFullYear()} Hecho con amor. Nos vemos pronto.
        </p>
      </div>
    </footer>
  );
};