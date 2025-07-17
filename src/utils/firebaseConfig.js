// Utilitários para configuração do Firebase
export const checkFirebaseConfig = () => {
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variáveis de ambiente do Firebase ausentes:', missingVars);
    return false;
  }

  console.log('✅ Configuração do Firebase válida');
  return true;
};

export const checkAuthorizedDomain = () => {
  const currentDomain = window.location.hostname;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  
  // Lista de domínios autorizados
  const authorizedDomains = [
    'localhost',
    '127.0.0.1',
    authDomain?.replace('.firebaseapp.com', ''),
    authDomain
  ].filter(Boolean);

  if (!authorizedDomains.includes(currentDomain)) {
    console.warn('⚠️ Domínio atual não está na lista de domínios autorizados:', currentDomain);
    console.log('📋 Domínios autorizados:', authorizedDomains);
  } else {
    console.log('✅ Domínio autorizado:', currentDomain);
  }
};

// Interceptar e suprimir erros de hosting do Firebase
export const suppressHostingErrors = () => {
  const originalFetch = window.fetch;
  
  window.fetch = function(...args) {
    const url = args[0];
    
    // Suprimir erros de configuração de hosting
    if (typeof url === 'string' && url.includes('/__/firebase/init.json')) {
      console.log('🔇 Suprimindo requisição de configuração de hosting:', url);
      return Promise.resolve(new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    
    return originalFetch.apply(this, args);
  };
};

// Configuração de desenvolvimento
export const setupDevelopmentConfig = () => {
  if (import.meta.env.DEV) {
    // Suprimir logs desnecessários do Firebase
    const originalConsoleWarn = console.warn;
    console.warn = function(...args) {
      const message = args[0];
      if (typeof message === 'string' && 
          (message.includes('__/firebase/init.json') || 
           message.includes('Firebase Hosting'))) {
        return; // Suprimir warnings de hosting
      }
      originalConsoleWarn.apply(console, args);
    };
    
    console.log('🔧 Configuração de desenvolvimento ativada');
  }
}; 