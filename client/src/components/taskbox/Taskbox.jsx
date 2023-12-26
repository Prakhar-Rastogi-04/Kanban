import { useState } from 'react';
import './taskbox.css';
import { Link, useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import ConfirmationWithApi from '../uiComponents/confirmationWithApi/ConfirmationWithApi';
import { handleDeleteCall } from '../../utilities/commonApiCalls';
import classNames from "classnames";

export default function Taskbox ({task, pageReload}) {
    const navigate = useNavigate();
    const [allTasks, setTask] = useState(task);
    const reRoutPath = '/details/TASK-'+allTasks.taskId;
    const deleteaApiEndPoint = process.env.REACT_APP_API_ENDPOINT + '/softDelete/'+allTasks._id;
    const [confirmationMsg, setConfirmationMsg] = useState('Are you sure, you want to delete this task ?') ;
    const [isTaskDelete, setTaskDelete] = useState(false);
    const handleDelete = () => {
        handleDeleteCall({setConfirmationMsg , setTaskDelete, deleteaApiEndPoint});
    }
    const handleAfterDeleteEffects =() => {
        pageReload();
    }
    const handleDontDelete = (e, close) => {
        close();
    }
    const onDragStart =(e ) =>{
        console.log('onDragStart  ', e)
    }
    const redirectToDetails = () => {
        navigate(reRoutPath)
    }
    return (
        <div className="taskboxContainer" draggable onDragStart={(e) => {onDragStart(e)}}>
            <div className="taskboxContent" onClick={redirectToDetails}>
                <Link to={reRoutPath} ><h4 className="taskId"> TASK-{allTasks.taskId} </h4></Link>
                <h5 className="taskSubject">{allTasks.subjectLine}</h5>
                <div className="status-priority-wrapper">
                    <div className="taskType">{allTasks.taskType}</div>
                    <div className={ classNames({ 
                        taskPriority : true, 
                        vhp : allTasks.priority ==='Very High', 
                        hp : allTasks.priority ==='High',
                        mp : allTasks.priority ==='Medium', 
                        lp: allTasks.priority ==='Low', })} >
                            {allTasks.priority}
                    </div>
                </div>
            </div>
            <div className="deleteTask">
                <Popup trigger={(<button className="deleteBtn primary-button button">Delete</button>)} modal nested>
                { close => ( <ConfirmationWithApi isApiSuccess={isTaskDelete} 
                                                      confirmationMsg={confirmationMsg} 
                                                      handleAPIAction={handleDelete} 
                                                      pressedNo ={(e) => {handleDontDelete(e, close)}}  
                                                      handleActionAfterAPICall={handleAfterDeleteEffects}  /> 
                              )
                      }
                </Popup>
                
            </div>
        </div>
    )
}