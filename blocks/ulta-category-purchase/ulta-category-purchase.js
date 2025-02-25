/* global Swiper */

export default function decorate(block) {
  const items = Array.from(block.children);
  const titleElement = items.shift();
  const titleText = titleElement ? titleElement.querySelector('p')?.textContent || 'Compra por categoría' : 'Compra por categoría';

  // Inicialización de Swiper
  function initializeSwiper() {
    if (typeof Swiper !== 'undefined') {
      const swiperInstance = new Swiper('.ulta-category-purchase__swiper', {
        slidesPerView: 'auto',
        spaceBetween: 15,
        navigation: {
          nextEl: '.ulta-category-purchase__button--next',
          prevEl: '.ulta-category-purchase__button--prev',
        },
      });
      return swiperInstance;
    }
    return null;
  }

  // Contenedor principal de Swiper
  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('ulta-category-purchase__swiper', 'swiper');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('ulta-category-purchase__wrapper', 'swiper-wrapper');

  // Crear los slides
  items.forEach((item) => {
    const categoryName = item.querySelector('p')?.textContent || '';
    const imgElement = item.querySelector('img');
    const imgSrc = imgElement?.src || '';
    const imgAlt = imgElement?.alt || categoryName;
    const linkElement = item.querySelector('a');
    const linkUrl = linkElement?.href || '#';

    const slide = document.createElement('div');
    slide.classList.add('ulta-category-purchase__slide', 'swiper-slide');

    slide.innerHTML = `
          <a href="${linkUrl}" class="ulta-category-purchase__item">
              <div class="ulta-category-purchase__image">
                  <img src="${imgSrc}" alt="${imgAlt}">
              </div>
              <p class="ulta-category-purchase__name">${categoryName}</p>
          </a>
        `;

    swiperWrapper.appendChild(slide);
  });

  // Botones de navegación
  const createNavButton = (className, imgAlt) => {
    const button = document.createElement('div');
    button.classList.add('ulta-category-purchase__button', className, `swiper-button-${className.split('--')[1]}`);
    button.innerHTML = `<img src="https://author-p34631-e1321407.adobeaemcloud.com/content/dam/learning-wysiwyg-con-edge-delivery-services/icons/arrow.svg" alt="${imgAlt}" class="ulta-category-purchase__arrow">`;
    return button;
  };

  const prevButton = createNavButton('ulta-category-purchase__button--prev', 'Previous');
  const nextButton = createNavButton('ulta-category-purchase__button--next', 'Next');

  // Título del bloque
  const titleContainer = document.createElement('div');
  titleContainer.classList.add('ulta-category-purchase__title');
  titleContainer.innerHTML = `<h2>${titleText}</h2>`;

  // Armar la estructura
  swiperContainer.appendChild(swiperWrapper);
  block.innerHTML = '';
  block.append(titleContainer, prevButton, swiperContainer, nextButton);
  block.classList.add('ulta-category-purchase');

  // Inicializar Swiper directamente
  initializeSwiper();
}
