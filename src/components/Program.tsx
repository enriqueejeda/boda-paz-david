import React, { useState } from 'react';
import { Shirt, Info } from 'lucide-react';
import { Day } from '../types';
import IMAGES from '../assets/images';

interface EventDetails {
  time: string;
  title: string;
  tip?: string;
}

interface DayConfig {
  id: Day;
  dateLabel: string;
  fullDate: string;
  theme: string;
  dressCode: string;
  image: string; // Nueva propiedad para la imagen de fondo
  events: EventDetails[];
}

export const Program: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Day>(Day.DAY2);

  const schedule: DayConfig[] = [
    {
      id: Day.DAY2,
      dateLabel: '1 Agosto',
      fullDate: 'Sábado, 1 de Agosto',
      theme: 'La Boda',
      dressCode: 'No hay código de vestimenta, elegancia natural y muchas ganas de disfrutar.',
      image: IMAGES.image2,
      events: [
        {
          time: '13:30',
          title: 'Llegada de invitados'
        },
        {
          time: '14:30',
          title: 'Ceremonia'
        },
        {
          time: '15:00',
          title: 'Coctel'
        },
        {
          time: '17:00',
          title: 'Comida'
        },
        {
          time: '18:00',
          title: 'Baile & Fiesta'
        },
      ]
    },
    {
      id: Day.DAY1,
      dateLabel: '31 Julio',
      fullDate: 'Viernes, 31 de Julio',
      theme: 'Pre-Boda',
      dressCode: 'No hay código de vestimenta',
      // Imagen: Atardecer, bienvenida, naturaleza
      image: IMAGES.image6,
      events: [
        {
          time: 'Cena',
          title: 'Para quienes lleguen con tiempo (y ganas), el viernes por la noche nos juntaremos para cenar de manera informal en algún sitio cercano. Sin protocolo, y con la mejor excusa posible: empezar a vernos y compartir mesa y risas, con calma',
          tip: 'Lugar y hora por confirmar más adelante.'
        }]
    },
    {
      id: Day.DAY3,
      dateLabel: '2 Agosto',
      fullDate: 'Domingo, 2 de Agosto',
      theme: 'Post-Boda',
      dressCode: 'No hay código de vestimenta',
      // Imagen: Piscina, verano, fresco
      image: IMAGES.image5,
      events: [
        {
          time: 'Comida',
          title: 'A la hora de comer, alargaremos la celebración con una paella en la misma finca.'
        }
      ]
    }
  ];

  const currentDay = schedule.find(d => d.id === activeTab) || schedule[1];

  return (
    <div className="py-24 bg-[#F3Efe8]">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-12">
          <div className="bg-[#F3Efe8] p-2 rounded-full shadow-lg border border-wedding-100 flex flex-wrap justify-center gap-2">
            {schedule.map((day) => (
              <button
                key={day.id}
                onClick={() => setActiveTab(day.id)}
                className={`px-6 md:px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-300 ${activeTab === day.id
                  ? 'bg-emerald-900 text-white shadow-md transform scale-105'
                  : 'text-emerald-900 hover:text-emerald-900 hover:bg-emerald-50'
                  }`}
              >
                {day.dateLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-wedding-100 transition-all duration-500 animate-fade-in-up">

          {/* Day Header con Imagen de Fondo */}
          <div className="relative h-96 md:h-112 flex flex-col items-center justify-center text-center p-8 md:p-10 text-white overflow-hidden group">

            {/* Imagen de Fondo Dinámica */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1500 ease-out group-hover:scale-105"
              style={{
                backgroundImage: `url('${currentDay.image}')`,
                willChange: 'transform',
                backgroundAttachment: 'fixed'
              }}
            >
              {/* Overlay oscuro para legibilidad (Gradient) */}
            </div>

            {/* Contenido (Encima de la imagen) */}
            <div className="relative z-10 animate-fade-in">
              <div className="inline-block px-4 py-1 mb-4 border border-white/50 rounded-full backdrop-blur-sm bg-black/40">
                <h3 className="font-bold uppercase tracking-[0.2em] text-xs md:text-sm text-white">
                  📅 {currentDay.fullDate}
                </h3>
              </div>

              <h2 className="text-4xl md:text-6xl font-serif mb-6 drop-shadow-lg">
                {currentDay.theme}
              </h2>

              <div className="w-24 h-1 bg-wedding-400 mx-auto mb-6 rounded-full"></div>

            </div>
          </div>

          <div className="p-6 md:p-12">

            {/* Dress Code Box */}
            <div className="mb-12 bg-wedding-50 rounded-xl p-6 border-l-4 border-wedding-500 flex gap-4 items-start">
              <div className="bg-white p-2 rounded-full shadow-sm text-wedding-600 mt-1">
                <Shirt size={24} />
              </div>
              <div>
                <h3 className="font-bold text-emerald-900 text-sm uppercase tracking-wider mb-1">Dress Code Sugerido</h3>
                <p className="text-emerald-800 text-lg font-serif">
                  {currentDay.dressCode}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-8 md:before:ml-34 before:h-full before:w-px before:bg-emerald-100">
              {currentDay.events.map((event, index) => (
                <div key={index} className="relative flex flex-col md:flex-row gap-6 md:gap-10 group">

                  {/* Time Badge */}
                  <div className="flex md:flex-col items-center md:items-end min-w-30 md:text-right gap-4 md:gap-2 z-10 bg-white md:bg-transparent py-2 md:py-0">
                    <span className="text-2xl md:text-3xl font-bold text-wedding-500 font-mono">
                      {event.time}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="grow pl-14 md:pl-0 -mt-8 md:mt-0">
                    <h3 className="text-2xl font-serif text-emerald-900 font-bold mb-2">
                      {event.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional Note for DAY1 (31 Julio) */}
            {activeTab === Day.DAY1 && (
              <div className="mt-12 pt-8 border-t border-emerald-200">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-wedding-500 shrink-0 mt-1" />
                  <p className="text-emerald-800 italic text-lg">
                    "No es obligatorio, pero sí recomendable."
                  </p>
                </div>
              </div>
            )}

            {/* Optional Note for DAY3 (2 Agosto) */}
            {activeTab === Day.DAY3 && (
              <div className="mt-12 pt-8 border-t border-emerald-200">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-wedding-500 shrink-0 mt-1" />
                  <p className="text-emerald-800 italic text-lg">
                    "Venid con hambre y sin reloj."
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Closing Note */}
        <div className="mt-16 text-center">
          <div className="inline-block p-8 border-t border-b border-wedding-200">
            <p className="font-serif text-2xl text-emerald-900 italic mb-4">
              "Estamos contando los días para compartir esta locura con vosotros."
            </p>
            <p className="font-bold text-wedding-600 uppercase tracking-widest text-sm">
              — Con amor, David & Paz
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};