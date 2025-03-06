import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const bgColor = block.dataset.backgroundColor || '#f6f6f6';
  block.style.backgroundColor = bgColor;

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('ulta-cintillo-descuento');

  const slides = [];

  [...block.children].forEach((row) => {
    const cells = row.children;
    if (cells.length < 3) return; // Asegurar que hay suficientes celdas

    const title = cells[0]?.textContent.trim() || '';
    const description = cells[1]?.textContent.trim() || '';
    const discountCode = cells[2]?.textContent.trim() || '';
    const linkElement = cells[3]?.querySelector('a');
    const linkUrl = linkElement ? linkElement.href : '';
    const linkText = linkElement ? linkElement.textContent.trim() : 'Ver detalles';

    const content = document.createElement('div');
    content.classList.add('ulta-cintillo-descuento-item');

    content.innerHTML = `
      <span class="ulta-cintillo-descuento-text">${title}</span>
      <span class="ulta-cintillo-descuento-description">${description}</span>
      <span class="ulta-cintillo-descuento-code">${discountCode}</span>
      ${linkUrl ? `<a href="${linkUrl}" class="ulta-cintillo-descuento-link">${linkText}</a>` : ''}
    `;

    if (typeof moveInstrumentation === 'function') {
      moveInstrumentation(row, content);
    }

    slides.push(content);
  });

  if (slides.length > 0) {
    slides.forEach((slide) => contentWrapper.append(slide));
    block.innerHTML = '';
    block.append(contentWrapper);
  }
}
