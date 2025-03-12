import { createElement } from '../../scripts/scripts.js';

const getPageTitle = async (url) => {
  try {
    const resp = await fetch(url);
    if (resp.ok) {
      const html = document.createElement('div');
      html.innerHTML = await resp.text();
      return html.querySelector('title')?.innerText.trim() || '';
    }
  } catch (error) {
    console.error(`Error fetching page title for ${url}:`, error);
  }
  return '';
};

const getBreadcrumbPaths = async (paths) => {
  const result = [];
  const pathsList = paths.replace(/^\/|\/$/g, '').split('/');

  for (let i = 0; i < pathsList.length - 1; i += 1) {
    const pathPart = pathsList[i];
    const prevPath = result[i - 1] ? result[i - 1].path : '';
    const path = `${prevPath}/${pathPart}`;
    const url = `${window.location.origin}${path}`;
    
    try {
      /* eslint-disable-next-line no-await-in-loop */
      const name = await getPageTitle(url);
      if (name) {
        result.push({ path, name, url });
      }
    } catch (error) {
      console.warn(`Skipping breadcrumb for ${url} due to error.`);
    }
  }
  return result;
};

const createLink = (path) => {
  const pathLink = document.createElement('a');
  pathLink.href = path.url;
  pathLink.innerText = path.name;
  pathLink.classList.add('breadcrumb-link');
  return pathLink;
};

export default async function decorate(block) {
  block.innerHTML = '';
  const breadcrumb = createElement('nav', 'breadcrumb-container', {
    'aria-label': 'Breadcrumb',
  });
  
  const fragment = document.createDocumentFragment();
  
  // Home link
  const homeLink = createLink({ path: '', name: 'Home', url: window.location.origin });
  fragment.appendChild(homeLink);

  // Fetch and build breadcrumb path
  const path = window.location.pathname;
  const paths = await getBreadcrumbPaths(path);

  paths.forEach((pathPart) => {
    const separator = document.createElement('span');
    separator.innerText = ' / ';
    separator.classList.add('breadcrumb-separator');
    fragment.appendChild(separator);
    fragment.appendChild(createLink(pathPart));
  });

  // Current Page (Non-clickable)
  const currentPage = document.createElement('span');
  currentPage.innerText = document.querySelector('title')?.innerText.trim() || 'Current Page';
  currentPage.classList.add('breadcrumb-current');

  const separator = document.createElement('span');
  separator.innerText = ' / ';
  separator.classList.add('breadcrumb-separator');
  fragment.appendChild(separator);
  fragment.appendChild(currentPage);

  // Append breadcrumb to block
  breadcrumb.appendChild(fragment);
  block.appendChild(breadcrumb);
}
