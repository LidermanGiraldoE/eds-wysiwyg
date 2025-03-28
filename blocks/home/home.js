// @ts-ignore
import { h } from '@dropins/tools/preact.js';
import { useEffect, useState } from '@dropins/tools/preact-hooks.js';
import htm from '../../../scripts/htm.js';

const html = htm.bind(h);
/**
 *
 * @param {*} param0
 * @returns
 *
 */

export const CustomeIcon = ({ icon = 'arrow-up', color = 'black' }) => {
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    fetch(`./icons/ultaIcons/${icon}.svg`)
      .then((res) => res.text())
      .then(setSvgContent);
  }, [icon]);

  return html`
    <div className="${['customeWrapper', `color-${color}`].join(' ')}">
      <h1>Hola soy el home</h1>
    </div>
  `;
};

export default CustomeIcon;
