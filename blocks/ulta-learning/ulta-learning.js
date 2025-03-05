import { moveInstrumentation } from '../../scripts/scripts.js';
 
export default async function decorate(block) {
  console.log('ULTA Learning block JS', block);
 
  // Ruta relativa al template HTML (asegúrate de que la ruta es correcta según la estructura de tu proyecto)
  const templatePath = '/blocks/ulta-learning/ulta-learning.html';
  try {
    const response = await fetch(templatePath);
    if (!response.ok) {
      throw new Error(`Error al cargar el template: ${response.statusText}`);
    }
    const templateHTML = await response.text();
 
    // Creamos un contenedor temporal para manipular el HTML
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = templateHTML;
 
    // Extraemos el elemento principal del template (suponemos que es el primer hijo)
    const templateBlock = tempContainer.firstElementChild;
    if (!templateBlock) {
      console.error('El template HTML no tiene elementos.');
      return;
    }
 
    // Buscar el título en el bloque original (por ejemplo, un párrafo) que contiene el contenido editable
    const titleElement = block.querySelector('p');
    if (titleElement) {
      // Buscamos el elemento h2 donde se insertará el título en el template
      const h2 = templateBlock.querySelector('.block-title');
      if (h2) {
        h2.textContent = titleElement.textContent;
        // Opcional: aplicar instrumentación (por ejemplo, para analytics o tracking de cambios)
        moveInstrumentation(titleElement, h2);
      } else {
        console.warn('No se encontró el elemento .block-title en el template.');
      }
    } else {
      console.warn('No se encontró el título en el contenido original del bloque.');
    }
 
    // Limpiamos el bloque original y añadimos el contenido del template
    block.innerHTML = '';
    block.appendChild(templateBlock);
 
    // Opcional: Puedes cargar el CSS del bloque dinámicamente o asegurarte de que se incluya en el build
    // Ejemplo de carga dinámica (si no se inyecta por otro mecanismo):
    // const link = document.createElement('link');
    // link.rel = 'stylesheet';
    // link.href = '/blocks/ulta-learning/ulta-learning.css';
    // document.head.appendChild(link);
 
  } catch (error) {
    console.error('Error en la decoración del bloque ULTA Learning:', error);
  }
}