export default function decorate(block) {
  const form = document.createElement('form');
  const leftSide = document.createElement('div');
  const rightSide = document.createElement('img');

  leftSide.classList.add('left-side');
  rightSide.classList.add('right-side');

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

  const createInputContainer = (className, title, textArea = false) => {
    const div = document.createElement('div');
    const p = document.createElement('p');
    const input = document.createElement(textArea ? 'textarea': 'input');
    p.textContent = title;

    div.classList.add(className);
    div.replaceChildren(p, input);
    return div;
  }

  const formNameContainer = createInputContainer('form-name-container', 'Nombre o apodo');
  const formMatterContainer = createInputContainer('form-matter-container', 'Asunto de la reseña');
  const formReviewContainer = createInputContainer('form-name-container', 'Reseña', true);

  productTitleContainer.replaceChildren(formSubTitle, productTitle);
  calificationContainer.replaceChildren(calificationTitle);
  infoContainer.replaceChildren(formNameContainer, formMatterContainer, formReviewContainer);

  leftSide.replaceChildren(formTitle, productTitleContainer, calificationContainer, infoContainer);
  form.replaceChildren(leftSide, rightSide);
  block.replaceChildren(form);

  console.log(block);
}
