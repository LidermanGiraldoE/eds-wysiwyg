/* eslint-disable import/no-unresolved */

import {
  InLineAlert,
  Icon,
  Button,
  provider as UI,
} from '@dropins/tools/components.js';
import { events } from '@dropins/tools/event-bus.js';
import * as pdpApi from '@dropins/storefront-pdp/api.js';
import { render as pdpRendered } from '@dropins/storefront-pdp/render.js';

// Containers
import ProductHeader from '@dropins/storefront-pdp/containers/ProductHeader.js';
import ProductPrice from '@dropins/storefront-pdp/containers/ProductPrice.js';
import ProductShortDescription from '@dropins/storefront-pdp/containers/ProductShortDescription.js';
import ProductOptions from '@dropins/storefront-pdp/containers/ProductOptions.js';
import ProductQuantity from '@dropins/storefront-pdp/containers/ProductQuantity.js';
import ProductDescription from '@dropins/storefront-pdp/containers/ProductDescription.js';
import ProductAttributes from '@dropins/storefront-pdp/containers/ProductAttributes.js';
import ProductGallery from '@dropins/storefront-pdp/containers/ProductGallery.js';

// Libs
import { setJsonLd } from '../../scripts/commerce.js';
import { fetchPlaceholders } from '../../scripts/aem.js';

// Initializers
import { IMAGES_SIZES } from '../../scripts/initializers/pdp.js';
import '../../scripts/initializers/cart.js';
import { rootLink } from '../../scripts/scripts.js';

// Custom imports
import { components } from './components.js';
import { dropdownColor } from './dropdownColor.js';
import { accordion } from './accordion.js';
import { modal } from './modal.js';

