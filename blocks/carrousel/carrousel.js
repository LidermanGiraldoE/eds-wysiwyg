// @ts-ignore
import { h, render } from '@dropins/tools/preact.js';
import CustomCarousel from '../../design-system/molecules/customCarousel/customCarousel.js';
import CustomCards from '../../design-system/atoms/customCards/customCards.js'
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

function buildCarouselCardPromo(group) {
  // Extrae la imagen del índice 1
  let imageSrc = "";
  if (group.children[1]) {
    const imgEl = group.children[1].querySelector('img');
    imageSrc = imgEl ? imgEl.getAttribute('src') : "";
  }
  
  // Extrae el Urgency Tag (índice 2)
  const urgencyTag = group.children[2] ? group.children[2].textContent.trim() : "";
  
  // Extrae la etiqueta (tag) (índice 3)
  const tagText = group.children[3] ? group.children[3].textContent.trim() : "";
  
  // Extrae el título (índice 4)
  const titleText = group.children[4] ? group.children[4].textContent.trim() : "";
  
  // Extrae la descripción (índice 5)
  const descriptionText = group.children[5] ? group.children[5].textContent.trim() : "";
  
  // Extrae el Button Text (índice 6)
  const buttonText = group.children[6] ? group.children[6].textContent.trim() : "";
  
  // Extrae el Link URL, se espera que el <p> esté dentro del contenedor en índice 7
  let linkUrl = "";
  if (group.children[7]) {
    linkUrl = group.children[7].querySelector('p')?.textContent.trim() || "";
  }
  
  // Extrae el valor de targetBlank (índice 8)
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
      showUrgencyTag=${urgencyTag ? true : false}
      urgencyTagText=${urgencyTag}
      clickableWholeCard=${false}
      cardVariant="horizontal"
    />
  `;
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
  const centeredSlides = configFields[7].toLowerCase() === 'true';

  // Extrae los slides (a partir del índice 7) y aplica la función según el tipo de tarjeta.
  const slides = children.slice(8).map(child => {
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
      loop: loop,
      centeredSlides: centeredSlides
    },
    slides: slides
  };

  console.log('Carousel Props:', carouselProps);

  block.innerHTML = '';
  render(html`<${CustomCarousel} props=${carouselProps} />`, block);
}
