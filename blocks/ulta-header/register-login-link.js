import {
  h,
} from '@dropins/tools/preact.js';
import { useState, useEffect } from '@dropins/tools/preact-hooks.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);

export const RegisterLogin = ({ label }) => {
  const [loginVisible, setLoginVisible] = useState(true);

  useEffect(() => {
    //TODO CDC
  }, []);

  return html`
    <div class="account-register-login">
    ${loginVisible ? html`<a href="#" aria-label="Account"> ${label} </a>` : ''}
   </div>
`;
};

export default RegisterLogin;
