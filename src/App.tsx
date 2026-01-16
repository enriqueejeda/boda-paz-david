import React, { Suspense } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';

// Lazy load components that are not immediately visible
const Program = React.lazy(() => import('./components/Program').then(module => ({ default: module.Program })));
const RSVPForm = React.lazy(() => import('./components/RSVPForm').then(module => ({ default: module.RSVPForm })));
const FAQ = React.lazy(() => import('./components/FAQ').then(module => ({ default: module.FAQ })));
const MusicRequest = React.lazy(() => import('./components/MusicRequest').then(module => ({ default: module.MusicRequest })));

// Loading fallback component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
  </div>
);

const App: React.FC = () => {

  return (
    <div className="flex flex-col min-h-screen bg-emerald-900">
      <Header />

      <main className="grow">
        {/* FASE 1: INTRO INMERSIVA - Optimizada para LCP */}
        <section id="home" style={{ contentVisibility: 'auto' }}>
          <Hero />
        </section>

        {/* FASE 2: CONTENIDO FUNCIONAL (Aparece tras el scroll de la intro) */}
        <div className="relative z-10 bg-white shadow-[0_-20px_40px_rgba(0,0,0,0.1)] -mt-20 pt-20 rounded-t-3xl">
          <Suspense fallback={<LoadingSpinner />}>
            <section id="program" className="scroll-mt-20">
              <Program />
            </section>

            <section id="rsvp" className="scroll-mt-20">
              <RSVPForm />
            </section>

            <section id="music" className="scroll-mt-20 bg-amber-600">
              <MusicRequest />
            </section>

            <section id="logistics" className="scroll-mt-20">
              <FAQ />
            </section>
          </Suspense>
        </div>
      </main>

      <Footer />

    </div>
  );
};

export default App;