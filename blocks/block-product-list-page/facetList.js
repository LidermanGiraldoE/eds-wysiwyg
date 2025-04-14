import { h, render } from '@dropins/tools/preact.js';
import { useState, useEffect, useRef } from '@dropins/tools/preact-hooks.js';
import htm from '../../scripts/htm.js';
import createModal from '../../design-system/atoms/customModal/customModal.js';
import { Button } from '@dropins/tools/components.js';
import { CustomAccordion } from '../../design-system/molecules/customAccordion/customAccordion.js';

const html = htm.bind(h);

let modalFacets;
let modalFacetsContainer;

/**
 * Displays a modal with the provided content.
 * @param {Object} content - The content to render inside the modal.
 */
const showModalFilter = async (content) => {
  modalFacetsContainer = document.createElement('div');
  render(h(content.type, content.props), modalFacetsContainer);

  modalFacets = await createModal([modalFacetsContainer], 'slide', 'right');
  modalFacets.showModal();
};

/**
 * Removes the currently displayed modal if any.
 */
const removeModalFilter = () => {
  if (!modalFacets) return;
  modalFacets.removeModal();
  modalFacets = null;
  modalFacetsContainer = null;
};

/**
 * Component representing the facet filter list.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.facets - Array of facet objects to display.
 * @param {Object} props.filters - Currently applied filters.
 * @param {Object} props.facetMenuRef - Ref to the facet menu container.
 * @param {Function} props.onFilterChange - Callback when filters are applied or cleared.
 * @param {boolean} props.loading - Whether the component is in loading state.
 * @param {number} props.totalProducts - Total number of products available.
 * @param {Object} props.labels - Labels to translate.
 * @returns {JSX.Element} The rendered facet list component.
 * 
 */
function FacetList({
  facets, filters, facetMenuRef, onFilterChange, loading, totalProducts, labels
}) {
  const [filterCount, setFilterCount] = useState(
    Object.entries(filters).reduce((count, [key, value]) => key !== 'inStock' ? count + value.length : count, 0)
  );
  const [auxFilters, setAuxFilters] = useState({ ...filters });
  const auxFiltersRef = useRef({ ...filters });

  useEffect(() => {
    setFilterCount(
      Object.entries(filters).reduce((count, [key, value]) => key !== 'inStock' ? count + value.length : count, 0)
    );
    setAuxFilters({ ...filters });
    auxFiltersRef.current = { ...filters };
  }, [filters]);

  if (loading) {
    return html`<div class="facet-list shimmer"></div>`;
  }

  /**
   * Handles the change of a filter selection.
   * @param {Object} facet - The facet object.
   * @param {Object} bucket - The bucket object within the facet.
   */
  const handleFilterChange = (facet, bucket) => {
    const newFilters = { ...auxFiltersRef.current };
    if (!newFilters[facet.attribute]) {
      newFilters[facet.attribute] = [];
    }
    if (newFilters[facet.attribute].includes(bucket.id)) {
      newFilters[facet.attribute] = newFilters[facet.attribute].filter((id) => id !== bucket.id);
    } else {
      newFilters[facet.attribute].push(bucket.id);
    }
    auxFiltersRef.current = newFilters;
    setAuxFilters(newFilters);
  };

  /**
   * Applies the filters selected in the modal.
   */
  const applyFilters = () => {
    const currentFilters = auxFiltersRef.current;
    onFilterChange(currentFilters);
    removeModalFilter();
  };

  /**
   * Clears all filters except the "inStock" filter.
   */
  const clearFilters = () => {
    const clearedFilters = { inStock: filters.inStock || [] };
    auxFiltersRef.current = clearedFilters;
    setAuxFilters(clearedFilters);
    onFilterChange(clearedFilters);
    removeModalFilter();
  };

  /**
   * Generates accordion data from facets.
   * @param {Array} facets - The array of facet objects.
   * @param {Object} auxFilters - The auxiliary filters object.
   * @param {Function} handleFilterChange - The function to handle filter changes.
   * @returns {Object} The accordion data object.
   */
  const generateAccordionData = (facets, auxFilters, handleFilterChange) => ({
    acordionProps: {
      actionIconPosition: 'right',
    },
    sections: facets.map((facet) => ({
      title: facet.title,
      children: html`
        <ul class="facet-list__items">
          ${facet.buckets.map((bucket) => html`
            <li class="facet-list__item">
              <label>
                <input
                  type="checkbox"
                  checked=${auxFilters[facet.attribute]?.includes(bucket.id) || false}
                  onClick=${() => handleFilterChange(facet, bucket)}
                />
                <span class="facet-list-item__name">${bucket.title}</span> <span class="facet-list-item__counter">${bucket.count}</span>
              </label>
            </li>
          `)}
        </ul>
      `,
    })),
  });

  const acordionData = generateAccordionData(facets, auxFilters, handleFilterChange);

  return html`
    <button id="toggle_filter" onClick=${async () => {
      const content = html`<div class="facet-list__container">
        <div class="facet-list__title">
          <span>${labels?.PLP?.Facets?.Title}</span>
        </div>
        <div class="facet-list" ref=${facetMenuRef}>
          <${CustomAccordion} props=${acordionData} />
        </div>
        <div class="facet-list__buttons">
          <${Button} variant="primary" onClick=${applyFilters}>${labels?.PLP?.Facets?.Buttons?.Primary} (${totalProducts})</${Button}>
          <${Button} variant="secondary" onClick=${clearFilters}>${labels?.PLP?.Facets?.Buttons?.Secondary}</${Button}>
        </div>
      </div>`;
      await showModalFilter(content);
    }}>
      ${labels?.PLP?.Facets?.Filter?.Button}${filterCount > 0 ? ` (${filterCount})` : ''}
    </button>
  `;
}

export default FacetList;
