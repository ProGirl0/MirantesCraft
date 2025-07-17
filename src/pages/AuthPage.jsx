import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthFormStyled as AuthForm } from '../components/auth/AuthForm';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Constellation from '../components/ui/Constelation';

export const AuthPage = ({ mode }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async ({ email, password }) => {
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Login tradicional bem-sucedido');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('✅ Registro bem-sucedido');
      }
      // O redirecionamento será feito pelo AuthProvider
    } catch (error) {
      console.error('❌ Erro de autenticação:', error);
      setError(
        error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found'
          ? 'Email ou senha incorretos. Por favor, tente novamente.'
          : error.code === 'auth/wrong-password'
          ? 'Senha incorreta. Por favor, tente novamente.'
          : error.code === 'auth/email-already-in-use'
          ? 'Este email já está em uso.'
          : error.code === 'auth/weak-password'
          ? 'A senha deve ter pelo menos 6 caracteres.'
          : error.code === 'auth/invalid-email'
          ? 'Email inválido.'
          : `Erro: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">

      
      {/* Container principal */}
      <div className="relative z-10 w-full max-w-2xl mx-auto">
       

        {/* Formulário de autenticação */}
        <AuthForm 
          mode={mode} 
          onSubmit={handleAuth} 
          isLoading={loading} 
          error={error}
        />


      </div>
    </div>
  );
};