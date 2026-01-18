import React from 'react';
import { MapPin } from 'lucide-react';



export const FAQ: React.FC = () => {

  return (
    <div className="">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Map Column */}
        <div className="flex flex-col h-full">
          <div className="bg-white rounded-2xl overflow-hidden grow min-h-100 shadow-xl relative border-4 border-white group">

            {/* Google Maps Iframe */}
            <iframe
              width="100%"
              height="100%"
              title="Mapa de La Granja de Lozoya"
              src="https://maps.google.com/maps?q=La%20Granja%20de%20Lozoya%2C%20Madrid&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="absolute w-300 inset-0 border-0 grayscale-20 group-hover:grayscale-0 transition-all duration-500"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Overlay Button */}
            <div className="absolute bottom-4 right-4 z-10">
              <a
                href="https://www.google.com/maps/search/?api=1&query=La+Granja+de+Lozoya+Madrid"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm text-emerald-900 rounded-full shadow-lg font-medium text-xs hover:bg-white hover:scale-105 transition-all"
              >
                <MapPin size={14} className="text-wedding-500" />
                <span>Ver en Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};