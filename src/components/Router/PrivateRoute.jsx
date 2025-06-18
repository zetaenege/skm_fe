import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../assets/context/AuthContext.jsx';

const PrivateRoute = ({ children, requiredAdmin }) => {
    const { isAuth, user, status } = useContext(AuthContext);
    const location = useLocation();

 if (status === 'pending') return <div>Loading...</div>;

    if (!isAuth) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (requiredAdmin !== undefined && user?.isAdmin !== requiredAdmin) {
        return (
            <Navigate
                to={user?.isAdmin ? "/dashboard" : "/dashboarduser"}
                replace
            />
        );
    }


    return children;
};

export default PrivateRoute;