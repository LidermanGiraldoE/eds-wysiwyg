import {
  h,
} from '@dropins/tools/preact.js';
import { useState, useEffect } from '@dropins/tools/preact-hooks.js';
import { events } from '@dropins/tools/event-bus.js';
import htm from '../../../scripts/htm.js';

const html = htm.bind(h);

export const Minicart = () => {
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    events.on(
      'cart/data',
      (data) => {
        if (data?.totalQuantity) {
          setTotalQuantity(data.totalQuantity);
        } else {
          setTotalQuantity(0);
        }
      },
      { eager: true },
    );
  }, []);
  return html`
    <div class="minicart-wrapper nav-tools-wrapper">
      <a role="link" href="/cart" data-testid="route-cart-button" tabindex="0" class="button nav-cart-button" data-count=${totalQuantity || undefined}></a>
   </div>
  `;
};
export default Minicart;
