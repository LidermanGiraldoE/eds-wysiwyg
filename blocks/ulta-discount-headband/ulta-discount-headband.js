import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  console.log('Decorating ulta-discount-headband block', block);

  const items = Array.from(block.children);

  // Extraer valores desde los elementos
  const discountTextElement = items.shift(); // Texto del descuento
  const textColorElement = items.shift(); // Color del texto del descuento
  const discountCodeElement = items.shift(); // Texto del código de descuento
  const linkTextElement = items.shift(); // Texto del link
  const linkUrlElement = items.shift(); // URL del link
  const backgroundColorElement = items.shift(); // Color de fondo

  // Obtener valores de los elementos
  const discountText = discountTextElement?.textContent.trim() || '';
  const textColor = textColorElement?.textContent.trim() || '#CC0058';
  const discountCode = discountCodeElement?.textContent.trim() || '';
  const linkText = linkTextElement?.textContent.trim() || '';
  const linkUrl = linkUrlElement?.querySelector('a')?.href || '#';
  const backgroundColor = backgroundColorElement?.textContent.trim() || '#FBF1F3';

  // Crear el contenedor principal del cintillo de descuento
  const discountContent = document.createElement('div');
  discountContent.classList.add('ulta-discount-headband');
  discountContent.style.backgroundColor = backgroundColor;

  // Manejo del texto del descuento
  const discountTextDiv = document.createElement('div');
  discountTextDiv.classList.add('ulta-discount-headband-text');
  discountTextDiv.style.color = textColor;
  discountTextDiv.textContent = discountText;
  moveInstrumentation(discountTextElement, discountTextDiv);

  // Manejo del código de descuento
  const discountCodeDiv = document.createElement('div');
  discountCodeDiv.classList.add('ulta-discount-headband-code');
  discountCodeDiv.textContent = discountCode;
  moveInstrumentation(discountCodeElement, discountCodeDiv);

  // Manejo del enlace
  const discountLink = document.createElement('a');
  discountLink.classList.add('ulta-discount-headband-link');
  discountLink.href = linkUrl;
  discountLink.textContent = linkText;
  moveInstrumentation(linkTextElement, discountLink);

  // Estructura final del bloque
  discountContent.appendChild(discountTextDiv);
  discountContent.appendChild(discountCodeDiv);
  discountContent.appendChild(discountLink);

  // Reemplazar el contenido original del bloque con la nueva estructura
  block.innerHTML = '';
  block.appendChild(discountContent);
}
