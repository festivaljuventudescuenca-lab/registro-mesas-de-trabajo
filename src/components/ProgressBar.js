import React from 'react';  
import { motion } from 'framer-motion';  
import logo from '../img/logo.png'; // importa la imagen

const ProgressBar = ({ currentStep, totalSteps }) => {  
  return (  
    <div className="progress-bar">  
      <div className="progress-logo">  
        <img  
          src={logo}  
          alt="Logo Festival Juventudes Ecuador 2025"  
        />  
      </div>  
      <div className="progress-steps">  
        {Array.from({ length: totalSteps }, (_, index) => (  
          <motion.div  
            key={index}  
            className={`progress-step ${index < currentStep ? '' : 'inactive'}`}  
            initial={{ width: '0%' }}  
            animate={{ width: index < currentStep ? '100%' : '20%' }}  
            transition={{ duration: 0.5 }}  
          />  
        ))}  
      </div>  
    </div>  
  );  
};  

export default ProgressBar;