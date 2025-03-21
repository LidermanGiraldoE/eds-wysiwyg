/* global gigya */

function getAccountInfoResponse(response) {
  if (response.errorCode === 0) {
    const { profile } = response;
    const msg = `${profile.firstName} is ${profile.age} years old`;
    console.log(msg);
  } else {
    console.error(`Error: ${response.errorMessage}`);
  }
}

function initializeGigya(container) {
  window.gigyaConf = {
    onGigyaServiceReady() {
      if (typeof gigya === 'undefined') {
        console.error('Gigya is not defined');
        return;
      }

      gigya.accounts.addEventHandlers({
        onLogin(r) {
          console.log('User is logged in', r);
          if (typeof gigya !== 'undefined') {
            gigya.accounts.getAccountInfo({ callback: getAccountInfoResponse });
          }
        },
        onLogout(r) {
          console.log('User is logged out', r);
          if (typeof gigya !== 'undefined') {
            gigya.accounts.showScreenSet({
              screenSet: 'Default-LiteRegistration',
              containerID: container.id,
            });
          }
        },
      });

      gigya.accounts.session.verify({
        callback(response) {
          if (typeof gigya !== 'undefined') {
            if (response.errorCode === 0) {
              gigya.accounts.showScreenSet({
                screenSet: 'Default-ProfileUpdate',
                containerID: container.id,
              });
            } else {
              gigya.accounts.showScreenSet({
                screenSet: 'Default-RegistrationLogin',
                containerID: container.id,
              });
            }
          }
        },
      });
    },
  };

  const gigyaScript = document.createElement('script');
  gigyaScript.src = 'https://cdns.gigya.com/js/gigya.js?apikey=4_VdOdUO1BkYX2CMMdGd8LhA';
  gigyaScript.onload = () => {
    if (typeof gigya !== 'undefined' && window.gigyaConf.onGigyaServiceReady) {
      window.gigyaConf.onGigyaServiceReady();
    }
  };
  document.head.appendChild(gigyaScript);
}

export default async function decorate(block) {
  // Limpiamos el contenido existente
  block.innerHTML = '';

  // 1) Creamos el overlay que cubre la pantalla
  const overlay = document.createElement('div');
  overlay.classList.add('ulta-login-cdc-overlay');
  // Por defecto, oculto
  overlay.style.display = 'none';

  // 2) Creamos el panel lateral
  const panel = document.createElement('div');
  panel.classList.add('ulta-login-cdc-panel');

  // 3) Crea un contenedor para el "header" del panel
  const panelHeader = document.createElement('div');
  panelHeader.classList.add('ulta-login-cdc-header');

  // 4) Crea el botón de cerrar
  const closeButton = document.createElement('button');
  closeButton.classList.add('ulta-login-cdc-close');
  closeButton.type = 'button';
  closeButton.innerHTML = '<img src="../icons/X.svg" alt="Cerrar" />';

  // 5) El contenedor para Gigya
  const container = document.createElement('div');
  container.id = 'ulta-login-cdc-container';

  // 6) Arma la estructura
  panelHeader.appendChild(closeButton);   
  panel.appendChild(panelHeader);        
  panel.appendChild(container);
  overlay.appendChild(panel);
  block.appendChild(overlay);

  // 7) Inicializa Gigya
  initializeGigya(container);

  // 8) Evento para cerrar el overlay
  closeButton.addEventListener('click', () => {
    overlay.style.display = 'none';
  });
}

