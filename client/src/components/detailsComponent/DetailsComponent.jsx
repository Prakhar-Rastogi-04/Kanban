import './detailsComponent.css';
import Topbar from '../topbar/Topbar';
import { Link, useNavigate } from 'react-router-dom';
import {dateFormatter} from '../../utilities/util';
import UtilPopup from '../uiComponents/popup/UtilPopup';
import Popup from 'reactjs-popup';
import axios from 'axios';
import { useState } from 'react';
import ConfirmationWithApi from '../uiComponents/confirmationWithApi/ConfirmationWithApi';
import { editTaskCall, softDeleteCall } from '../../utilities/commonApiCalls';
import Comment from '../commentUI/comment';

export default function  DetailsComponent ({task}){
   let [confirmationMsg, setConfirmationMsg] = useState('Are you sure, you want to delete this task ?') ;
   let [isTaskDelete, setTaskDelete] = useState(false);
   const statusArray = [{ value : 'To Do' , name: 'To Do'}, { value : 'In Progress' , name: 'inProgress'}, { value : 'Done' , name: 'Done'}];
   const [isShowStatus, setIsShowStatus] = useState(false);
   const navigate = useNavigate();
   const [notify, setNotify] = useState({msg:'', err:'', isShow:false, isError:false});
   const formContent = {
        heading : `Edit Task - ${task.taskId}`,
        button : 'Save Changes'
    };
   const [formData , setFormData] = useState(task);
   const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name] : value});
    }
   const handleSubmit = async (e) => {
        e.preventDefault();
        editTaskData();
    }
   const editTaskData = async() => {
      const res = await editTaskCall(formData);
      setNotify({...notify, 'msg': !!(res.data.err) ? res.data.err :res.data.msg , 'isShow': true , isError: !!(res.data.err) });
    }
   
   const handleDelete = async() => {
      const res = await softDeleteCall(task._id);
      console.log('res ',res)
      if(res.status === 200) {
         setConfirmationMsg('The task is deleted successfully')
         setTaskDelete(true);
      } else {
         setConfirmationMsg('Something went wrong. Please try again later');
         setTaskDelete(true);
      }
   }
   const handleAfterDeleteEffects = () => {
      navigate('/')
   }
   const handleStatusChange =() => {
      setIsShowStatus(!isShowStatus)
   }

   const handleItemClicked = async (event) => {
      console.log('task ',task);
      console.log(event.currentTarget.textContent);
      let data = {
         'status': event.currentTarget.textContent,
         'taskId' : task.taskId
      }
      var res = await editTaskCall(data);
      if(res.status === 200) {
         alert('updated the task');
         window.location.reload();
      } else {
         alert('something went wrong')
      }
   }
   
   const editTask = [
      notify, setNotify, formContent, formData, setFormData, handleChange, handleSubmit
   ]
    return(
        <>
        <Topbar />
           <div className="taskDetailContainer">
               <div className="staticDetailsContainer">
                 <div className="taskHeader">
                    <div className="taskLogo">
                        <div className="projectLogo">
                           <img src={`${process.env.REACT_APP_PUBLIC_ASSETS}/logo512.png`} alt="" className="" />
                        </div>
                    </div>
                    <div className="taskSubject margLeft10">
                       <Link><h4 className="taskIdContainer">TASK-{task.taskId}</h4> </Link>
                       <h2 className="taskSubjectContainer capitalise">{task.subjectLine}</h2>
                    </div>
                 </div>
                 
                 <div className="actionbtnContainer">
                    <UtilPopup 
                              name="Edit" 
                              task={task} 
                              props = {editTask}
                              />
                    
                    <div className="statusBtnContainer">
                        <button className="todo button default-button" onClick={handleStatusChange}>Chnage Status</button>
                       {isShowStatus && <ul className="unOrderedList margin0" >
                        {statusArray.map((status) => (
                        (task.status !== status.value) && <li className="listItem" value={status.value} onClick={handleItemClicked} onBlur={() => { setIsShowStatus(false) }}>{status.value}</li>
                        ))}
                        </ul>}
                    </div>
                    <Popup trigger={(<button className='delete button default-button'>Delete</button>)} modal nested>
                    { close => ( <ConfirmationWithApi isApiSuccess={isTaskDelete} 
                                                      confirmationMsg={confirmationMsg} 
                                                      handleAPIAction={handleDelete} 
                                                      close ={close}  
                                                      handleActionAfterAPICall={handleAfterDeleteEffects}  /> 
                              )
                      }
                    </Popup>
                 </div>

                 <div className="taskDetails">
                    <div className="flextChild detailSection">
                       <div className="detailsLabel"><h4>Details :</h4></div>
                       <div className="detailsValue">
                          <div className="sublabel">Type :</div>
                          <div className="subValues">{task.type ? task.type : '--'}</div>
                       </div>
                       <div className="detailsValue">
                          <div className="sublabel">Priority :</div>
                          <div className="subValues">{task.priority ? task.priority : '--'}</div>
                       </div>
                       <div className="detailsValue">
                          <div className="sublabel">Labels :</div>
                          <div className="subValues">{task.label ? task.label :'--'}</div>
                       </div>
                       <div className="detailsValue">
                          <div className="sublabel">DB Id :</div>
                          <div className="subValues">{task._id ? task._id : '--'}</div>
                       </div>
                       <div className="detailsValue">
                          <div className="sublabel">SubTasks :</div>
                          <div className="subValues">{task.hasSubtask ? 'You have subtasks' : 'No subtasks created'}</div>
                       </div>
                       <div className="detailsValue">
                          <div className="sublabel">Status :</div>
                          <div className="subValues">{task.status ? task.status : '--'}</div>
                       </div>
                       <div className="detailsValue">
                          <div className="sublabel">Genre :</div>
                          <div className="subValues">{task.genre ? task.genre :'--'}</div>
                       </div>
                       
                    </div>

                    <div className="flextChild trackingSection">
                       <div className="detailsLabel"><h4>Dates:</h4></div>
                       <div className="detailsValue">
                          <div className="sublabel">Created On :</div>
                          <div className="subValues">{ dateFormatter(new Date(task.createdAt)) }</div>
                       </div>
                       <div className="detailsValue">
                          <div className="sublabel">Updated On :</div>
                          <div className="subValues">{ dateFormatter(new Date(task.createdAt)) }</div>
                       </div>
                       <div className="detailsValue">
                          <div className="sublabel">Dead Line :</div>
                          <div className="subValues">{ dateFormatter(new Date(task.deadLine || new Date())) }</div>
                       </div>
                       
                       <div className="detailsLabel"><h4>Time Log:</h4></div>
                       <div className="detailsValue">
                          <div className="sublabel">Time Estimated :</div>
                          <div className="subValues">{task.estimatedTime ? task.estimatedTime : '--'}</div>
                       </div>
                       <div className="detailsValue">
                          <div className="sublabel">Time Invested :</div>
                          <div className="subValues">{task.timeInvested ? task.timeInvested : '--'}</div>
                       </div>
                    </div>
                 </div>
               </div>
                     
                 <div className="descriptionContainer">
                   <div className="detailsValue">
                        <div className="sublabel">Description :</div>
                  </div>
                     <div className="descriptionSection">
                        <div className="subValues">
                           <div className="descriptionBlock" dangerouslySetInnerHTML={{__html : task.description}}></div>
                        </div>
                     </div>
                  </div> 

                  <Comment task={task} /> 
                 
              
           </div>
      </>
    )
   
}