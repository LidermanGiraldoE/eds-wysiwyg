import { h } from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);

export const StaticBanner = ({
  imageDesktop,
  imageMobile,
  imageAlt,
  title,
  description,
  contentBackgroundColor,
  contentBorderColor,
}) => html`
  <section class="static-banner-box">
    <picture class="static-banner-box__image">
      <source srcset=${imageMobile} media="(max-width: 900px)" />
      <img src=${imageDesktop} alt=${imageAlt} loading="lazy" />
    </picture>
    <div class="static-banner-box__content-wrapper">
      <div
        class="static-banner-box__border static-banner-box__border--bottom"
        style=${{ backgroundColor: contentBorderColor }}
      ></div>
      <div
        class="static-banner-box__border static-banner-box__border--right"
        style=${{ backgroundColor: contentBorderColor }}
      ></div>
      <div
        class="static-banner-box__content"
        style=${{ backgroundColor: contentBackgroundColor }}
      >
        <h1 class="static-banner-box__title">${title}</h1>
        <p class="static-banner-box__description" dangerouslySetInnerHTML=${{ __html: description }} />
      </div>
    </div>
  </section>
`;
