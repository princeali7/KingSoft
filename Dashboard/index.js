import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import DB from './BaseStore/Store';
ReactDOM.render(<App  db={DB} />, document.getElementById('root'));

