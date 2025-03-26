export default function decorate(block) {
  block.classList.add('test-buttom');

  // Se espera que el bloque contenga un elemento <button>.
  const btn = block.querySelector('button');
  if (btn) {
    btn.addEventListener('click', () => {
      console.log('¡Botón clickeado!');
      // Aquí puedes agregar la lógica que necesites para el botón.
    });
  }
}
