import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
    const bgColor = block.dataset.backgroundColor || '#f6f6f6';
    block.style.backgroundColor = bgColor;

    let contentWrapper = document.createElement('div');
    contentWrapper.classList.add('cintillo-descuento');
    
    let slides = [];
    
    [...block.children].forEach((row) => {
        const title = row.children[0]?.textContent.trim() || '';
        const description = row.children[1]?.textContent.trim() || '';
        const discountCode = row.children[2]?.textContent.trim() || '';
        const linkElement = row.children[3]?.querySelector('a');
        const linkUrl = linkElement ? linkElement.href : '';
        const linkText = linkElement ? linkElement.textContent.trim() : 'Ver detalles';

        const content = document.createElement('div');
        content.classList.add('cintillo-descuento-item');
        
        content.innerHTML = `
            <span class="cintillo-descuento-text">${title}</span>
            <span class="cintillo-descuento-description">${description}</span>
            <span class="cintillo-descuento-code">${discountCode}</span>
            ${linkUrl ? `<a href="${linkUrl}" class="cintillo-descuento-link">${linkText}</a>` : ''}
        `;

        moveInstrumentation(row, content);
        slides.push(content);
    });
    
    slides.forEach((slide) => contentWrapper.append(slide));
    block.innerHTML = '';
    block.append(contentWrapper);
}
