import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have an AuthContext

const PrivateRoute = ({ children }) => {
    const { isLoggedIn } = useAuth(); // Get the authentication state
    const location = useLocation(); // Get the current location

    // If the user is not logged in, redirect to the login page
    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If the user is logged in, render the children (protected component)
    return children;
};

export default PrivateRoute;