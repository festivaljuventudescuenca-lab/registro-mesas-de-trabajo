import React from 'react';  
import { motion } from 'framer-motion';  
import { ArrowRight } from 'lucide-react';  
import portada from '../img/portada.png'; // <-- importa la imagen (ajusta la ruta según tu archivo)  

const Home = ({ onStart }) => {  
  return (  
    <motion.div  
      initial={{ opacity: 0, y: 20 }}  
      animate={{ opacity: 1, y: 0 }}  
      transition={{ duration: 0.6 }}  
      className="text-center"  
    >  
      {/* <h1 className="text-3xl font-bold text-[#1B86FF] mb-4">Festival Nacional de Juventudes Ecuador 2025</h1>  
      <p className="text-lg mb-8">Únete a este evento increíble para jóvenes líderes, donde compartiremos ideas, experiencias y construiremos el futuro del país. ¡Tu voz cuenta!</p>   */}
      {/* <img  
        src={portada}
        alt="Portada Festival"  
        className="w-full rounded-2xl mb-6 shadow-lg"  
      />   */}
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <motion.button  
        onClick={onStart}  
        className="btn-primary flex items-center justify-center gap-2 mx-auto"  
        whileHover={{ scale: 1.05 }}  
        whileTap={{ scale: 0.95 }}  
      >  
        Iniciar Registro  
        <ArrowRight className="w-5 h-5" />  
      </motion.button>  
    </motion.div>  
  );  
};  

export default Home;