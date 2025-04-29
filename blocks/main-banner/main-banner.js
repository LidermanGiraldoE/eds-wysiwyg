import { h, render } from '@dropins/tools/preact.js';
import MainBanner from './MainBanner.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);

export default async function decorate(block) {
  const children = Array.from(block.children).filter(c => c.nodeType === 1);

  const [
    imageDesktopEl,
    imageMobileEl,
    imageAltEl,
    highlightTextEl,
    taglineEl,
    titleEl,
    descriptionEl,
    buttonTextEl,
    buttonLinkEl,
    styleDesktopEl,
    styleMobileEl,
  ] = children;

  const imageDesktop = imageDesktopEl.querySelector('img')?.src || '';
  const imageMobile = imageMobileEl.querySelector('img')?.src || '';
  const imageAlt = imageAltEl.textContent.trim() || '';
  const highlightText = highlightTextEl.textContent.trim() || '';
  const tagline = taglineEl.textContent.trim() || '';
  const title = titleEl.textContent.trim() || '';
  const description = descriptionEl.textContent.trim() || '';
  const buttonText = buttonTextEl.textContent.trim() || '';
  const buttonLink = buttonLinkEl.querySelector('a')?.href || '';
  const styleDesktop = styleDesktopEl.textContent.trim() || '';
  const styleMobile = styleMobileEl.textContent.trim() || '';

  const props = {
    imageDesktop,
    imageMobile,
    imageAlt,
    highlightText,
    tagline,
    title,
    description,
    buttonText,
    buttonLink,
    styleDesktop,
    styleMobile
  };

  console.log('MainBanner props:', props);

  block.innerHTML = '';
  render(html`<${MainBanner} ...${props} />`, block);
}
