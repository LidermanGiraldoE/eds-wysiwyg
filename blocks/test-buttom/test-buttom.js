export default function decorate(block) {
  block.classList.add('button-block');
  
  // Suponiendo que el contenido del bloque es un <button>
  const btn = block.querySelector('button');
  if (btn) {
    btn.addEventListener('click', () => {
      console.log('¡Botón clickeado!');
      // Aquí puedes agregar la lógica que necesites para el botón.
    });
  }
}
