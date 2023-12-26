import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import Popup from "reactjs-popup";
import Taskbox from "../taskbox/Taskbox";
import "./tasklist.css";
import { useEffect, useState } from "react";
import { editTaskCall, getDataCall, getDeletedTasksCall } from "../../utilities/commonApiCalls";
import ConfirmationWithApi from '../uiComponents/confirmationWithApi/ConfirmationWithApi';
import UtilForm from '../uiComponents/form/UtilForm';
export default function Tasklist({getData, columns, setColumns, getColumns}) {
    console.log('taskData ',columns);
    // const [columns, setColumns] = useState(taskData);
    const [deletedTasks, setDeletedTasks] = useState([]);
    const [isDragged, setIsDragged] = useState(false);
    const [isStatusChanges, setIsStatusChanges] = useState(false);
    const [confMsg, setConfMsg] = useState('');
    const [dragObject, setDragObject] = useState([]);
    const [draggedTask, setDraggedTask] = useState([]);
    const [openFiletrPopup, setOpenFilterPopup] = useState(false);
    const [formData , setFormData] = useState({
        subjectLine: '',
        description : '',
        label : '',
        taskType : '',
        genre :'',
        status : 'To Do',
        deadLine: ''
    });
    const filterContent = {
        heading : 'Apply Filter Here..',
        button : 'Apply Filter'
    };
    const handleChange = (e) => {
        const {name, value} = e.target;
        console.log(name,'   ',value);
        setFormData({...formData, [name] : value});
    }
    const getDeletedTasks = async() => {
        console.log('getDeletedTasks');
        const res = await getDeletedTasksCall();
        if(res.status === 200) {
            console.log(res)
            setDeletedTasks(res.data)
        }
    }
    const handleRestore = async(event,task) => {
        task.isSofteDelete = false
        const res = await editTaskCall(task);
        if(res.status === 200) {
            setDeletedTasks(prevDeletedTasks => prevDeletedTasks.filter(t => t._id !== task._id) )
        }
    }


    const statusChangeonUI = (result) => {
        console.log('dragObject  ', result);
        const draggedObject = columns[result.source.droppableId].items[result.source.index]
        console.log('draggedObject  ',draggedObject);
        const sourceColumn = columns[result.source.droppableId];
        const destColumn = columns[result.destination.droppableId];
        const reducedSourceColumn = sourceColumn.items.splice(result.source.index,1);
        destColumn.items.splice(destColumn.items.length, 0, ...reducedSourceColumn);
        setDraggedTask(...reducedSourceColumn);
    }
    const revertStatusChangeonUI = () => {
        console.log('dragObject ',dragObject);

        const revertSourceColumn = columns[dragObject.destination.droppableId].items.splice(columns[dragObject.destination.droppableId].items.length-1, 1);
        columns[dragObject.source.droppableId].items.splice(dragObject.source.index,0, ...revertSourceColumn);
        

    }
    const handleTaksMoveAPICall = async() => {
        const data = {
            'status': columns[dragObject.destination.droppableId].alias,
            'taskId' : draggedTask.taskId
         }
         console.log('data ',data);
        const res = await editTaskCall(data);
        if(res.status === 200) {
            setConfMsg('Status is changed Successfully');
        } else{ 
            setConfMsg('Something went wrong. Please retry.');
            revertStatusChangeonUI()
        }

        console.log('draggedTask  ',draggedTask)

        setIsStatusChanges(true);
    }
    const handleActionAfterStatusChange = (e, close) => {
        close(); 
        setIsDragged(false);
        // window.location.reload();
    }
    const onDragEnd = (result, columns, setColumns) => {
        console.log('result ', result);
        console.log('column ', columns)
        setDragObject(result);
        if (!result.destination) return;
        const { source, destination } = result;
        if (source.droppableId !== destination.droppableId) {
            statusChangeonUI(result);
            setConfMsg('Are You Sure, You want to move the status of this Task ?' )
            setIsDragged(true);
        }

    }
    const handleRevertedStatusChange = (e, close) => {
        console.log('handleRevertedStatusChange  ');
        setIsStatusChanges(false)
        window.location.reload();
        close();
    }
    const handleFilterClick = () => {
        setOpenFilterPopup(true)
    }
    const closeFilter = (e, close) => {
        close();
        setOpenFilterPopup(false)
    }
    const handleFilterSubmit = async(e) => {
        e.preventDefault();
        console.log('formData ',formData)
        const res = await getDataCall(formData);
        const colArr = await getColumns(res);
        setColumns(colArr);
        setOpenFilterPopup(false)
    }
    return (
        <div className="tasklistContainerWrapper">
            <div className="taskListActions">
                <Popup trigger={(<button className="button default-button">Restore Tasks</button>)} onOpen={getDeletedTasks} modal>
                    {
                        close => (
                            <div className='modal center-text'>
                                <h2 className="headText">Restore tasks from here..</h2>
                                {deletedTasks.map(task => (
                                    <div className="restoreList" key={task._id}>
                                        <div className="taskId padLeft10">Task-{task.taskId}</div>
                                        <div className="taskLabel">{task.subjectLine}</div>
                                        <div className="action">
                                        <button className="button primary-button" onClick={(event) => handleRestore(event,task)}>Restore</button>
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="popupAction">
                                    <button className="button primary-button" onClick={(event => {getData(); close();})}>Close</button>
                                </div>
                            </div>
                        )
                    }
                </Popup>
                <button className="button default-button" onClick={handleFilterClick}>Filters</button>
                <Popup open={openFiletrPopup}>
                    {
                        close=> (
                            <div className="modal">
                                <UtilForm 
                                handleSubmit={handleFilterSubmit} 
                                handleChange={handleChange} 
                                getData={getData} 
                                setFormData={setFormData} 
                                formData = {formData}
                                formContent = {filterContent}
                                close={(e)=>{closeFilter(e, close)}}
                                isFilter = {true}
                                />
                                
                            </div>
                        )
                    }
                </Popup>
                
            </div>
            <Popup open={isDragged} modal>
                {
                    close => (<ConfirmationWithApi confirmationMsg={confMsg}
                        isApiSuccess={isStatusChanges} 
                        handleActionAfterAPICall={(e) => { handleActionAfterStatusChange(e, close ) }} 
                        close ={(e) => { close(); setIsDragged(false); }}
                        handleAPIAction={handleTaksMoveAPICall} 
                        pressedNo = {(e) => { handleRevertedStatusChange(e, close) }} />
                        )
                }
            </Popup>
            <div style={{ display: "flex", justifyContent: "center", height: "100%" }} >
                <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)} >
                    {
                        Object.entries(columns).map(([columnId, column], index) => {
                            return (
                                <div 
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center"
                                    }}
                                    key={columnId} >
                                        <h2>{column.name}</h2>
                                        <div style={{ margin: 8 }}>
                                            <Droppable droppableId={columnId} key={columnId}> 
                                                {
                                                    (provided, snapshot) => (
                                                        <div
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                            style={{
                                                            background: snapshot.isDraggingOver
                                                                ? "lightblue"
                                                                : "lightgrey",
                                                            padding: 4,
                                                            width: 250,
                                                            minHeight: 500
                                                            }} >
                                                                { 
                                                                // JSON.stringify(column.items)
                                                                    column.items.map((item, index) => {
                                                                        return (
                                                                            <Draggable key={item._id} draggableId={item._id} index={index}>
                                                                                {
                                                                                    (provided, snapshot) => {
                                                                                        return (
                                                                                            <div ref={provided.innerRef}  className='dragDropContainer'
                                                                                            {...provided.draggableProps}
                                                                                            {...provided.dragHandleProps}
                                                                                            style={{
                                                                                                userSelect: "none",
                                                                                                padding: 16,
                                                                                                margin: "0 0 8px 0",
                                                                                                minHeight: "50px",
                                                                                                backgroundColor: snapshot.isDragging
                                                                                                  ? "#263B4A"
                                                                                                  : "#007bff",
                                                                                                color: "white",
                                                                                                ...provided.draggableProps.style
                                                                                              }}>
                                                                                                <Taskbox key={item._id} task={item} pageReload={getData} />
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                }
                                                                            </Draggable>
                                                                        )
                                                                    } )
                                                                }
                                                            {provided.placeholder}
                                                        </div>
                                                    )
                                                }
                                            </Droppable>
                                        </div>
                                    </div>                                                                                         
                            )
                        })
                    }
                </DragDropContext>
            </div>
        </div>
    )
}