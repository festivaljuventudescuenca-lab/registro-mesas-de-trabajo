import React from 'react';  
import { motion } from 'framer-motion';  
import { CheckCircle2 } from 'lucide-react';  
import FooterLogo from './FooterLogo';  

const Confirmation = ({ data, onRestart }) => {  
  return (  
    <motion.div  
      initial={{ opacity: 0, scale: 0.9 }}  
      animate={{ opacity: 1, scale: 1 }}  
      transition={{ duration: 0.6 }}  
      className="text-center form-wrapper relative"  
    >  
      <CheckCircle2 className="w-24 h-24 text-[#FBC02D] mx-auto mb-6" />  
      <h2 className="text-3xl font-bold text-[#1565C0] mb-4">¡Felicidades por tu registro!</h2>  
      <p className="text-lg mb-8">Se te enviará un mensaje de confirmación una vez validado el pago para que puedas asistir. ¡Gracias por unirte al Festival Nacional de Juventudes Ecuador 2025!</p>  
      <button  
        onClick={onRestart}  
        className="btn-primary"  
      >  
        Registrar Otro  
      </button>  
      <FooterLogo />  
    </motion.div>  
  );  
};  

export default Confirmation;