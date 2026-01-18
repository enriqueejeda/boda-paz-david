import React from 'react';
import { MapPin } from 'lucide-react';

export const FAQ: React.FC = () => {
  return (
    <div className="relative w-full pointer-events-auto">
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 shadow-2xl backdrop-blur-md">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-900/25 via-transparent to-white/10 pointer-events-none" />
        <div className="aspect-4/3 md:aspect-video relative">
          <iframe
            title="Mapa de La Granja de Lozoya"
            src="https://maps.google.com/maps?q=La%20Granja%20de%20Lozoya%2C%20Madrid&t=&z=14&ie=UTF8&iwloc=&output=embed"
            className="absolute inset-0 w-full h-full border-0 rounded-3xl grayscale-22 hover:grayscale-0 transition duration-500"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="absolute bottom-4 right-4 z-10">
          <a
            href="https://www.google.com/maps/search/?api=1&query=La+Granja+de+Lozoya+Madrid"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-900 rounded-full shadow-xl font-semibold text-xs hover:scale-105 transition"
          >
            <MapPin size={14} />
            <span>Ver en Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
};