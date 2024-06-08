import { Navigate, Outlet, Route } from 'react-router-dom'
import { UserContext } from '../Context/UserContext';
import { useContext } from 'react';

function PrivateRoute() {
    const { userDetails } = useContext(UserContext);
    return userDetails ? <Outlet/> : <Navigate to='/login'/>
}

export default PrivateRoute