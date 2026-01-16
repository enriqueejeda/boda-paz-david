import React, { useState } from 'react';
import { Sun, Coffee, Music, GlassWater, Church, PartyPopper, MapPin, Sparkles, Shirt, Info } from 'lucide-react';
import { Day } from '../types';

interface EventDetails {
  time: string;
  title: string;
  location: string;
  icon: React.ElementType;
  tip: string;
}

interface DayConfig {
  id: Day;
  dateLabel: string;
  fullDate: string;
  theme: string;
  vibe: string;
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
      theme: 'El Gran Día',
      vibe: 'Emoción a flor de piel, lágrimas de felicidad y baile hasta que salga el sol.',
      dressCode: 'Etiqueta / Formal (Ellos: Traje oscuro. Ellas: Vestido largo o cóctel elegante).',
      // Imagen: Floral, elegante, ceremonia bosque
      image: '',
      events: [
        {
          time: '12:30',
          title: 'Ceremonia Civil',
          location: 'El Bosque de las Hayas',
          icon: Church,
          tip: 'Por favor, sed puntuales. Habrá abanicos para el calor.'
        },
        {
          time: '14:00',
          title: 'El Gran Banquete',
          location: 'Salón de Cristal',
          icon: GlassWater,
          tip: 'Preparaos para un festín gastronómico de 3 horas.'
        },
        {
          time: '18:00',
          title: 'Fiesta & Baile',
          location: 'Pista de Baile Exterior',
          icon: Music,
          tip: '¡Barra libre! Aseguraos de llevar calzado cómodo para el baile.'
        },
      ]
    },
    {
      id: Day.DAY3,
      dateLabel: '2 Agosto',
      fullDate: 'Domingo, 2 de Agosto',
      theme: 'La Despedida',
      vibe: 'Gafas de sol, relax total y comentar las mejores anécdotas de la noche anterior.',
      dressCode: 'Pool Party / Relajado (Estilo ibicenco o veraniego. ¡Traed bañador!).',
      // Imagen: Piscina, verano, fresco
      image: '',
      events: [
        {
          time: '13:00',
          title: 'Brunch de Recuperación',
          location: 'Zona de Piscina',
          icon: Coffee,
          tip: 'Tendremos zona de sombra y bebidas detox.'
        },
        {
          time: '15:00',
          title: 'Paella de Despedida',
          location: 'Terraza de la Sierra',
          icon: Sun,
          tip: 'La mejor forma de coger fuerzas antes del viaje de vuelta.'
        },
        {
          time: '18:00',
          title: 'Cierre del Fin de Semana',
          location: 'Salida Principal',
          icon: PartyPopper,
          tip: 'Besos, abrazos y un "hasta luego".'
        },
      ]
    }
  ];

  const currentDay = schedule.find(d => d.id === activeTab) || schedule[1];

  return (
    <div className="py-24 bg-wedding-50/50">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">

        {/* Header Editorial */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-2 mb-4 text-wedding-500">
            <Sparkles size={20} />
            <span className="font-bold tracking-[0.2em] uppercase text-sm">Guía de Invitados</span>
            <Sparkles size={20} />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-emerald-900 mb-6">Itinerario del Fin de Semana</h2>
          <p className="text-xl text-emerald-800 font-serif italic max-w-2xl mx-auto leading-relaxed">
            "Tres días, una localización mágica y nuestra gente favorita. Aquí tenéis la hoja de ruta para no perderos nada."
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-12">
          <div className="bg-white p-2 rounded-full shadow-lg border border-wedding-100 flex flex-wrap justify-center gap-2">
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
              <div className="absolute inset-0 bg-emerald-900/60 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-linear-to-t from-emerald-900/90 via-transparent to-emerald-900/30"></div>
            </div>

            {/* Contenido (Encima de la imagen) */}
            <div className="relative z-10 animate-fade-in">
              <div className="inline-block px-4 py-1 mb-4 border border-white/40 rounded-full backdrop-blur-sm bg-white/30">
                <h3 className="font-bold uppercase tracking-[0.2em] text-xs md:text-sm text-white">
                  📅 {currentDay.fullDate}
                </h3>
              </div>

              <h2 className="text-4xl md:text-6xl font-serif mb-6 drop-shadow-lg">
                {currentDay.theme}
              </h2>

              <div className="w-24 h-1 bg-wedding-400 mx-auto mb-6 rounded-full"></div>

              <p className="text-lg md:text-2xl font-light italic text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                "{currentDay.vibe}"
              </p>
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
                    <div className="p-3 rounded-full bg-emerald-100 text-emerald-800 border-4 border-white shadow-md md:order-last group-hover:bg-wedding-500 group-hover:text-white transition-colors duration-300">
                      <event.icon size={20} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="grow pl-14 md:pl-0 -mt-8 md:mt-0">
                    <h3 className="text-2xl font-serif text-emerald-900 font-bold mb-2">
                      {event.title}
                    </h3>

                    <div className="flex items-center gap-2 text-emerald-700 font-medium mb-3 uppercase text-xs tracking-wider">
                      <MapPin size={14} />
                      {event.location}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg rounded-tl-none border border-gray-100 inline-block">
                      <p className="text-emerald-800/80 text-sm flex items-start gap-2">
                        <Info size={16} className="text-wedding-500 shrink-0 mt-0.5" />
                        <span className="italic">{event.tip}</span>
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>

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