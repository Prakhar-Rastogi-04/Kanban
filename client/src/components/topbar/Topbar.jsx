import React, { useEffect, useState } from 'react';
import "../topbar/topbar.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { getSearchResultsCall } from '../../utilities/commonApiCalls';
import { clearSessionStorage, getValFromSession } from '../../utilities/util';
import Classification from '../../pages/classification/Classification';
import classNames from "classnames";

const Topbar = () => {
    const [ searchInput, setSearchInput] = useState('');
    const [ results, setResults ] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const urlPath = location.pathname;
    const handleSearchResults = () => {
        const getSearchResults = async () => {
            if(searchInput.length > 0) {
                let response = await getSearchResultsCall(searchInput);
                let data = response.data
                await setResults(data);
            }
        }
        getSearchResults();
    }
    const userName = getValFromSession('isLoggedin') ? getValFromSession('fname')+' '+getValFromSession('lname'): '';
    const avatarName = getValFromSession('isLoggedin') ? getValFromSession('fname').slice('',1).toUpperCase() + getValFromSession('lname').slice('',1).toUpperCase() : '';
    useEffect(() => {
        console.log('use effect')
        handleSearchResults();
    }, [searchInput])
    
    
    const handleSearchInput = async (event) => {
        await setSearchInput(event.target.value);
    }

    const predictiveSearchClick = (item) => {
        navigate('/details/TASK-'+item.taskId , {reload: true });
    }

    const handleLogout = () => {
        clearSessionStorage();
        navigate('/login');
    }

    const isCurrentPage = (tabname) => {
        return urlPath.replace('/','') === tabname.toLocaleLowerCase() 
    }
    
    const handleTabClick = (evt) => {
        console.log(evt.currentTarget.text)
        navigate(`/${evt.currentTarget.textContent.toLocaleLowerCase()}`)
    }

    return (
        <div>
            <div className="topbarContainer">
                <div className="topbarLeft">
                    <div className="logoContainer">
                            <div className="companyLogo">TaskBook </div>
                        <div className="comanyTagLine">
                            <i></i>
                        </div>
                    </div>
                </div>
                <div className="topbarCenter">
                    <div className="searchBar">
                        <input className='searchText' type='search' placeholder='search your tasks here' name='search' onChange={handleSearchInput} value={searchInput} />
                    </div>
                    <div className={`predictiverResults ${results.length > 0 ? 'predictiverResultsStyles' : '' }`}>
                        <ul>
                            {
                                results.length > 0 && results.map((item) => (
                                    <li key={item.taskId} onClick={() =>{predictiveSearchClick(item)} }>{item.taskId} {item.subjectLine}</li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <div className="topbarRight">
                    <div className="topbarLink">
                        {/* <div className={ classNames({ currentTab :  isCurrentPage('Dashboard')})} onClick={handleTabClick} >Dashboard</div>
                        <div className={ classNames({ currentTab :  isCurrentPage('Classification')}) } onClick={handleTabClick}>Classification</div> */}
                    </div>
                    
                    <div className="topbarProfileIcon">
                        <div className="avatarContainer">
                            <span className="avatarName">{avatarName}</span>
                            <div className="profileMenu">
                                <ul className='margin0 padding0'>
                                    <li className='disabled'>Edit Profile</li>
                                    <li className='disabled'>My Reports</li>
                                    <li onClick={handleLogout}>Logout</li>
                                </ul>
                            </div>
                        </div>
                        <div className="userNameContainer">
                            <span className="username">{userName}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;