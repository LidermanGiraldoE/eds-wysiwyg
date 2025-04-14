import {
  h,
} from '@dropins/tools/preact.js';
import { useState, useEffect } from '@dropins/tools/preact-hooks.js';
import htm from '../../../scripts/htm.js';
import { buildBlock, decorateBlock, loadBlock } from '../../../scripts/aem.js';

const html = htm.bind(h);

export const AccountMenu = () => {
  const [loginVisible, setLoginVisible] = useState(false);

  useEffect(() => {
    const accountBlock = buildBlock('ulta-beauty-login-cdc', '');
    const accountWrapper = document.getElementById('account-menu-container');
    accountWrapper.append(accountBlock);
    decorateBlock(accountBlock);
    loadBlock(accountBlock);
  }, []);

  return html`
    <div class="account-wrapper nav-tools-wrapper">
    ${html`<button type="button" class="nav-account-button" aria-label="Account" onClick=${() => setLoginVisible(!loginVisible)}></button>`}
    <div id="account-menu-container" class="account-panel nav-tools-panel ${loginVisible ? 'nav-tools-panel--show' : ''}">
    </div>
   </div>
`;
};

export default AccountMenu;
