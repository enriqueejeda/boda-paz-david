import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ChevronDown, MoveDown } from 'lucide-react';
import { IMAGES } from '../assets/images';

const SCENES = [
  {
    id: 1,
    img: IMAGES.hero,
    content: (
      <>
        <motion.p className="text-gray-200 font-sans tracking-[0.4em] text-[10px] md:text-sm uppercase mb-4 md:mb-6 font-bold">
          Capítulo I
        </motion.p>
        <h1 className="text-5xl md:text-9xl font-serif text-white leading-none tracking-tight mb-6 md:mb-8 drop-shadow-2xl">
          Paz <span className="text-wedding-200 italic">&</span> David
        </h1>
        <p className="font-serif italic text-lg md:text-xl text-gray-200 max-w-lg mx-auto leading-relaxed border-t border-black/20 pt-6 mt-6">
          "El amor no se trata de mirar el uno al otro, sino de mirar juntos en la misma dirección."
        </p>
      </>
    )
  },
  {
    id: 2,
    img: IMAGES.image1,
    content: (
      <>
        <h2 className="text-4xl md:text-8xl text-white font-serif text-wedding-50 italic mb-6 md:mb-8 drop-shadow-xl">
          La Granja de Lozoya
        </h2>
        <div className="w-16 md:w-24 h-px bg-wedding-200/40 mx-auto my-6 md:my-8"></div>
        <p className="font-sans font-medium text-lg md:text-2xl text-wedding-50 tracking-wide text-white/90 max-w-2xl mx-auto leading-relaxed">
          Aire puro. Atardeceres de bosque. <br className="hidden md:block" /> Un refugio para celebrar.
        </p>
      </>
    )
  },
  {
    id: 3,
    img: IMAGES.image4,
    content: (
      <div className="border border-gray-200/20 p-6 md:p-12 backdrop-blur-md bg-black/40 inline-block rounded-lg shadow-2xl">
        <h2 className="text-5xl md:text-8xl font-display text-white font-bold mb-4 uppercase tracking-tighter">
          FIESTA
        </h2>
        <p className="font-serif text-xl md:text-3xl text-gray-200 italic font-medium">
          31 de Julio — 02 de Agosto
        </p>
      </div>
    )
  },
  {
    id: 4,
    img: IMAGES.image3,
    content: (
      <div className="transform translate-y-6 md:translate-y-12 px-4">
        <p className="text-lg md:text-2xl font-sans tracking-[0.2em] text-white uppercase mb-4 font-bold">
          Bienvenidos a nuestra
        </p>
        <h1 className="text-5xl md:text-8xl font-serif text-white tracking-tighter mb-8 md:mb-12 drop-shadow-2xl">
          Gran Aventura
        </h1>
        <div className="animate-bounce mt-8 md:mt-12">
          <ChevronDown className="w-8 h-8 md:w-10 md:h-10 text-gray-200 mx-auto" />
          <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-200 mt-2 font-bold">Desliza para los detalles</p>
        </div>
      </div>
    )
  }
];

const BackgroundLayer: React.FC<{
  img: string;
  index: number;
  range: [number, number];
  scrollYProgress: MotionValue<number>;
}> = ({ img, index, range, scrollYProgress }) => {
  const opacity = useTransform(
    scrollYProgress,
    index === 0 ? [0, range[1] - 0.01, range[1] + 0.01] : [range[0] - 0.01, range[0], range[1], range[1] + 0.01],
    index === 0 ? [1, 1, 0] : [0, 1, 1, 0]
  );
  const scale = useTransform(scrollYProgress, range, [1, 1.03]);

  return (
    <motion.div
      style={{ opacity, zIndex: index }}
      className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
    >
      <motion.div
        style={{ scale }}
        className="w-full h-full bg-black will-change-transform"
        initial={false}
      >
        <img
          src={img}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            contentVisibility: 'auto',
            backfaceVisibility: 'hidden'
          }}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </motion.div>
    </motion.div>
  );
};

const TextLayer: React.FC<{
  children: React.ReactNode;
  index: number;
  range: [number, number];
  scrollYProgress: MotionValue<number>;
}> = ({ children, index, range, scrollYProgress }) => {
  const opacity = useTransform(
    scrollYProgress,
    index === 0 ? [0, range[1] - 0.05, range[1]] : [range[0], range[0] + 0.05, range[1] - 0.05, range[1]],
    index === 0 ? [1, 1, 0] : [0, 1, 1, 0]
  );
  const y = useTransform(scrollYProgress, range, [10, -10]);

  return (
    <motion.div
      style={{ opacity, y, pointerEvents: 'none' }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center px-4 md:px-6 z-20 will-change-transform"
    >
      <div className="max-w-5xl">{children}</div>
    </motion.div>
  );
};

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {SCENES.map((scene, i) => {
          const step = 1 / SCENES.length;
          const start = i * step;
          const end = start + step;
          return (
            <React.Fragment key={scene.id}>
              <BackgroundLayer img={scene.img} index={i} range={[start, end]} scrollYProgress={scrollYProgress} />
              <TextLayer index={i} range={[start, start + step]} scrollYProgress={scrollYProgress}>
                {scene.content}
              </TextLayer>
            </React.Fragment>
          );
        })}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.01], [1, 0]) }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 text-wedding-50 flex flex-col items-center gap-2 pointer-events-none"
        >
          <div className="animate-bounce mt-8 md:mt-12">
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-gray-200">Desliza para comenzar</span>
            <MoveDown className=" text-gray-200 mx-auto" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};