// button.js
export default function decorate(block) {
    block.classList.add('button-block');
    
    // Suponiendo que el contenido del bloque es un botón (<button>)
    const btn = block.querySelector('button');
    if (btn) {
      btn.addEventListener('click', () => {
        console.log('¡Botón clickeado!');
        // Puedes agregar aquí la lógica que necesites para el botón.
      });
    }
  }
  