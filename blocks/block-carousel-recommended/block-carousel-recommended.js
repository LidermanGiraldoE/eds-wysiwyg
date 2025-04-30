import { h, render, Fragment } from '@dropins/tools/preact.js';
import { useEffect } from '@dropins/tools/preact-hooks.js';
import htm from '../../scripts/htm.js';

import CarouselRecommended from '../../design-system/molecules/customCarouselRecommended/customCarouselRecommended.js';
import { fetchPlaceholders } from '../../scripts/aem.js';

const html = htm.bind(h);

/**
 * CarouselRecommendedBlock Component
 *
 * Renders a CarouselRecommended component dynamically
 * based on the provided category path, item limit, and title.
 *
 * @param {Object} props - Component properties.
 * @param {string} [props.categoryPath=''] - Parent category path for filtering products.
 * @param {number} [props.limit=5] - Maximum number of products to show.
 * @param {string} [props.title=''] - Optional title for the carousel section.
 * @param {Object} [props.labels={}] - Placeholder labels fetched from AEM.
 * @param {Function} [props.resolve] - Function to call when the component has fully mounted.
 * @returns {JSX.Element} Preact component tree.
 */
function CarouselRecommendedBlock({
  filterType = 'categoryPath',
  categoryPath = '',
  skus = '',
  limit = 5,
  title = '',
  labels = {},
  resolve,
}) {
  useEffect(() => {
    if (typeof resolve === 'function') {
      resolve();
    } else {
      console.warn('No resolve function provided to CarouselRecommendedBlock.');
    }
  }, []);

  const filter =
    filterType === 'sku'
      ? [{
          attribute: 'sku',
          in: skus.split(',').map((sku) => sku.trim()).filter(Boolean)
        }]
      : [{
          attribute: 'categoryPath',
          eq: categoryPath,
        }];

  return html`
    <div class="block-carousel-recommended">
      <${CarouselRecommended}
        filter=${filter}
        limit=${limit}
        title=${title}
        labels=${labels}
      />
    </div>
  `;
}

/**
 * Extracts content data from the block.
 *
 * @param {HTMLElement} block - Block container element.
 * @returns {Object} Extracted block data.
 */
function extractBlockData(block) {
  const items = Array.from(block.children);

  items.shift();
  const filterTypeEl = items.shift();
  const categoryPathEl = items.shift();
  const skusEl = items.shift();
  const limitEl = items.shift();
  const titleEl = items.shift();

  const filterType = filterTypeEl?.textContent?.trim() || 'categoryPath';
  const categoryPath = categoryPathEl?.textContent?.trim() || '';
  const skus = skusEl?.textContent?.trim() || '';
  const limitText = limitEl?.textContent?.trim() || '5';
  const title = titleEl?.textContent?.trim() || '';
  const limit = parseInt(limitText, 10) || 5;

  [filterTypeEl, categoryPathEl, skusEl, limitEl, titleEl].forEach(el => el?.remove());

  return { filterType, categoryPath, skus, limit, title };
}


/**
 * Main decorator function to mount the dynamic block.
 *
 * @param {HTMLElement} block - Block container element to decorate.
 * @returns {Promise<void>} A Promise that resolves when the block is fully decorated.
 */
export default async function decorate(block) {
  if (!block) {
    console.error('Decorate function called without a valid block.');
    return;
  }

  const { filterType, categoryPath, skus, limit, title } = extractBlockData(block);
  const labels = await fetchPlaceholders();

  return new Promise((resolve) => {
    const app = html`
      <${CarouselRecommendedBlock}
        filterType=${filterType}
        categoryPath=${categoryPath}
        skus=${skus}
        limit=${limit}
        title=${title}
        labels=${labels}
        resolve=${resolve}
      />
    `;
    render(app, block)
  });
}
