import { h, render } from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';
import { StaticBanner } from './render.js';

const html = htm.bind(h);

export default async function decorate(block) {
  const children = Array.from(block.children).filter((c) => c.nodeType === 1);

  const [
    imageDesktopEl,
    imageMobileEl,
    imageAltEl,
    titleEl,
    descriptionEl,
    backgroundColorEl,
    borderColorEl,
  ] = children;

  const imageDesktop = imageDesktopEl.querySelector('img')?.src || '';
  const imageMobile = imageMobileEl.querySelector('img')?.src || '';
  const imageAlt = imageAltEl.textContent.trim() || '';
  const title = titleEl.textContent.trim() || '';
  const description = descriptionEl.innerHTML || '';
  const contentBackgroundColor = backgroundColorEl.textContent.trim() || '#ffffff';
  const contentBorderColor = borderColorEl.textContent.trim() || '#e35200';

  const props = {
    imageDesktop,
    imageMobile,
    imageAlt,
    title,
    description,
    contentBackgroundColor,
    contentBorderColor,
  };

  block.innerHTML = '';
  render(html`<${StaticBanner} ...${props} />`, block);
}
