import { Outlet } from 'react-router-dom';
import './appLayout.css';
// import { }

export default function AppLayout () {
    return (
        <>
            <div className="appLayout"></div>
            <Outlet />
        </>
    )
}