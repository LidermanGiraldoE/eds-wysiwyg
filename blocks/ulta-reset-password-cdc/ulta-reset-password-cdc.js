/* global gigya */

function getAccountInfoResponse(response) {
  if (response.errorCode === 0) { // Corregido '==' a '==='
    const { profile } = response; // Uso de destructuración
    const msg = `${profile.firstName} is ${profile.age} years old`;
    console.log(msg); // Reemplazo de alert() por console.log()
  } else {
    console.error(`Error: ${response.errorMessage}`); // Reemplazo de alert() por console.error()
  }
}

function initializeGigya(container) {
  window.gigyaConf = { // Eliminar el guion bajo inicial
    onGigyaServiceReady() { // Uso de shorthand
      if (typeof gigya === 'undefined') {
        console.error('Gigya is not defined');
        return;
      }

      gigya.accounts.addEventHandlers({
        onLogin(r) { // Uso de shorthand
          console.log('User is logged in', r);
          gigya.accounts.getAccountInfo({ callback: getAccountInfoResponse });
        },
        onLogout(r) { // Uso de shorthand
          console.log('User is logged out', r);
          gigya.accounts.showScreenSet({
            screenSet: 'Default-LiteRegistration',
            containerID: container.id,
          });
        },
      });

      gigya.accounts.session.verify({
        callback(response) { // Uso de shorthand
          if (response.errorCode === 0) { // Corregido '==' a '==='
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
  console.log('block', block);
  block.innerHTML = '';

  const container = document.createElement('div');
  container.id = 'ulta-reset-password-cdc-container';
  block.appendChild(container);
  initializeGigya(container);
}
