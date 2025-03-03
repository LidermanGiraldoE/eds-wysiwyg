import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const items = Array.from(block.children);

  // Extraer el título
  const titleElement = items.shift();
  const titleParagraph = titleElement?.querySelector('p');
  const titleText = titleParagraph?.textContent.trim();

  // Crear contenedor principal
  const container = document.createElement('div');
  container.classList.add('ulta-corporate-commitments-container');

  // Crear el título
  const titleContainer = document.createElement('div');
  titleContainer.classList.add('ulta-corporate-commitments-header');

  const titleH2 = document.createElement('h2');
  titleH2.textContent = titleText;
  moveInstrumentation(titleParagraph, titleH2);
  titleContainer.appendChild(titleH2);

  // Crear contenedor de los compromisos
  const commitmentsWrapper = document.createElement('div');
  commitmentsWrapper.classList.add('ulta-corporate-commitments-wrapper');

  // Iterar sobre los elementos restantes (cada compromiso)
  items.forEach((item) => {
    const imgElement = item.querySelector('img');
    const imgSrc = imgElement?.src || '';
    const imgAlt = imgElement?.alt || 'Corporate Commitment Image';

    const texts = item.querySelectorAll('p');
    const commitmentTitle = texts[0]?.textContent.trim() || '';
    const commitmentDescription = texts[1]?.textContent.trim() || '';
    const buttonText = texts[2]?.textContent.trim() || '';

    const linkElement = item.querySelector('a');
    const linkUrl = linkElement?.href || '#';

    // Crear estructura de cada compromiso
    const commitmentItem = document.createElement('div');
    commitmentItem.classList.add('ulta-corporate-commitment');

    // Imagen
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('ulta-corporate-commitment-image');

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = imgAlt;
    moveInstrumentation(imgElement, img);

    imageContainer.appendChild(img);

    // Información del compromiso
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('ulta-corporate-commitment-info');

    const title = document.createElement('h3');
    title.textContent = commitmentTitle;
    console.log('texts', texts);
    moveInstrumentation(texts[0], title);

    const description = document.createElement('p');
    description.textContent = commitmentDescription;
    moveInstrumentation(texts[1], description);

    // Botón
    const button = document.createElement('a');
    button.classList.add('ulta-corporate-commitment-button');
    button.href = linkUrl;

    const buttonTextElement = document.createElement('p');
    buttonTextElement.textContent = buttonText;
    moveInstrumentation(texts[2], buttonTextElement);

    button.appendChild(buttonTextElement);

    // Estructura final del compromiso
    infoContainer.appendChild(title);
    infoContainer.appendChild(description);
    infoContainer.appendChild(button);

    commitmentItem.appendChild(imageContainer);
    commitmentItem.appendChild(infoContainer);

    moveInstrumentation(item, commitmentItem);

    commitmentsWrapper.appendChild(commitmentItem);
  });

  // Armar la estructura final
  container.appendChild(titleContainer);
  container.appendChild(commitmentsWrapper);
  block.innerHTML = '';
  block.appendChild(container);
  block.classList.add('ulta-corporate-commitments');
}
