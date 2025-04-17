// @ts-ignore
import { h, render } from '@dropins/tools/preact.js';
import CustomCarousel from '../../design-system/molecules/customCarousel/customCarousel.js';
import CustomCards from '../../design-system/atoms/customCards/customCards.js';
import htm from '../../../../scripts/htm.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const html = htm.bind(h);
let promoFound = false;

function buildCarouselCard(group, slideIndex) {
  const desktopImageMarkup = group.children[1] ? group.children[1].outerHTML : '';
  const mobileImageMarkupRaw = group.children[2] ? group.children[2].innerHTML.trim() : '';
  const mobileImageMarkup = mobileImageMarkupRaw ? group.children[2].outerHTML : '';
  const altText = group.children[3] ? group.children[3].textContent.trim() : 'Imagen promocional';
  const desktopImageWithAlt = desktopImageMarkup.replace('<img', `<img alt="${altText}"`);
  const mobileImageWithAlt = mobileImageMarkup.replace('<img', `<img alt="${altText}"`);
  const imageMarkup = (window.innerWidth <= 900 && mobileImageMarkup)
    ? mobileImageWithAlt
    : desktopImageWithAlt;

  const brandText = group.children[4] ? group.children[4].textContent.trim() : '';
  const titleText = group.children[5] ? group.children[5].textContent.trim() : '';
  const descriptionText = group.children[6] ? group.children[6].textContent.trim() : '';

  let linkUrl = group.children[7]
    ? group.children[7].querySelector('p')?.textContent.trim() || ''
    : '';
  let targetBlank = false;
  if (group.children.length >= 9) {
    targetBlank = group.children[8].textContent.trim().toLowerCase() === 'true';
  }

  const cardHtml = html`
    <div
      class="carousel-card"
      data-slide-index="${slideIndex}"
    >
      <div class="carousel-card__image" dangerouslySetInnerHTML=${{ __html: imageMarkup }}></div>
      <p class="carousel-card__brand">${brandText}</p>
      <p class="carousel-card__title">${titleText}</p>
      <p class="carousel-card__description">${descriptionText}</p>
    </div>
  `;

  return linkUrl
    ? html`
      <a
        class="carousel-card__link-wrapper"
        aria-label=${titleText}
        href=${linkUrl}
        target=${targetBlank ? '_blank' : '_self'}
        data-slide-index="${slideIndex}"
      >
        ${cardHtml}
      </a>
    `
    : cardHtml;
}

function buildCarouselCategoryCard(group, slideIndex) {
  console.log('buildCarouselCategoryCard', group);
  const iconImageMarkup = group.children[1] ? group.children[1].outerHTML : '';
  const altText = group.children[2] ? group.children[2].textContent.trim() : 'Imagen de categoría';
  const iconImageWithAlt = iconImageMarkup.replace('<img', `<img alt="${altText}"`);
  const titleText = group.children[3] ? group.children[3].textContent.trim() : '';

  let linkUrl = group.children[4]
    ? group.children[4].querySelector('p')?.textContent.trim() || ''
    : '';
  let targetBlank = false;
  if (group.children.length >= 6) {
    targetBlank = group.children[5].textContent.trim().toLowerCase() === 'true';
  }

  const cardHtml = html`
    <div
      class="carousel-category-card"
      data-slide-index="${slideIndex}"
    >
      <div class="carousel-category-card__image" dangerouslySetInnerHTML=${{ __html: iconImageWithAlt }}></div>
      <span class="carousel-category-card__title">${titleText}</span>
    </div>
  `;

  return linkUrl
    ? html`
      <a
        class="carousel-category-card__link-wrapper"
        aria-label=${titleText}
        href=${linkUrl}
        target=${targetBlank ? '_blank' : '_self'}
        data-slide-index="${slideIndex}"
      >
        ${cardHtml}
      </a>
    `
    : cardHtml;
}

