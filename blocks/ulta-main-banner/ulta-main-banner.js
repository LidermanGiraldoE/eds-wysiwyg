export default function decorate(block) {
  block.classList.add('ulta-banner');

  const [imageContainer, taglineContainer, titleContainer, descriptionContainer] = block.children;

  if (imageContainer) {
    imageContainer.classList.add('ulta-banner-wrapper');
    const img = imageContainer.querySelector('img');
    if (img) img.classList.add('ulta-banner-img');
  }

  const textsContainer = document.createElement('div');
  textsContainer.classList.add('ulta-banner-texts');

  if (taglineContainer) {
    taglineContainer.classList.add('ulta-banner-tagline');
    textsContainer.appendChild(taglineContainer);
  }

  if (titleContainer) {
    titleContainer.classList.add('ulta-banner-title');
    textsContainer.appendChild(titleContainer);
  }

  if (descriptionContainer) {
    descriptionContainer.classList.add('ulta-banner-description');
    textsContainer.appendChild(descriptionContainer);
  }

  block.appendChild(textsContainer);
}
