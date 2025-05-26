import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ProtectedRoute component acts as a wrapper for protected routes
const ProtectedRoute = ({children}) => {
  // Get the token from the AuthContext
  const { token } = useAuth();
  // if the token is present, render the children (protected route)
  // If the token is not present, redirect to the login page
  return token ? children : <Navigate to="/login"/>;
}

export default ProtectedRoute;