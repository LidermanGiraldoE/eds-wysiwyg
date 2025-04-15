// @ts-ignore
import { h, render } from '@dropins/tools/preact.js';
import CustomCarousel from '../../design-system/molecules/customCarousel/customCarousel.js';
import htm from '../../../../scripts/htm.js';

const html = htm.bind(h);

export default function decorate(block) {
  // Definición de slides (cada slide es un string de HTML)
  const slides = [
    `<div style="display: flex; justify-content: center; height: 50px;">
         Card 1
     </div>`,
    `<div style="display: flex; justify-content: center; height: 50px;">
         Card 2
     </div>`,
    `<div style="display: flex; justify-content: center; height: 50px;">
         Card 3
     </div>`,
    `<div style="display: flex; justify-content: center; height: 50px;">
         Card 4
     </div>`
  ];

  // Configuración del Swiper (propiedades "quemadas")
  const carouselProps = {
    swiperConfigs: {
      slidesPerView: 'auto',
      spaceBetween: 16,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      loop: true,
    },
    slides: slides,
  };

  // Limpiamos el bloque y renderizamos el CustomCarousel
  block.innerHTML = '';
  render(html`<${CustomCarousel} props=${carouselProps} />`, block);
}
