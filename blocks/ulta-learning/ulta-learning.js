import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  console.log('ULTA Learning block JS', block);

  const templatePath = '/blocks/ulta-learning/ulta-learning.html';

  try {
    const response = await fetch(templatePath);
    if (!response.ok) {
      throw new Error(`Error al cargar el template: ${response.statusText}`);
    }

    const templateHTML = await response.text();
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = templateHTML;
    const templateBlock = tempContainer.firstElementChild;

    if (!templateBlock) {
      console.error('El template HTML no tiene elementos.');
      return;
    }

    const titleElement = block.querySelector('p');

    if (titleElement) {
      const h2 = templateBlock.querySelector('.block-title');
      if (h2) {
        h2.textContent = titleElement.textContent;

        // Aplicar instrumentación
        moveInstrumentation(titleElement, h2);
      } else {
        console.warn('No se encontró el elemento .block-title en el template.');
      }
    } else {
      console.warn('No se encontró el título en el contenido original del bloque.');
    }

    block.innerHTML = '';
    block.appendChild(templateBlock);

    // Opcional: Carga dinámica del CSS si es necesario
    // const link = document.createElement('link');
    // link.rel = 'stylesheet';
    // link.href = '/blocks/ulta-learning/ulta-learning.css';
    // document.head.appendChild(link);
  } catch (error) {
    console.error('Error en la decoración del bloque ULTA Learning:', error);
  }
}
