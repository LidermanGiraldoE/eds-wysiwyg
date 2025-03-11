export default function decorate(block) {
  console.log('Decorating block:', block);

  // Agregar clase al bloque principal
  block.classList.add('ulta-category-blogs');

  // Extraer y estructurar el contenido
  const [title, subtitle, ...items] = [...block.children];

  // Crear encabezado con clases diferenciadas
  const header = document.createElement('div');
  header.classList.add('ulta-category-header');

  if (title) {
      title.classList.add('ulta-category-title'); // Clase para título principal
      header.appendChild(title);
  }

  if (subtitle) {
      subtitle.classList.add('ulta-category-subtitle'); // Clase para subtítulo
      header.appendChild(subtitle);
  }

  // Reemplazar encabezado en el bloque
  block.innerHTML = '';
  block.appendChild(header);

  // Crear contenedor de tarjetas
  const blogContainer = document.createElement('div');
  blogContainer.classList.add('ulta-category-container');

  items.forEach((item) => {
      // Verificar si el item contiene información relevante
      const imgWrapper = item.querySelector('picture');
      const img = imgWrapper ? imgWrapper.querySelector('img') : null;
      const title = item.querySelector('div:nth-of-type(2)');
      const description = item.querySelector('div:nth-of-type(3)');
      const buttonContainer = item.querySelector('.button-container');

      if (!img || !title || !description || !buttonContainer) {
          return;
      }

      // Extraer enlace del botón
      const buttonLink = buttonContainer.querySelector('a');
      const href = buttonLink ? buttonLink.getAttribute('href') : '#';

      // Crear tarjeta
      const blogCard = document.createElement('div');
      blogCard.classList.add('ulta-category-card');

      // Agregar imagen
      const imgContainer = document.createElement('div');
      imgContainer.classList.add('ulta-category-image');
      imgContainer.appendChild(img);
      blogCard.appendChild(imgContainer);

      // Contenedor de texto
      const textContainer = document.createElement('div');
      textContainer.classList.add('ulta-category-text');

      // Aplicar clases diferenciadas a título y descripción
      title.classList.add('ulta-category-card-title'); // Clase para el título del servicio
      description.classList.add('ulta-category-card-description'); // Clase para la descripción

      textContainer.appendChild(title);
      textContainer.appendChild(description);

      // Crear enlace "Saber más"
      const ctaElement = document.createElement('a');
      ctaElement.classList.add('ulta-category-cta');
      ctaElement.href = href;
      ctaElement.textContent = 'Saber más';

      textContainer.appendChild(ctaElement);
      blogCard.appendChild(textContainer);
      blogContainer.appendChild(blogCard);
  });

  block.appendChild(blogContainer);
}
