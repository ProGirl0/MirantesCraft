import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { suppressHostingErrors, setupDevelopmentConfig, checkFirebaseConfig, checkAuthorizedDomain } from './utils/firebaseConfig.js'

// Configurar Firebase antes de renderizar
suppressHostingErrors();
setupDevelopmentConfig();

// Verificar configuração
if (import.meta.env.DEV) {
  checkFirebaseConfig();
  checkAuthorizedDomain();
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
)
