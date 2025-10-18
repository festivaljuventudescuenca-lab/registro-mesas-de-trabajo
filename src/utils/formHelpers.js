export const validateForm = (formData) => {  
  const errors = {};  
  if (!formData.Nombres?.trim()) errors.Nombres = 'Los nombres son obligatorios, ¡no seas tímido!';  
  if (!formData.Apellidos?.trim()) errors.Apellidos = '¿Y los apellidos? No nos dejes adivinando.';  
  if (!formData.Cedula?.trim()) errors.Cedula = 'La cédula es clave, ¡ingrésala!';  
  else if (!/^\d{10}$/.test(formData.Cedula)) errors.Cedula = 'Cédula debe ser 10 dígitos exactos.';  
  if (!formData.Edad || formData.Edad < 18 || formData.Edad > 99) errors.Edad = 'Debes ser mayor de edad (18-99) para inscribirte.';  
  if (!formData.Provincia) errors.Provincia = 'Elige tu provincia de la lista.';  
  if (!formData.Canton?.trim()) errors.Canton = 'Dinos tu cantón para ubicarte.';  
  if (!formData.Barrio?.trim()) errors.Barrio = '¿En qué barrio vives? ¡Detalles importan!';  
  if (!formData.Email?.trim()) errors.Email = 'Sin email no podemos contactarte.';  
  else if (!/\S+@\S+\.\S+/.test(formData.Email)) errors.Email = 'Ese email parece de otro planeta. Corrígelo.';  
  if (!formData.Celular?.trim()) errors.Celular = 'Número de celular obligatorio para emergencias.';  
  else if (!/^\d{10}$/.test(formData.Celular)) errors.Celular = 'Celular: 10 dígitos, como 099xxxxxx.';  
  if (!formData.Motivacion?.trim()) errors.Motivacion = '¡Cuéntanos por qué quieres unirte!';  
  if (!formData.MesaSelected) errors.MesaSelected = 'Selecciona una mesa para debatir.';  
  if (!formData.RazonMesa?.trim()) errors.RazonMesa = 'Explica tu pasión por esa mesa.';  
  return errors;  
};