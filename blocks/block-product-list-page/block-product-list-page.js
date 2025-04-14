/* eslint-disable no-unused-vars */
import {
  h, Component, Fragment, render, createRef,
} from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';
import ProductCard from '../../design-system/molecules/customProductCard/customProductCard.js';
import FacetList from './facetList.js';
import Pagination from '../../design-system/atoms/customPagination/customPagination.js';
import Sort from './sort.js';
import { readBlockConfig, sampleRUM } from '../../scripts/aem.js';
import { priceFieldsFragment, performCatalogServiceQuery } from '../../scripts/commerce.js';
import { rootLink } from '../../scripts/scripts.js';
import { fetchPlaceholders } from '../../scripts/aem.js';

const html = htm.bind(h);

// Constants
const ALLOWED_FILTER_PARAMETERS = ['page', 'pageSize', 'sort', 'sortDirection', 'q', 'price', 'size', 'color_family', 'activity', 'color', 'gender'];
const isMobile = window.matchMedia('only screen and (max-width: 900px)').matches;
const PAGE_SIZE_DESKTOP = 12;
const PAGE_SIZE_MOBILE = 6;
const DEFAULT_PARAMS = {
  basePageSize: isMobile ? PAGE_SIZE_MOBILE : PAGE_SIZE_DESKTOP,
  page: 1,
  pageSize: isMobile ? PAGE_SIZE_MOBILE : PAGE_SIZE_DESKTOP,
  sort: 'position',
  sortDirection: 'asc',
};

/**
 * GraphQL query for product search.
 * @param {boolean} addCategory - Whether to include category in the query.
 * @returns {string} The GraphQL query string.
 */
const productSearchQuery = () => `query ProductSearch(
  $currentPage: Int = 1
  $pageSize: Int = 20
  $phrase: String = ""
  $sort: [ProductSearchSortInput!] = []
  $filter: [SearchClauseInput!] = []
) {
  productSearch(
      current_page: $currentPage
      page_size: $pageSize
      phrase: $phrase
      sort: $sort
      filter: $filter
  ) {
      facets {
          title
          type
          attribute
          buckets {
              title
              __typename
              ... on RangeBucket {
                  count
                  from
                  to
              }
              ... on ScalarBucket {
                  count
                  id
              }
              ... on StatsBucket {
                  max
                  min
              }
          }
      }
      items {
          product {
            id
          }
          productView {
              name
              sku
              urlKey
              images(roles: "thumbnail") {
                url
              }
              attributes(roles: []) {
                name
                value
              }
              __typename
              ... on SimpleProductView {
                  price {
                      ...priceFields
                  }
              }
              ... on ComplexProductView {
                  options {
                    id
                    title
                    required
                    values {
                      id
                      title
                    }
                  },
                  priceRange {
                      minimum {
                          ...priceFields
                      }
                      maximum {
                          ...priceFields
                      }
                  }
              }
          }
      }
      page_info {
          current_page
          total_pages
          page_size
      }
      total_count
  }
}
${priceFieldsFragment}`;

/**
 * Loads product category data based on the current state.
 * @param {Object} state - The current state of the component.
 * @returns {Promise<Object>} The updated state with loaded category data.
 */
async function loadCategory(state) {
  try {
    const variables = {
      pageSize: state.currentPageSize,
      currentPage: state.currentPage,
      sort: [{
        attribute: state.sort,
        direction: state.sortDirection === 'desc' ? 'DESC' : 'ASC',
      }],
    };

    variables.phrase = state.type === 'search' ? state.searchTerm : '';

    if (Object.keys(state.filters).length > 0) {
      variables.filter = [];
      Object.keys(state.filters).forEach((key) => {
        if (key === 'price') {
          const [from, to] = state.filters[key];
          if (from && to) {
            variables.filter.push({ attribute: key, range: { from, to } });
          }
        } else if (state.filters[key].length > 1) {
          variables.filter.push({ attribute: key, in: state.filters[key] });
        } else if (state.filters[key].length === 1) {
          variables.filter.push({ attribute: key, eq: state.filters[key][0] });
        }
      });
    }

    if (state.type === "category" && state.category.urlPath) {
      variables.filter = variables.filter || [];
      variables.filter.push({
        attribute: "categoryPath",
        eq: state.category.urlPath,
      });
    }

    window.adobeDataLayer.push((dl) => {
      const requestId = crypto.randomUUID();
      window.sessionStorage.setItem('searchRequestId', requestId);
      const searchInputContext = dl.getState('searchInputContext') ?? { units: [] };
      const searchUnitId = 'livesearch-plp';
      const unit = {
        searchUnitId,
        searchRequestId: requestId,
        queryTypes: ['products', 'suggestions'],
        ...variables,
      };
      const index = searchInputContext.units.findIndex((u) => u.searchUnitId === searchUnitId);
      if (index < 0) {
        searchInputContext.units.push(unit);
      } else {
        searchInputContext.units[index] = unit;
      }
      dl.push({ searchInputContext });
      dl.push({ event: 'search-request-sent', eventInfo: { ...dl.getState(), searchUnitId } });
    });

    const response = await performCatalogServiceQuery(productSearchQuery(state.type === 'category'), variables);

    return {
      pages: Math.max(response.productSearch.page_info.total_pages, 1),
      products: {
        items: response.productSearch.items
          .map((product) => ({ ...product.productView, ...product.product }))
          .filter((product) => product !== null),
        total: response.productSearch.total_count,
      },
      category: { ...state.category, ...response.categories?.[0] ?? {} },
      facets: response.productSearch.facets.filter((facet) => facet.attribute !== 'categories'),
    };
  } catch (e) {
    console.error('Error loading products', e);
    return {
      pages: 1,
      products: {
        items: [],
        total: 0,
      },
      facets: [],
    };
  }
}

