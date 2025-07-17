import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const AuthRedirector = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      // Se estiver em /login ou /register, redireciona para /dashboard
      if (location.pathname === '/login' || location.pathname === '/register') {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, location, navigate]);

  useEffect(() => {
    // Se o usuário acabou de fazer login social, pode estar em /login
    // e o getRedirectResult já foi processado
    // O AuthProvider já atualizou o user
    // O AuthRedirector cuida do redirecionamento
  }, []);

  return null;
};

export default AuthRedirector; 