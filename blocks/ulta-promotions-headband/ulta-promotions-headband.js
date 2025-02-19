import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const div = document.createElement('div');
  div.className = 'ulta-promotions-headband-list';

  const slides = [];

  [...block.children].forEach((row) => {
    const a = document.createElement('a');
    a.className = 'ulta-promotions-headband-item';

    const rowChildren = [...row.children];
    rowChildren.forEach((child, index) => {
      if (index === 0 || index === 1) {
        a.append(child);
      } else if (index === rowChildren.length - 1) {
        const url = child.querySelector('p')?.textContent.trim();
        if (url) {
          a.href = url;
        }
      }
    });

    moveInstrumentation(row, a);

    // Crear un contenedor para cada slide
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.append(a);
    slides.push(slide);
  });

  block.textContent = '';

  if (window.innerWidth <= 1024) {
    const swiperContainer = document.createElement('div');
    swiperContainer.className = 'swiper ulta-promotions-headband-swiper';
    swiperContainer.innerHTML = `
      <div class="swiper-wrapper">
        ${slides.map((slide) => slide.outerHTML).join('')}
      </div>
      <div class="swiper-pagination"></div>
    `;
    block.append(swiperContainer);

    // Inicializar Swiper usando la instancia global del CDN
    setTimeout(() => {
      new Swiper('.ulta-promotions-headband-swiper', { // eslint-disable-line no-new, no-undef
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        loop: true,
        slidesPerView: 1,
      });
    }, 0);
  } else {
    slides.forEach((slide) => div.append(slide.firstElementChild));
    block.append(div);
  }
}