export default async function decorate(block) {
  // eslint-disable-next-line no-underscore-dangle
  const product = events._lastEvent?.['pdp/data']?.payload ?? null;

  console.log('Product: ', product);

  const labels = await fetchPlaceholders();

  // Layout
  const fragment = document.createRange().createContextualFragment(`
    <div class="product-details__wrapper">
      <div class="product-details__alert"></div>
      <div class="product-details__left-column">
        <div class="product-details__gallery"></div>
      </div>
      <div class="product-details__right-column">
        <div class="product-details__content">
          <div class="product-details__brand"></div>
          <div class="product-details__header"></div>
          <div class="product-details__tags"></div>
          <div class="product-details__reviews"></div>
          <div class="product-details__gallery"></div>
          <div class="product-details__price"></div>
          <div class="product-details__exclusive-price"></div>
          <div class="product-details__gift"></div>
          <div class="product-details__colors"></div>
          <div class="product-details__short-description"></div>
          <div class="product-details__configuration">
            <div class="product-details__options"></div>
            <div class="product-details__size"></div>
            <div class="product-details__quantity"></div>
            <div class="product-details__buttons">
              <div class="product-details__buttons__add-to-cart"></div>
              <div class="product-details__buttons__add-to-wishlist"></div>
            </div>
          </div>
          <div class="product-details__description"></div>
          <div class="product-details__attributes"></div>
          <div class="product-details__accordion" id="reviews"></div>
        </div>
      </div>
    </div>
  `);

  const $alert = fragment.querySelector('.product-details__alert');
  const $gallery = fragment.querySelector('.product-details__gallery');
  const $header = fragment.querySelector('.product-details__header');
  const $price = fragment.querySelector('.product-details__price');
  const $galleryMobile = fragment.querySelector('.product-details__right-column .product-details__gallery');
  const $shortDescription = fragment.querySelector('.product-details__short-description');
  const $options = fragment.querySelector('.product-details__options');
  const $quantity = fragment.querySelector('.product-details__quantity');
  const $addToCart = fragment.querySelector('.product-details__buttons__add-to-cart');
  const $addToWishlist = fragment.querySelector('.product-details__buttons__add-to-wishlist');
  const $description = fragment.querySelector('.product-details__description');
  const $attributes = fragment.querySelector('.product-details__attributes');

  // Custom variables
  const $brandContainer = fragment.querySelector('.product-details__brand');
  const $tagsContainer = fragment.querySelector('.product-details__tags');
  const $reviewsContainer = fragment.querySelector('.product-details__reviews');
  const $giftContainer = fragment.querySelector('.product-details__gift');
  const $colorsContainer = fragment.querySelector('.product-details__colors');
  const $exclusivePriceContainer = fragment.querySelector('.product-details__exclusive-price');
  const $sizeContainer = fragment.querySelector('.product-details__size');

  // Special price
  let $exclusivePriceSpan = $exclusivePriceContainer.querySelector('.product-details__exclusive-price span');
  if (!$exclusivePriceSpan) {
    $exclusivePriceSpan = document.createElement('span');
    $exclusivePriceContainer.appendChild($exclusivePriceSpan);
  }

  $exclusivePriceSpan.textContent = 'Precio exclusivo en línea';

  // Gift
  if (!$giftContainer) {
    const newGiftContainer = document.createElement('div');
    newGiftContainer.className = 'product-details__gift';
    fragment.appendChild(newGiftContainer);
  }

  const $updatedGiftContainer = fragment.querySelector('.product-details__gift');
  let $giftTitle = $updatedGiftContainer.querySelector('.gift-title');

  if (!$giftTitle) {
    $giftTitle = document.createElement('span');
    $giftTitle.className = 'gift-title';
    $updatedGiftContainer.appendChild($giftTitle);
  }

  let $iconTitle = $updatedGiftContainer.querySelector('.icon-title');

  if (!$iconTitle) {
    $iconTitle = document.createElement('span');
    $iconTitle.className = 'icon-title';
    $updatedGiftContainer.appendChild($iconTitle);
  }

  const giftText = product?.giftText || 'Obsequio con tu pedido';
  $giftTitle.textContent = giftText;

  // Selected color
  if (product?.productType === 'simple' || product?.options?.some(option => option.id === 'ulta_tamano')) {
    $colorsContainer.remove();
  } else {
    $colorsContainer.innerHTML = '';

    const colorTitle = document.createElement('div');
    colorTitle.className = 'product-details__color-title';
    colorTitle.textContent = 'Color: ';

    const colorSelected = document.createElement('div');
    colorSelected.className = 'product-details__color-selected';

    const colorInfo = document.createElement('div');
    colorInfo.className = 'product-details__color-info';

    const itemColor = document.createElement('div');
    itemColor.className = 'item-color';
    const colorValue = product?.color?.value || '#000000';
    itemColor.style.backgroundColor = colorValue;

    const itemName = document.createElement('span');
    itemName.className = 'item-name';
    const colorName = product?.color?.name || 'Color desconocido';
    itemName.textContent = colorName;

    colorInfo.appendChild(itemColor);
    colorInfo.appendChild(itemName);

    colorSelected.appendChild(colorInfo);

    const itemDescription = document.createElement('span');
    itemDescription.className = 'item-description';
    const colorDescription = product?.color?.description || 'marrón espresso con matices verdosos';
    itemDescription.textContent = colorDescription;

    colorSelected.appendChild(itemDescription);

    const colorSelect = document.createElement('div');
    colorSelect.className = 'product-details__color-select';

    $colorsContainer.appendChild(colorTitle);
    $colorsContainer.appendChild(colorSelected);
    $colorsContainer.appendChild(colorSelect);
  }

  // Dropdown colors
  const interval = setInterval(() => {
    if ($colorsContainer) {
      clearInterval(interval);
      if (product.productType === 'simple' && $colorsContainer) {
        $colorsContainer.remove();
      } else {
        dropdownColor(product);
        accordion(product);
      }
    }
  }, 100);

  // Components
  components($brandContainer, $tagsContainer, $reviewsContainer, product);

  // Size
  const sizeTitle = document.createElement('span');
  sizeTitle.className = 'size-title';
  sizeTitle.textContent = 'Tamaño: ';

  const sizeValue = document.createElement('span');
  sizeValue.className = 'size-value';
  sizeValue.textContent = product?.size?.value || '0.04';

  const sizeVariation = document.createElement('span');
  sizeVariation.className = 'size-variation';
  sizeVariation.textContent = product?.size?.variation || ' oz';

  $sizeContainer.appendChild(sizeTitle);
  $sizeContainer.appendChild(sizeValue);
  $sizeContainer.appendChild(sizeVariation);

  // Modal
  modal($giftContainer, product);

  block.appendChild(fragment);

  // Alert
  let inlineAlert = null;

  // Render Containers
  const [
    _galleryMobile,
    _gallery,
    _header,
    _price,
    _shortDescription,
    _options,
    _quantity,
    addToCart,
    addToWishlist,
    _description,
    _attributes,
  ] = await Promise.all([
    // Gallery (Mobile)
    (async () => {
      await pdpRendered.render(ProductGallery, {
        controls: 'dots',
        arrows: false,
        peak: true,
        gap: 'small',
        loop: false,
        imageParams: {
          ...IMAGES_SIZES,
        },
      })($galleryMobile);

      const compareButtonMobile = document.createElement('button');
      compareButtonMobile.innerText = 'Comparar';
      compareButtonMobile.classList.add('product-compare-button');
      compareButtonMobile.addEventListener('click', () => {
        console.log('Add to compare');
      });

      const shareButtonMobile = document.createElement('button');
      shareButtonMobile.innerText = 'Compartir';
      shareButtonMobile.classList.add('product-wishlist-button');
      shareButtonMobile.addEventListener('click', () => {
        console.log('Add to wishlist');
      });

      const buttonsWrapper = document.createElement('div');
      buttonsWrapper.className = 'product-gallery__buttons-desk';
      buttonsWrapper.appendChild(shareButtonMobile);
      buttonsWrapper.appendChild(compareButtonMobile);
      $galleryMobile.appendChild(buttonsWrapper);
    })(),

    // Gallery (Desktop)
    (async () => {
      await pdpRendered.render(ProductGallery, {
        controls: 'thumbnailsRow',
        arrows: true,
        peak: false,
        gap: 'small',
        loop: true,
        imageParams: {
          ...IMAGES_SIZES,
        },
      })($gallery);

      // Esperamos un frame para asegurar que todo esté en el DOM
      requestAnimationFrame(() => {
        const thumbnailsContainer = $gallery.querySelector('.pdp-carousel__controls__container--thumbnailsRow');
        if (thumbnailsContainer) {
          // Moverlo justo después del contenedor de galería
          $gallery.parentNode.insertBefore(thumbnailsContainer, $gallery.nextSibling);
        }
      });

      const compareButton = document.createElement('button');
      compareButton.innerText = 'Comparar';
      compareButton.classList.add('product-compare-button');
      compareButton.addEventListener('click', () => {
        console.log('Add to compare');
      });

      const shareButton = document.createElement('button');
      shareButton.innerText = 'Compartir';
      shareButton.classList.add('product-wishlist-button');
      shareButton.addEventListener('click', () => {
        console.log('Add to wishlist');
      });

      const buttonsWrapper = document.createElement('div');
      buttonsWrapper.className = 'product-gallery__buttons';
      buttonsWrapper.appendChild(shareButton);
      buttonsWrapper.appendChild(compareButton);
      $gallery.appendChild(buttonsWrapper);
    })(),

    // Header
    pdpRendered.render(ProductHeader, {})($header),

    // Price
    pdpRendered.render(ProductPrice, {})($price),

    // Short Description
    pdpRendered.render(ProductShortDescription, {})($shortDescription),

    // Configuration - Swatches
    pdpRendered.render(ProductOptions, { hideSelectedValue: false })($options),

    // Configuration  Quantity
    pdpRendered.render(ProductQuantity, {})($quantity),

    // Configuration – Button - Add to Cart
    UI.render(Button, {
      children: labels.PDP?.Product?.AddToCart?.label,
      icon: Icon({ source: 'Cart' }),
      onClick: async () => {
        try {
          addToCart.setProps((prev) => ({
            ...prev,
            children: labels.Custom?.AddingToCart?.label,
            disabled: true,
          }));

          // get the current selection values
          const values = pdpApi.getProductConfigurationValues();
          const valid = pdpApi.isProductConfigurationValid();

          // add the product to the cart
          if (valid) {
            const { addProductsToCart } = await import('@dropins/storefront-cart/api.js');
            await addProductsToCart([{ ...values }]);
          }

          // reset any previous alerts if successful
          inlineAlert?.remove();
        } catch (error) {
          // add alert message
          inlineAlert = await UI.render(InLineAlert, {
            heading: 'Error',
            description: error.message,
            icon: Icon({ source: 'Warning' }),
            'aria-live': 'assertive',
            role: 'alert',
            onDismiss: () => {
              inlineAlert.remove();
            },
          })($alert);

          // Scroll the alertWrapper into view
          $alert.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        } finally {
          addToCart.setProps((prev) => ({
            ...prev,
            children: labels.PDP?.Product?.AddToCart?.label,
            disabled: false,
          }));
        }
      },
    })($addToCart),

    // Configuration - Add to Wishlist
    UI.render(Button, {
      icon: Icon({ source: 'Heart' }),
      variant: 'secondary',
      'aria-label': labels.Custom?.AddToWishlist?.label,
      onClick: async () => {
        try {
          addToWishlist.setProps((prev) => ({
            ...prev,
            disabled: true,
            'aria-label': labels.Custom?.AddingToWishlist?.label,
          }));

          const values = pdpApi.getProductConfigurationValues();

          if (values?.sku) {
            const wishlist = await import('../../scripts/wishlist/api.js');
            await wishlist.addToWishlist(values.sku);
          }
        } catch (error) {
          console.error(error);
        } finally {
          addToWishlist.setProps((prev) => ({
            ...prev,
            disabled: false,
            'aria-label': labels.Custom?.AddToWishlist?.label,
          }));
        }
      },
    })($addToWishlist),

    // Description
    pdpRendered.render(ProductDescription, {})($description),

    // Attributes
    pdpRendered.render(ProductAttributes, {})($attributes),
  ]);

  // Lifecycle Events
  events.on('pdp/valid', (valid) => {
    // update add to cart button disabled state based on product selection validity
    addToCart.setProps((prev) => ({ ...prev, disabled: !valid }));
  }, { eager: true });

  // Set JSON-LD and Meta Tags
  events.on(
    'eds/lcp',
    () => {
      if (product) {
        setJsonLdProduct(product);
        setMetaTags(product);
        document.title = product.name;
      }
    },
    { eager: true },
  );

  return Promise.resolve();
}