/**
 * Parses query parameters from the URL and returns the corresponding state.
 * @returns {Object} The state derived from the query parameters.
 */
function parseQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const newState = {
    filters: {
      inStock: ['true'],
    },
  };
  params.forEach((value, key) => {
    if (!ALLOWED_FILTER_PARAMETERS.includes(key)) {
      return;
    }

    if (key === 'page') {
      newState.currentPage = parseInt(value, 10) || 1;
    } else if (key === 'pageSize') {
      newState.currentPageSize = parseInt(value, 10) || 12;
    } else if (key === 'sort') {
      newState.sort = value;
    } else if (key === 'sortDirection') {
      newState.sortDirection = value === 'desc' ? 'desc' : 'asc';
    } else if (key === 'q') {
      newState.searchTerm = value;
    } else if (key === 'price') {
      newState.filters[key] = value.split(',').map((v) => parseInt(v, 10) || 0);
    } else {
      newState.filters[key] = value.split(',');
    }
  });
  return newState;
}

/**
 * Preloads category data based on the provided category.
 * @param {string} category - The category to preload.
 */
export async function preloadCategory(category) {
  const queryParams = parseQueryParams();
  window.loadCategoryPromise = loadCategory({
    pages: DEFAULT_PARAMS.page,
    currentPage: DEFAULT_PARAMS.page,
    category,
    basePageSize: DEFAULT_PARAMS.basePageSize,
    currentPageSize: DEFAULT_PARAMS.pageSize,
    locale: 'en-US',
    currency: 'USD',
    type: 'category',
    sort: DEFAULT_PARAMS.sort,
    sortDirection: DEFAULT_PARAMS.sortDirection,
    ...queryParams,
  });
}

/**
 * Component representing the product list page.
 * @extends Component
 */
class ProductListPage extends Component {
  constructor(props) {
    const {
      type = 'category',
      category,
      urlpath,
      labels
    } = props;
    super();

    this.facetMenuRef = createRef();
    this.sortMenuRef = createRef();
    this.secondLastProduct = createRef();

    const queryParams = parseQueryParams();

    let headline = 'Search Results';
    let sort = 'relevance';
    let sortDirection = 'desc';
    if (type === 'category') {
      headline = document.querySelector('.default-content-wrapper > h1')?.innerText;
      sort = 'position';
      sortDirection = 'asc';
    }

    if (type === 'search') {
      sampleRUM('search', { source: '.search-input', target: queryParams.searchTerm });
    }
    this.state = {
      loading: true,
      pages: DEFAULT_PARAMS.page,
      currentPage: DEFAULT_PARAMS.page,
      basePageSize: DEFAULT_PARAMS.basePageSize,
      currentPageSize: DEFAULT_PARAMS.pageSize,
      type,
      category: {
        name: headline,
        id: category || null,
        urlPath: urlpath || null,
      },
      sort,
      sortDirection,
      products: {
        items: [],
        total: 0,
      },
      filters: {},
      facets: [],
      ...queryParams,
    };

    this.filterChange = false;
    this.paginationClick = false;
  }

  /**
   * Sets the state and returns a promise that resolves when the state is updated.
   * @param {Object} state - The new state to set.
   * @returns {Promise<void>} A promise that resolves when the state is updated.
   */
  setStatePromise(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  /**
   * Updates the URL query parameters based on the provided state.
   * @param {Object} params - The state parameters to update in the URL.
   */
  static updateQueryParams = (params) => {
    const newParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (!ALLOWED_FILTER_PARAMETERS.includes(key)) {
        return;
      }

      if (params[key] === DEFAULT_PARAMS[key]
        && !new URLSearchParams(window.location.search).has(key)) {
        return;
      }

      if (Array.isArray(params[key]) && params[key].length > 0) {
        newParams.set(key, params[key].join(','));
      } else if (!Array.isArray(params[key]) && params[key]) {
        newParams.set(key, params[key]);
      }
    });

