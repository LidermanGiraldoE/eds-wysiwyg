export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('promotionscodebar-list');

  [...block.children].forEach((row) => {
    const item = document.createElement('a');
    item.classList.add('promotionscodebar-item');
    while (row.firstElementChild) {
      item.append(row.firstElementChild);
    }
    container.append(item);
  });

  block.textContent = '';
  block.append(container);
}
