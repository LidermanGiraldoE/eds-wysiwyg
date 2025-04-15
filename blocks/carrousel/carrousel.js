// @ts-ignore
import { h, render } from '@dropins/tools/preact.js';
import CustomCarousel from '../../design-system/molecules/customCarousel/customCarousel.js';
import htm from '../../../../scripts/htm.js';

const html = htm.bind(h);

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

  // Extrae los slides (a partir del índice 7) y los transforma a la estructura deseada.
  const slides = children.slice(7).map(child => {
    const temp = document.createElement('div');
    temp.innerHTML = child.outerHTML;
    const group = temp.firstElementChild;
    if (group && group.children.length >= 6) {
      // Extrae la imagen de escritorio
      const desktopImageMarkup = group.children[0] 
        ? group.children[0].outerHTML 
        : '';

      // Extrae la imagen móvil y verifica si está vacía:
      const mobileImageMarkupRaw = group.children[1] 
        ? group.children[1].innerHTML.trim() 
        : '';
      const mobileImageMarkup = mobileImageMarkupRaw ? group.children[1].outerHTML : '';

      // Usa la imagen móvil si existe contenido; de lo contrario, la desktop.
      const imageMarkup = (window.innerWidth <= 900 && mobileImageMarkup)
        ? mobileImageMarkup
        : desktopImageMarkup;
      
      const brandText = group.children[2] ? group.children[2].textContent.trim() : '';
      const titleText = group.children[3] ? group.children[3].textContent.trim() : '';
      const descriptionText = group.children[4] ? group.children[4].textContent.trim() : '';
      
      let linkUrl = '';
      if (group.children.length >= 6) {
        linkUrl = group.children[5].querySelector('p')?.textContent.trim() || '';
      }
      
      let targetBlank = false;
      if (group.children.length >= 7) {
        targetBlank = group.children[6].textContent.trim().toLowerCase() === 'true';
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