    const curentParams = new URLSearchParams(window.location.search);
    curentParams.forEach((value, key) => {
      if (!ALLOWED_FILTER_PARAMETERS.includes(key)) {
        newParams.set(key, value);
      }
    });

    if (newParams.toString() !== curentParams.toString()) {
      window.history.pushState({}, '', `${window.location.pathname}?${newParams.toString()}`);
    }
  };

  /**
   * Loads the state and updates the component accordingly.
   * @param {Object} state - The new state to load.
   * @returns {Promise<void>} A promise that resolves when the state is loaded.
   */
  loadState = async (state) => {
    await this.setStatePromise({ ...state, loading: false });
    if (this.state && this.state.products) {
      this.filterChange = false;
      this.paginationClick = false;
    }
    this.props.resolve();

    if (this.state.loading === false) {
      window.adobeDataLayer.push((dl) => {
        const searchResultsContext = dl.getState('searchResultsContext') ?? { units: [] };
        const searchRequestId = window.sessionStorage.getItem('searchRequestId');
        const searchUnitId = 'livesearch-plp';
        const searchResultUnit = {
          searchUnitId,
          searchRequestId,
          products: this.state.products.items.map((p, index) => ({
            name: p.name,
            sku: p.sku,
            url: new URL(rootLink(`/products/${p.urlKey}/${p.sku}`), window.location).toString(),
            imageUrl: p.images?.length ? p.images[0].url : '',
            price: p.price?.final?.amount?.value ?? p.priceRange?.minimum?.final?.amount?.value,
            rank: index,
          })),
          categories: [],
          suggestions: [],
          page: this.state.currentPage,
          perPage: this.state.currentPageSize,
          facets: this.state.facets,
        };
        const index = searchResultsContext.units.findIndex((u) => u.searchUnitId === searchUnitId);
        if (index < 0) {
          searchResultsContext.units.push(searchResultUnit);
        } else {
          searchResultsContext.units[index] = searchResultUnit;
        }
        dl.push({ searchResultsContext });
        dl.push({ event: 'search-response-received', eventInfo: { ...dl.getState(), searchUnitId } });
        if (this.props.type === 'search') {
          dl.push({ event: 'search-results-view', eventInfo: { ...dl.getState(), searchUnitId } });
        } else {
          dl.push({
            categoryContext: {
              name: this.state.category.name,
              urlKey: this.state.category.urlKey,
              urlPath: this.state.category.urlPath,
            },
          });
          dl.push({ event: 'category-results-view', eventInfo: { ...dl.getState(), searchUnitId } });
        }
      });
    }
  };

  /**
   * Loads the products based on the current state.
   * @returns {Promise<void>} A promise that resolves when the products are loaded.
   */
  loadProducts = async () => {
    this.setState({ loading: true });

    const state = await loadCategory(this.state);
    await this.loadState(state);
  };

  /**
   * Lifecycle method called when the component is mounted.
   */
  async componentDidMount() {
    if (window.loadCategoryPromise) {
      const state = await window.loadCategoryPromise;
      await this.loadState(state);
    } else {
      await this.loadProducts();
    }

    if ('IntersectionObserver' in window && isMobile && this.state.products.items.length === 6 && this.state.products.total > 6) {
      const scrollToBottomObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.setState({ currentPageSize: PAGE_SIZE_DESKTOP, basePageSize: PAGE_SIZE_DESKTOP });
            scrollToBottomObserver.unobserve(entry.target);
          }
        });
      });
      if (this.secondLastProduct.current) {
        scrollToBottomObserver.observe(this.secondLastProduct.current);
      }
    }
  }

  /**
   * Lifecycle method called when the component is updated.
   * @param {Object} prevProps - The previous properties.
   * @param {Object} prevState - The previous state.
   */
  componentDidUpdate(_, prevState) {
    ProductListPage.updateQueryParams({
      page: this.state.currentPage,
      basePageSize: this.state.basePageSize,
      pageSize: this.state.currentPageSize,
      sort: this.state.sort,
      sortDirection: this.state.sortDirection,
      q: this.state.searchTerm,
      ...this.state.filters,
    });

    const diff = Object.keys(Object.keys(prevState).reduce((acc, key) => {
      if (prevState[key] !== this.state[key]) {
        acc[key] = this.state[key];
      }
      return acc;
    }, {}));

    const keysToCheck = ['filters', 'sort', 'sortDirection', 'searchTerm', 'currentPageSize', 'currentPage'];
    if (keysToCheck.some((key) => diff.includes(key))) {
      this.loadProducts();
    }
  }

  /**
   * Handles page change events.
   * @param {number} page - The new page number.
   */
  onPageChange(page) {
    this.setState({ currentPage: page });
    this.paginationClick = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Handles filter change events.
   * @param {Object} filters - The new filters to apply.
   */
  handleFilterChange(filters) {
    const newState = { filters, currentPage: 1 };
    if (this.state.currentPageSize === PAGE_SIZE_MOBILE) {
      newState.basePageSize = PAGE_SIZE_DESKTOP;
      newState.currentPageSize = PAGE_SIZE_DESKTOP;
    }
    this.setState(newState);
    this.filterChange = true;
  }

  /**
   * Handles sort change events.
   * @param {string} sort - The new sort attribute.
   * @param {string} direction - The new sort direction.
   */
  handleSortChange(sort, direction) {
    const newState = { sort, sortDirection: direction };
    if (this.state.currentPageSize === PAGE_SIZE_MOBILE) {
      newState.basePageSize = PAGE_SIZE_DESKTOP;
      newState.currentPageSize = PAGE_SIZE_DESKTOP;
    }
    this.setState(newState);
  }

  /**
   * Renders the component.
   * @param {Object} props - The properties passed to the component.
   * @param {Object} state - The current state of the component.
   * @returns {JSX.Element} The rendered component.
   */
  render(props, state) {
    const { type = 'category' } = props;
    const filtersCount = ((Object.keys(state.filters).length) - 1);
    const labelResult = props.labels?.PLP?.Title?.Category?.Total?.result || 'result'; 
    const labelResults = props.labels?.PLP?.Title?.Category?.Total?.results || 'results'; 

    return html`<${Fragment}>
      <div class="product-list-page">
        <div class="product-list-page__title">
          <h1>${state.category.name}</h1>
          <a class="product-list-page__title-link" href="#productList">${props.labels?.PLP?.Title?.Category?.link}</a>
        </div>
        <div class="product-list-page__control">
          <div class="product-list-page__filters">
            ${!state.loading && html`<span class="product-list-page__total">${state.products.total} ${state.products.total === 1 ? labelResult : labelResults}</span>`}
            <${FacetList} 
              facets=${state.facets}
              filters=${state.filters}
              facetMenuRef=${this.facetMenuRef}
              onFilterChange=${this.handleFilterChange.bind(this)}
              loading=${state.loading}
              totalProducts=${state.products.total}
              labels=${props.labels} />
          </div>
          <div class="product-list-page__sort">
            <${Sort}
              disabled=${state.loading}
              currentSort=${state.sort}
              sortDirection=${state.sortDirection}
              type=${type}
              onSort=${this.handleSortChange.bind(this)}
              sortMenuRef=${this.sortMenuRef}
              labels=${props.labels} />
          </div>
        </div>
        <div id="productList" class="product-list">
          <${ProductCard}
            products=${state.products}
            secondLastProduct=${this.secondLastProduct}
            loading=${state.loading}
            currentPageSize=${state.currentPageSize}
            labels=${props.labels} />
        </div>
        <${Pagination}
          pages=${state.pages}
          currentPage=${state.currentPage}
          pageSizeOptions=${[state.basePageSize, 24, 36]}
          currentPageSize=${state.currentPageSize}
          loading=${state.loading}
          onPageChange=${this.onPageChange.bind(this)}
          onPageSizeChange=${(pageSize) => this.setState({ currentPageSize: pageSize, currentPage: 1 })} />
      </div>
    </>`;
  }
}

/**
 * Retrieves category information from the URL.
 * @returns {Object|null} An object containing the category ID and URL path, or null if the URL is invalid.
 */
function getCategoryInfo() {
  // Get the path from the URL
  const path = window.location.pathname;

  // Check if the path contains "/categories/"
  const pathParts = path.split('/categories/')[1];

  if (!pathParts) {
    console.error('The URL does not contain the expected parameters.');
    return null; // Return null if the path is invalid
  }

  // The urlPath is everything that follows after "/categories/"
  const urlpath = pathParts; // This is everything that remains after "/categories/"

  // Return an object with the urlPath and a dummy id
  return { id: 'dummy', urlpath };
}

/**
 * Decorates the block with the ProductListPage component.
 * @param {HTMLElement} block - The block element to decorate.
 * @returns {Promise<void>} A promise that resolves when the block is decorated.
 */
export default async function decorate(block) {
  const config = getCategoryInfo();
  const labels = await fetchPlaceholders();

  block.textContent = '';
  block.dataset.category = config.urlpath;
  block.dataset.urlpath = config.urlpath;

  return new Promise((resolve) => {
    const app = html`<${ProductListPage} ...${config} block=${block} resolve=${resolve} labels=${labels} />`;
    render(app, block);
  });
}
