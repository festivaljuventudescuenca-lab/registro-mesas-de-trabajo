import React, { useState } from 'react';  
import { motion } from 'framer-motion';  
import ProgressBar from './components/ProgressBar';  
import Home from './components/Home';  
import PersonalForm from './components/PersonalForm';  
import AcademicForm from './components/AcademicForm';  
import PaymentForm from './components/PaymentForm';  
import Confirmation from './components/Confirmation';  
import fondo from './img/portada.png'; // importa la imagen


const App = () => {  
  const [step, setStep] = useState(0);  
  const [data, setData] = useState({});  
  const totalSteps = 3; // Personal + Academic + Payment (Confirmation no en barra)  

  const handleStart = () => setStep(1);  

  const handlePersonalContinue = (personalData) => {  
    setData({ ...data, personal: personalData });  
    setStep(2);  
  };  

  const handleAcademicContinue = (fullData) => {  
  setData({ ...data, academic: fullData.academic });
  setStep(3);
  };  

  const handlePaymentContinue = (fullData) => {  
  setData({ ...data, payment: fullData.payment });
  setStep(4);
  };  

  const handleBack = (stepTo) => {  
    setStep(stepTo || step - 1);  
  };  

  const handleRestart = () => {  
    setStep(0);  
    setData({});  
  };  

  const renderStep = () => {  
    switch (step) {  
      case 0:  
        return <Home onStart={handleStart} />;  
      case 1:  
        return (  
          <PersonalForm  
            onContinue={handlePersonalContinue}  
            onBack={() => handleBack(0)}  
            personalData={data.personal || {}}  
          />  
        );  
      case 2:  
        return (  
          <AcademicForm  
            onContinue={handleAcademicContinue}  
            onBack={() => handleBack(1)}  
            personalData={data.personal || {}}  
            academicData={data.academic || {}}  
          />  
        );  
      case 3:  
        return (  
          <PaymentForm  
            onContinue={handlePaymentContinue}  
            onBack={() => handleBack(2)}  
            data={data}  
          />  
        );  
      case 4:  
        return <Confirmation data={data} onRestart={handleRestart} />;  
      default:  
        return null;  
    }  
  };  

  return (  
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${fondo})` }}>  
      {step > 0 && step < 4 && <ProgressBar currentStep={step - 1} totalSteps={totalSteps} />}  
      <div className="container py-8">  
        <motion.div  
          key={step}  
          initial={{ opacity: 0 }}  
          animate={{ opacity: 1 }}  
          exit={{ opacity: 0 }}  
          transition={{ duration: 0.3 }}  
        >  
          {renderStep()}  
        </motion.div>  
      </div>  
    </div>  
  );  
};  

export default App;