export default function decorate(block) {
  const form = document.createElement('form');
  const leftSide = document.createElement('div');
  const formImage = document.createElement('img');

  leftSide.classList.add('left-side');
  formImage.classList.add('right-side');

  const createPTag = (name, text) => {
    const p = document.createElement('p');
    p.textContent = text;
    p.classList.add(name);
    return p;
  }
  
  const productTitleContainer = document.createElement('div');
  const calificationContainer = document.createElement('div');
  const infoContainer = document.createElement('div');

  const formTitle = createPTag('form-title', 'Calificar producto');
  const formSubTitle = createPTag('form-sub-title', 'Estas revisando: ');
  const productTitle = createPTag('product-title', '*nombre*');
  const calificationTitle = createPTag('calification-title', 'Tu puntuacion*');

  const createInputContainer = (title, textArea = false) => {
    const div = document.createElement('div');
    const p = document.createElement('p');
    const input = document.createElement(textArea ? 'textarea': 'input');
    p.textContent = title;
    textArea ? input.name = 'Review' : input.type = 'text';
    input.title = 'input'

    div.classList.add('form-input-container');
    div.replaceChildren(p, input);
    return div;
  }

  const formNameContainer = createInputContainer('Nombre o apodo');
  const formMatterContainer = createInputContainer('Asunto de la reseña');
  const formReviewContainer = createInputContainer('Reseña', true);

  const formSubmitButton = document.createElement('button');
  formSubmitButton.setAttribute('type', 'button');
  formImage.setAttribute('alt', '*alt image*');
  formSubmitButton.textContent = 'ENVIAR RESEÑA';

  productTitleContainer.replaceChildren(formSubTitle, productTitle);
  calificationContainer.replaceChildren(calificationTitle);
  infoContainer.replaceChildren(formNameContainer, formMatterContainer, formReviewContainer);

  leftSide.replaceChildren(formTitle, productTitleContainer, calificationContainer, infoContainer, formSubmitButton);
  form.replaceChildren(leftSide, formImage);
  block.replaceChildren(form);
}
