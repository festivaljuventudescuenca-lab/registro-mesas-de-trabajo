import React, { useState, useEffect } from 'react';  
import { motion } from 'framer-motion';  
import { ArrowRight } from 'lucide-react';  
import FooterLogo from './FooterLogo';  

const PersonalForm = ({ onContinue, onBack, personalData = {} }) => {  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    edad: '',
    cedula: '',
    provincia: '',
    canton: '',
    parroquia: '',
    barrio: '',
    celular: '',
    email: ''
  });
  const [errors, setErrors] = useState({});  

  useEffect(() => {  
    setFormData({ ...formData, ...personalData });  
  }, [personalData]);  

  const handleChange = (e) => {  
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Validación en tiempo real
    let errorMsg = '';
    
    if (!value.trim()) {
      errorMsg = '* Este campo es obligatorio *';
    } else if (name === 'cedula') {
          const numericValue = value.replace(/\D/g, '');
    setFormData({ ...formData, [name]: numericValue });

    let errorMsg = '';
    if (!numericValue.trim()) {
      errorMsg = '* Este campo es obligatorio *';
    } else if (numericValue.length !== 10) {
      errorMsg = 'La cédula debe tener exactamente 10 caracteres';
    }
    }
    setErrors({ ...errors, [name]: errorMsg });
  };  

  const handleBlur = (e) => {
  const { name, value } = e.target;
  let errorMsg = '';
  if (!value.trim()) {
    errorMsg = '* Este campo es obligatorio *';
  } else if (name === 'cedula' && value.length !== 10) {
    errorMsg = 'La cédula debe tener exactamente 10 caracteres';
  }
  setErrors({ ...errors, [name]: errorMsg });
};

  const validate = () => {  
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key].trim()) {
        newErrors[key] = '* Este campo es obligatorio *';
      } else if (key === 'cedula' && formData[key].length !== 10) {
        newErrors.cedula = 'La cédula debe tener exactamente 10 caracteres';
      } else if (key === 'celular' && !/^\d{10}$/.test(formData.celular)) {
        newErrors.celular = 'El celular debe tener 10 dígitos';
      } else if (key === 'email' && !/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Correo electrónico inválido';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {  
    e.preventDefault();
    if (validate()) {
      onContinue(formData);
    }
  };

  return (  
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="form-wrapper relative"
    >
      {/* <h2 className="text-2xl font-bold text-[#1565C0] mb-6">Datos Personales</h2>   */}
  <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" autoFill="off">  
        <div>  
          <label htmlFor="nombres" className="block mb-1 font-semibold text-white">Nombres</label>  
          <input  
            id="nombres"  
            type="text"  
            name="nombres"  
            placeholder="Ingresa tus nombres"  
            value={formData.nombres}  
            onChange={handleChange}  
            onBlur={handleBlur} // <- aquí
            className="input-field"  
          />  
          {errors.nombres && <p className="error">{errors.nombres}</p>}  
        </div>  

        <div>  
          <label htmlFor="apellidos" className="block mb-1 font-semibold text-white">Apellidos</label>  
          <input  
            id="apellidos"  
            type="text"  
            name="apellidos"  
            placeholder="Ingresa tus apellidos"  
            value={formData.apellidos}  
            onChange={handleChange}  
            onBlur={handleBlur} 
            className="input-field"  
          />  
          {errors.apellidos && <p className="error">{errors.apellidos}</p>}  
        </div>  

        <div>  
          <label htmlFor="edad" className="block mb-1 font-semibold text-white">Edad</label>  
          <input  
            id="edad"  
            type="number"  
            name="edad"  
            placeholder="Ingresa tu edad"  
            value={formData.edad}  
            onChange={handleChange} 
            onBlur={handleBlur}  
            className="input-field"  
          />  
          {errors.edad && <p className="error">{errors.edad}</p>}  
        </div>  

        <div>  
          <label htmlFor="cedula" className="block mb-1 font-semibold text-white">Cédula</label>  
          <input  
            id="cedula"  
            type="text"  
            name="cedula"  
            placeholder="Ingresa tu número de cédula"  
            value={formData.cedula}  
            onChange={handleChange}
            onBlur={handleBlur}   
            className="input-field"  
          />  
          {errors.cedula && <p className="error">{errors.cedula}</p>}  
        </div>  

        <div>  
          <label htmlFor="provincia" className="block mb-1 font-semibold text-white">Provincia</label>  
          <input  
            id="provincia"  
            type="text"  
            name="provincia"  
            placeholder="Ingresa tu provincia"  
            value={formData.provincia}  
            onChange={handleChange}
            onBlur={handleBlur}   
            className="input-field"  
          />  
          {errors.provincia && <p className="error">{errors.provincia}</p>}  
        </div>  

        <div>  
          <label htmlFor="canton" className="block mb-1 font-semibold text-white">Cantón</label>  
          <input  
            id="canton"  
            type="text"  
            name="canton"  
            placeholder="Ingresa tu cantón"  
            value={formData.canton}  
            onChange={handleChange}
            onBlur={handleBlur}   
            className="input-field"  
          />  
          {errors.canton && <p className="error">{errors.canton}</p>}  
        </div>  

        <div>  
          <label htmlFor="parroquia" className="block mb-1 font-semibold text-white">Parroquia</label>  
          <input  
            id="parroquia"  
            type="text"  
            name="parroquia"  
            placeholder="Ingresa tu parroquia"  
            value={formData.parroquia}  
            onChange={handleChange}
            onBlur={handleBlur}   
            className="input-field"  
          />  
          {errors.parroquia && <p className="error">{errors.parroquia}</p>}  
        </div>  

        <div>
          <label htmlFor="barrio" className="block mb-1 font-semibold text-white">Barrio</label>
          <input
            id="barrio"
            type="text"
            name="barrio"
            placeholder="Ingresa tu barrio"
            value={formData.barrio}
            onChange={handleChange}
            onBlur={handleBlur}
            className="input-field"
          />
          {errors.barrio && <p className="error">{errors.barrio}</p>}
        </div>

        <div>
          <label htmlFor="celular" className="block mb-1 font-semibold text-white">Celular</label>
          <input
            id="celular"
            type="text"
            name="celular"
            placeholder="Ingresa tu número de celular"
            value={formData.celular}
            onChange={handleChange}
            onBlur={handleBlur}
            className="input-field"
            maxLength={10}
            inputMode="numeric"
          />
          {errors.celular && <p className="error">{errors.celular}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-semibold text-white">Correo electrónico</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Ingresa tu correo electrónico"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="input-field"
            autoComplete="off"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="flex gap-4 mt-6">  
          <button  
            type="button"  
            onClick={onBack}  
            className="btn-secondary flex-1"  
          >  
            Atrás  
          </button>  
          <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">  
            Continuar  
            <ArrowRight className="w-4 h-4" />  
          </button>  
        </div>  
      </form>  
      <FooterLogo />  
    </motion.div>  
  );  
};  

export default PersonalForm;