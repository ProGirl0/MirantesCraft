import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Constellation from '../ui/Constelation';
import AnimatedButton from '../ui/Button';
import { MotionForm, MotionInput, MotionSpan } from '../ui/MotionWrapper';
import { useAuth } from './useAuth';
import { FunnelIcon } from '@heroicons/react/24/outline';
import '../../App.css';

export const AuthFormStyled = ({ mode, onSubmit, isLoading = false, error }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();
  const [authError, setAuthError] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const { loginWithGoogle, isRedirecting } = useAuth();

  const handleAuthSubmit = async (data) => {
    try {
      setAuthError('');
      await onSubmit(data);
    } catch (error) {
      setAuthError(
        mode === 'login' 
          ? 'Falha no login. Verifique suas credenciais.'
          : 'Erro no cadastro. Tente novamente.'
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setAuthError(''); // Limpar erro anterior
      const result = await loginWithGoogle();
      
      // Se retornou redirect, mostrar mensagem informativa
      if (result && result.redirect) {
        setAuthError(result.message || 'Redirecionando para o Google...');
        return;
      }
    } catch (error) {
      console.error('Erro detalhado do Google:', error);
      setAuthError(error.message || 'Erro no login com Google. Tente novamente.');
    }
  };

  // Variantes de animação
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  const glowVariants = {
    focused: {
      boxShadow: "0 0 20px rgba(20, 184, 166, 0.4)",
      transition: { duration: 0.3 }
    },
    unfocused: {
      boxShadow: "0 0 0px rgba(20, 184, 166, 0)",
      transition: { duration: 0.3 }
    }
  };

  return (
      <MotionForm 
        onSubmit={handleSubmit(handleAuthSubmit)} 
        className="relative z-10 w-full max-w-md space-y-6 p-8 bg-teal-200/5 backdrop-blur-sm border border-gray-700 shadow-2xl"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Título animado */}
        <motion.div variants={fieldVariants} className="text-center mb-8">
          <motion.h2 
            className="text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {mode === 'login' ? 'Bem-vindo de volta!' : 'Criar conta'}
          </motion.h2>
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {mode === 'login' ? 'Entre na sua conta' : 'Cadastre-se para começar'}
          </motion.p>
        </motion.div>

        {/* Campo Nome (apenas para registro) */}
        {mode === 'register' && (
          <motion.div variants={fieldVariants}>
            <label htmlFor="displayName" className="sr-only">Nome</label>
            <motion.div
              className="relative"
              variants={glowVariants}
              animate={focusedField === 'displayName' ? 'focused' : 'unfocused'}
            >
              <MotionInput
                id="displayName"
                {...register('displayName', { 
                  required: 'Nome é obrigatório',
                  minLength: {
                    value: 2,
                    message: 'Nome deve ter pelo menos 2 caracteres'
                  }
                })}
                placeholder="Nome completo"
                type="text"
                autoComplete="name"
                onFocus={() => setFocusedField('displayName')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-6 py-4 border-0 bg-gray-800 text-white placeholder-gray-500 focus:outline-none ${
                  errors.displayName ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-teal-500'
                }`}
                aria-invalid={errors.displayName ? "true" : "false"}
                whileFocus={{ scale: 1.02 }}
              />
              <MotionSpan
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                animate={{ 
                  opacity: focusedField === 'displayName' ? 1 : 0.5, 
                  scale: focusedField === 'displayName' ? 1.1 : 1 
                }}
              >
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </MotionSpan>
            </motion.div>
            {errors.displayName && (
              <p className="mt-2 text-sm text-red-400 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.displayName.message}
              </p>
            )}
          </motion.div>
        )}

        {/* Campo Email */}
        <motion.div variants={fieldVariants}>
          <label htmlFor="email" className="sr-only">Email</label>
          <motion.div
            className="relative"
            variants={glowVariants}
            animate={focusedField === 'email' ? 'focused' : 'unfocused'}
          >
            <MotionInput
              id="email"
              {...register('email', { 
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              placeholder="Email"
              type="email"
              autoComplete="email"
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-6 py-4 border-0 bg-gray-800 text-white placeholder-gray-500 focus:outline-none ${
                errors.email ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-teal-500'
              }`}
              aria-invalid={errors.email ? "true" : "false"}
              whileFocus={{ scale: 1.02 }}
            />
            <MotionSpan
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
              animate={{ 
                opacity: focusedField === 'email' ? 1 : 0.5, 
                scale: focusedField === 'email' ? 1.1 : 1 
              }}
            >
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </MotionSpan>
          </motion.div>
            {errors.email && (
            <p 
                className="mt-2 text-sm text-red-400 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.email.message}
            </p>
            )}
        </motion.div>

        {/* Campo Senha */}
        <motion.div variants={fieldVariants}>
          <label htmlFor="password" className="sr-only">Senha</label>
          <motion.div
            className="relative"
            variants={glowVariants}
            animate={focusedField === 'password' ? 'focused' : 'unfocused'}
          >
            <MotionInput
              id="password"
              {...register('password', { 
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'Senha deve ter pelo menos 6 caracteres'
                }
              })}
              placeholder="Senha"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-6 py-4 border-0 bg-gray-800 text-white placeholder-gray-500 focus:outline-none ${
                errors.password ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-teal-500'
              }`}
              aria-invalid={errors.password ? "true" : "false"}
              whileFocus={{ scale: 1.02 }}
            />
            <MotionSpan
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
              animate={{ 
                opacity: focusedField === 'password' ? 1 : 0.5, 
                scale: focusedField === 'password' ? 1.1 : 1 
              }}
            >
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </MotionSpan>
          </motion.div>
            {errors.password && (
            <p 
                className="mt-2 text-sm text-red-400 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.password.message}
            </p>
            )}
        </motion.div>

        {/* Botão Submit */}
        <motion.div variants={fieldVariants}>
          <AnimatedButton
            type="submit"
            isLoading={isLoading}
            fullWidth
            size="large"
            variant="primary"
            iconPosition="right"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </AnimatedButton>
        </motion.div>

        {/* Separador */}
        <motion.div variants={fieldVariants} className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">ou</span>
          </div>
        </motion.div>

        {/* Botão Google */}
        <motion.div variants={fieldVariants}>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isRedirecting}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isRedirecting ? 'Redirecionando...' : 'Continuar com Google'}
          </button>
        </motion.div>

        {/* Mensagem de erro global ou local */}
        {(error || authError) && (
          <div
              className="p-4 bg-red-900/20 text-red-400 border border-red-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            {error || authError}
          </div>
          )}

        {/* Rodapé */}
        <motion.div 
          className="text-center pt-4"
          variants={fieldVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {mode === 'login' ? (
            <p>Novo por aqui? <a href="/register" className="text-teal-400 hover:underline">Crie uma conta</a></p>
          ) : (
            <p>Já tem uma conta? <a href="/login" className="text-teal-400 hover:underline">Faça login</a></p>
          )}
        </motion.div>
      </MotionForm>
  );
};