// @ts-ignore
import { h, render } from '@dropins/tools/preact.js';
import CustomCarousel from '../../design-system/molecules/customCarousel/customCarousel.js';
import htm from '../../../../scripts/htm.js';

const html = htm.bind(h);

export default function decorate(block) {
  // Extraer los valores de configuración desde los hijos del bloque
  const fields = Array.from(block.children).map(child =>
    child.textContent.trim()
  );

  // Asumimos el siguiente orden:
  // fields[0]: slidesPerView, fields[1]: spaceBetween, fields[2]: navigation,
  // fields[3]: pagination, fields[4]: autoplay, fields[5]: autoplayDelay, fields[6]: loop

  const slidesPerView = parseFloat(fields[0]) || 1;
  const spaceBetween = parseFloat(fields[1]) || 0;
  const navigation = fields[2].toLowerCase() === 'true';
  const pagination = fields[3].toLowerCase() === 'true';
  const autoplay = fields[4].toLowerCase() === 'true';
  const autoplayDelay = parseInt(fields[5], 10) || 3000;
  const loop = fields[6].toLowerCase() === 'true';

  const carouselProps = {
    swiperConfigs: {
      slidesPerView: slidesPerView,
      spaceBetween: spaceBetween,
      navigation: navigation ? { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' } : false,
      pagination: pagination ? { el: '.swiper-pagination', clickable: true } : false,
      autoplay: autoplay ? { delay: autoplayDelay, disableOnInteraction: false } : false,
      loop: loop,
    },
    slides: [
      html`<div
        style=${{
          display: 'flex',
          'justify-content': 'center',
          height: '50px',
        }}
      >
        slide 1
      </div>`,
      html`<div
        style=${{
          display: 'flex',
          'justify-content': 'center',
          height: '50px',
        }}
      >
        slide 2
      </div>`,
      html`<div
        style=${{
          display: 'flex',
          'justify-content': 'center',
          height: '50px',
        }}
      >
        slide 3
      </div>`,
      html`<div
        style=${{
          display: 'flex',
          'justify-content': 'center',
          height: '50px',
        }}
      >
        slide 4
      </div>`,
      html`<div
        style=${{
          display: 'flex',
          'justify-content': 'center',
          height: '50px',
        }}
      >
        slide 5
      </div>`
    ],
  };

  console.log('Carousel Props:', carouselProps);

  block.innerHTML = '';
  render(html`<${CustomCarousel} props=${carouselProps} />`, block);
}
