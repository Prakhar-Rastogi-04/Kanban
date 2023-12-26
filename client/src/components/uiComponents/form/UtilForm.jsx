import { useEffect, useState } from 'react';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import TextEditor from '../../textEditor/TextEditor';
import './utilForm.css';
import { getAllUsersCall } from '../../../utilities/commonApiCalls';
import { dateFormatter } from '../../../utilities/util';


export default function UtilForm(props) {
    const {formData, handleSubmit, handleChange, formContent, close, isFilter} = props;
    const [description, setDescription] = useState('');
    const [users, setUsers] = useState([]);
    const [deadLine, setDeadLine] = useState(new Date());
    const [isCalendarOn , setIsCalendarOn] = useState(false);
    const handleCancel = () => {
        close();
    }
    const handleFieldChanges = (e) => {
        handleChange(e);
    }
    const handleFormSubmit = (e) => {
        formData.description = description || '';
        formData.deadLine = new Date(deadLine);
        handleSubmit(e);
    }
    const getAllUsers = async () => {
        const res = await getAllUsersCall();
        if(res.status==200) {
            setUsers(res.data);
        }
    }
    const isCalendarOnToggle = (ev) => {
        setIsCalendarOn(!isCalendarOn)
    }
    const onDateChange = (nextValue) => {
        setDeadLine(nextValue);
        setIsCalendarOn(false)
      }
    const disabledDates = (prop) =>{
        return prop.date < new Date
    }
    useEffect(()=>{
        getAllUsers();
    },[])
    return(
        <>
            <h2 className='center-text'>{formContent.heading}</h2>
            <form onSubmit={handleFormSubmit} className="kanban-form" autoComplete="off">
                {!isFilter && <> 
                    <div className="formGroup">
                        <label htmlFor="subject">Subject</label>
                        <input type="text" id="subject" name="subjectLine" value={formData.subjectLine} onChange={handleFieldChanges} autoComplete='off'/>
                    </div>
                    <div className="formGroup">
                        <label htmlFor="description">Description</label>
                        {/* <input type="text" id="description" className='description' name="description" value={formData.description} onChange={handleFieldChanges} autoComplete='off'/> */}
                        <TextEditor setDescription={setDescription} description={formData.description} />
                    </div>
                </>}
                <div className="formGroup">
                    <label htmlFor="label">Label</label>
                    <select id="label" name="label" value={formData.label} onChange={handleFieldChanges} autoComplete='off'>
                        <option value="">Select Label</option>
                        <option value="important">Important</option>
                        <option value="average">Average</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>
                <div className="formGroup">
                    <label htmlFor="taskType">Task Type</label>
                    <select id="taskType" name="taskType" value={formData.taskType} onChange={handleFieldChanges} autoComplete='off'>
                        <option value="">Select Type</option>
                        <option value="Personal">Personal</option>
                        <option value="Professional">Professional</option>
                    </select>
                </div>
                <div className="formGroup">
                    <label htmlFor="priority">Priority</label>
                    <select id="priority" name="priority" value={formData.priority} onChange={handleFieldChanges} autoComplete='off'>
                        <option value="">Select Priority</option>
                        <option value="Very High">Very High</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div className="formGroup">
                    <label htmlFor="genre">Genre</label>
                    <select id="genre" name="genre" value={formData.genre} onChange={handleFieldChanges} autoComplete='off'>
                        <option value="">Select Genre</option>
                        <option value="it">IT</option>
                        <option value="itUpskilling">IT Upskilling</option>
                        <option value="stockUpskilling">Stock Market Upskilling</option>
                        <option value="Office">Office</option>
                        <option value="house">House Hold </option>
                        <option value="tax">Income Tax </option>
                    </select>
                </div>
                <div className="formGroup">
                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" value={formData.status} onChange={handleFieldChanges} autoComplete='off'>
                        <option value="">Select Status</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                        <option value="Today">Today's Bucket</option>
                    </select>
                </div>
                <div className="formGroup">
                    <label htmlFor="assignee">Assignee</label>
                    <select id="assignee" name="assignee" value={formData.assignee} onChange={handleFieldChanges} autoComplete='off'>
                        <option value="">--Assignee--</option>
                        {
                            users.map(user => (
                                <option value={user.email} key={user._id}>{user.firstName} {user.lastName} ( {user.email}) </option>
                            ))
                        }
                    </select>
                </div>

                <div className="formGroup calendarInput">
                    <label htmlFor="deadline">Dead Line</label>
                    <input type="text" id="subject" name="deadline" value={ dateFormatter( deadLine, 'short')} autoComplete='off' onFocus={isCalendarOnToggle} />
                    {isCalendarOn && <div className="calendarSection">
                        <Calendar value={deadLine} onChange={onDateChange} tileDisabled={disabledDates} />
                    </div>}
                </div>
                
                
                <div className="formGroup">
                    <button className='button primary-button' type="submit">{formContent.button}</button>
                    <button className='button' type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </>
    )
}