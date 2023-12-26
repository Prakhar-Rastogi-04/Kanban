
import { useState } from 'react';
import './createtask.css';
import axios from 'axios';
import UtilForm from '../uiComponents/form/UtilForm';
import { creatrTaskCall, getDataCall } from '../../utilities/commonApiCalls';
import Popup from 'reactjs-popup';
import ConfirmationWithApi from '../uiComponents/confirmationWithApi/ConfirmationWithApi';
import TaskFilter from '../taskFilter/TaskFilter';

export default function Createtask ({getData, taskData}) {
    const formContent = {
        heading : 'Create Task Here..',
        button : 'Create Task'
    };
    

    const [formData , setFormData] = useState({
        subjectLine: '',
        description : '',
        label : '',
        taskType : '',
        genre :'',
        status : 'To Do',
        deadLine: ''
    });
    const handleChange = (e) => {
        const {name, value} = e.target;
        console.log(name,'   ',value);
        setFormData({...formData, [name] : value});
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('form data ', formData);
        try {
            const response = await creatrTaskCall(formData);
            alert(response.data.msg);
            getData();
        } catch(err) {
            console.log('something went wrong ', err)
        }
    }
   
    
    return (
        <div className="createTaskContainerWrapper">
            <div className="createTaskAction right-text">
                <Popup trigger={(<button className="button default-button" >Weekly Report</button>)} modal>
                {
                    close => (
                        <ConfirmationWithApi confirmationMsg="Weekly Task Status" isApiSuccess="true" handleActionAfterAPICall={close} isChartingOn="true" taskData={taskData}/>
                    )
                }     
                </Popup>
                
            </div>
            <div className="createTaskContainer">
                <UtilForm 
                handleSubmit={handleSubmit} 
                handleChange={handleChange} 
                getData={getData} 
                setFormData={setFormData} 
                formData = {formData}
                formContent = {formContent}
                />
            </div>
           
        </div>
    )
}