function buildCarouselCardPromo(group, slideIndex) {
  promoFound = true;

  let imageSrc = '';
  if (group.children[1]) {
    const imgEl = group.children[1].querySelector('img');
    imageSrc = imgEl ? imgEl.getAttribute('src') : '';
  }
  const urgencyTag = group.children[2] ? group.children[2].textContent.trim() : '';
  const tagText = group.children[3] ? group.children[3].textContent.trim() : '';
  const titleText = group.children[4] ? group.children[4].textContent.trim() : '';
  const descriptionText = group.children[5] ? group.children[5].textContent.trim() : '';
  const buttonText = group.children[6] ? group.children[6].textContent.trim() : '';

  let linkUrl = '';
  if (group.children[7]) {
    linkUrl = group.children[7].querySelector('p')?.textContent.trim() || '';
  }
  const targetBlank = group.children[8]
    ? group.children[8].textContent.trim().toLowerCase() === 'true'
    : false;

  return html`
    <${CustomCards}
      imageSrc=${imageSrc}
      imageAlt=""
      labelText=${tagText}
      titleText=${titleText}
      bodyText=${descriptionText}
      linkText=${buttonText}
      linkUrl=${linkUrl}
      showUrgencyTag=${!!urgencyTag}
      urgencyTagText=${urgencyTag}
      clickableWholeCard=${false}
      cardVariant="horizontal"
      data-slide-index="${slideIndex}"
    />
  `;
}

export default function decorate(block) {
  // Guardamos los elementos originales con atributos data-aue-*
  const allChildren = Array.from(block.children).filter(c => c.nodeType === 1);
  const configChildren = allChildren.slice(0, 7);
  const originalSlides = allChildren.slice(7);

  // Leemos configuración
  const [rawSlidesPerView, rawSpaceBetween, rawNav, rawPag, rawAuto, rawDelay, rawLoop] =
    configChildren.map(c => c.textContent.trim());
  const slidesPerView = parseFloat(rawSlidesPerView) === 0 ? 'auto' : (parseFloat(rawSlidesPerView) || 1);
  const spaceBetween = parseFloat(rawSpaceBetween) || 0;
  const navigation = rawNav.toLowerCase() === 'true';
  const pagination = rawPag.toLowerCase() === 'true';
  const autoplay = rawAuto.toLowerCase() === 'true';
  const autoplayDelay = parseInt(rawDelay, 10) || 3000;
  const loop = rawLoop.toLowerCase() === 'true';

  // Construimos slides con índices para luego instrumentar
  const slides = originalSlides.map((child, idx) => {
    const temp = document.createElement('div');
    temp.innerHTML = child.outerHTML;
    const group = temp.firstElementChild;
    if (!group) return html`<div />`;
    const cardType = group.children[0].textContent.trim();
    switch (cardType) {
      case 'carrousel-card':
        return buildCarouselCard(group, idx);
      case 'carrousel-card-category':
        return buildCarouselCategoryCard(group, idx);
      case 'carrousel-card-promo':
        return buildCarouselCardPromo(group, idx);
      default:
        return html`<div class="carousel-card" data-slide-index="${idx}" dangerouslySetInnerHTML=${{ __html: child.outerHTML }} />`;
    }
  });

  const centeredSlides = window.innerWidth >= 901 && promoFound;
  const swiperConfigs = {
    slidesPerView,
    spaceBetween,
    navigation: navigation ? { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' } : false,
    pagination: pagination ? { el: '.swiper-pagination', clickable: true } : false,
    autoplay: autoplay ? { delay: autoplayDelay, disableOnInteraction: false } : false,
    loop,
    centeredSlides
  };
  const carouselProps = { swiperConfigs, slides };

  // Renderizamos el carrusel
  block.innerHTML = '';
  render(html`<${CustomCarousel} props=${carouselProps} />`, block);

  // Movemos los atributos data-aue-* y data-richtext-* de los originales a los generados
  originalSlides.forEach((orig, idx) => {
    const slideEl = block.querySelector(`[data-slide-index="${idx}"]`);
    if (slideEl) {
      moveInstrumentation(orig, slideEl);
      slideEl.removeAttribute('data-slide-index');
    }
  });
  // Reset flag
  promoFound = false;
}
