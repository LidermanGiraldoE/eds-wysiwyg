import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  console.log('ULTA Learning block JS', block);

  const titleElement = block.querySelector('p');

  if (titleElement) {
    const h2 = document.createElement('h2');
    h2.textContent = titleElement.textContent;

    // Aplicar moveInstrumentation
    /* moveInstrumentation(titleElement, h2); */

    // Reemplazar el párrafo con el h2
    titleElement.replaceWith(h2);
  } else {
    console.warn('No se encontró el título dentro del bloque ULTA Learning.');
  }
}
