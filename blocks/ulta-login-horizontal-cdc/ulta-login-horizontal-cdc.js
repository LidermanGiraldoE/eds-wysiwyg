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
  console.log('block', block);
  block.innerHTML = '';

  const container = document.createElement('div');
  container.id = 'ulta-login-horizontal-cdc-container';
  block.appendChild(container);
  initializeGigya(container);
}
