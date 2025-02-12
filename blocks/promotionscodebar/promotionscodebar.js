import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const div = document.createElement('div');
  div.className = 'promotionscodebar-list';

  const slides = [];

  [...block.children].forEach((row) => {
    const a = document.createElement('a');
    a.className = 'promotionscodebar-item';

    const rowChildren = [...row.children];
    rowChildren.forEach((child, index) => {
      if (index === 0 || index === 1) {
        const p = document.createElement('p');
        p.textContent = child.textContent;
        a.append(p);
        child.remove();
      } else if (index === rowChildren.length - 1) {
        const url = child.querySelector('p')?.textContent.trim();
        if (url) {
          a.href = url;
          child.remove();
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
    swiperContainer.className = 'swiper promotionscodebar-swiper';
    swiperContainer.innerHTML = `
      <div class="swiper-wrapper">
        ${slides.map((slide) => slide.outerHTML).join('')}
      </div>
      <div class="swiper-pagination"></div>
    `;
    block.append(swiperContainer);

    // Inicializar Swiper usando la instancia global del CDN
    setTimeout(() => {
      new Swiper('.promotionscodebar-swiper', { // eslint-disable-line no-new, no-undef
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
