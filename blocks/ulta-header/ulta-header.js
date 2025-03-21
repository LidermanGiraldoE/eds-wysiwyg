export default function decorate(block) {
  // Limpiamos el contenido existente
  block.innerHTML = '';

  // Inyectamos HTML quemado
  block.innerHTML = `
    <!-- Barra superior (full-width) -->
    <div class="ulta-header-topbar">
      <!-- Contenedor interno limitado a 1360px -->
      <div class="ulta-header-topbar-inner">
        <div class="ulta-header-topbar-shipping">
          <span>Envío gratuito en órdenes mayores a MXN$600</span>
        </div>
        <div class="ulta-header-topbar-links">
          <ul>
            <li><a href="#">Iniciar sesión</a></li>
            <li><a href="#">Registrarse</a></li>
            <li><a href="#">Rastrea una orden</a></li>
            <li><a href="#">Encuentra una tienda</a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Contenedor interno (máximo 1360px) para el resto del header -->
    <div class="ulta-header-inner">
      <!-- Contenedor principal -->
      <div class="ulta-header-main">
        <!-- Logo -->
        <div class="ulta-header-logo">
          <a href="#">
            <img 
              src="../icons/Logodesktop.svg" 
              alt="Ulta Beauty Logo"
            />
          </a>
        </div>

        <!-- Navegación principal -->
        <nav class="ulta-header-nav">
          <ul>
            <li><a href="#">Categorías</a></li>
            <li><a href="#">Novedades</a></li>
            <li><a href="#">Marcas</a></li>
            <li><a href="#">Promociones</a></li>
            <li><a href="#">Orgullosamente mexicano</a></li>
          </ul>
        </nav>

        <!-- Buscador -->
        <div class="ulta-header-search">
          <input 
            type="text" 
            placeholder="Buscar productos y más" 
            aria-label="Buscar productos"
          />
          <button type="button" aria-label="Buscar">
            <img 
              src="../icons/Search--Streamline-Streamline--3.0.svg" 
              alt="Icono de búsqueda"
            />
          </button>
        </div>

        <!-- Íconos (favoritos, cuenta, bolsa) -->
        <div class="ulta-header-icons">
          <a href="#" class="ulta-header-icon" aria-label="Favoritos">
            <img 
              src="../icons/Grupo200284.svg" 
              alt="Ícono de favoritos"
            />
          </a>
          <a href="#" class="ulta-header-icon" aria-label="Bolsa de compras">
            <img 
              src="../icons/bag.svg" 
              alt="Ícono de bolsa de compras"
            />
          </a>
          <a href="#" class="ulta-header-icon" aria-label="Mi cuenta">
            <img 
              src="../icons/Grupo201637.svg" 
              alt="Ícono de cuenta"
            />
          </a>
        </div>
      </div>
    </div>
  `;

  // Agrega el listener al botón "Mi cuenta"
  const accountButton = block.querySelector('.ulta-header-icon[aria-label="Mi cuenta"]');
  if (accountButton) {
    // En tu header.js, dentro del eventListener de "Mi cuenta":
    // Ejemplo en header.js
    const accountButton = block.querySelector('.ulta-header-icon[aria-label="Mi cuenta"]');
    if (accountButton) {
      accountButton.addEventListener('click', (e) => {
        e.preventDefault();
        // Buscamos el overlay del login
        const overlay = document.querySelector('.ulta-login-cdc-overlay');
        if (overlay) {
          overlay.style.display = 'block'; // Muestra el panel
        }
      });
    }
  }
}