async function setJsonLdProduct(product) {
  const {
    name,
    inStock,
    description,
    sku,
    urlKey,
    price,
    priceRange,
    images,
    attributes,
  } = product;
  const amount = priceRange?.minimum?.final?.amount || price?.final?.amount;
  const brand = attributes.find((attr) => attr.name === 'brand');

  // get variants
  const { data } = await pdpApi.fetchGraphQl(`
    query GET_PRODUCT_VARIANTS($sku: String!) {
      variants(sku: $sku) {
        variants {
          product {
            sku
            name
            inStock
            images(roles: ["image"]) {
              url
            }
            ...on SimpleProductView {
              price {
                final { amount { currency value } }
              }
            }
          }
        }
      }
    }
  `, {
    method: 'GET',
    variables: { sku },
  });

  const variants = data?.variants?.variants || [];

  const ldJson = {
    '@context': 'http://schema.org',
    '@type': 'Product',
    name,
    description,
    image: images[0]?.url,
    offers: [],
    productID: sku,
    brand: {
      '@type': 'Brand',
      name: brand?.value,
    },
    url: new URL(rootLink(`/products/${urlKey}/${sku}`), window.location),
    sku,
    '@id': new URL(rootLink(`/products/${urlKey}/${sku}`), window.location),
  };

  if (variants.length > 1) {
    ldJson.offers.push(...variants.map((variant) => ({
      '@type': 'Offer',
      name: variant.product.name,
      image: variant.product.images[0]?.url,
      price: variant.product.price.final.amount.value,
      priceCurrency: variant.product.price.final.amount.currency,
      availability: variant.product.inStock ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock',
      sku: variant.product.sku,
    })));
  } else {
    ldJson.offers.push({
      '@type': 'Offer',
      price: amount?.value,
      priceCurrency: amount?.currency,
      availability: inStock ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock',
    });
  }

  setJsonLd(ldJson, 'product');
}

