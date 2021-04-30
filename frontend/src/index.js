
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

/*
  We assign the component <App/> to an arbitrary variable just because.
*/
const app = <App />

/*
  ReactDom renders our app component as the div element in index.html with 'root' as the Id
*/
ReactDOM.render(
  app,
  document.getElementById('root')
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
