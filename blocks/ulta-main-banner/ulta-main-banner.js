import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('ulta-banner');

  const [imageContainer, contentContainer, buttonContainer] = block.children;

  if (imageContainer) {
    imageContainer.classList.add('ulta-banner-wrapper');
    const img = imageContainer.querySelector('img');
    if (img) img.classList.add('ulta-banner-img');
  }

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('ulta-banner-content');

  const textsContainer = document.createElement('div');
  textsContainer.classList.add('ulta-banner-texts');

  if (contentContainer) {
    const contentElements = Array.from(contentContainer.children);

    // Asignar clases según la posición de los elementos en contentContainer
    contentElements.forEach((element, index) => {
      if (index === 0) {
        element.classList.add('ulta-banner-tagline');
      } else if (index === 1) {
        element.classList.add('ulta-banner-title');
      } else if (index === 2) {
        element.classList.add('ulta-banner-description');
      }
      textsContainer.appendChild(element);
    });
  }

  moveInstrumentation(contentContainer, textsContainer);
  contentContainer.remove();
  contentWrapper.appendChild(textsContainer);

  if (buttonContainer) {
    const [textElement, hrefElement] = buttonContainer.children;
    const buttonHref = hrefElement?.querySelector('p')?.textContent.trim();
  
    const button = document.createElement('a');
    button.href = buttonHref || '#';
    button.className = 'ulta-banner-button';
  
    // Reutilizar textElement
    textElement.classList.add('ulta-button-text');
    button.appendChild(textElement);
  
    moveInstrumentation(buttonContainer, button);
    buttonContainer.remove();
  
    contentWrapper.appendChild(button);
  }
  

  block.appendChild(contentWrapper);
}
