import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const items = Array.from(block.children);

  // Extraer el título (primer elemento)
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

    // Seleccionar los divs con los textos (en lugar de usar `data-aue-prop`)
    const textContainers = item.querySelectorAll('div');

    // Filtramos los divs que contienen un párrafo dentro
    const textDivs = Array.from(textContainers).filter(div => div.querySelector('p'));

    const commitmentTitle = textDivs[0]?.querySelector('p')?.textContent.trim() || '';
    const commitmentDescription = textDivs[1]?.querySelector('p')?.textContent.trim() || '';
    const buttonText = textDivs[2]?.querySelector('p')?.textContent.trim() || '';

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

    // Título
    const title = document.createElement('h3');
    title.textContent = commitmentTitle;
    if (textDivs[0]) moveInstrumentation(textDivs[0], title);

    // Descripción
    const description = document.createElement('p');
    description.textContent = commitmentDescription;
    if (textDivs[1]) moveInstrumentation(textDivs[1], description);

    // Botón
    const button = document.createElement('a');
    button.classList.add('ulta-corporate-commitment-button');
    button.href = linkUrl;

    const buttonTextElement = document.createElement('p');
    buttonTextElement.textContent = buttonText;
    if (textDivs[2]) moveInstrumentation(textDivs[2], buttonTextElement);

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
