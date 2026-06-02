import React, { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PrimeReactProvider } from 'primereact/api';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import "./index.css";


const root = ReactDOM.createRoot(document.getElementById('root'));
const value = {
     cssTransition: false,
     inputStyle: 'filled',
 };
root.render(
     <PrimeReactProvider value={value}>
            <App />
        </PrimeReactProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
