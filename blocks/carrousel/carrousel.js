// @ts-ignore
import { h, render } from '@dropins/tools/preact.js';
import CustomCarousel from '../../design-system/molecules/customCarousel/customCarousel.js';
import CustomCards from '../../design-system/atoms/customCards/customCards.js';
import htm from '../../../../scripts/htm.js';
import { moveInstrumentation } from '../../../../scripts/scripts.js';
 
const html = htm.bind(h);
let promoFound = false;

function buildCarouselCard(group) {
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

  const card = html`
    <div
      class="carousel-card"
      oncreate=${el => moveInstrumentation(el, { component: 'carousel-card', title: titleText })}
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
        oncreate=${el => moveInstrumentation(el, { component: 'carousel-card-link', title: titleText })}
      >
        ${card}
      </a>
    `
    : card;
}

function buildCarouselCategoryCard(group) {
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

  const card = html`
    <div
      class="carousel-category-card"
      oncreate=${el => moveInstrumentation(el, { component: 'carousel-category-card', title: titleText })}
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
        oncreate=${el => moveInstrumentation(el, { component: 'carousel-category-card-link', title: titleText })}
      >
        ${card}
      </a>
    `
    : card;
}

function buildCarouselCardPromo(group) {
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

  const card = html`
    <${CustomCards}
      imageSrc=${imageSrc}
      imageAlt="${altText}"
      labelText=${tagText}
      titleText=${titleText}
      bodyText=${descriptionText}
      linkText=${buttonText}
      linkUrl=${linkUrl}
      showUrgencyTag=${!!urgencyTag}
      urgencyTagText=${urgencyTag}
      clickableWholeCard=${false}
      cardVariant="horizontal"
      oncreate=${el => moveInstrumentation(el, { component: 'carousel-card-promo', title: titleText })}
    />
  `;

  return card;
}

export default function decorate(block) {
  const children = Array.from(block.children).filter(child => child.nodeType === 1);
  const configFields = children.slice(0, 7).map(child => child.textContent.trim());

  const rawSlidesPerView = parseFloat(configFields[0]);
  const slidesPerView = rawSlidesPerView === 0 ? 'auto' : (rawSlidesPerView || 1);
  const spaceBetween = parseFloat(configFields[1]) || 0;
  const navigation = configFields[2].toLowerCase() === 'true';
  const pagination = configFields[3].toLowerCase() === 'true';
  const autoplay = configFields[4].toLowerCase() === 'true';
  const autoplayDelay = parseInt(configFields[5], 10) || 3000;
  const loop = configFields[6].toLowerCase() === 'true';

  const slides = children.slice(7).map(child => {
    const temp = document.createElement('div');
    temp.innerHTML = child.outerHTML;
    const group = temp.firstElementChild;
    if (group) {
      const cardType = group.children[0].textContent.trim();
      switch (cardType) {
        case 'carrousel-card':
          return buildCarouselCard(group);
        case 'carrousel-card-category':
          return buildCarouselCategoryCard(group);
        case 'carrousel-card-promo':
          return buildCarouselCardPromo(group);
        default:
          return html`<div class="carousel-card" dangerouslySetInnerHTML=${{ __html: child.outerHTML }}></div>`;
      }
    }
    return html`<div class="carousel-card" dangerouslySetInnerHTML=${{ __html: child.outerHTML }}></div>`;
  });

  const centeredSlides = (window.innerWidth >= 901 && promoFound);

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

  console.log('Carousel Props:', carouselProps);
  promoFound = false;

  block.innerHTML = '';
  render(html`<${CustomCarousel} props=${carouselProps} />`, block);
}
