import { Route, Navigate } from 'react-router-dom';

 function PrivateComp({component: Component }) {
    const isAuthenticated= false
    return (
        <Route
            element = { isAuthenticated ? <Component /> : <Navigate to='/login' /> }
        />
    )
 }

 export default PrivateComp