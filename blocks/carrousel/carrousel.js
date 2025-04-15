// @ts-ignore
import { h, render } from '@dropins/tools/preact.js';
import CustomCarousel from '../../design-system/molecules/customCarousel/customCarousel.js';
import htm from '../../../../scripts/htm.js';

const html = htm.bind(h);

export default function decorate(block) {
  // Convierte todos los hijos del bloque en un arreglo.
  const children = Array.from(block.children);

  // Suponemos que los primeros 7 hijos contienen la configuración:
  // [0]: slidesPerView, [1]: spaceBetween, [2]: navigation,
  // [3]: pagination, [4]: autoplay, [5]: autoplayDelay, [6]: loop.
  const configFields = children.slice(0, 7).map(child => child.textContent.trim());

  const rawSlidesPerView = parseFloat(configFields[0]);
  const slidesPerView = rawSlidesPerView === 0 ? 'auto' : (rawSlidesPerView || 1);
  const spaceBetween = parseFloat(configFields[1]) || 0;
  const navigation = configFields[2].toLowerCase() === 'true';
  const pagination = configFields[3].toLowerCase() === 'true';
  const autoplay = configFields[4].toLowerCase() === 'true';
  const autoplayDelay = parseInt(configFields[5], 10) || 3000;
  const loop = configFields[6].toLowerCase() === 'true';

  // Los elementos restantes son los items del carrusel.
  // Cada hijo representa un "carousel item" configurado desde AEM.
  /* const slides = children.slice(7).map(child => html`${child.outerHTML}`); */
  const slides = children.slice(7).map(child => html` 
    <div className=${['star-icon-container-filled'].join(' ')}dangerouslySetInnerHTML=${{ __html: child.outerHTML }}></div>`);

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
