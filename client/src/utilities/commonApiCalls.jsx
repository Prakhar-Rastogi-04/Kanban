
import axios from 'axios';
import { getAccessTokenFromSession, removeAccessToken } from './util';
// import { useNavigate } from 'react-router-dom';
axios.defaults.headers.common['x-access-token'] = getAccessTokenFromSession();

const handleDeleteCall = async(props) => {
    let res =  await axios.put(props.deleteaApiEndPoint)
    console.log('res ',res)
    if(res.status === 200) {
        props.setConfirmationMsg('The task is deleted successfully')
        props.setTaskDelete(true);
    } else {
        props.setConfirmationMsg('Something went wrong. Please try again later');
        props.setTaskDelete(true);
    }
 }
 const editTaskCall = async(formData) => {
    console.log('edit data ',formData);
    const {_id, ...editedData } = formData;
    const res = await axios.put(process.env.REACT_APP_API_ENDPOINT+'/editTasks', editedData);
    return res;
    // setNotify({...notify, 'msg': !!(res.data.err) ? res.data.err :res.data.msg , 'isShow': true , isError: !!(res.data.err) });
  }

const loginCall = async (formData) => {
    console.log('login data ',formData);
    const loginEndpoint = process.env.REACT_APP_API_ENDPOINT+'/login';
    try {
        const res = await axios.post(loginEndpoint, formData);
        return res
    } catch(err) {
        return err.response
    }
    
}

const creatrTaskCall = async(formData) => {
    const res = await axios.post(process.env.REACT_APP_API_ENDPOINT+'/createTasks' , formData);
    return res
}

const getTaskDataCall = async() => {
    const res = await axios.get(process.env.REACT_APP_API_ENDPOINT+'/tasks');
    return res
}

const getDeletedTasksCall = async() => {
    const res = await axios.get(process.env.REACT_APP_API_ENDPOINT+'/deletedTasks');
    return res
}

const getDataCall = async(isFormData) => {
    let endPoint = process.env.REACT_APP_API_ENDPOINT + '/tasks?groupBy=status&accessToken='+getAccessTokenFromSession();
    let filterVal = [];
    if(isFormData) {
        filterVal.push('&isFilter=true') ;
        isFormData.assignee && filterVal.push('&assignee='+isFormData.assignee) ;
        isFormData.deadLine && filterVal.push('&deadLine='+isFormData.deadLine) ;
        isFormData.genre && filterVal.push('&genre='+isFormData.genre) ;
        isFormData.label && filterVal.push('&label='+isFormData.label) ;
        isFormData.priority && filterVal.push('&priority='+isFormData.priority) ;
        isFormData.status && filterVal.push('&status='+isFormData.status) ;
        isFormData.taskType && filterVal.push('&taskType='+isFormData.taskType);
        endPoint = endPoint+filterVal.join('');
    }
    try {
        const res = await axios.get(endPoint);
        return res
    } catch(err) {
        return err.response
    }
    
}

const softDeleteCall = async(id) => {
    const res = await axios.get(process.env.REACT_APP_API_ENDPOINT + '/softDelete/'+id);
    return res
}

const getSearchResultsCall = async(searchInput) => {
    const res = await axios.get(process.env.REACT_APP_API_ENDPOINT + '/search?search='+searchInput);
    return res
}

const getTaskDetailsCall = async(taskId) => {
    try {
        const res = await axios.get(process.env.REACT_APP_API_ENDPOINT+'/taskDetails/'+taskId);
        return res
    } catch ( err ){
        return err.response
    }
}

const registerUserCall = async(userData) => {
    const res = await axios.post(process.env.REACT_APP_API_ENDPOINT+'/register', userData);
    return res
}

const addCommentCall = async(commentData) => {
    try {
        const res = await axios.post(process.env.REACT_APP_API_ENDPOINT+'/addComment', commentData);
        return res  
    } catch ( err ){
        return err.response
    }
}

const getCommentByTaskCall = async(taskId) => {
    try {
        const res = await axios.get(process.env.REACT_APP_API_ENDPOINT+'/getComments/'+taskId);
        return res  
    } catch ( err ){
        return err.response
    }
}

const getAllUsersCall = async() => {
    try {
        const res = await axios.get(process.env.REACT_APP_API_ENDPOINT+'/users');
        return res
    } catch ( err ){
        return err.response
    }
}

export { handleDeleteCall, 
        editTaskCall , 
        loginCall, 
        creatrTaskCall, 
        getTaskDataCall,
        getDeletedTasksCall,
        getDataCall,
        softDeleteCall,
        getSearchResultsCall,
        getTaskDetailsCall,
        registerUserCall,
        addCommentCall,
        getCommentByTaskCall,
        getAllUsersCall
    }