import {
  h,
} from '@dropins/tools/preact.js';
import { useState, useEffect, useRef } from '@dropins/tools/preact-hooks.js';
import htm from '../../../scripts/htm.js';

const html = htm.bind(h);

export const MainNav = ({ categories, labels }) => {
  const [activeItem, setActiveItem] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveItem(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderCategory = (category, path = '', level = 0, parentPath = null, parentName = 'Menu') => {
    const hasChildren = category.children?.length > 0;
    const isActive = activeItem === path;
    const liClass = hasChildren ? `nav-drop level-${level}` : `level-${level}`;

    return html`
      <li
        class=${liClass}
        aria-expanded=${hasChildren ? String(isActive) : null}
        onClick=${(e) => {
            if (!hasChildren) return;
            e.stopPropagation();
            setActiveItem(isActive ? null : path);
        }}
        >
          ${hasChildren ? html`
            <span class="label-container"
                  onClick=${(e) => {
                      if (level !== 2) return;
                      if(isActive) {
                        e.stopPropagation();
                        setActiveItem(parentPath);
                      }
                  }}>
              <p class="normal-label" >${category.name}</p>
              <a class="desktop-link" href="${'/' + category.url_path}" title="${category.name}" aria-label="${category.name}">${category.name}</a>
            </span>
            <div class="submenu-wrapper">
              <div class="submenu-header">
                <p
                  class="back-link"
                  onClick=${(e) => {
                      e.stopPropagation();
                      setActiveItem(parentPath);
                  }}>
                    ${parentName}
                </p>
              </div>
                ${(level > 0) ? html`
                  <p class="submenu-title">
                    <a href="${'/' + category.url_path}" title="${category.name}" aria-label="${category.name}">
                        <span class="see-all">${labels?.Custom?.Header?.Menu?.seeall}</span>
                        <span class="category-all">${category.name}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                            <g id="Grupo_201035" data-name="Grupo 201035" transform="translate(21847 -10791)">
                                <rect id="Rectángulo_151512" data-name="Rectángulo 151512" width="16" height="16" transform="translate(-21847 10791)" fill="#fff" opacity="0"/>
                                <path id="arrowForward" d="M8.213,1.5l-.046.073a.64.64,0,0,0,.1.759l5.355,5.453H1.375l-.074,0a.633.633,0,0,0-.551.629l0,.074a.628.628,0,0,0,.621.56H13.621L8.265,14.5l-.053.061a.642.642,0,0,0,.053.832.619.619,0,0,0,.886,0l6.417-6.533.046-.053.054-.08.031-.062.029-.085.01-.039.01-.07,0-.052a.651.651,0,0,0-.027-.19l-.028-.076-.041-.077a.641.641,0,0,0-.086-.11L9.151,1.437l-.07-.061a.619.619,0,0,0-.816.061Z" transform="translate(-21847.084 10790.417)"/>
                            </g>
                        </svg>
                    </a>
                  </p>
                ` : ''}
                <ul class=${`level-${level + 1}`}>
                  ${category.children.map((child, index) =>
                    renderCategory(child, `${path}-${index}`, level + 1, path, category.name)
                  )}
                </ul>
              </div>
            ` : html`
                <span class="label-container">
                    <a href="${'/' + category.url_path}" title="${category.name}" aria-label="${category.name}">${category.name}</a>
                </span>
            `}
        </li>
    `;
  };

  return html`
    <div class="default-content-wrapper" ref=${navRef}>
      <ul class="main-nav level-0">
        ${categories.map((category, index) => renderCategory(category, `${index}`, 0, null, labels?.Custom?.Header?.Menu?.menu))}
      </ul>
      ${activeItem !== null && html`
        <div class="main-nav-overlay" onClick=${() => setActiveItem(null)}></div>
      `}
    </div>
  `;
};

export default MainNav;
