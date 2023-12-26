import Createtask from "../../components/createTask/Createtask";
import Tasklist from "../../components/tasklist/Tasklist";
import Topbar from "../../components/topbar/Topbar";
import { useEffect, useState } from "react";
import "./home.css";
// import Iuview from "../../components/iuView/Iuview";
import LoginPrompt from "../../components/uiComponents/loginPrompt/LoginPrompt";
import { getDataCall } from "../../utilities/commonApiCalls";
import useLogoutHook from "../../utilities/useLogoutHook";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/uiComponents/loader/Loader";
import { clearSessionStorage } from "../../utilities/util";

export default function Home () {
    const navigate = useNavigate();
    const [taskData, setTaskData] = useState([]);
    const [loading , setLoading] = useState(false);
    const [loadingMsg , setLoadingMSG] = useState('');
    let columnsFromBackend = []
    const [columns, setColumns] = useState(columnsFromBackend);
    let recallGetData = true;
    const getColumns = async (res) => {
        let colArr = [
            {
                name: "To Do",
                alias:"To Do",
                items: res.data[0]
            },{
                name: "In Progress",
                alias:"In Progress",
                items: res.data[1]
            },{
                name: "Done",
                alias:"Done",
                items: res.data[2]
            },{
                name: "Today's Picks",
                alias:"Today",
                items: res.data[3]
            }
    
        ];
        return colArr
    }
    const getData = async() => {
        setLoading(true);
        const res = await getDataCall() ;
        console.log('res ',res)
        if(res.status===200) {
            setTaskData(res.data);
            columnsFromBackend = await getColumns(res);
            setColumns(columnsFromBackend);
            setLoading(false) 
            setTimeout(()=>{
                console.log('123----')
                setLoading(false) 
            },1000)
        }
        if(res.status === 401 ){
            console.log('--logout called ---------');
            logout();
        }
        if(res.status === 403 ){
            console.log('--Forbiddent access ----recallGetData-----', recallGetData);
            // if(recallGetData) { 
            //     getData();
            //     console.log('call getData');
            //     recallGetData = false; 
            // }
            // console.log('recallGetData  ',recallGetData)
        }
    };
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            getData();
        }, 2000);
    },[]);
    const logout = () => {
    //    setTimeout(()=>{  navigate('/login'); },1500)
    clearSessionStorage();
    navigate('/login');
    }


   

    return (
        <div>
            <LoginPrompt />
            <Loader isOpen = {loading} msg={loadingMsg} />
            <Topbar />
            <div className="pageContainer">
                <div className="taskPanel">
                    { !loading && <Tasklist getData={getData} 
                    // taskData={taskData} 
                    // taskData={columnsFromBackend}
                    columns={columns}
                    setColumns={setColumns}
                    getColumns = {getColumns}
                    /> }
                </div>
                <div className="actionPanel">
                    <Createtask getData={getData} taskData={taskData} />
                </div>
            </div>
        </div>
    )
}