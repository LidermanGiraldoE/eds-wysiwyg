import { h } from '@dropins/tools/preact.js';
import { useState, useEffect } from '@dropins/tools/preact-hooks.js';
import htm from '../../../scripts/htm.js';

const html = htm.bind(h);

export const SearchBar = ({ labels }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    if (showModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal]);

  const toggleSearch = (e) => {
    e?.preventDefault?.();
    setShowModal((prev) => !prev);
  };

  async function addSearch() {
      await import('../../header/searchbar.js');
  }

  const form = html`
    <form class="search-bar" action="/search" method="GET" onSubmit=${() => setShowModal(false)}>
      <button type="submit" class="nav-search-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16.873" height="16.873" viewBox="0 0 16.873 16.873">
              <g id="Search--Streamline-Streamline--3.0" transform="translate(0.131 0.131)">
                  <path id="Trazado_53275" data-name="Trazado 53275" d="M.892,9.146A6.294,6.294,0,1,0,4.223.892,6.294,6.294,0,0,0,.892,9.146" transform="translate(0)" fill="none" stroke="#505050" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
                  <path id="Trazado_53276" data-name="Trazado 53276" d="M8.448,8.448l5.334,5.335" transform="translate(2.606 2.606)" fill="none" stroke="#505050" stroke-linejoin="round" stroke-width="1"/>
              </g>
          </svg>
      </button>
      <input
        id="search"
        class="search-input"
        type="search"
        name="q"
        placeholder="${labels?.Custom?.Header?.Search?.placeholder}"
        onfocus=${addSearch}
        autofocus=${isMobile && showModal}
      />
      <div id="search_autocomplete" class="search-autocomplete"></div>
    </form>
  `;

  return html`
    <div>
      ${isMobile && html`
      <button class="mobile-search-button" onClick=${toggleSearch}>${labels?.Custom?.Header?.Search?.search}</button>
      ${showModal && html`
        <div class="search-modal-container" onClick=${toggleSearch}>
          <div class="search-modal-content" onClick=${(e) => e.stopPropagation()}>
            <button class="modal-close-button" onClick=${toggleSearch}>✕</button>
            ${form}
          </div>
        </div>
      `}
    `}
      ${!isMobile && form}
    </div>
  `;
};

export default SearchBar;
