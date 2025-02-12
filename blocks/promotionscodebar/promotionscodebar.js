import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const div = document.createElement('div');
  div.className = 'promotionscodebar-list';

  [...block.children].forEach((row) => {
    const a = document.createElement('a');
    a.className = 'promotionscodebar-item';

    const rowChildren = [...row.children];
    rowChildren.forEach((child, index) => {
      if (index === 0) {
        const p = document.createElement('p');
        p.textContent = child.textContent;
        moveInstrumentation(child, p);
        a.append(p);
        child.remove();
      } else if (index === 1) {
        const p = document.createElement('p');
        p.textContent = child.textContent;
        moveInstrumentation(child, p);
        a.append(p);
        child.remove();
      } else if (index === rowChildren.length - 1) {
        const url = child.querySelector('p')?.textContent.trim();
        if (url) {
          a.href = url;
          child.remove();
        }
      }
    });
    moveInstrumentation(row, a);
    div.append(a);
  });

  block.textContent = '';
  block.append(div);
}
