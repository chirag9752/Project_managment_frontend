import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const currentTime = Date.now() / 1000;

  if(!token){
    localStorage.removeItem('current_user_feature');
    return <Navigate to="/login" replace />
  }

  const { exp } = jwtDecode(token);

  if (currentTime >= exp) {
    localStorage.removeItem('token');
    localStorage.removeItem('current_user_feature');
    return <Navigate to="/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
export default ProtectedRoute;