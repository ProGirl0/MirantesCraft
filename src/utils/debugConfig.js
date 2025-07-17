// Utilitário para debugar configurações no Vercel
export const debugEnvironment = () => {
  console.log('🔍 Debug: Verificando configuração do ambiente...');
  
  // Verificar se estamos no Vercel
  const isVercel = window.location.hostname.includes('vercel.app');
  console.log('📍 Ambiente Vercel:', isVercel);
  
  // Verificar variáveis de ambiente
  const envVars = {
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Configurada' : '❌ Ausente',
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Configurada' : '❌ Ausente',
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Configurada' : '❌ Ausente',
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✅ Configurada' : '❌ Ausente',
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✅ Configurada' : '❌ Ausente',
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID ? '✅ Configurada' : '❌ Ausente',
  };
  
  console.log('🔧 Variáveis de ambiente:', envVars);
  
  // Verificar domínio atual
  console.log('🌐 Domínio atual:', window.location.hostname);
  console.log('🔗 URL completa:', window.location.href);
  
  // Verificar se o Firebase está inicializado
  try {
    const firebaseApp = window.firebase || window.firebaseApp;
    if (firebaseApp) {
      console.log('🔥 Firebase detectado:', firebaseApp);
    } else {
      console.log('❌ Firebase não detectado no objeto window');
    }
  } catch (error) {
    console.log('❌ Erro ao verificar Firebase:', error.message);
  }
  
  // Verificar roteamento
  console.log('🛣️ Rota atual:', window.location.pathname);
  console.log('🔍 Parâmetros de URL:', window.location.search);
  
  return {
    isVercel,
    envVars,
    currentDomain: window.location.hostname,
    currentPath: window.location.pathname,
    hasFirebase: !!window.firebase || !!window.firebaseApp
  };
};

// Função para testar conectividade com Firebase
export const testFirebaseConnection = async () => {
  console.log('🧪 Testando conectividade com Firebase...');
  
  try {
    // Verificar se o Firebase está disponível
    const { auth } = await import('../firebase');
    
    if (auth) {
      console.log('✅ Firebase Auth carregado com sucesso');
      
      // Testar se conseguimos acessar métodos do auth
      const currentUser = auth.currentUser;
      console.log('👤 Usuário atual:', currentUser ? 'Logado' : 'Não logado');
      
      return { success: true, auth: !!auth, user: !!currentUser };
    } else {
      console.log('❌ Firebase Auth não disponível');
      return { success: false, error: 'Firebase Auth não disponível' };
    }
  } catch (error) {
    console.error('❌ Erro ao testar Firebase:', error);
    return { success: false, error: error.message };
  }
};

// Função para verificar se o roteamento está funcionando
export const testRouting = () => {
  console.log('🧪 Testando roteamento...');
  
  const testRoutes = ['/login', '/dashboard', '/projects'];
  const results = {};
  
  testRoutes.forEach(route => {
    try {
      // Tentar navegar para a rota
      const fullUrl = `${window.location.origin}${route}`;
      console.log(`🔗 Testando rota: ${fullUrl}`);
      
      // Verificar se conseguimos fazer uma requisição HEAD
      fetch(fullUrl, { method: 'HEAD' })
        .then(response => {
          results[route] = response.status;
          console.log(`✅ ${route}: ${response.status}`);
        })
        .catch(error => {
          results[route] = 'error';
          console.log(`❌ ${route}: ${error.message}`);
        });
    } catch (error) {
      results[route] = 'error';
      console.log(`❌ ${route}: ${error.message}`);
    }
  });
  
  return results;
};

// Função para exportar informações de debug
export const exportDebugInfo = () => {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    environment: debugEnvironment(),
    firebase: testFirebaseConnection(),
    routing: testRouting()
  };
  
  console.log('📊 Informações de debug:', debugInfo);
  return debugInfo;
}; 