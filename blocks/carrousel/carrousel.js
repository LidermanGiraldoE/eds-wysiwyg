// @ts-ignore
import { h, render } from '@dropins/tools/preact.js';
import CustomCarousel from '../../design-system/molecules/customCarousel/customCarousel.js';
import CustomCards from '../../design-system/atoms/customCards/customCards.js';
import htm from '../../../../scripts/htm.js';
 
const html = htm.bind(h);
 
let promoFound = false; // Bandera para detectar si se encontró al menos una tarjeta promo
 
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
    <div class="carousel-card">
      <div class="carousel-card__image" dangerouslySetInnerHTML=${{ __html: imageMarkup }}></div>
      <p class="carousel-card__brand">${brandText}</p>
      <h4 class="carousel-card__title">${titleText}</h4>
      <p class="carousel-card__description">${descriptionText}</p>
    </div>
  `;
  return linkUrl ? html`
    <a class="carousel-card__link-wrapper" aria-label=${titleText} href=${linkUrl} target=${targetBlank ? '_blank' : '_self'}>
      ${card}
    </a>
  ` : card;
}
 
function buildCarouselCategoryCard(group) {
  const iconImageMarkup = group.children[1] ? group.children[1].outerHTML : '';
  const titleText = group.children[2] ? group.children[2].textContent.trim() : '';
  let linkUrl = group.children[3]
    ? group.children[3].querySelector('p')?.textContent.trim() || ''
    : '';
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
    <a class="carousel-category-card__link-wrapper" aria-label=${titleText} href=${linkUrl} target=${targetBlank ? '_blank' : '_self'}>
      ${card}
    </a>
  ` : card;
}
 
function buildCarouselCardPromo(group) {
  // Se marca que se encontró una tarjeta promo
  promoFound = true;
 
  let imageSrc = "";
  if (group.children[1]) {
    const imgEl = group.children[1].querySelector('img');
    imageSrc = imgEl ? imgEl.getAttribute('src') : "";
  }
  
  const urgencyTag = group.children[2] ? group.children[2].textContent.trim() : "";
  const tagText = group.children[3] ? group.children[3].textContent.trim() : "";
  const titleText = group.children[4] ? group.children[4].textContent.trim() : "";
  const descriptionText = group.children[5] ? group.children[5].textContent.trim() : "";
  const buttonText = group.children[6] ? group.children[6].textContent.trim() : "";
  let linkUrl = "";
  if (group.children[7]) {
    linkUrl = group.children[7].querySelector('p')?.textContent.trim() || "";
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
    />
  `;
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
      if (cardType === 'carrousel-card') {
        return buildCarouselCard(group);
      } else if (cardType === 'carrousel-card-category') {
        return buildCarouselCategoryCard(group);
      } else if (cardType === 'carrousel-card-promo') {
        return buildCarouselCardPromo(group);
      } else {
        return html`
          <div class="carousel-card" dangerouslySetInnerHTML=${{ __html: child.outerHTML }}></div>
        `;
      }
    } else {
      return html`
        <div class="carousel-card" dangerouslySetInnerHTML=${{ __html: child.outerHTML }}></div>
      `;
    }
  });
 
  const centeredSlides = (window.innerWidth >= 901 && promoFound) ? true : false;
 
  const swiperConfigs = {
    slidesPerView: slidesPerView,
    spaceBetween: spaceBetween,
    navigation: navigation ? { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' } : false,
    pagination: pagination ? { el: '.swiper-pagination', clickable: true } : false,
    autoplay: autoplay ? { delay: autoplayDelay, disableOnInteraction: false } : false,
    loop: loop,
    centeredSlides: centeredSlides
  };
 
  const carouselProps = {
    swiperConfigs: swiperConfigs,
    slides: slides
  };
 
  console.log('Carousel Props:', carouselProps);
  promoFound = false;
 
  block.innerHTML = '';
  render(html`<${CustomCarousel} props=${carouselProps} />`, block);
}