import React, { useState, useEffect } from 'react';  
import { motion } from 'framer-motion';  
import { ArrowRight, Check } from 'lucide-react';  
import FooterLogo from './FooterLogo';  

const AcademicForm = ({ onContinue, onBack, personalData = {}, academicData = {} }) => {  
  const [formData, setFormData] = useState({  
    organizacion: '',  
    nombreOrg: '',  
    pregunta1: '',  
    pregunta2: '',  
    pregunta3: '',  
    pregunta4: '',  
    pregunta5: '',  
    pregunta6: ''  
  });  
  const [errors, setErrors] = useState({});  

  useEffect(() => {  
    setFormData({ ...formData, ...academicData });  
  }, [academicData]);  

  const handleChange = (e) => {  
    setFormData({ ...formData, [e.target.name]: e.target.value });  
    if (errors[e.target.name]) {  
      setErrors({ ...errors, [e.target.name]: '' });  
    }  
  };  

  const handleOrgChange = (e) => {  
    const value = e.target.value;  
    setFormData({ ...formData, organizacion: value, nombreOrg: value === 'Si' ? formData.nombreOrg : '' });  
    if (errors.organizacion) setErrors({ ...errors, organizacion: '' });  
  };  

  const validate = () => {  
    const newErrors = {};
    const requiredFields = ['organizacion', 'pregunta1', 'pregunta2', 'pregunta3', 'pregunta4', 'pregunta5', 'pregunta6'];
    requiredFields.forEach(key => {
      const value = formData[key];
      const strValue = typeof value === 'string' ? value : String(value ?? '');
      if (!strValue.trim()) {
        newErrors[key] = 'Este campo es obligatorio';
      } else if (key.startsWith('pregunta') && strValue.trim().length < 20) {
        newErrors[key] = 'Mínimo 20 caracteres';
      }
    });
    if (formData.organizacion === 'Si' && !(typeof formData.nombreOrg === 'string' ? formData.nombreOrg : String(formData.nombreOrg ?? '')).trim()) {
      newErrors.nombreOrg = 'Este campo es obligatorio si perteneces a una organización';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {  
    e.preventDefault();
    if (validate()) {
      const fullData = {
        ...formData,
        organizacion: formData.organizacion === 'Si', // true si 'Si', false si 'No'
        nombreOrg: formData.organizacion === 'Si' ? formData.nombreOrg : ''
      };
      onContinue({ ...personalData, academic: fullData });
    }
  };

  return (  
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="form-wrapper relative"
    >
  <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" autoFill="off">  
        <div>  
          <label htmlFor="organizacion" className="block mb-2 font-semibold text-white">¿Pertenece a alguna organización? (Sí/No)</label>  
          <select id="organizacion" name="organizacion" value={formData.organizacion} onChange={handleOrgChange} className="input-field">  
            <option value="">Selecciona una opción</option>  
            <option value="Si">Sí</option>  
            <option value="No">No</option>  
          </select>  
          {errors.organizacion && <p className="error">{errors.organizacion}</p>}  
        </div>  

        {formData.organizacion === 'Si' && (  
          <div>  
            <label htmlFor="nombreOrg" className="block mb-1 font-semibold text-white">¿A qué organización pertenece?</label>  
            <input  
              id="nombreOrg"  
              type="text"  
              name="nombreOrg"  
              placeholder="Ingresa el nombre de la organización"  
              value={formData.nombreOrg}  
              onChange={handleChange}  
              className="input-field"  
            />  
          </div>  
        )}  
        {errors.nombreOrg && <p className="error">{errors.nombreOrg}</p>}  

        <div>  
          <label htmlFor="pregunta1" className="block mb-1 font-semibold text-white">¿Por qué te gustaría ser parte del Festival Nacional de Juventudes Ecuador 2025?</label>  
          <textarea  
            id="pregunta1"  
            name="pregunta1"  
            placeholder="Escribe tu respuesta aquí (mínimo 20 caracteres)"  
            value={formData.pregunta1}  
            onChange={handleChange}  
            className="textarea-field"  
          />  
          {errors.pregunta1 && <p className="error">{errors.pregunta1}</p>}  
        </div>  

        <div>  
          <label htmlFor="pregunta2" className="block mb-1 font-semibold text-white">¿Qué aportes consideras que puedes brindar desde tu experiencia, liderazgo o colectivo?</label>  
          <textarea  
            id="pregunta2"  
            name="pregunta2"  
            placeholder="Escribe tu respuesta aquí (mínimo 20 caracteres)"  
            value={formData.pregunta2}  
            onChange={handleChange}  
            className="textarea-field"  
          />  
          {errors.pregunta2 && <p className="error">{errors.pregunta2}</p>}  
        </div>  

        <div>  
          <label htmlFor="pregunta3" className="block mb-1 font-semibold text-white">Desde tu visión, ¿qué aporte podrías dar en el Festival Nacional de Juventudes Ecuador 2025 para construir la Agenda 2030 de Juventudes para el país?</label>  
          <textarea  
            id="pregunta3"  
            name="pregunta3"  
            placeholder="Escribe tu respuesta aquí (mínimo 20 caracteres)"  
            value={formData.pregunta3}  
            onChange={handleChange}  
            className="textarea-field"  
          />  
          {errors.pregunta3 && <p className="error">{errors.pregunta3}</p>}  
        </div>  

        <div>  
          <label htmlFor="pregunta4" className="block mb-1 font-semibold text-white">¿Has tenido alguna experiencia de activismo o participación juvenil? Cuéntanos brevemente.</label>  
          <textarea  
            id="pregunta4"  
            name="pregunta4"  
            placeholder="Escribe tu respuesta aquí (mínimo 20 caracteres)"  
            value={formData.pregunta4}  
            onChange={handleChange}  
            className="textarea-field"  
          />  
          {errors.pregunta4 && <p className="error">{errors.pregunta4}</p>}  
        </div>  

        <div>  
          <label htmlFor="pregunta5" className="block mb-1 font-semibold text-white">Menciona en qué proyectos has participado y cuál es tu mejor propuesta para fortalecer a la juventud del Ecuador.</label>  
          <textarea  
            id="pregunta5"  
            name="pregunta5"  
            placeholder="Escribe tu respuesta aquí (mínimo 20 caracteres)"  
            value={formData.pregunta5}  
            onChange={handleChange}  
            className="textarea-field"  
          />  
          {errors.pregunta5 && <p className="error">{errors.pregunta5}</p>}  
        </div>  

        <div>  
          <label htmlFor="pregunta6" className="block mb-1 font-semibold text-white">Describa su nivel académico actual y campo de estudio, así como cualquier programa o curso educativo o significativo.</label>  
          <textarea  
            id="pregunta6"  
            name="pregunta6"  
            placeholder="Escribe tu respuesta aquí (mínimo 20 caracteres)"  
            value={formData.pregunta6}  
            onChange={handleChange}  
            className="textarea-field"  
          />  
          {errors.pregunta6 && <p className="error">{errors.pregunta6}</p>}  
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

export default AcademicForm;