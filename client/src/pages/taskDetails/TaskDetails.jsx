import { useNavigate, useParams } from 'react-router-dom'
import './taskDetails.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import DetailsComponent from '../../components/detailsComponent/DetailsComponent';
import Createtask from '../../components/createTask/Createtask';
import { getTaskDetailsCall } from '../../utilities/commonApiCalls';
import { clearSessionStorage } from '../../utilities/util';


export default function TaskDetails () {
    const {taskId} = useParams();
    const [taskData , setTaskData] = useState([]) ;
    const navigate = useNavigate();
    const logout = () => {
      clearSessionStorage();
      navigate('/login');
      } 
    useEffect(()=>{
       const getData = async () => {
               const response  = await getTaskDetailsCall(taskId) ;
               if ( response.status === 200 ) { setTaskData(response.data) }
               if(response.status === 401){
                  alert('something went wrong');
                  logout();
               }
               
       }
       getData();
    },[taskId])
    return (
      <div className='pageContainer'>
         <div id="taskDetailsComp" className="taskPanel">
            {
               taskData.map((t) => (
                  <DetailsComponent key={t._id} task={t}  />
               ))
            }
         </div>
         <div id="createTask" className="actionPanel">
            <Createtask />
         </div>
      </div>
      )
}