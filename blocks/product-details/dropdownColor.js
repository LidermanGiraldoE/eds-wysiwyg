/**
 * Build a custom select for a product's colors and sync with color swatches.
 * @param {Object} product
 */

 // eslint-disable-next-line import/prefer-default-export
 export function dropdownColor(product) {
  if (!product || !product.options) {
    console.error('The product is not defined or has no options.');
    return;
  }

  const colorOption = product.options.find((option) => option.id === 'ulta_color' || 'color');

  if (!colorOption || !colorOption.items) {
    console.warn('No color options were found for the product.');
    return;
  }

  const colorSelectContainer = document.querySelector('.product-details__color-select');
  const colorTitleContainer = document.querySelector('.product-details__color-selected .item-name');
  const colorContainer = document.querySelector('.product-details__color-selected .item-color');
  const colorsContainer = document.querySelector('.product-details__colors');

  if (!colorSelectContainer || !colorTitleContainer || !colorsContainer) {
    console.error('Required elements are missing from the DOM.');
    return;
  }

  colorSelectContainer.innerHTML = '';
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'product-details__select-options';
  let defaultSelectedId = localStorage.getItem('selectedColorId');

  if (!defaultSelectedId) {
    defaultSelectedId = colorOption.items[0].id;
  }

  colorOption.items.forEach((item) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'product-details__select-option';

    const colorDiv = document.createElement('div');
    colorDiv.className = 'product-details__color-preview';
    colorDiv.style.backgroundColor = item.value;
    optionDiv.appendChild(colorDiv);

    const labelSpan = document.createElement('span');
    labelSpan.textContent = item.label;
    optionDiv.appendChild(labelSpan);

    optionDiv.dataset.colorId = item.id;

    if (item.id === defaultSelectedId) {
      optionDiv.classList.add('selected');
      colorTitleContainer.textContent = `${item.label}`;
      colorContainer.style.backgroundColor = `${item.value}`;
    }

    optionDiv.addEventListener('click', () => {
      const selectedOption = optionsContainer.querySelector('.selected');
      if (selectedOption) {
        selectedOption.classList.remove('selected');
      }

      optionDiv.classList.add('selected');

      localStorage.setItem('selectedColorId', item.id);
      colorTitleContainer.textContent = `${item.label}`;
      colorContainer.style.backgroundColor = `${item.value}`;

      // Here we synchronize the click with the color swatch
      const swatchInput = document.querySelector(`input[type="radio"][id="${item.id}"]`);
      if (swatchInput) {
        swatchInput.click();
      }
    });

    optionsContainer.appendChild(optionDiv);
  });

  colorSelectContainer.appendChild(optionsContainer);
  colorsContainer.addEventListener('click', () => {
    const isActive = optionsContainer.classList.contains('_active');
    if (isActive) {
      optionsContainer.classList.remove('_active');
    } else {
      optionsContainer.classList.add('_active');
    }
  });

  document.addEventListener('click', (event) => {
    if (!colorsContainer.contains(event.target)) {
      optionsContainer.classList.remove('_active');
    }
  });

  // Sync with swatches
  const swatchInputs = document.querySelectorAll('.dropin-color-swatch');
  swatchInputs.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      const colorId = swatch.id;
      const selectedOption = optionsContainer.querySelector(`[data-color-id="${colorId}"]`);

      if (selectedOption) {
        const selectedDropdownOption = optionsContainer.querySelector('.selected');
        if (selectedDropdownOption) {
          selectedDropdownOption.classList.remove('selected');
        }
        selectedOption.classList.add('selected');

        const colorValue = swatch.value;
        const colorLabel = selectedOption.querySelector('span').textContent;

        colorTitleContainer.textContent = colorLabel;
        colorContainer.style.backgroundColor = colorValue;

        localStorage.setItem('selectedColorId', colorId);
      }
    });
  });
}
