import { useEffect, useState, useRef } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged, GoogleAuthProvider, sendEmailVerification, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { db } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Verificar resultado de redirecionamento
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && isMountedRef.current) {
          console.log('✅ Login com redirecionamento bem-sucedido');
          if (result.user && !result.user.emailVerified) {
            await sendEmailVerification(result.user);
          }
        }
      } catch (error) {
        console.error('❌ Erro no resultado de redirecionamento:', error);
      }
    };
    
    checkRedirectResult();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMountedRef.current) return;
      
      try {
        setUser(user);
        setLoading(false);
        setIsRedirecting(false);
        
        if (user) {
          // Salva/atualiza usuário na coleção 'users' para autocomplete
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            uid: user.uid,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            emailVerified: user.emailVerified,
            lastLogin: new Date(),
          }, { merge: true });

          // Buscar perfil do usuário
          if (isMountedRef.current) {
            const profileDoc = await getDoc(doc(db, 'users', user.uid));
            if (profileDoc.exists() && isMountedRef.current) {
              setUserProfile(profileDoc.data());
            }
          }
        } else {
          if (isMountedRef.current) {
            setUserProfile(null);
          }
        }
      } catch (error) {
        console.error('Erro no onAuthStateChanged:', error);
        if (isMountedRef.current) {
          setLoading(false);
          setIsRedirecting(false);
        }
      }
    });
    
    return () => {
      isMountedRef.current = false;
      unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    
    // Configurar provider para melhor experiência
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    if (isMountedRef.current) {
      setIsRedirecting(true);
    }
    console.log('🔄 Iniciando login com Google via redirecionamento...');
    
    try {
      // Usar apenas redirecionamento para evitar problemas de COOP
      await signInWithRedirect(auth, provider);
      
      // Retornar indicador de redirecionamento
      return { redirect: true, message: 'Redirecionando para o Google...' };
    } catch (error) {
      if (isMountedRef.current) {
        setIsRedirecting(false);
      }
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    }
  };

  const updateUserProfile = async (profileData) => {
    if (!user) return;
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...profileData,
        updatedAt: new Date(),
      }, { merge: true });
      
      // Atualizar estado local
      if (isMountedRef.current) {
        const updatedDoc = await getDoc(doc(db, 'users', user.uid));
        if (updatedDoc.exists()) {
          setUserProfile(updatedDoc.data());
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      if (isMountedRef.current) {
        setUser(null);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile,
      loading, 
      isRedirecting,
      logout, 
      loginWithGoogle, 
      sendVerificationEmail,
      updateUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};