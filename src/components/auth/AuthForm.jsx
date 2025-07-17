import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import AnimatedButton from '../ui/Button';
import { MotionForm, MotionInput, MotionSpan } from '../ui/MotionWrapper';
import '../../App.css';

export const AuthFormStyled = ({ mode, onSubmit, isLoading = false, error }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();
  const [authError, setAuthError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

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
        onSubmit={handleSubmit(onSubmit)} 
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
                // whileFocus removido
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
              // whileFocus removido
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
              // whileFocus removido
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