function createMetaTag(property, content, type) {
  if (!property || !type) {
    return;
  }
  let meta = document.head.querySelector(`meta[${type}="${property}"]`);
  if (meta) {
    if (!content) {
      meta.remove();
      return;
    }
    meta.setAttribute(type, property);
    meta.setAttribute('content', content);
    return;
  }
  if (!content) {
    return;
  }
  meta = document.createElement('meta');
  meta.setAttribute(type, property);
  meta.setAttribute('content', content);
  document.head.appendChild(meta);
}

function setMetaTags(product) {
  if (!product) {
    return;
  }

  const price = product.prices.final.minimumAmount ?? product.prices.final.amount;

  createMetaTag('title', product.metaTitle || product.name, 'name');
  createMetaTag('description', product.metaDescription, 'name');
  createMetaTag('keywords', product.metaKeyword, 'name');

  createMetaTag('og:type', 'product', 'property');
  createMetaTag('og:description', product.shortDescription, 'property');
  createMetaTag('og:title', product.metaTitle || product.name, 'property');
  createMetaTag('og:url', window.location.href, 'property');
  const mainImage = product?.images?.filter((image) => image.roles.includes('thumbnail'))[0];
  const metaImage = mainImage?.url || product?.images[0]?.url;
  createMetaTag('og:image', metaImage, 'property');
  createMetaTag('og:image:secure_url', metaImage, 'property');
  createMetaTag('product:price:amount', price.value, 'property');
  createMetaTag('product:price:currency', price.currency, 'property');
}
