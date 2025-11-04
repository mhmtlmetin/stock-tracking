
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  // Eğer kullanıcı giriş yapmışsa çocuk route'ları (Layout ve içindeki sayfaları) render et.
  // Yoksa Login sayfasına yönlendir.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;