import {
  h,
} from '@dropins/tools/preact.js';
import { Icon } from '@dropins/tools/components.js';
import htm from '../../../scripts/htm.js';

const html = htm.bind(h);

export const WishList = () => html`
    <div class="wishlist-wrapper nav-tools-wrapper">
      <a role="link" href="/customer/wishlist" class="button">
        <${Icon} source="Heart" size="24" title="Wish list"/>
      </a>
   </div>
  `;
export default WishList;
