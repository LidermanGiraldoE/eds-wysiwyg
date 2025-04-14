/**
 * Build custom components to PDP.
 * @param {HTMLElement} $giftContainer - Container element for the gift section.
 * @param {Object} product - Product data object.
 */
import createModal from '../../design-system/atoms/customModal/customModal.js';
import { h, render } from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);

export function modal($giftContainer, product) {
  if (!$giftContainer) {
    console.error('Error: $giftContainer is not defined.');
    return;
  }

  // Example data
  const productExamples = [{
      title: 'Detalles de la oferta',
      subtitle: 'Obsequio con tu pedido',
      description: 'Recibe un mini Butter Gloss en tono Praline de NYX de regalo al incluir el Slim Lip Pencil en tu pedido. Perfecto para complementar tu delineador con un brillo irresistible (solo por tiempo limitado o hasta agotar existencias)' },
  ];

  /**
   * Displays a modal with the provided content.
   * @param {Object} content - The content to render inside the modal.
   */
  const showModal = async (content) => {
    try {
      const modalContainer = document.createElement('div');
      render(h(content.type, content.props), modalContainer);

      const modal = await createModal([modalContainer], 'slide', 'right');
      modal.showModal();
    } catch (error) {
      console.error('Error displaying the modal:', error);
    }
  };

  $giftContainer.addEventListener('click', () => {
    const exampleProduct = productExamples[0];
    const content = html`
    <h2 class='modal-title'>${exampleProduct.title}</h2>
    <h3 class='modal-subtitle'>${exampleProduct.subtitle}</h3>
    <p class='modal-description'>${exampleProduct.description}</p>
    `;

    showModal({
      type: 'div',
      props: { children: content },
    });
  });
}
