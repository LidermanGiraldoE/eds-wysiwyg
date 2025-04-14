import {
  h, render,
} from '@dropins/tools/preact.js';
import { events } from '@dropins/tools/event-bus.js';
import { useRef, useState } from '@dropins/tools/preact-hooks.js';
import { provider as UI } from '@dropins/tools/components.js';
import htm from '../../scripts/htm.js';
import applyHashTagsForDomElement from '../../scripts/api/hashtags/api.js';
import { GET_CATEGORIES } from './menu/commerce-categories.js';

import { MainNav } from './menu/main-nav.js';
import { Minicart } from './nav-tools/mini-cart.js';
import { SearchBar } from './nav-tools/search-bar.js';
import { AccountMenu } from './nav-tools/account-menu.js';
import { WishList } from './nav-tools/wish-list.js';
import { loadFragment } from '../fragment/fragment.js';
import { getMetadata, fetchPlaceholders } from '../../scripts/aem.js';
import { RegisterLogin } from './register-login-link.js';
import { performMonolithGraphQLQuery } from '../../scripts/commerce.js';

const html = htm.bind(h);

const SiteHeader = ({
    logo,
    preHeader,
    navLinks,
    labels,
    categories
  }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navWrapperRef = useRef();
  const navRef = useRef();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);

    if (navWrapperRef.current) {
      navWrapperRef.current.classList.toggle('active', !isMenuOpen);
    }

    if (navRef.current) {
      navRef.current.setAttribute('aria-expanded', String(!isMenuOpen));
    }
  };

  return html`
  <div class="nav-wrapper" ref=${navWrapperRef}>
    <div class="pre-header-container" ref=${(el) => el && el.appendChild(preHeader)}></div>
    <nav aria-expanded="false" ref=${navRef}>
      <div class="nav-links" ref=${(el) => el && el.appendChild(navLinks)}>
          <${RegisterLogin} label="${labels?.Custom?.Header?.Menu?.account}"/>
      </div>
      <div class="nav-hamburger"><button type="button" aria-controls="nav" aria-label="Open navigation" onClick=${toggleMenu}>
        <span class="nav-hamburger-icon"></span>
      </button></div>
      <div class="nav-brand"><a href="/" aria-label="Ulta Beauty" ref=${(el) => el && el.appendChild(logo)}></a></div>
      <div class="nav-sections">
        <${MainNav} categories="${categories}" labels=${labels} />
      </div>
      <div class="nav-tools">
        <${SearchBar} labels=${labels} />
        <${WishList} />
        <${Minicart} />
        <${AccountMenu} />
      </div>
    </nav>
  </div>
  `;
};

export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  const sections = fragment.querySelectorAll('.section');
  const labels = await fetchPlaceholders();
  const pictureLogo = sections[1].querySelector('picture');
  const preHeader = sections[0].querySelector('.columns-2-cols');

  const categoriesResponse = await performMonolithGraphQLQuery(
    GET_CATEGORIES,
    {},
    true
  );
  const categories = categoriesResponse.data.categories.items[0].children;

  const ul = sections[0].querySelector('.columns-2-cols > div > div > ul');
  const registerLoginLi = document.createElement('li');
  UI.render(
    RegisterLogin,
    { label: labels?.Custom?.Header?.Topheader?.account }
  )(registerLoginLi);
  ul.insertBefore(registerLoginLi, ul.firstChild);

  const navLinks = document.createDocumentFragment();

  let next = ul.nextElementSibling;
  while (next) {
    const toCheck = next;
    next = next.nextElementSibling;

    if (toCheck.classList.contains('block-image-wrapper')) {
      navLinks.appendChild(toCheck);
    }
  }

  return new Promise((resolve) => {
    const app = html`<${SiteHeader} 
            logo="${pictureLogo}"
            preHeader="${preHeader}"
            navLinks="${navLinks}"
            block=${block}
            resolve=${resolve}
            labels=${labels}
            categories=${categories}
    />`;
    render(app, block);
  });
}

events.on('cart/initialized', () => {
  applyHashTagsForDomElement('nav');
}, { eager: true });

events.on('cart/updated', () => {
  applyHashTagsForDomElement('nav');
}, { eager: true });

events.on('cart/reset', () => {
  applyHashTagsForDomElement('nav');
}, { eager: true });
