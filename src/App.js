import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import InscripcionForm from './components/InscripcionForm';
import './styles.css';
import logo from './img/logo.png'; // importa la imagen
import fondo from './img/fondo.png'; // importa la imagen de fondo
import Acreditacion from './components/Acreditacion';
const App = () => {
  const [hash, setHash] = useState(typeof window !== 'undefined' ? window.location.hash : '');

  useEffect(() => {
    const onHash = () => setHash(window.location.hash || '');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Si la ruta hash es #acreditacion, renderizamos la pantalla de acreditación
  if (hash === '#acreditacion') {
    return <Acreditacion />;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col font-display group/design-root overflow-x-hidden" style={{ backgroundImage: `url(${fondo})` }}>
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <img
              alt="Festival Logo"
              className="h-10 w-10 rounded-full"
              src={logo}
            />
            <h1 className="text-xl font-bold text-slate-200 ">Festival Nacional de Juventudes</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex h-full grow flex-col px-4 md:px-0">
        <div className="flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-4xl flex-1 px-4 md:px-0">
            <div className="flex flex-col gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-3 p-4 text-center"
              >
                <p className="text-slate-200 dark:text-dark text-4xl font-black leading-tight tracking-tighter">
                  Inscripción al Congreso Académico
                </p>
                <p className="text-slate-200 dark:text-dark text-2xl font-black leading-tight tracking-tighter">
                  Información Personal y Académica
                </p>
                <img
                  alt="Festival Logo"
                  src={logo}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-lg bg-white/5 border border-white/10 p-6 text-left text-slate-200"
              >
                <h2 className="text-2xl font-extrabold">INFORMACIÒN Congreso Académico – Festival Nacional de Juventudes Ecuador 2025</h2>
                <p className="mt-2 text-sm text-slate-100/90 font-semibold">Foros · Mesas de Trabajo · Networking</p>

                <p className="mt-4 text-slate-100">
                  El Congreso Académico del Festival Nacional de Juventudes Ecuador 2025 busca fomentar la participación activa y propositiva de las juventudes mediante el abordaje de temas estratégicos, generando espacios de intercambio de conocimientos, experiencias y perspectivas con representantes de organizaciones, colectivos y actores institucionales.
                </p>

                <p className="mt-3 text-slate-100">
                  Con este encuentro se pretende aportar a la construcción de propuestas sostenibles en beneficio de las comunidades.
                </p>

                <p className="mt-3 text-slate-100">
                  El evento contempla 24 foros académicos simultáneos, desarrollados en diversos espacios del Centro Histórico de la ciudad, concebido como el epicentro formativo y cultural del festival.
                </p>

                <h3 className="mt-4 text-lg font-bold">Ejes Temáticos</h3>
                <ul className="list-disc list-inside mt-2 ml-2 space-y-1 text-slate-100">
                  <li>Emprendimiento, gestión de proyectos y educación.</li>
                  <li>Medio ambiente y sostenibilidad.</li>
                  <li>Política, ciudadanía y democracia.</li>
                  <li>Tecnología, innovación y cultura.</li>
                  <li>Comunicación y generación de contenido.</li>
                </ul>
              </motion.div>

              <InscripcionForm />
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 p-8 text-center md:text-left">
          <p className="text-slate-200 dark:text-slate-200 text-sm">
            © 2025 Festival Nacional de Juventudes. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <a className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors" href="#">Facebook</a> |
            <a className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors" href="#">Instagram</a> |
            <a className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors" href="#">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;