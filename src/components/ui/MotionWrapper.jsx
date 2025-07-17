import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Wrapper para componentes Framer Motion que previne erros de DOM
export const MotionWrapper = ({ 
  children, 
  component = 'div',
  fallback = null,
  ...props 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Se houve erro ou não está montado, renderizar fallback
  if (hasError || !isMounted) {
    return fallback || <div {...props}>{children}</div>;
  }

  try {
    const MotionComponent = motion[component] || motion.div;
    
    return (
      <MotionComponent
        {...props}
        onError={() => setHasError(true)}
        onAnimationComplete={() => {
          // Verificar se o elemento ainda existe no DOM
          if (!document.contains(document.activeElement)) {
            setHasError(true);
          }
        }}
      >
        {children}
      </MotionComponent>
    );
  } catch (error) {
    console.error('Erro no MotionWrapper:', error);
    setHasError(true);
    return fallback || <div {...props}>{children}</div>;
  }
};

// Wrapper específico para botões
export const MotionButton = ({ 
  children, 
  fallback = null,
  ...props 
}) => {
  return (
    <MotionWrapper
      component="button"
      fallback={fallback || <button {...props}>{children}</button>}
      {...props}
    >
      {children}
    </MotionWrapper>
  );
};

// Wrapper específico para formulários
export const MotionForm = ({ 
  children, 
  fallback = null,
  ...props 
}) => {
  return (
    <MotionWrapper
      component="form"
      fallback={fallback || <form {...props}>{children}</form>}
      {...props}
    >
      {children}
    </MotionWrapper>
  );
};

// Wrapper específico para inputs
export const MotionInput = ({ 
  fallback = null,
  ...props 
}) => {
  return (
    <MotionWrapper
      component="input"
      fallback={fallback || <input {...props} />}
      {...props}
    />
  );
};

// Wrapper específico para spans
export const MotionSpan = ({ 
  children, 
  fallback = null,
  ...props 
}) => {
  return (
    <MotionWrapper
      component="span"
      fallback={fallback || <span {...props}>{children}</span>}
      {...props}
    >
      {children}
    </MotionWrapper>
  );
}; 