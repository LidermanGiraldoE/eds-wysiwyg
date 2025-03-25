export default function decorate(block) {
  const container = document.createElement('div');
  const mainTitle = document.createElement('p');
  const reviewsContainer = document.createElement('ul');

  mainTitle.textContent = 'Reseñas de los clientes';

  const createPTags = (arr) => arr.map(element => {
    const p = document.createElement('p');
    p.textContent = element;
    return p;
  });

  const createReview = () => {
    const reviewContainer = document.createElement('li');
    
    reviewContainer.replaceChildren(...createPTags([
      'Review title', 
      'Review score title',
      'Review text', 
      'Review author',
      'Review date'
    ]));

    reviewsContainer.append(reviewContainer);
  }

  createReview();

  container.replaceChildren(mainTitle, reviewsContainer);
  block.replaceChildren(container);
  console.log(block);
}
