import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const bgColor = block.dataset.backgroundColor || '#f6f6f6';
  block.style.backgroundColor = bgColor;

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('ulta-cintillo-descuento');

  [...block.children].forEach((row) => {
    const promoText = row.querySelector('[data-name="promo_text"]')?.textContent.trim() || '';
    const discountText = row.querySelector('[data-name="discount_text"]')?.textContent.trim() || '';
    const couponCode = row.querySelector('[data-name="coupon_code"]')?.textContent.trim() || '';
    const linkElement = row.querySelector('[data-name="cta_link"] a');
    const linkUrl = linkElement ? linkElement.href : '';
    const linkText = linkElement ? linkElement.textContent.trim() : 'Ver detalles';

    const content = document.createElement('div');
    content.classList.add('ulta-cintillo-descuento-item');

    content.innerHTML = `
      <span class="ulta-cintillo-descuento-text">${promoText} ${discountText}</span>
      <span class="ulta-cintillo-descuento-code">${couponCode}</span>
      ${linkUrl ? `<a href="${linkUrl}" class="ulta-cintillo-descuento-link">${linkText}</a>` : ''}
    `;

    if (typeof moveInstrumentation === 'function') {
      moveInstrumentation(row, content);
    }

    contentWrapper.append(content);
  });

  block.innerHTML = '';
  block.append(contentWrapper);
}
