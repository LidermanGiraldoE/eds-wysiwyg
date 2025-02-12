import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const div = document.createElement('div');
  [...block.children].forEach((row) => {
    const a = document.createElement('a');
    moveInstrumentation(row, a);
    while (row.firstElementChild) a.append(row.firstElementChild);
    div.className = 'promotionscodebar-list';
    div.append(a);
  });
  block.textContent = '';
  block.append(div);
}
