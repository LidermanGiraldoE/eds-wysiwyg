import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const items = Array.from(block.children);

  // Extraer valores desde los elementos
  const discountTextElement = items.shift(); // Texto del descuento
  const textColorElement = items.shift(); // Color del texto del descuento
  const discountCodeElement = items.shift(); // Texto del código de descuento
  const linkTextElement = items.shift(); // Texto del link
  const linkUrlElement = items.shift(); // URL del link
  const backgroundColorElement = items.shift(); // Color de fondo

  // Obtener valores directamente desde el contenido del AEM
  const discountText = discountTextElement?.innerHTML || '';
  const textColor = textColorElement?.textContent.trim() || '';
  const discountCode = discountCodeElement?.innerHTML || '';
  const linkText = linkTextElement?.innerHTML || '';
  const linkUrl = linkUrlElement?.querySelector('a')?.href || '';
  const backgroundColor = backgroundColorElement?.textContent.trim() || '';

  // Asignar el background color a la clase existente
  block.closest('.discount-headband')?.style.setProperty('background-color', backgroundColor);

  // Crear el contenedor principal del cintillo de descuento
  const discountContent = document.createElement('div');
  discountContent.classList.add('discount-headband-content');
  discountContent.style.color = textColor;

  // Crear un contenedor que agrupe el texto del descuento y el código
  const discountInfoContainer = document.createElement('div');
  discountInfoContainer.classList.add('discount-headband-info');

  // Manejo del texto del descuento
  const discountTextDiv = document.createElement('div');
  discountTextDiv.classList.add('discount-headband-text');
  discountTextDiv.style.color = textColor;
  discountTextDiv.innerHTML = discountText;
  moveInstrumentation(discountTextElement, discountTextDiv);

  // Manejo del código de descuento
  const discountCodeDiv = document.createElement('div');
  discountCodeDiv.classList.add('discount-headband-code');
  discountCodeDiv.innerHTML = discountCode;
  moveInstrumentation(discountCodeElement, discountCodeDiv);

  // Añadir al contenedor de información
  discountInfoContainer.appendChild(discountTextDiv);
  discountInfoContainer.appendChild(discountCodeDiv);

  // Manejo del enlace
  const discountLink = document.createElement('a');
  discountLink.classList.add('discount-headband-link');
  discountLink.href = linkUrl;
  discountLink.innerHTML = linkText;
  moveInstrumentation(linkTextElement, discountLink);

  // Estructura final del bloque
  discountContent.appendChild(discountInfoContainer);
  discountContent.appendChild(discountLink);

  // Reemplazar el contenido original del bloque con la nueva estructura
  block.innerHTML = '';
  block.appendChild(discountContent);
}
