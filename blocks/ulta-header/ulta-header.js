export default function decorate(block) {
  // Limpia el contenido existente del bloque
  block.innerHTML = '';

  // Construimos el HTML "quemado" con la clase renombrada a .ulta-header-inner
  block.innerHTML = `
    <div class="ulta-header-inner">
      <!-- Barra superior -->
      <div class="ulta-header-topbar">
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

      <!-- Contenedor principal -->
      <div class="ulta-header-main">
        <!-- Logo -->
        <div class="ulta-header-logo">
          <a href="#">
            <img 
              src="https://author-p34631-e1321407.adobeaemcloud.com/ui#/aem/assetdetails.html/content/dam/learning-wysiwyg-con-edge-delivery-services/generales/logos/Logo%20desktop.svg" 
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
              src="https://via.placeholder.com/16x16?text=🔍" 
              alt="Icono de búsqueda"
            />
          </button>
        </div>

        <!-- Íconos (favoritos, cuenta, bolsa) -->
        <div class="ulta-header-icons">
          <a href="#" class="ulta-header-icon" aria-label="Favoritos">
            <img 
              src="https://via.placeholder.com/16x16?text=❤" 
              alt="Ícono de favoritos"
            />
          </a>
          <a href="#" class="ulta-header-icon" aria-label="Bolsa de compras">
            <img 
              src="https://via.placeholder.com/16x16?text=🛍" 
              alt="Ícono de bolsa de compras"
            />
          </a>
          <a href="#" class="ulta-header-icon" aria-label="Mi cuenta">
            <img 
              src="https://via.placeholder.com/16x16?text=👤" 
              alt="Ícono de cuenta"
            />
          </a>
        </div>
      </div>
    </div>
  `;
}
