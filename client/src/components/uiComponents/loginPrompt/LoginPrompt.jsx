import Popup from 'reactjs-popup'
// import useIdleHook from "../../utilities/idleTimer/useIdleHook";
import './loginPrompt.css'
import useIdleHook from '../../../utilities/idleTimer/useIdleHook';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPrompt () {
    const navigate = useNavigate();
     const logout =() => {
        console.log("User got logged out");
        setIsOpen(false);
        navigate('/login')
    };
     const [isOpen, setIsOpen] = useState(false);
     const handlePrompt =() => {
        console.log("Prompt open");
        setIsOpen(true)
     };
     const {isIdle, getRemainingTime, getLastActiveTime, activate} = useIdleHook({onIdle: logout, onPrompt:handlePrompt, idleTime: 1000})
     const timeLeft =  parseInt(Math.ceil(getRemainingTime()/1000));
    return (
        <Popup open={isOpen} modal nested>
            {
                close => (
                    <div className="popupContainer">
                        <div className="modal">
                            Are you Still Active ?
                        </div>
                        <div className="popupControls">
                            <button className="close button primary-button" onClick={event => { activate(); setIsOpen(false) }}>Still Active ?({timeLeft})</button>
                            <button className="close button primary-button" onClick={event => { logout(); setIsOpen(false)}}>Logout</button>
                        </div>
                    </div>
                )
            }
        </Popup>
    )
}