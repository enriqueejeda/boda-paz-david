import React, { useState, useEffect, useCallback } from 'react';
import {
  Send, CheckCircle, AlertCircle, AlertTriangle,
  User, Mail, ChevronRight, ChevronLeft,
  Utensils, Users, X, PartyPopper, Moon, UserPlus,
  Info
} from 'lucide-react';

// --- CONFIGURACIÓN ---
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxnhIbX-y0O1YKt6u8HH7JoXDsXUcfIfCeo1-FG2l5AIA5X0kdDQOyvdGJcl6O2y020/exec';

// --- TIPOS ---
interface FormData {
  fullNames: string;
  emailTelefono: string;
  attendingDay1: boolean; // 31 Julio
  attendingDay2: boolean; // 1 Agosto
  attendingDay3: boolean; // 2 Agosto
  notAttending: boolean;
  adultCount: number;
  childCount: number;
  additionalGuests: string[]; // Array para guardar nombres de acompañantes
  dietaryRestrictions: string;
}

interface FormErrors {
  fullNames?: string;
  emailTelefono?: string;
  eventos?: string;
  guestNames?: string;
  general?: string;
}

const STEPS = [
  { id: 1, title: 'Tú' },
  { id: 2, title: 'Asistencia' },
  { id: 3, title: 'Detalles' },
  { id: 4, title: 'Confirmar' }
];

