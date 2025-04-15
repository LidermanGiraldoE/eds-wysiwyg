// @ts-ignore
import { h, render } from '@dropins/tools/preact.js';
import CustomCarousel from '../../design-system/molecules/customCarousel/customCarousel.js';
import htm from '../../../../scripts/htm.js';

const html = htm.bind(h);

export default function decorate(block) {
  // Convierte todos los hijos del bloque en un arreglo.
  const children = Array.from(block.children);

  // Se asume que los primeros 7 hijos contienen la configuración:
  // [0]: slidesPerView, [1]: spaceBetween, [2]: navigation,
  // [3]: pagination, [4]: autoplay, [5]: autoplayDelay, [6]: loop.
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
  // Asumimos que cada "carousel item" tiene la siguiente estructura interna:
  // [0] Desktop Image
  // [1] Mobile Image (se ignora en este ejemplo, se usa la de desktop)
  // [2] Tag (marca)
  // [3] Title
  // [4] Description
  // [5] Link URL (obligatorio para envolver la tarjeta)
  // [6] TargetBlank (booleano, "true" o "false")
  const slides = children.slice(7).map(child => {
    const temp = document.createElement('div');
    temp.innerHTML = child.outerHTML;
    const group = temp.firstElementChild;

    if (group && group.children.length >= 6) {
      // Extraemos la información
      const imageMarkup = group.children[0] ? group.children[0].outerHTML : '';
      const brandText = group.children[2] ? group.children[2].textContent.trim() : '';
      const titleText = group.children[3] ? group.children[3].textContent.trim() : '';
      const descriptionText = group.children[4] ? group.children[4].textContent.trim() : '';

      // El Link URL se espera en el sexto hijo (índice 5)
      let linkUrl = '';
      if (group.children.length >= 6) {
        linkUrl = group.children[5].querySelector('p')?.textContent.trim() || '';
      }

      // Se extrae el valor de targetBlank del séptimo hijo (índice 6) si existe.
      let targetBlank = false;
      if (group.children.length >= 7) {
        targetBlank = group.children[6].textContent.trim().toLowerCase() === 'true';
      }

      // Se construye la tarjeta
      const card = html`
        <div class="carousel-card">
          <div class="carousel-card__image" dangerouslySetInnerHTML=${{ __html: imageMarkup }}></div>
          <p class="carousel-card__brand">${brandText}</p>
          <h4 class="carousel-card__title">${titleText}</h4>
          <p class="carousel-card__description">${descriptionText}</p>
        </div>
      `;

      // Si se extrajo un link, envolvemos la tarjeta completa en un <a> 
      // usando target="_blank" si targetBlank es true.
      return linkUrl ? html`
        <a class="carousel-card__link-wrapper" href=${linkUrl} target=${targetBlank ? '_blank' : '_self'}>
          ${card}
        </a>
      ` : card;
    } else {
      // Si la estructura no es la esperada, retorna el contenido original envuelto en .carousel-card.
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
