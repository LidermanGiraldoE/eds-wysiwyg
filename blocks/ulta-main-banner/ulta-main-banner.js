export default function decorate(block) {
  block.classList.add('ulta-banner');

  const [imageContainer, contentContainer, buttonContainer] = block.children;

  // Procesar la imagen
  if (imageContainer) {
    imageContainer.classList.add('ulta-banner-wrapper');
    const img = imageContainer.querySelector('img');
    if (img) img.classList.add('ulta-banner-img');
  }

  // Crear el contenedor para los textos
  const textsContainer = document.createElement('div');
  textsContainer.classList.add('ulta-banner-texts');

  // Procesar el contentContainer (tagline, title, description)
  if (contentContainer) {
    const paragraphs = contentContainer.querySelectorAll('p');
    if (paragraphs[0]) {
      const tagline = document.createElement('div');
      tagline.classList.add('ulta-banner-tagline');
      tagline.appendChild(paragraphs[0]);
      textsContainer.appendChild(tagline);
    }
    if (paragraphs[1]) {
      const title = document.createElement('div');
      title.classList.add('ulta-banner-title');
      title.appendChild(paragraphs[1]);
      textsContainer.appendChild(title);
    }
    if (paragraphs[2]) {
      const description = document.createElement('div');
      description.classList.add('ulta-banner-description');
      description.appendChild(paragraphs[2]);
      textsContainer.appendChild(description);
    }

    contentContainer.remove(); // Eliminar el contentContainer original
  }

  // Procesar el botón
  if (buttonContainer) {
    const [textElement, hrefElement] = buttonContainer.children;
    const buttonText = textElement?.querySelector('p')?.textContent.trim();
    const buttonHref = hrefElement?.querySelector('p')?.textContent.trim();

    const button = document.createElement('a');
    button.href = buttonHref || '#';
    button.textContent = buttonText || 'Comprar Ahora';
    button.className = 'ulta-banner-button';
    textsContainer.appendChild(button);

    buttonContainer.remove(); // Eliminar el buttonContainer original
  }

  // Agregar el nuevo contenedor de textos al bloque principal
  block.appendChild(textsContainer);
}
