import React, { useState } from 'react';  
import { motion } from 'framer-motion';  
import { supabase } from '../supabaseClient';  
import { validateForm } from '../utils/formHelpers';  
import logo from '../img/logo.png'; // importa la imagen 
const InscripcionForm = () => {  
  const [formData, setFormData] = useState({  
    Nombres: '',  
    Apellidos: '',  
    Cedula: '',  
    Edad: '',  
    Provincia: '',  
    Canton: '',  
    Barrio: '',  
    Email: '',  
    Celular: '',  
    Motivacion: '',  
    MesaSelected: '',  
    RazonMesa: ''  
  });  
  const [errors, setErrors] = useState({});  
  const [loading, setLoading] = useState(false);  
  const [success, setSuccess] = useState(false);  
  const [showVerifiedPopup, setShowVerifiedPopup] = useState(false);

  const provincias = [  
    'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro',  
    'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos',  
    'Manabí', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza', 'Pichincha',  
    'Santa Elena', 'Santo Domingo de los Tsáchilas', 'Sucumbíos', 'Tungurahua',  
    'Zamora Chinchipe'  
  ];  

  const mesas = [  
    'Emprendimiento, gestión de proyectos y educación.',  
    'Medio ambiente y sostenibilidad.',  
    'Política, ciudadanía y democracia.',  
    'Tecnología, innovación y cultura.',  
    'Comunicación y generación de contenido.'  
  ];  

  // Beneficios/inclusiones con icono asociado
  const benefits = [
    { icon: 'how_to_reg', text: 'Registro de participantes y entrega de souvenirs institucionales personalizados.' },
    { icon: 'card_membership', text: 'Certificación con aval nacional e internacional (académico y gubernamental).' },
    { icon: 'card_giftcard', text: 'Kit de bienvenida (carpeta institucional, bolígrafo corporativo y material complementario).' },
    { icon: 'lunch_dining', text: 'Box lunch en horario matutino.' },
    { icon: 'groups', text: 'Participación en mesas de trabajo y espacios de networking con actores estratégicos.' },
    { icon: 'photo_camera', text: 'Entrega de recuerdo conmemorativo del evento' },
    { icon: 'celebration', text: 'Actividad de integración privada en el establecimiento “La Bienvenida – ¡Que Viva Cuenca por sus Fiestas!”.' }
  ];

  const handleChange = (e) => {  
    const { name, value } = e.target;  
    // Sanitizar inputs numéricos: solo dígitos
    if (name === 'Cedula' || name === 'Celular') {
      const digits = String(value).replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: digits }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
      return;
    }
    if (name === 'Edad') {
      const digits = String(value).replace(/\D/g, '').slice(0, 2);
      setFormData(prev => ({ ...prev, [name]: digits }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));  
  };  

  const handleRadioChange = (e) => {  
    setFormData(prev => ({ ...prev, MesaSelected: e.target.value }));  
    if (errors.MesaSelected) setErrors(prev => ({ ...prev, MesaSelected: '' }));  
  };  

  // NOTE: removed payment file upload and related helpers — comprobante is no longer required

  // Enviar formulario: inserta la cadena base64 en la columna Comprobante
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      const fieldLabels = {
        Nombres: 'Nombres',
        Apellidos: 'Apellidos',
        Cedula: 'Cédula',
        Edad: 'Edad',
        Provincia: 'Provincia',
        Canton: 'Cantón',
        Barrio: 'Barrio',
        Email: 'Correo electrónico',
        Celular: 'Número de celular',
        Motivacion: 'Motivación',
        MesaSelected: 'Mesa de trabajo',
        RazonMesa: 'Razón de la mesa'
      };
      const missing = Object.keys(validationErrors).map(k => fieldLabels[k] || k);
      const generalMsg = `Faltan los siguientes campos: ${missing.join(', ')}.`;
      setErrors({ ...validationErrors, general: generalMsg });
      const firstKey = Object.keys(validationErrors)[0];
      scrollToField(firstKey);
      return;
    }

    // Comprobante (comprobante de pago) ya no es obligatorio — se omite la validación cliente

    setLoading(true);
    try {
        // Verificar si la cédula ya está registrada
        const { data: existing, error: selectError } = await supabase
          .from('Inscripciones')
          .select('id')
          .eq('Cedula', formData.Cedula)
          .limit(1);

        if (selectError) throw new Error(`Error al consultar cédula: ${selectError.message}`);

        if (existing && existing.length > 0) {
          // Ya existe una inscripción con esa cédula
          setErrors({ Cedula: 'La cédula ya está registrada. Si crees que es un error, contáctanos.' , general: 'No se pudo completar la inscripción porque la cédula ya existe.' });
          scrollToField('Cedula');
          setLoading(false);
          return;
        }

        const { error: insertError } = await supabase
          .from('Inscripciones')
          .insert([{ 
            Nombres: formData.Nombres.trim(),
            Apellidos: formData.Apellidos.trim(),
            Cedula: formData.Cedula,
            Edad: parseInt(formData.Edad),
            Provincia: formData.Provincia,
            Canton: formData.Canton.trim(),
            Barrio: formData.Barrio.trim(),
            Email: formData.Email.toLowerCase().trim(),
            Celular: formData.Celular,
            Motivacion: formData.Motivacion.trim(),
            MesaSelected: formData.MesaSelected,
            RazonMesa: formData.RazonMesa.trim()
          }]);

      if (insertError) {
        // Manejar conflicto de unicidad (condición de carrera eventual)
        const msg = insertError.message || '';
        const code = insertError.code || '';
        if (code === '23505' || /duplicate key|duplicate entry|unique constraint|already exists|duplicate/i.test(msg)) {
          setErrors({ Cedula: 'La cédula ya está registrada. Si crees que es un error, contáctanos.' , general: 'No se pudo completar la inscripción porque la cédula ya existe.' });
          scrollToField('Cedula');
          setLoading(false);
          return;
        }
        throw new Error(`Error en base de datos: ${insertError.message}`);
      }

  setSuccess(true);
  // Mostrar popup informativo sobre verificación y grupo de WhatsApp
  setShowVerifiedPopup(true);
      // Limpiar formulario
  setFormData({ Nombres: '', Apellidos: '', Cedula: '', Edad: '', Provincia: '', Canton: '', Barrio: '', Email: '', Celular: '', Motivacion: '', MesaSelected: '', RazonMesa: '' });
      setErrors({});
    } catch (error) {
      console.error('¡Drama en la inscripción!', error);
      setErrors({ general: 'Algo salió mal: ' + error.message + '. Revisa tu conexión o el archivo.' });
    } finally {
      setLoading(false);
    }
  };


  // Helper: desplaza suavemente al primer campo con error
  const scrollToField = (fieldKey) => {
    try {
      // Nota: el campo 'Comprobante' fue eliminado; tratamos cualquier campo igual que otros.
      // Para radios (MesaSelected) nos interesa el primer elemento con ese name
      const els = document.getElementsByName(fieldKey);
      if (els && els.length > 0) {
        const el = els[0];
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Si el elemento no es focusable, intentar enfocar su contenedor
        try { el.focus?.(); } catch (e) { }
        // Resaltar temporalmente el campo o su contenedor
        try {
          const target = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' ? el : el.closest('label') || el;
          // Guardar estilos previos para restaurar
          const prevBox = target.style.boxShadow;
          const prevBorder = target.style.borderColor;
          target.style.transition = 'box-shadow 220ms ease, border-color 220ms ease';
          target.style.boxShadow = '0 0 0 6px rgba(239,68,68,0.18)';
          // Intentar colorear borde si existe
          try { target.style.borderColor = '#f43f5e'; } catch (e) {}
          setTimeout(() => {
            try { target.style.boxShadow = prevBox || ''; target.style.borderColor = prevBorder || ''; } catch (e) {}
          }, 1400);
        } catch (e) {
          // noop
        }
        return;
      }
      // Fallback: hacer scroll al tope del formulario
      const form = document.querySelector('form');
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      // no hacer nada si algo falla en scroll
      console.warn('No se pudo desplazar al campo:', fieldKey, err);
    }
  };

  // Determina si el formulario está completamente válido
  const _formErrors = validateForm(formData);
  const isFormComplete = Object.keys(_formErrors).length === 0;

  if (success) {  
    return (  
      <motion.div  
        initial={{ opacity: 0, scale: 0.95 }}  
        animate={{ opacity: 1, scale: 1 }}  
        className="md:col-span-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center shadow-sm"  
      >  
        <span className="material-symbols-outlined text-6xl text-green-500 mb-4 block mx-auto">task_alt</span>  
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">¡Inscripción confirmada!</h2>  
        <p className="text-green-700 dark:text-green-300">Tu registro está en camino al equipo. ¡Revisa tu email para detalles y prepárate para brillar en el congreso!</p>  
        <motion.button  
          onClick={() => setSuccess(false)}  
          className="mt-6 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90"  
          whileHover={{ scale: 1.05 }}  
        >  
          Nueva inscripción  
        </motion.button>  
        
        {showVerifiedPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative bg-white dark:bg-slate-900 rounded-lg p-6 max-w-lg mx-4 shadow-lg z-10">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Información importante</h3>
              <p className="text-slate-700 dark:text-slate-300">Una vez verificado el pago, te enviaremos la información por correo electrónico y serás agregado al grupo de WhatsApp del evento.</p>
              <div className="mt-4 flex justify-end">
                <button onClick={() => setShowVerifiedPopup(false)} className="bg-primary text-white px-4 py-2 rounded-md">Entendido</button>
              </div>
            </div>
          </div>
        )}
      </motion.div>  
    );  
  }  

  return (  
    <form onSubmit={handleSubmit} autoComplete="off" className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm">  
      {errors.general && (  
        <motion.div className="md:col-span-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3"  
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}  
        >  
          <span className="material-symbols-outlined text-red-500">error</span>  
          <span className="text-red-700 dark:text-red-300">{errors.general}</span>  
        </motion.div>  
      )}  

      {/* Datos Personales */}  
      <div className="md:col-span-2 text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-2">Datos Personales</div>  
      <label className="flex flex-col flex-1">  
        <p className="text-slate-700 dark:text-slate-300 text-base font-medium leading-normal pb-2">Nombres <span className="text-red-500">*</span></p>  
        <input  
          name="Nombres"  
          autoComplete="off"  
          value={formData.Nombres}  
          onChange={handleChange}  
          className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${errors.Nombres ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-background-light dark:bg-slate-800 focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-base font-normal leading-normal`}  
          placeholder="Ingresa tus nombres"  
          required  
        />  
        {errors.Nombres && <p className="text-red-500 text-sm mt-1">{errors.Nombres}</p>}  
      </label>  
      <label className="flex flex-col flex-1">  
        <p className="text-slate-700 dark:text-slate-300 text-base font-medium leading-normal pb-2">Apellidos <span className="text-red-500">*</span></p>  
        <input  
          name="Apellidos"  
          autoComplete="off"  
          value={formData.Apellidos}  
          onChange={handleChange}  
          className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${errors.Apellidos ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-background-light dark:bg-slate-800 focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-base font-normal leading-normal`}  
          placeholder="Ingresa tus apellidos"  
          required  
        />  
        {errors.Apellidos && <p className="text-red-500 text-sm mt-1">{errors.Apellidos}</p>}  
      </label>  
      <label className="flex flex-col flex-1">  
        <p className="text-slate-700 dark:text-slate-300 text-base font-medium leading-normal pb-2">Cédula <span className="text-red-500">*</span></p>  
        <input  
          name="Cedula"  
          autoComplete="off"  
          value={formData.Cedula}  
          onChange={handleChange}  
          inputMode="numeric" pattern="\d*" maxLength={10}
          className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${errors.Cedula ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-background-light dark:bg-slate-800 focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-base font-normal leading-normal`}  
          placeholder="Ej: 0104273656"  
          required  
        />  
        {errors.Cedula && <p className="text-red-500 text-sm mt-1">{errors.Cedula}</p>}  
      </label>  
      <label className="flex flex-col flex-1">  
        <p className="text-slate-700 dark:text-slate-300 text-base font-medium leading-normal pb-2">Número de Celular <span className="text-red-500">*</span></p>  
        <input  
          name="Celular"  
          autoComplete="off"  
          type="tel"  
          value={formData.Celular}  
          onChange={handleChange}  
          inputMode="numeric" pattern="\d*" maxLength={10}
          className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${errors.Celular ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-background-light dark:bg-slate-800 focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-base font-normal leading-normal`}  
          placeholder="Ej: 0991234567"  
          required  
        />  
        {errors.Celular && <p className="text-red-500 text-sm mt-1">{errors.Celular}</p>}  
      </label>  
      <label className="flex flex-col flex-1 md:col-span-2">  
        <p className="text-slate-700 dark:text-slate-300 text-base font-medium leading-normal pb-2">Edad <span className="text-red-500">*</span></p>  
        <input  
          name="Edad"  
          autoComplete="off"  
          type="number"  
          min="18"  
          max="99"  
          value={formData.Edad}  
          onChange={handleChange}  
          className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${errors.Edad ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-background-light dark:bg-slate-800 focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-base font-normal leading-normal`}  
          placeholder="Ej: 22"  
          required  
        />  
        {errors.Edad && <p className="text-red-500 text-sm mt-1">{errors.Edad}</p>}  
      </label>  

      {/* Ubicación */}  
      <div className="md:col-span-2 text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-2 mt-4">Ubicación</div>  
      <label className="flex flex-col flex-1">  
        <p className="text-slate-700 dark:text-slate-300 text-base font-medium leading-normal pb-2">Provincia <span className="text-red-500">*</span></p>  
        <select  
          name="Provincia"  
          autoComplete="off"  
          value={formData.Provincia}  
          onChange={handleChange}  
          className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-slate-800 focus:border-primary h-12 p-3 text-base font-normal leading-normal"  
          required  
        >  
          <option value="">Selecciona tu provincia</option>  
          {provincias.sort().map((prov) => (  
            <option key={prov} value={prov}>{prov}</option>  
          ))}  
        </select>  
        {errors.Provincia && <p className="text-red-500 text-sm mt-1">{errors.Provincia}</p>}  
      </label>  
      <label className="flex flex-col flex-1">  
        <p className="text-slate-700 dark:text-slate-300 text-base font-medium leading-normal pb-2">Cantón <span className="text-red-500">*</span></p>  
        <input  
          name="Canton"  
          autoComplete="off"  
          value={formData.Canton}  
          onChange={handleChange}  
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-slate-800 focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-base font-normal leading-normal"  
          placeholder="Ingresa tu cantón"  
          required  
        />  
        {errors.Canton && <p className="text-red-500 text-sm mt-1">{errors.Canton}</p>}  
      </label>  
      <label className="flex flex-col md:col-span-2">  
        <p className="text-slate-700 dark:text-slate-300 text-base font-medium leading-normal pb-2">Barrio <span className="text-red-500">*</span></p>  
        <input  
          name="Barrio"  
          autoComplete="off"  
          value={formData.Barrio}  
          onChange={handleChange}  
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-slate-800 focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-base font-normal leading-normal"  
          placeholder="Ingresa tu barrio"  
          required  
        />  
        {errors.Barrio && <p className="text-red-500 text-sm mt-1">{errors.Barrio}</p>}  
      </label>  

      {/* Contacto y Motivación */}  
      <div className="md:col-span-2 text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-2 mt-4">Contacto y Motivación</div>  
      <label className="flex flex-col md:col-span-2">  
        <p className="text-slate-700 dark:text-slate-300 text-base font-medium leading-normal pb-2">Correo electrónico <span className="text-red-500">*</span></p>  
        <input  
          name="Email"  
          autoComplete="off"  
          type="email"  
          value={formData.Email}  
          onChange={handleChange}  
          className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${errors.Email ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-background-light dark:bg-slate-800 focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-base font-normal leading-normal`}  
          placeholder="tu.correo@ejemplo.com"  
          required  
        />  
        {errors.Email && <p className="text-red-500 text-sm mt-1">{errors.Email}</p>}  
      </label>  
      <label className="flex flex-col md:col-span-2">  
        <p className="text-slate-700 dark:text-slate-300 text-base font-medium leading-normal pb-2">¿Por qué te gustaría asistir? <span className="text-red-500">*</span></p>  
        <textarea  
          name="Motivacion"  
          autoComplete="off"  
          value={formData.Motivacion}  
          onChange={handleChange}  
          className={`form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${errors.Motivacion ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-background-light dark:bg-slate-800 focus:border-primary min-h-[100px] placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-base font-normal leading-normal`}  
          placeholder="Describe tu motivación para unirte al congreso..."  
          required  
        ></textarea>  
        {errors.Motivacion && <p className="text-red-500 text-sm mt-1">{errors.Motivacion}</p>}  
      </label>  
      <div className="md:col-span-2">  
        <p className="text-slate-700 dark:text-slate-300 text-base font-medium leading-normal pb-2">Elige tu Mesa de Trabajo <span className="text-red-500">*</span></p>  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">  
          {mesas.map((mesa) => (  
            <label key={mesa} className={`flex items-center gap-3 p-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-primary/10 dark:hover:bg-primary/20 cursor-pointer ${formData.MesaSelected === mesa ? 'bg-primary/20 border-primary dark:border-primary' : ''}`}>  
              <input  
                className="form-radio text-primary focus:ring-primary/50"  
                name="MesaSelected"  
                type="radio"  
                autoComplete="off"  
                value={mesa}  
                checked={formData.MesaSelected === mesa}  
                onChange={handleRadioChange}  
              />  
              <span className="text-slate-800 dark:text-slate-200">{mesa}</span>  
            </label>  
          ))}  
        </div>  
        {errors.MesaSelected && <p className="text-red-500 text-sm mt-1">{errors.MesaSelected}</p>}  
      </div>  
      <label className="flex flex-col md:col-span-2">  
        <p className="text-slate-700 dark:text-slate-300 text-base font-medium leading-normal pb-2">¿Por qué te interesa esta mesa de trabajo? <span className="text-red-500">*</span></p>  
        <textarea  
          name="RazonMesa"  
          autoComplete="off"  
          value={formData.RazonMesa}  
          onChange={handleChange}  
          className={`form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${errors.RazonMesa ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-background-light dark:bg-slate-800 focus:border-primary min-h-[100px] placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-base font-normal leading-normal`}  
          placeholder="Explica qué esperas aportar o aprender..."  
          required  
        ></textarea>  
        {errors.RazonMesa && <p className="text-red-500 text-sm mt-1">{errors.RazonMesa}</p>}  
      </label>  

      {/* Pago removido: se muestra información y beneficios */}
      <div className="md:col-span-2">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-2">Información</h3>
          <p className="text-slate-600 dark:text-slate-400">La inscripción ya no requiere comprobante de pago. Completa el formulario y envía tu registro.</p>
          <div className="mt-4">
            <ul className="space-y-3 mt-4 text-slate-600 dark:text-slate-300">
              {benefits.map((b) => (
                <li key={b.text} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">{b.icon}</span>
                  <span>{b.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Botón final - Fuera del grid principal */}  
      <div className="md:col-span-2 flex justify-center p-4">  
        <motion.button  
          type="submit"  
          disabled={loading}  
          aria-disabled={loading ? 'true' : (!isFormComplete ? 'true' : 'false')}  
          className={`font-bold py-4 px-10 rounded-lg text-lg transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-4 ${loading ? 'opacity-70 cursor-wait' : (!isFormComplete ? 'bg-gray-300 text-gray-500 ring-gray-200 opacity-90' : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-300 ring-green-400/30')}`}  
          whileHover={(!loading && isFormComplete) ? { scale: 1.02 } : {}}  
          whileTap={(!loading && isFormComplete) ? { scale: 0.98 } : {}}  
        >  
          {loading ? (  
            <>  
              <span className="material-symbols-outlined animate-spin">hourglass_empty</span>  
              Procesando...  
            </>  
          ) : (  
            <>  
              Finalizar y Enviar mi Inscripción  
            </>  
          )}  
        </motion.button>  
      </div>  
    </form>  
  );  
};  

export default InscripcionForm;