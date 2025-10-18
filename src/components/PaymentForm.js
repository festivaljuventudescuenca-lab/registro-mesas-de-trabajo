import React, { useState, useEffect } from 'react';  
import { motion } from 'framer-motion';  
import { ArrowRight, Download, Upload, Check } from 'lucide-react';  
import FooterLogo from './FooterLogo';  
import { supabase } from '../supabaseClient';

const PaymentForm = ({ onContinue, onBack, data = {} }) => {  
  const [selectedPackage, setSelectedPackage] = useState(data.payment?.package || '');
  const [file, setFile] = useState(data.payment?.file || null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {  
    setSelectedPackage(data.payment?.package || '');  
    setFile(data.payment?.file || null);  
  }, [data]);  

  const handlePackageSelect = (pkg) => {  
    setSelectedPackage(pkg);  
    if (errors.package) setErrors({ ...errors, package: '' });  
  };  

  const handleFileChange = (e) => {  
    setFile(e.target.files[0]);  
    if (errors.file) setErrors({ ...errors, file: '' });  
  };  

  const validate = () => {  
    const newErrors = {};  
    if (!selectedPackage) newErrors.package = 'Selecciona un paquete';  
    if (!file) newErrors.file = 'Sube el comprobante';  
    setErrors(newErrors);  
    return Object.keys(newErrors).length === 0;  
  };  

  const handleSubmit = (e) => {  
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64File = reader.result.split(',')[1];
        // Unir toda la información personal, académica y pago
        const registro = {
          ...data.personal,
          ...data.academic,
          comprobante: base64File,
          payment_package: selectedPackage
        };
        const { error } = await supabase
          .from('registros')
          .insert([registro]);
        setIsSubmitting(false);
        if (error) {
          alert('Error al guardar: ' + error.message);
          return;
        }
        onContinue({ ...data, payment: { package: selectedPackage, file: base64File } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (  
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="form-wrapper relative"
    >
      {/* <h2 className="text-2xl font-bold text-[#1565C0] mb-6">Sección de Pago</h2>   */}
  <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off" autoFill="off">  
        <div>  
          <label className="block mb-2 font-semibold text-white">Selecciona tu paquete</label>  
          <div className="grid md:grid-cols-2 gap-4">  
            <motion.div  
              className={`card p-4 cursor-pointer ${selectedPackage === 'El Pregon' ? 'border-2 border-[#FBC02D]' : ''}`}  
              onClick={() => handlePackageSelect('El Pregon')}  
              whileHover={{ scale: 1.02 }}  
            >  
              <h3 className="text-xl font-bold mb-2">El Pregon</h3>  
              <p>Paquete básico con acceso a eventos principales y materiales.</p>  
              {selectedPackage === 'El Pregon' && <Check className="w-5 h-5 text-[#FBC02D] ml-auto mt-2" />}  
            </motion.div>  

            <motion.div  
              className={`card p-4 cursor-pointer ${selectedPackage === 'Atenas Full Trip' ? 'border-2 border-[#FBC02D]' : ''}`}  
              onClick={() => handlePackageSelect('Atenas Full Trip')}  
              whileHover={{ scale: 1.02 }}  
            >  
              <h3 className="text-xl font-bold mb-2">Atenas Full Trip</h3>  
              <p>Paquete completo con transporte, alojamiento y todas las actividades.</p>  
              {selectedPackage === 'Atenas Full Trip' && <Check className="w-5 h-5 text-[#FBC02D] ml-auto mt-2" />}  
            </motion.div>  
          </div>  
          {errors.package && <p className="error">{errors.package}</p>}  
        </div>  

        <a href="https://drive.google.com/uc?export=download&id=1wXstq1k76Y_3flhwZhhlESQSdyTe8o2B" download className="btn-secondary flex items-center gap-2"> 
          <Download className="w-4 h-4" />  
          Descargar PDF con detalles  
        </a>  

        <div className="grid md:grid-cols-2 gap-4">  
          <div className="card p-4">  
            <h3 className="font-bold mb-2">Banco Pichincha</h3>  
            <p>Cuenta: 2203812116<br />C.I.: 1234567890</p>  
          </div>  
          <div className="card p-4">  
            <h3 className="font-bold mb-2">Banco JEP</h3>  
            <p>Cuenta: 0987654321<br />C.I.: 0987654321</p>  
          </div>  
        </div>  

        <div className="card p-4">  
          <label htmlFor="comprobante" className="block mb-2 font-semibold text-white">Sube tu comprobante de pago (obligatorio)</label>  
          <div className="flex items-center gap-2 p-4 border-2 border-dashed border-[#F57C00] rounded-lg">  
            <Upload className="w-5 h-5 text-[#F57C00]" />  
            <input  
              id="comprobante"  
              type="file"  
              onChange={handleFileChange}  
              className="input-field flex-1"  
              accept="image/*,.pdf"  
            />  
          </div>  
          {file && <p className="text-[#FBC02D] mt-2">Archivo seleccionado: {file.name}</p>}  
          {errors.file && <p className="error">{errors.file}</p>}  
        </div>  

        <div className="flex gap-4">  
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary flex-1"
            disabled={isSubmitting}
          >
            Atrás
          </button>
          <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Continuar'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>  
      </form>  
      <FooterLogo />  
    </motion.div>  
  );  
};  

export default PaymentForm;