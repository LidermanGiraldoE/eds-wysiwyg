/* eslint-disable indent */
import { h } from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);

/**
 * Component representing the sort controls.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.type - The type of sorting (e.g., 'category').
 * @param {boolean} props.disabled - Whether the component is disabled.
 * @param {Object} props.sortMenuRef - The reference to the sort menu element.
 * @param {Function} props.onSort - The function to call when sorting changes.
 * @param {string} props.currentSort - The current sort attribute.
 * @param {string} props.sortDirection - The current sort direction.
 * @param {Object} props.labels - Labels to translate.
 * 
 * @returns {JSX.Element} The rendered component.
 */
function Sort(
  {
    type, disabled, sortMenuRef, onSort, currentSort, sortDirection, labels
  },
) {
  const options = [
    { label: 'Precio (Mayor a menor)', value: 'price-desc' },
    { label: 'Precio (Menor a mayor)', value: 'price-asc' },
    { label: 'Nombre (A - Z)', value: 'name-asc' },
    { label: 'Nombre (Z - A)', value: 'name-desc' },
    { label: 'Más relevantes', value: type === 'category' ? 'position-asc' : 'relevance-desc' },
  ];

  const currentSortOption = options.find((option) => option.value === `${currentSort}-${sortDirection}`) || options[3];
  const labelSort = labels.PLP.Sort.Label;

  return html`<div class="sort" disabled=${disabled}>
      <label for="sort-select" class="sort__label">${labelSort}</label>
      <select id="sort-select" class="sort__select" disabled=${disabled} onChange=${(e) => {
        const [sort, direction = 'asc'] = e.target.value.split('-');
        onSort(sort, direction);
      }}>
        ${options.map((option) => html`<option value=${option.value} class="sort__option" selected=${currentSortOption.value === option.value}>${option.label}</option>`)}
      </select>
    </div>`;
}

export default Sort;
