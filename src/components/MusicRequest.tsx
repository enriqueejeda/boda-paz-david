import React from 'react';
import { Music, PlusCircle, Search, ExternalLink, Smartphone } from 'lucide-react';

export const MusicRequest: React.FC = () => {
  // REEMPLAZAR CON TU ENLACE REAL DE SPOTIFY JAM O PLAYLIST COLABORATIVA
  const SPOTIFY_JAM_URL = "https://open.spotify.com/playlist/3mLKC8tYZsMApkSFgDVHxO?si=37672c7c95e544b6&pt=0021dccb7e0ac34e939e77aeefd87d54";

  const steps = [
    {
      id: 1,
      title: "Abre la Lista",
      description: "Haz clic en el botón de abajo para abrir la playlist oficial en tu App de Spotify.",
      icon: Smartphone
    },
    {
      id: 2,
      title: "Añade a tu Biblioteca",
      description: "Pulsa el icono del 'Más' (+) en un circulito para guardar la lista en tu biblioteca.",
      icon: PlusCircle
    },
    {
      id: 3,
      title: "Suma tus Canciones",
      description: "Busca la canción que quieras y añádelos a la lista para que suene en la fiesta.",
      icon: Search
    }
  ];

  return (
    <div className="py-20 text-white bg-white overflow-hidden relative">
      {/* Decorative background elements */}

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-600 rounded-full mb-6 text-white shadow-lg">
            <Music size={32} />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-4 font-bold text-emerald-700">La Banda Sonora</h2>
          <p className="text-lg text-emerald-700 max-w-2xl mx-auto leading-relaxed">
            Queremos que la fiesta sea vuestra tanto como nuestra. Sigue estos 3 sencillos pasos para colaborar:
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step) => (
            <div key={step.id} className="bg-emerald-800 backdrop-blur-md rounded-2xl p-6 border border-white/20
             flex flex-col items-center text-center relative group transition-colors duration-300">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-white text-wedding-500 font-bold rounded-full flex items-center justify-center shadow-lg border-2 text-black border-emerald-500 z-20">
                {step.id}
              </div>
              <div className="mb-4 p-4 bg-white/30 rounded-full text-white group-hover:scale-110 transition-transform duration-300">
                <step.icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white drop-shadow-md">{step.title}</h3>
              <p className="text-white text-sm leading-relaxed drop-shadow-sm">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Action Button with Pulse Effect */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {/* Animación Ping (Onda expansiva)*/}
            <span className="absolute hidden md:inline-flex w-full h-full rounded-full bg-emerald-700 opacity-75 animate-ping" style={{ animationDuration: '1.5s' }}></span>

            <a
              href={SPOTIFY_JAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 group flex items-center gap-3 bg-white text-emerald-900 font-bold py-4 px-8 rounded-full shadow-2xl hover:bg-emerald-50 hover:scale-105 transition-all duration-300"
            >
              <Music size={20} className="text-[#1DB954]" />
              <span>Abrir Playlist en Spotify</span>
              <ExternalLink size={18} className="text-emerald-900/50 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <p className="text-xs text-black mt-4 max-w-sm text-center">
            *Requiere tener la App de Spotify instalada.
          </p>
        </div>

      </div>
    </div>

  );
};
