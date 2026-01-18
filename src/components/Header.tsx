import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { IMAGES } from '../assets/images';
export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
        ticking.current = false;
      });
    };

    // Usar passive listener para mejorar scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Manejador para el desplazamiento suave (memoizado)
  const handleNavigation = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#home' },
    { name: 'Información Práctica', href: '#program' },
  ];

  const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#2F3E34] py-2' : 'bg-transparent py-3'}`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo / Names */}
        <a
          href="#home"
          onClick={(e) => handleScroll(e, '#home')}
          className={`text-2xl font-serif italic font-bold flex items-center gap-2 text-white`}
        >
          {/* <Heart /> */}
          <img src={IMAGES.logo} alt="Logo Boda Paz y David" className="w-20" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavigation(e, link.href)}
              className={`text-sm font-medium tracking-wide hover:text-wedding-500 transition-colors text-white shadow-black/20 text-shadow-sm`}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#rsvp"
            onClick={(e) => handleNavigation(e, '#rsvp')}
            className="px-6 py-2 text-white font-semibold rounded-full shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 bg-emerald-600 hover:bg-emerald-700"
          >
            Confirma Asistencia
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} className={isScrolled ? 'text-white' : 'text-white lg:text-white'} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 animate-fade-in-down">
          <div className="flex flex-col py-4 px-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavigation(e, link.href)}
                className="text-emerald-900 font-medium py-2 border-b border-gray-50"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#rsvp"
              onClick={(e) => handleNavigation(e, '#rsvp')}
              className="mt-4 w-full text-center px-6 py-3 bg-[#6B7F6A] text-white font-semibold rounded-lg"
            >
              Confirmar Asistencia
            </a>
          </div>
        </div>
      )}
    </header>
  );
};