export const RSVPForm: React.FC = () => {
  // Estado del formulario
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullNames: '',
    emailTelefono: '',
    attendingDay1: false,
    attendingDay2: true,
    attendingDay3: false,
    notAttending: false,
    adultCount: 1,
    childCount: 0,
    additionalGuests: [],
    dietaryRestrictions: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Calcular cuántos acompañantes extra hay (Total - 1, que eres tú)
  const totalGuests = formData.adultCount + formData.childCount;
  const companionsNeeded = Math.max(0, totalGuests - 1);

  // Efecto para ajustar el array de nombres si cambia el número de invitados
  useEffect(() => {
    setFormData(prev => {
      const currentGuests = prev.additionalGuests;
      if (currentGuests.length === companionsNeeded) return prev;

      // Si necesitamos más huecos, añadimos cadenas vacías. Si menos, cortamos.
      let newGuests = [...currentGuests];
      if (currentGuests.length < companionsNeeded) {
        const diff = companionsNeeded - currentGuests.length;
        newGuests = [...newGuests, ...Array(diff).fill('')];
      } else {
        newGuests = newGuests.slice(0, companionsNeeded);
      }
      return { ...prev, additionalGuests: newGuests };
    });
  }, [companionsNeeded]);

  // --- MANEJADORES (Memoizados) ---

  const updateField = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const updateGuestName = useCallback((index: number, value: string) => {
    setFormData(prev => {
      const newGuests = [...prev.additionalGuests];
      newGuests[index] = value;
      return { ...prev, additionalGuests: newGuests };
    });
    if (errors.guestNames) setErrors(prev => ({ ...prev, guestNames: undefined }));
  }, [errors]);

  const toggleEvent = useCallback((day: 'attendingDay1' | 'attendingDay2' | 'attendingDay3') => {
    setFormData(prev => ({
      ...prev,
      [day]: !prev[day],
      notAttending: false
    }));
    if (errors.eventos) setErrors(prev => ({ ...prev, eventos: undefined }));
  }, [errors]);

  const handleGuestCount = useCallback((type: 'adult' | 'child', operation: 'add' | 'sub') => {
    const field = type === 'adult' ? 'adultCount' : 'childCount';
    setFormData(prev => {
      const current = prev[field];
      const newVal = operation === 'add' ? current + 1 : Math.max(0, current - 1);
      if (type === 'adult' && newVal < 1 && prev.childCount === 0) return prev;
      return { ...prev, [field]: newVal };
    });
  }, []);

  // --- VALIDACIÓN Y NAVEGACIÓN ---

  const validateStep = useCallback((step: number): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.fullNames.trim() || formData.fullNames.length < 3) {
        newErrors.fullNames = "Por favor, dinos tu nombre completo.";
        isValid = false;
      }
      if (!formData.emailTelefono.trim()) {
        newErrors.emailTelefono = "Necesitamos un contacto para confirmarte.";
        isValid = false;
      }
    }

    if (step === 2 && !formData.notAttending) {
      if (!formData.attendingDay1 && !formData.attendingDay2 && !formData.attendingDay3) {
        newErrors.eventos = "Selecciona al menos un evento o indica que no asistirás.";
        isValid = false;
      }
    }

    if (step === 3) {
      if (companionsNeeded > 0) {
        const emptyNames = formData.additionalGuests.some(name => !name.trim());
        if (emptyNames) {
          newErrors.guestNames = "Por favor, escribe el nombre de todos tus acompañantes.";
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [formData, companionsNeeded]);

  const nextStep = useCallback((skipToConfirm = false) => {
    if (validateStep(currentStep)) {
      if (skipToConfirm) {
        setCurrentStep(4);
      } else if (currentStep === 2 && formData.notAttending) {
        setCurrentStep(4);
      } else {
        setCurrentStep(prev => Math.min(prev + 1, 4));
      }
      window.document.getElementById('rsvp-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, formData.notAttending, validateStep]);

  const prevStep = () => {
    if (currentStep === 4 && formData.notAttending) {
      setCurrentStep(2);
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };

  // --- SUBMIT ---

  const handleSubmit = useCallback(async () => {
    setStatus('submitting');

    const eventosSeleccionados = [];
    if (formData.attendingDay1) eventosSeleccionados.push("31 Julio (Bienvenida)");
    if (formData.attendingDay2) eventosSeleccionados.push("1 Agosto (Boda)");
    if (formData.attendingDay3) eventosSeleccionados.push("2 Agosto (Despedida)");
    if (formData.notAttending) eventosSeleccionados.push("No asistirá");

    const listaAcompanantes = formData.additionalGuests.filter(n => n.trim()).join(", ");

    const payload = {
      nombreCompleto: formData.fullNames.trim(),
      emailTelefono: formData.emailTelefono.trim(),
      eventos: eventosSeleccionados,
      adultos: formData.notAttending ? 0 : formData.adultCount,
      ninos: formData.notAttending ? 0 : formData.childCount,
      acompanantes: listaAcompanantes,
      alergias: formData.dietaryRestrictions.trim()
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
      });
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrors({ general: "Error de conexión. Inténtalo de nuevo." });
    }
  }, [formData]);

  // --- RENDERIZADO DE PASOS ---

  const renderProgressBar = () => (
    <div className="flex justify-between items-center mb-8 px-2">
      {STEPS.map((s, idx) => (
        <div key={s.id} className="flex flex-col items-center relative z-10 w-1/4">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 ${currentStep >= s.id
              ? 'bg-wedding-500 border-wedding-500 text-white shadow-lg scale-110'
              : 'bg-white border-gray-300 text-gray-600'
              }`}
          >
            {currentStep > s.id ? <CheckCircle size={16} /> : s.id}
          </div>
          <span className={`text-xs mt-2 font-medium uppercase tracking-wider transition-colors ${currentStep >= s.id ? 'text-wedding-700' : 'text-gray-600'}`}>
            {s.title}
          </span>
          {/* Línea conectora */}
          {idx < STEPS.length - 1 && (
            <div className="absolute top-4 left-1/2 w-full h-0.5 -z-10 bg-gray-100">
              <div
                className="h-full bg-wedding-500 transition-all duration-500"
                style={{ width: currentStep > s.id ? '100%' : '0%' }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // VISTA DE ÉXITO
  if (status === 'success') {
    return (
      <div className="py-24 bg-wedding-50 flex items-center justify-center px-4" id="rsvp-success">
        <div className="bg-white rounded-3xl p-10 md:p-14 text-center shadow-2xl border border-wedding-100 max-w-lg w-full animate-fade-in-up">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-3xl font-serif text-emerald-900 mb-4 font-bold">¡Confirmado!</h3>
          <p className="text-emerald-800 text-lg mb-8 leading-relaxed">
            {formData.notAttending
              ? "Sentiremos no verte, pero gracias por avisarnos."
              : "¡Qué alegría! Ya contamos contigo para el gran día. Hemos guardado tus preferencias."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-wedding-600 font-semibold hover:text-wedding-800 underline decoration-2 underline-offset-4"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const setNotAttending = () => {
    setFormData(prev => ({
      ...prev,
      notAttending: !prev.notAttending,
      attendingDay1: false,
      attendingDay2: false,
      attendingDay3: false
    }));
    if (errors.eventos) setErrors(prev => ({ ...prev, eventos: undefined }));
  };
  return (
    <div className="py-20 md:py-28 bg-[#2F3E34] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-wedding-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-emerald-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-2xl">
        <div className="text-center mb-10 text-white">
          <h2 className="text-4xl md:text-5xl font-serif mb-3 font-bold">Reserva tu Lugar</h2>
          <p className="text-emerald-100/80 text-lg">Confirmanos tu asistencia antes del 1 de junio para poder organizarnos, todo con cariño.</p>
          <p className="text-emerald-400 mt-2">
            <Info size={20} className="inline-block mr-2" />
            Si tienes cualquier duda, llamanos sin porblema
          </p>
        </div>

        <div id="rsvp-card" className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden min-h-125 flex flex-col">

          {/* Header del Formulario */}
          <div className="p-8 pb-0">
            {renderProgressBar()}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                <AlertTriangle size={16} /> {errors.general}
              </div>
            )}
          </div>

          <div className="grow px-8 pb-8">

            {/* STEP 1: IDENTIDAD */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-4">
                  <label className="block text-emerald-900 font-bold text-lg">¿Cómo te llamas?</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={formData.fullNames}
                      onChange={(e) => updateField('fullNames', e.target.value)}
                      placeholder="Nombre y Apellidos"
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl focus:ring-2 focus:outline-none transition-all ${errors.fullNames ? 'border-red-300 ring-red-100' : 'border-gray-200 focus:border-wedding-500 focus:ring-wedding-100'}`}
                    />
                  </div>
                  {errors.fullNames && <p className="text-red-500 text-sm ml-2">{errors.fullNames}</p>}
                </div>

                <div className="space-y-4">
                  <label className="block text-emerald-900 font-bold text-lg">Email o Teléfono</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={formData.emailTelefono}
                      onChange={(e) => updateField('emailTelefono', e.target.value)}
                      placeholder="Para enviarte detalles..."
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl focus:ring-2 focus:outline-none transition-all ${errors.emailTelefono ? 'border-red-300 ring-red-100' : 'border-gray-200 focus:border-wedding-500 focus:ring-wedding-100'}`}
                    />
                  </div>
                  {errors.emailTelefono && <p className="text-red-500 text-sm ml-2">{errors.emailTelefono}</p>}
                </div>
              </div>
            )}

            {/* STEP 2: EVENTOS */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-serif text-emerald-900 mb-2">Hola, {formData.fullNames.split(' ')[0]}</h3>
                  <p className="text-gray-700">¿Podrás acompañarnos?</p>
                </div>

                <div className="grid gap-4">
                  {/* Option: Boda (Day 2) */}
                  <div
                    onClick={() => toggleEvent('attendingDay2')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 group ${formData.attendingDay2 ? 'border-wedding-500 bg-wedding-50' : 'border-gray-100 hover:border-wedding-200'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${formData.attendingDay2 ? 'bg-wedding-500 border-wedding-500' : 'border-gray-300'}`}>
                      {formData.attendingDay2 && <CheckCircle size={14} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-bold ${formData.attendingDay2 ? 'text-emerald-900' : 'text-gray-700'}`}>EL GRAN DÍA</span>
                        <span className="text-xs font-semibold bg-white px-2 py-1 rounded border shadow-sm text-gray-700">1 AGO</span>
                      </div>
                      <p className="text-sm text-gray-700">Ceremonia & Fiesta. Lo más importante.</p>
                    </div>
                    <PartyPopper className={`w-6 h-6 ${formData.attendingDay2 ? 'text-wedding-500' : 'text-gray-300'}`} />
                  </div>

                  {/* Option: Pre-boda (Day 1) */}
                  <div
                    onClick={() => toggleEvent('attendingDay1')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 group ${formData.attendingDay1 ? 'border-wedding-500 bg-wedding-50' : 'border-gray-100 hover:border-wedding-200'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${formData.attendingDay1 ? 'bg-wedding-500 border-wedding-500' : 'border-gray-300'}`}>
                      {formData.attendingDay1 && <CheckCircle size={14} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-bold ${formData.attendingDay1 ? 'text-emerald-900' : 'text-gray-700'}`}>BIENVENIDA</span>
                        <span className="text-xs font-semibold bg-white px-2 py-1 rounded border shadow-sm text-gray-700">31 JUL</span>
                      </div>
                      <p className="text-sm text-gray-700">Cena informal y cóctel para romper el hielo.</p>
                    </div>
                    <Moon className={`w-6 h-6 ${formData.attendingDay1 ? 'text-wedding-500' : 'text-gray-300'}`} />
                  </div>

                  {/* Option: Post-boda (Day 3) */}
                  <div
                    onClick={() => toggleEvent('attendingDay3')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 group ${formData.attendingDay3 ? 'border-wedding-500 bg-wedding-50' : 'border-gray-100 hover:border-wedding-200'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${formData.attendingDay3 ? 'bg-wedding-500 border-wedding-500' : 'border-gray-300'}`}>
                      {formData.attendingDay3 && <CheckCircle size={14} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-bold ${formData.attendingDay3 ? 'text-emerald-900' : 'text-gray-700'}`}>DESPEDIDA</span>
                        <span className="text-xs font-semibold bg-white px-2 py-1 rounded border shadow-sm text-gray-700">2 AGO</span>
                      </div>
                      <p className="text-sm text-gray-700">Brunch y piscina antes de volver.</p>
                    </div>
                    <Utensils className={`w-6 h-6 ${formData.attendingDay3 ? 'text-wedding-500' : 'text-gray-300'}`} />
                  </div>
                </div>

                {errors.eventos && <p className="text-red-500 text-center text-sm">{errors.eventos}</p>}

                <div className="pt-4 border-t border-gray-100 text-center">
                  <button
                    onClick={setNotAttending}
                    className="text-gray-600 text-sm hover:text-red-500 transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    <X size={14} /> Lamentablemente, no podré asistir a nada
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DETALLES */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-fade-in">

                {/* Contadores */}
                <div>
                  <h3 className="text-emerald-900 font-bold text-lg mb-6 flex items-center gap-2">
                    <Users size={20} className="text-wedding-500" /> ¿Cuántos venís?
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
                    <div>
                      <span className="block font-bold text-gray-800">Adultos</span>
                      <span className="text-xs text-gray-700">Mayores de 12 años</span>
                    </div>
                    <div className="flex items-center gap-4 bg-white px-2 py-1 rounded-lg shadow-sm">
                      <button
                        onClick={() => handleGuestCount('adult', 'sub')}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-emerald-900 font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-bold text-lg">{formData.adultCount}</span>
                      <button
                        onClick={() => handleGuestCount('adult', 'add')}
                        className="w-8 h-8 rounded-full bg-wedding-500 hover:bg-wedding-600 flex items-center justify-center text-white font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <span className="block font-bold text-gray-800">Niños</span>
                      <span className="text-xs text-gray-700">Menores de 12 años</span>
                    </div>
                    <div className="flex items-center gap-4 bg-white px-2 py-1 rounded-lg shadow-sm">
                      <button
                        onClick={() => handleGuestCount('child', 'sub')}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-emerald-900 font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-bold text-lg">{formData.childCount}</span>
                      <button
                        onClick={() => handleGuestCount('child', 'add')}
                        className="w-8 h-8 rounded-full bg-wedding-500 hover:bg-wedding-600 flex items-center justify-center text-white font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Nombres de Acompañantes (DINÁMICO) */}
                {companionsNeeded > 0 && (
                  <div className="animate-fade-in bg-wedding-50/50 p-4 rounded-xl border border-wedding-100">
                    <h3 className="text-emerald-900 font-bold text-sm mb-4 flex items-center gap-2 uppercase tracking-wide">
                      <UserPlus size={16} className="text-wedding-500" /> Nombres de acompañantes
                    </h3>
                    <div className="space-y-3">
                      {formData.additionalGuests.map((name, index) => (
                        <div key={index}>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => updateGuestName(index, e.target.value)}
                            placeholder={`Nombre y Apellido del Acompañante ${index + 1}`}
                            className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-wedding-100 focus:border-wedding-500 focus:outline-none transition-all text-sm"
                          />
                        </div>
                      ))}
                    </div>
                    {errors.guestNames && <p className="text-red-500 text-xs mt-2 ml-1">{errors.guestNames}</p>}
                  </div>
                )}

                {/* Alergias */}
                <div>
                  <h3 className="text-emerald-900 font-bold text-lg mb-4 flex items-center gap-2">
                    <AlertCircle size={20} className="text-wedding-500" /> Alergias o Dietas
                  </h3>
                  <textarea
                    value={formData.dietaryRestrictions}
                    onChange={(e) => updateField('dietaryRestrictions', e.target.value)}
                    placeholder="Ej. María es celíaca, Juan es vegetariano..."
                    rows={3}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-wedding-100 focus:border-wedding-500 focus:outline-none resize-none"
                  ></textarea>
                </div>
              </div>
            )}

            {/* STEP 4: CONFIRMACIÓN */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in text-center">
                <h3 className="text-2xl font-serif text-emerald-900 font-bold">Resumen</h3>

                {formData.notAttending ? (
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-gray-600 mb-2">Has indicado que</p>
                    <p className="text-xl font-bold text-red-500 mb-2">No podrás asistir</p>
                    <p className="text-sm text-gray-700">Esperamos poder celebrar contigo en otra ocasión.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-wedding-50 p-6 rounded-xl border border-wedding-100 space-y-3">
                      <div className="flex justify-between border-b border-wedding-200 pb-2">
                        <span className="text-gray-600">Nombre Principal</span>
                        <span className="font-bold text-emerald-900">{formData.fullNames}</span>
                      </div>

                      {/* Mostrar nombres de acompañantes en el resumen */}
                      {formData.additionalGuests.length > 0 && (
                        <div className="text-left border-b border-wedding-200 pb-2">
                          <span className="text-gray-600 block mb-1">Acompañantes:</span>
                          <ul className="list-disc list-inside">
                            {formData.additionalGuests.map((guest, idx) => (
                              <li key={idx} className="text-emerald-900 font-medium text-sm ml-2">
                                {guest}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex justify-between border-b border-wedding-200 pb-2">
                        <span className="text-gray-600">Total Invitados</span>
                        <span className="font-bold text-emerald-900">{formData.adultCount + formData.childCount} personas</span>
                      </div>
                      <div className="text-left">
                        <span className="text-gray-600 block mb-2">Eventos seleccionados:</span>
                        <div className="flex flex-wrap gap-2">
                          {formData.attendingDay1 && <span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm text-wedding-600">31 Jul</span>}
                          {formData.attendingDay2 && <span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm text-wedding-600">1 Ago</span>}
                          {formData.attendingDay3 && <span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm text-wedding-600">2 Ago</span>}
                        </div>
                      </div>
                      {formData.dietaryRestrictions && (
                        <div className="text-left pt-2">
                          <span className="text-gray-600 text-sm block">Notas:</span>
                          <p className="text-sm italic text-gray-800">{formData.dietaryRestrictions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer del Formulario (Botones) */}
          <div className="p-6 bg-white border-t border-gray-200 flex justify-between items-center">

            {currentStep > 1 ? (
              <button
                onClick={prevStep}
                className="text-emerald-700 font-semibold hover:text-emerald-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={18} /> Atrás
              </button>
            ) : (
              <div></div> // Spacer
            )}

            {currentStep < 4 ? (
              <button
                onClick={() => nextStep()}
                className="bg-emerald-900 hover:bg-emerald-800 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                Siguiente <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={status === 'submitting'}
                className={`bg-wedding-500 hover:bg-wedding-600 text-white px-10 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-0.5 ${status === 'submitting' ? 'opacity-70 cursor-wait' : ''}`}
              >
                {status === 'submitting' ? 'Enviando...' : 'Confirmar Todo'} <Send size={18} />
              </button>
            )}

          </div>

        </div>
      </div>

      {/* AlertTriangle is imported but was giving error in step 1 if not used, included in general error rendering */}
      <div className="hidden"><AlertCircle /></div>
    </div>
  );
};