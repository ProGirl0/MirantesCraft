import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { auth } from '../../firebase';
import { getRedirectResult } from 'firebase/auth';

const AuthDebug = () => {
  const { user, loading, isRedirecting } = useAuth();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const checkAuthState = async () => {
      const info = {
        timestamp: new Date().toISOString(),
        currentUser: auth.currentUser ? {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          emailVerified: auth.currentUser.emailVerified,
          displayName: auth.currentUser.displayName
        } : null,
        authState: {
          user: user ? 'Logged In' : 'Not Logged In',
          loading,
          isRedirecting
        },
        environment: {
          hostname: window.location.hostname,
          pathname: window.location.pathname,
          search: window.location.search,
          isVercel: window.location.hostname.includes('vercel.app')
        },
        firebaseConfig: {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✅' : '❌',
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅' : '❌',
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅' : '❌',
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✅' : '❌',
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✅' : '❌',
          appId: import.meta.env.VITE_FIREBASE_APP_ID ? '✅' : '❌'
        }
      };

      // Verificar resultado de redirecionamento
      try {
        const redirectResult = await getRedirectResult(auth);
        info.redirectResult = redirectResult ? {
          user: redirectResult.user ? 'Present' : 'None',
          credential: redirectResult.credential ? 'Present' : 'None',
          operationType: redirectResult.operationType
        } : 'No redirect result';
      } catch (error) {
        info.redirectResult = { error: error.message };
      }

      setDebugInfo(info);
      console.log('🔍 Auth Debug Info:', info);
    };

    checkAuthState();
  }, [user, loading, isRedirecting]);

  // Só mostrar em desenvolvimento ou quando houver problemas
  if (!import.meta.env.DEV && !window.location.hostname.includes('vercel.app')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🔍 Auth Debug</h3>
      <div className="space-y-1">
        <div>User: {debugInfo.authState?.user}</div>
        <div>Loading: {debugInfo.authState?.loading ? 'Yes' : 'No'}</div>
        <div>Redirecting: {debugInfo.authState?.isRedirecting ? 'Yes' : 'No'}</div>
        <div>Path: {debugInfo.environment?.pathname}</div>
        <div>Config: {Object.values(debugInfo.firebaseConfig || {}).filter(v => v === '✅').length}/6</div>
        {debugInfo.redirectResult && (
          <div>Redirect: {typeof debugInfo.redirectResult === 'string' ? debugInfo.redirectResult : 'Result available'}</div>
        )}
      </div>
    </div>
  );
};

export default AuthDebug; 