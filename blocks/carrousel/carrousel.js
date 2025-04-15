// @ts-ignore
import { h, render } from '@dropins/tools/preact.js';
import CustomCarousel from '../../../atoms/customCarousel/customCarousel.js';
import htm from '../../../../scripts/htm.js';

const html = htm.bind(h);

export default function decorate(block) {
  // Definimos un array de slides estáticos (cada slide representa una tarjeta simple)
  const staticSlides = [
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

  // Configuración "quemada" para Swiper
  const carouselData = {
    swiperConfigs: {
      slidesPerView: 'auto',
      spaceBetween: 16,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
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
    slides: staticSlides,
  };

  // Limpia el bloque y renderiza CustomCarousel en él
  block.innerHTML = '';
  render(h(CustomCarousel, { props: carouselData }), block);
}
