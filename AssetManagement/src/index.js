import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { DataTableCrudDemo } from './components/Item';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "primereact/resources/primereact.min.css";
// import Cards from './components/cards'
ReactDOM.render(
  <React.StrictMode>
    <App />
    
    <DataTableCrudDemo/>
    {/* <Cards/> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
