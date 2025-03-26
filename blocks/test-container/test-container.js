import decorateText from '../text/text.js';
import decorateButton from '../button/button.js';

export default function decorate(block) {
  block.classList.add('container-block');
  
  // Buscar y decorar los bloques de texto dentro del container.
  const textBlocks = block.querySelectorAll('[data-block-id="test-text"]');
  textBlocks.forEach((child) => {
    decorateText(child);
  });
  
  // Buscar y decorar los bloques de botón dentro del container.
  const buttonBlocks = block.querySelectorAll('[data-block-id="test-buttom"]');
  buttonBlocks.forEach((child) => {
    decorateButton(child);
  });
}
