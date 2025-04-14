/**
 * Accordion functionality for product details.
 * Toggles the visibility of the accordion sections with the ability to open multiple.
 * Adds smooth transition for opening and closing.
 */

export function accordion() {
  const accordions = document.querySelectorAll('.pal-c-Accordion');

  accordions.forEach((accordion) => {
    const button = accordion.querySelector('.pal-c-Accordion__button');
    const section = accordion.querySelector('.pal-c-Accordion__body');

    accordion.classList.remove('pal-c-Accordion--is-active');
    button.setAttribute('aria-expanded', 'false');
    section.style.maxHeight = '0';
  });

  const accordionButtons = document.querySelectorAll('.pal-c-Accordion__button');

  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const accordion = button.closest('.pal-c-Accordion');
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const section = accordion.querySelector('.pal-c-Accordion__body');

      if (isExpanded) {
        accordion.classList.remove('pal-c-Accordion--is-active');
        button.setAttribute('aria-expanded', 'false');
        section.style.maxHeight = '0';
      } else {
        accordion.classList.add('pal-c-Accordion--is-active');
        button.setAttribute('aria-expanded', 'true');
        section.style.maxHeight = `${section.scrollHeight}px`;
      }
    });
  });
}
