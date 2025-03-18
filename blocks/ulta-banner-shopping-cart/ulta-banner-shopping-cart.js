import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  console.log('Decorating cart-purchase-banner block', block);

  const items = Array.from(block.children);

  // Extraer valores desde los elementos
  const imageBannerElement = items.shift(); // Imagen del Banner
  const textColorElement = items.shift(); // Color del texto
  const descriptionElement = items.shift(); // Descripción
  const linkTextElement = items.shift(); // Texto del link
  const linkUrlElement = items.shift(); // URL del link
  const logoArrowElement = items.shift(); // Imagen del logo de la flecha

  // Obtener valores directamente desde el contenido del AEM
  const imageBannerSrc = imageBannerElement?.querySelector('img')?.src || '';
  const textColor = textColorElement?.textContent.trim() || '';
  const description = descriptionElement?.innerHTML || '';
  const linkText = linkTextElement?.innerHTML || '';
  const linkUrl = linkUrlElement?.querySelector('a')?.href || '';
  const logoArrowSrc = logoArrowElement?.querySelector('img')?.src || '';

  // Crear el contenedor principal del banner
  const bannerContent = document.createElement('div');
  bannerContent.classList.add('cart-purchase-banner');
  bannerContent.style.color = textColor;

  // Manejo de la imagen del banner
  const bannerImage = document.createElement('img');
  bannerImage.classList.add('cart-purchase-banner-image');
  bannerImage.src = imageBannerSrc;
  bannerContent.appendChild(bannerImage);

  // Manejo de la descripción
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('cart-purchase-banner-description');
  descriptionDiv.innerHTML = description;
  bannerContent.appendChild(descriptionDiv);

  // Manejo del enlace
  const bannerLink = document.createElement('a');
  bannerLink.classList.add('cart-purchase-banner-link');
  bannerLink.href = linkUrl;
  bannerLink.innerHTML = linkText;
  bannerContent.appendChild(bannerLink);

  // Manejo de la imagen de la flecha
  const logoArrowImage = document.createElement('img');
  logoArrowImage.classList.add('cart-purchase-banner-arrow');
  logoArrowImage.src = logoArrowSrc;
  bannerContent.appendChild(logoArrowImage);

  // Reemplazar el contenido original del bloque con la nueva estructura
  block.innerHTML = '';
  block.appendChild(bannerContent);
}
