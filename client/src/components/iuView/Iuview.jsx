import { useEffect, useState } from 'react';
import './iuview.css';
import axios from 'axios';
import { getTaskDataCall } from '../../utilities/commonApiCalls';
import Topbar from '../topbar/Topbar';

export default function Iuview () {
    const [taskData , setTaskData ] = useState([]);
    const [hliu , sethliu ] = useState([]);
    const [hhiu , sethhiu ] = useState([]);
    const [lliu , setlliu ] = useState([]);
    const [lhiu , setlhiu ] = useState([]);
    const getTaskData = async () => {
       let res = await getTaskDataCall();
       if(res.status===200){
        setTaskData(res.data);
        classifyTaskData(res.data);
       }
    }
    const classifyTaskData = (taskData) => {
        
        console.log('taskData ',taskData);
        let ll =[],hh=[],lh=[],hl=[];
        taskData.forEach(task => {
            console.log(task);
            if(task.importance === 'low') {
                if(task.urgency == 'low') {
                    ll.push(task);
                } else lh.push(task)
            }
            if(task.importance === 'high') {
                if(task.urgency == 'low') {
                    hl.push(task);
                } else hh.push(task)
            }
        })
        sethhiu(hh);
        setlliu(ll);
        sethliu(hl);
        setlhiu(lh);
        consoleAllData();
    }
    useEffect(() => {
       getTaskData(); 
    }, [])

    const consoleAllData = () => {
        console.log('hliu ', hliu);
    }

    return (
        <>
        <Topbar />
        <div className="iuViewContainer">
            <svg height="550" width="100" className='verticalArrow'>
                <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                    <path d="M0,0 L0,10 L10,5 Z" fill="black" />
                    </marker>
                </defs>
                <line x1="15" y1="0" x2="15" y2="550" class="vl" marker-end="url(#arrow)" />
                <text x="30" y="250" class="text">Importance</text>
            </svg>

            <div className="iuGraphParent">
                <div className="taskBlocks iu-1 border-bottom-dotted border-right-dotted">
                    <h2>High Importance - Low Urgency</h2>
                    <div className="taskTokenContainer">
                        {
                            hliu.map((task) => <div className='taskToken'>TASK-{task.taskId}</div> )
                        }                    
                    </div>
                </div>
                <div className="taskBlocks iu-2 border-bottom-dotted">
                    <h2>High Importance - High Urgency</h2>
                    <div className="taskTokenContainer">
                        {
                            hhiu.map((task) => <div className='taskToken'>TASK-{task.taskId}</div> )
                        }                    
                    </div>
                </div>
                <div className="taskBlocks iu-3 border-right-dotted">
                    <h2>Low Importance - Low Urgency</h2>
                    <div className="taskTokenContainer">
                        {
                            lliu.map((task) => <div className='taskToken'>TASK-{task.taskId}</div> )
                        }                    
                    </div>
                </div>
                <div className="taskBlocks iu-4">
                    <h2>Low Importance - High Urgency</h2>
                    <div className="taskTokenContainer">
                        {
                            lhiu.map((task) => <div className='taskToken'>TASK-{task.taskId}</div> )
                        }                    
                    </div>
                </div>
            </div>

            <svg height="100" width="100%" className='horizontalArrow'>
                <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                    <path d="M0,0 L0,10 L10,5 Z" fill="black" />
                    </marker>
                </defs>
                <line x1="100" y1="10" x2="90%" y2="10" class="vl" marker-end="url(#arrow)"></line>
                <text x="50%" y="35" class="text">Urgency</text>
            </svg>
            
            {/* <svg height="100" width="500">
                <line x1="0" y1="50" x2="500" y2="50" class="hl"/>
            </svg> */}
        </div>
        </>
    )
}