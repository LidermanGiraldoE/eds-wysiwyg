// @ts-ignore
import { h, render } from '@dropins/tools/preact.js';
import CustomCarousel from '../../design-system/molecules/customCarousel/customCarousel.js';
import htm from '../../../../scripts/htm.js';

const html = htm.bind(h);

function buildCarouselCard(group) {
  const desktopImageMarkup = group.children[1] ? group.children[1].outerHTML : '';
  const mobileImageMarkupRaw = group.children[2] ? group.children[2].innerHTML.trim() : '';
  const mobileImageMarkup = mobileImageMarkupRaw ? group.children[2].outerHTML : '';
  const imageMarkup = (window.innerWidth <= 900 && mobileImageMarkup)
    ? mobileImageMarkup
    : desktopImageMarkup;
  const brandText = group.children[3] ? group.children[3].textContent.trim() : '';
  const titleText = group.children[4] ? group.children[4].textContent.trim() : '';
  const descriptionText = group.children[5] ? group.children[5].textContent.trim() : '';
  let linkUrl = group.children[6] ? group.children[6].querySelector('p')?.textContent.trim() || '' : '';
  let targetBlank = false;
  if (group.children.length >= 8) {
    targetBlank = group.children[7].textContent.trim().toLowerCase() === 'true';
  }
  const card = html`
    <div class="carousel-card">
      <div class="carousel-card__image" dangerouslySetInnerHTML=${{ __html: imageMarkup }}></div>
      <p class="carousel-card__brand">${brandText}</p>
      <h4 class="carousel-card__title">${titleText}</h4>
      <p class="carousel-card__description">${descriptionText}</p>
    </div>
  `;
  return linkUrl ? html`
    <a class="carousel-card__link-wrapper" href=${linkUrl} target=${targetBlank ? '_blank' : '_self'}>
      ${card}
    </a>
  ` : card;
}

function buildCarouselCategoryCard(group) {
  // Extrae el ícono. Usamos la imagen de desktop (en este modelo solo se define Icon Image)
  const iconImageMarkup = group.children[1] ? group.children[1].outerHTML : '';

  // Extrae el título de la categoría.
  const titleText = group.children[2] ? group.children[2].textContent.trim() : '';

  // Extrae el Link URL (dentro de un párrafo)
  let linkUrl = group.children[3] ? group.children[3].querySelector('p')?.textContent.trim() || '' : '';

  // Extrae el valor targetBlank (valor booleano) del quinto elemento.
  let targetBlank = false;
  if (group.children.length >= 5) {
    targetBlank = group.children[4].textContent.trim().toLowerCase() === 'true';
  }

  const card = html`
    <div class="carousel-category-card">
      <div class="carousel-category-card__image" dangerouslySetInnerHTML=${{ __html: iconImageMarkup }}></div>
      <span class="carousel-category-card__title">${titleText}</span>
    </div>
  `;

  return linkUrl ? html`
    <a class="carousel-category-card__link-wrapper" href=${linkUrl} target=${targetBlank ? '_blank' : '_self'}>
      ${card}
    </a>
  ` : card;
}


export default function decorate(block) {
  const children = Array.from(block.children);

  const configFields = children.slice(0, 7).map(child =>
    child.textContent.trim()
  );

  const rawSlidesPerView = parseFloat(configFields[0]);
  const slidesPerView = rawSlidesPerView === 0 ? 'auto' : (rawSlidesPerView || 1);
  const spaceBetween = parseFloat(configFields[1]) || 0;
  const navigation = configFields[2].toLowerCase() === 'true';
  const pagination = configFields[3].toLowerCase() === 'true';
  const autoplay = configFields[4].toLowerCase() === 'true';
  const autoplayDelay = parseInt(configFields[5], 10) || 3000;
  const loop = configFields[6].toLowerCase() === 'true';

  // Extrae los slides (a partir del índice 7) y aplica la función según el tipo de tarjeta.
  const slides = children.slice(7).map(child => {
    const temp = document.createElement('div');
    temp.innerHTML = child.outerHTML;
    const group = temp.firstElementChild;
    if (group) {
      const cardType = group.children[0].textContent.trim();
      if (cardType === 'carrousel-card') {
        return buildCarouselCard(group);
      } else if (cardType === 'carrousel-card-category') {
        return buildCarouselCategoryCard(group);
      }
    } else {
      return html`
        <div class="carousel-card" dangerouslySetInnerHTML=${{ __html: child.outerHTML }}></div>
      `;
    }
  });

  const carouselProps = {
    swiperConfigs: {
      slidesPerView: slidesPerView,
      spaceBetween: spaceBetween,
      navigation: navigation ? { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' } : false,
      pagination: pagination ? { el: '.swiper-pagination', clickable: true } : false,
      autoplay: autoplay ? { delay: autoplayDelay, disableOnInteraction: false } : false,
      loop: loop
    },
    slides: slides
  };

  console.log('Carousel Props:', carouselProps);

  block.innerHTML = '';
  render(html`<${CustomCarousel} props=${carouselProps} />`, block);
}
