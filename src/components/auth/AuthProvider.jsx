import { useEffect, useState, useRef } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { db } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const AuthProvider = ({ children }) => {
  // Mantém apenas para compatibilidade, mas não expõe mais contexto
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMountedRef.current) return;
      try {
        setUser(user);
        setLoading(false);
        if (user) {
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            uid: user.uid,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            emailVerified: user.emailVerified,
            lastLogin: new Date(),
          }, { merge: true });
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
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    });
    return () => {
      isMountedRef.current = false;
      unsubscribe();
    };
  }, []);

  // Funções auxiliares mantidas para compatibilidade
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
      if (isMountedRef.current) {
        const updatedDoc = await getDoc(doc(db, 'users', user.uid));
        if (updatedDoc.exists()) {
          setUserProfile(updatedDoc.data());
        }
      }
    } catch (error) {
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
    } catch (error) {}
  };

  // Não expõe mais contexto, apenas renderiza os filhos
  return children;
};