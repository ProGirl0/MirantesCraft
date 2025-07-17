import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
    // Opcional: measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID 
};

// Configuração adicional para evitar erros de hosting
const appConfig = {
    ...firebaseConfig,
    // Desabilitar carregamento automático de configuração de hosting
    databaseURL: null,
    // Configurar para desenvolvimento local
    authDomain: firebaseConfig.authDomain || `${firebaseConfig.projectId}.firebaseapp.com`
};

// Inicializar Firebase com configuração personalizada
const app = initializeApp(appConfig);

// Configurar Auth com opções específicas para evitar problemas de COOP
export const auth = getAuth(app);

// Configurar Firestore
export const db = getFirestore(app);

// Log de inicialização (apenas em desenvolvimento)
if (import.meta.env.DEV) {
    console.log('🔥 Firebase inicializado com sucesso');
    console.log('📁 Projeto:', firebaseConfig.projectId);
    console.log('🌐 Auth Domain:', firebaseConfig.authDomain);
    console.log('🔧 Modo: Desenvolvimento (sem hosting)');
}