import { h } from '@dropins/tools/preact.js';
import { render as provider } from '@dropins/storefront-cart/render.js';
import { Home } from '../../design-system/pages/home/home.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);
const CustomeHome = () => {
  return html`
    <div className="${['home-wrapper'].join(' ')}">
      <${Home} />
    </div>
  `;
};

export default async function decorate(block) {
  block.innerHTML = '';

  await provider.render(CustomeHome, {})(block);
}
