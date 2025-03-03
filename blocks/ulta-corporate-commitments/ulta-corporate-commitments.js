import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const items = Array.from(block.children);

  // Extraer el título principal del bloque
  const titleElement = items.shift();
  const titleParagraph = titleElement?.querySelector('p');
  const titleText = titleParagraph?.textContent.trim() || 'Nuestros compromisos corporativos';

  // Contenedor principal
  const container = document.createElement('div');
  container.classList.add('ulta-corporate-commitments-container');

  // Header con el título
  const header = document.createElement('div');
  header.classList.add('ulta-corporate-commitments-header');

  const titleH2 = document.createElement('h2');
  titleH2.textContent = titleText;
  if (titleParagraph) moveInstrumentation(titleParagraph, titleH2);
  header.appendChild(titleH2);

  // Contenedor de los compromisos
  const commitmentsWrapper = document.createElement('div');
  commitmentsWrapper.classList.add('ulta-corporate-commitments-wrapper');

  // Iterar sobre los elementos restantes (cada compromiso)
  items.forEach((item) => {
    const imgElement = item.querySelector('img');
    const imgSrc = imgElement?.src || '';
    const imgAlt = imgElement?.alt || 'Corporate Commitment Image';

    // **Títulos y descripciones sin depender de `data-aue-prop`**
    const paragraphs = item.querySelectorAll('p');
    const commitmentTitle = paragraphs[0]?.textContent.trim() || 'Título no disponible';
    const commitmentDescription = paragraphs[1]?.textContent.trim() || 'Descripción no disponible';
    const buttonText = paragraphs[2]?.textContent.trim() || 'Saber más';

    // Extraer link del botón
    const linkElement = item.querySelector('a');
    const linkUrl = linkElement?.href || '#';

    // Crear estructura del compromiso
    const commitmentItem = document.createElement('div');
    commitmentItem.classList.add('ulta-corporate-commitment');

    // Imagen
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('ulta-corporate-commitment-image');

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = imgAlt;
    if (imgElement) moveInstrumentation(imgElement, img);
    imageContainer.appendChild(img);

    // Información del compromiso
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('ulta-corporate-commitment-info');

    // **Título**
    const title = document.createElement('h3');
    title.textContent = commitmentTitle;
    if (paragraphs[0]) moveInstrumentation(paragraphs[0], title);

    // **Descripción**
    const description = document.createElement('p');
    description.textContent = commitmentDescription;
    if (paragraphs[1]) moveInstrumentation(paragraphs[1], description);

    // **Botón**
    const button = document.createElement('a');
    button.classList.add('ulta-corporate-commitment-button');
    button.href = linkUrl;

    const buttonTextElement = document.createElement('p');
    buttonTextElement.textContent = buttonText;
    if (paragraphs[2]) moveInstrumentation(paragraphs[2], buttonTextElement);

    button.appendChild(buttonTextElement);

    // Agregar elementos a la estructura final
    infoContainer.appendChild(title);
    infoContainer.appendChild(description);
    infoContainer.appendChild(button);
    commitmentItem.appendChild(imageContainer);
    commitmentItem.appendChild(infoContainer);

    // Aplicar `moveInstrumentation` a todo el compromiso
    moveInstrumentation(item, commitmentItem);

    commitmentsWrapper.appendChild(commitmentItem);
  });

  // Armar la estructura final
  container.appendChild(header);
  container.appendChild(commitmentsWrapper);
  block.innerHTML = '';
  block.appendChild(container);
  block.classList.add('ulta-corporate-commitments');
}
