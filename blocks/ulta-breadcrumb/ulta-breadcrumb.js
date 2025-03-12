export default function decorate(block) {
  block.innerHTML = '';

  const breadcrumb = document.createElement('nav');
  breadcrumb.classList.add('breadcrumb-container');
  breadcrumb.setAttribute('aria-label', 'Breadcrumb');

  const fragment = document.createDocumentFragment();

  // Home link
  const homeLink = document.createElement('a');
  homeLink.href = window.location.origin;
  homeLink.innerText = 'Home';
  homeLink.classList.add('breadcrumb-link');
  fragment.appendChild(homeLink);

  // Obtener la ruta actual y dividirla en segmentos
  const path = window.location.pathname.replace(/^\/|\/$/g, '');
  const pathsList = path ? path.split('/') : [];

  let cumulativePath = '';
  pathsList.forEach((segment) => {
    cumulativePath += `/${segment}`;

    const separator = document.createElement('span');
    separator.innerText = ' / ';
    separator.classList.add('breadcrumb-separator');
    fragment.appendChild(separator);

    const link = document.createElement('a');
    link.href = window.location.origin + cumulativePath;
    link.innerText = segment.replace(/[-_]/g, ' ');
    link.classList.add('breadcrumb-link');
    fragment.appendChild(link);
  });

  // Último elemento: página actual (no clickeable)
  if (pathsList.length > 0) {
    const separator = document.createElement('span');
    separator.innerText = ' / ';
    separator.classList.add('breadcrumb-separator');
    fragment.appendChild(separator);
  }

  const currentPage = document.createElement('span');
  currentPage.innerText = document.title || 'Current Page';
  currentPage.classList.add('breadcrumb-current');
  fragment.appendChild(currentPage);

  // Agregar breadcrumb al bloque
  breadcrumb.appendChild(fragment);
  block.appendChild(breadcrumb);
}
