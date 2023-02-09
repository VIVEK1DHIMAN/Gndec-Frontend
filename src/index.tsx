import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
// import { isPlatform, setupConfig, getPlatforms } from '@ionic/react';

import store from './store';
import { StoreProvider } from 'easy-peasy';

// console.log(getPlatforms())
// if (isPlatform("android")) {
//   setupConfig({ mode: 'ios' });
// }

ReactDOM.render(
  <StoreProvider store={store}>
    {process.env.REACT_APP_MAINTAINANCE_MODE ?
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', margin: 'auto' }}>
        We are under Maintainance and will be back soon!
      </div> :
      <App />}
  </StoreProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
