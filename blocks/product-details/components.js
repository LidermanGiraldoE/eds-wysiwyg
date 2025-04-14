/**
 * Build custom components to PDP.
 * @param {Object} product
 */

// eslint-disable-next-line import/prefer-default-export
export function components($brandContainer, $tagsContainer, $reviewsContainer, product) {
  // Brand
  let $brandLink = $brandContainer.querySelector('a');

  if (!$brandLink) {
    $brandLink = document.createElement('a');
    $brandContainer.appendChild($brandLink);
  }

  const brandAttr = product?.attributes?.find(attr => attr.id === 'ulta_marca');
  const brandName = brandAttr?.value || ' ';
  const brandUrl = product?.brandUrl || '/url-brand';

  $brandLink.textContent = brandName;
  $brandLink.href = brandUrl;

  // Tags
  $tagsContainer.innerHTML = '';
  let $tagsWrapper = $tagsContainer.querySelector('.tags');

  if (!$tagsWrapper) {
    $tagsWrapper = document.createElement('p');
    $tagsWrapper.className = 'tags';
    $tagsContainer.appendChild($tagsWrapper);
  }

  $tagsWrapper.innerHTML = '';
  const tags = product?.tags?.length ? product.tags : ['Exclusivo', 'Edición limitada', `Item ${product.externalId}`];

  tags.forEach((tag) => {
    const tagSpan = document.createElement('span');
    tagSpan.textContent = tag;
    $tagsWrapper.appendChild(tagSpan);
  });

  // Ratings
  const rating = product?.rating || 4.3;
  const reviewCount = product?.reviewCount || '4.621';
  const ratingPercentage = (rating / 5) * 100;

  const $productStars = document.createElement('div');
  $productStars.className = 'product-stars';
  $productStars.style.setProperty('--rating', `${ratingPercentage}%`);

  const $productStarsPoints = document.createElement('div');
  $productStarsPoints.className = 'product-stars-points';
  $productStarsPoints.textContent = `${rating}`;

  let $reviewsButton = $reviewsContainer.querySelector('.button-review');
  if (!$reviewsButton) {
    $reviewsButton = document.createElement('a');
    $reviewsButton.className = 'button-review';
    $reviewsButton.id = 'go-to-review';
    $reviewsButton.href = '#reviews';
  }

  let $iconReviews = $reviewsContainer.querySelector('.icon-reviews');
  if (!$iconReviews) {
    $iconReviews = document.createElement('span');
    $iconReviews.classList.add('icon-reviews');
  }

  const $starsWrapper = document.createElement('div');
  $starsWrapper.className = 'product-stars-wrapper';
  $starsWrapper.appendChild($productStarsPoints);
  $starsWrapper.appendChild($productStars);

  $reviewsButton.textContent = `${reviewCount} Reseñas `;
  $reviewsContainer.appendChild($starsWrapper);
  $reviewsContainer.appendChild($reviewsButton);
  $reviewsButton.appendChild($iconReviews);
}
