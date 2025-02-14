export default function decorate(block) {
  block.classList.add('ulta-banner');

  const [imageContainer, contentContainer, buttonContainer] = block.children;

  if (imageContainer) {
    imageContainer.classList.add('ulta-banner-wrapper');
    const img = imageContainer.querySelector('img');
    if (img) img.classList.add('ulta-banner-img');
  }

  const textsContainer = document.createElement('div');
  textsContainer.classList.add('ulta-banner-texts');

  if (contentContainer) {
    const contentElements = Array.from(contentContainer.children);

    // Asignar clases según la posición de los elementos en contentContainer
    contentElements.forEach((element, index) => {
      const text = element.querySelector('p')?.textContent.trim();
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

  if (buttonContainer) {
    const [textElement, hrefElement] = buttonContainer.children;
    const buttonText = textElement?.querySelector('p')?.textContent.trim();
    const buttonHref = hrefElement?.querySelector('p')?.textContent.trim();

    const button = document.createElement('a');
    button.href = buttonHref || '#';
    button.textContent = buttonText || 'Comprar Ahora';
    button.className = 'ulta-banner-button';
    textsContainer.appendChild(button);
  }

  block.appendChild(textsContainer);
}
