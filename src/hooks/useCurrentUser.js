import { useEffect, useState } from 'react';
import { auth } from '../firebase';

export function useCurrentUser() {
  const [user, setUser] = useState(() => auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  return user;
} 