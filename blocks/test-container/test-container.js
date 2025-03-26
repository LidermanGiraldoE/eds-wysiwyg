import { decorateBlocks, loadBlock } from '../../scripts/aem.js';

export default function decorate(block) {
  block.classList.add('test-container');

  // Decora de forma automática todos los bloques hijos que ya están marcados
  decorateBlocks(block);

  // Opcional: Si deseas asegurarte de cargar individualmente ciertos bloques
  const textBlock = block.querySelector('[data-block-id="test-text"]');
  if (textBlock) loadBlock(textBlock);
  
  const buttonBlock = block.querySelector('[data-block-id="test-buttom"]');
  if (buttonBlock) loadBlock(buttonBlock);
}
