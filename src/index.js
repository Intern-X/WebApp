import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react"
import { persistStore } from "redux-persist";
import store from './redux/store';

let persistor = persistStore(store);

ReactDOM.render(
  
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
      <App />
      </PersistGate>
      </Provider>
    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
