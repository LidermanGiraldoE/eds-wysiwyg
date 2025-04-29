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
  <section class="static-banner">
    <picture class="static-banner__image">
      <source srcset=${imageMobile} media="(max-width: 900px)" />
      <img src=${imageDesktop} alt=${imageAlt} loading="lazy" />
    </picture>
    <div
      class="static-banner__content"
      style=${{
        backgroundColor: contentBackgroundColor,
        boxShadow: `0 8px 0 ${contentBorderColor}`,
      }}
    >
      <h2 class="static-banner__title">${title}</h2>
      <p class="static-banner__description" dangerouslySetInnerHTML=${{ __html: description }} />
    </div>
  </section>
`;
