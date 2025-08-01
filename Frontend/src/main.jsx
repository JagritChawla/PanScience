import { StrictMode } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import { createRoot } from 'react-dom/client'

import store from './store';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </StrictMode>,
)
