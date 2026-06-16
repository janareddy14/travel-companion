import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isAdmin } = useAuth();
  const { showToast } = useToast();

  if (!isLoggedIn) {
    showToast('Please login to continue', 'warning');
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    showToast('Admin access required', 'error');
    return <Navigate to="/" replace />;
  }

  return children;
}
