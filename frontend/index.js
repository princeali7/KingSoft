import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import DB from './BaseStore/Store';
//import registerServiceWorker from './registerServiceWorker';



ReactDOM.render(<App  db={DB} />, document.getElementById('conversionKing'));
//registerServiceWorker();
