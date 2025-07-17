import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import '../../assets/css/Button.css';

const AnimatedButton = forwardRef(({
  children,
  type = 'button',
  disabled = false,
  isLoading = false,
  icon: IconComponent,
  iconPosition = 'right',
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  animateIcon = true,
  // Framer Motion props
  whileHover,
  whileTap,
  initial,
  animate,
  exit,
  transition,
  ...props
}, ref) => {
  // Variantes de estilo
  const variants = {
    primary: 'bg-teal-600/20 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-teal-400/30',
    secondary: 'border-2 border-teal-600 text-teal-400 hover:bg-teal-400 hover:text-gray-900',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-red-400/30',
    ghost: 'text-gray-700 hover:text-teal-500 hover:bg-gray-100'
  };

  // Tamanhos
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  // Efeito de balanço para o ícone
  const iconAnimation = {
    x: [0, 4, -4, 4, 0],
    transition: { duration: 0.6 }
  };

  // Configuração de animação padrão
  const defaultWhileHover = !disabled ? { scale: 1.05 } : {};
  const defaultWhileTap = !disabled ? { scale: 0.98 } : {};

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={`
        btn flex items-center justify-center gap-3 rounded-lg font-semibold
        transition-all duration-300 ease-out
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      whileHover={whileHover || defaultWhileHover}
      whileTap={whileTap || defaultWhileTap}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      {...props}
    >
      {isLoading ? (
        <span className="btn-loader">Carregando...</span>
      ) : (
        <>
          {iconPosition === 'left' && IconComponent && (
            <motion.span
              animate={animateIcon && !disabled ? iconAnimation : {}}
              key="left-icon"
            >
              <IconComponent className="h-5 w-5" />
            </motion.span>
          )}
          
          <span key="content">{children}</span>
          
          {iconPosition === 'right' && IconComponent && (
            <motion.span
              animate={animateIcon && !disabled ? iconAnimation : {}}
              key="right-icon"
            >
              <IconComponent className="h-5 w-5" />
            </motion.span>
          )}
        </>
      )}
    </motion.button>
  );
});

AnimatedButton.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  animateIcon: PropTypes.bool,
  // Framer Motion props
  whileHover: PropTypes.object,
  whileTap: PropTypes.object,
  initial: PropTypes.object,
  animate: PropTypes.object,
  exit: PropTypes.object,
  transition: PropTypes.object,
};

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;