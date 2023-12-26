import Popup from 'reactjs-popup';
import UtilPopup from '../uiComponents/popup/UtilPopup';
import './comment.css';
import { useEffect, useState } from 'react';
import TextEditor from '../textEditor/TextEditor';
import { dateFormatter, getValFromSession } from '../../utilities/util';
import { addCommentCall, getCommentByTaskCall } from '../../utilities/commonApiCalls';

export default function Comment({task}) {
    console.log('task  ',task)
    const [addCommmentOpen, setaddCommmentOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [taskComments, setTaskComments] = useState([]);
    const [reloadComment, setReloadComment] = useState(false)
    const openCommentPopup = () => {
        setaddCommmentOpen(true);
    }
    const handleSave = async () => {
        const data = {
            "taskId" : task.taskId,
            "userId" : getValFromSession('userId'),
            "username" : getValFromSession('fname')+' '+getValFromSession('lname'),
            "comment" : comment
        }
        console.log('comment ', comment)
        // const res = await addCommentCall(data);
        // if(res.status === 200) { 
        //    alert(' your comment is added successfully');
        //    getCommentsByTask();
        // //    refresh commment section
        // setReloadComment(true)
        //  } else {
        //     alert('Something went wrong , please retry')
        //  }
    }
    const getCommentsByTask = async() => {
        const res = await getCommentByTaskCall(task.taskId);
        console.log('res ',res.data);
        if(res.status === 200) {
            setTaskComments(res.data)
            setaddCommmentOpen(false);
        } else setTaskComments([])
    }
    const getAvatar = (username) => {
        let [fname, lname] = username.split(' ');
        return fname.substring(0,1).toUpperCase() + lname.substring(0,1).toUpperCase()
    }
    useEffect(() => {
        getCommentsByTask();
    },[reloadComment])
    return (
                <div className="commentContainer">
                     <div className="userComment">
                        <div className="detailsValue">
                           <div className="sublabel">Comment :</div>
                           <div className="addComment">
                              <button className="button default-button" onClick={openCommentPopup}>Add Comment</button>
                              <Popup open={addCommmentOpen} closeOnDocumentClick={false} modal nested> 
                                {
                                    close => (
                                        <div className="popupContainer modal">
                                            <div className="mb10">
                                                What is your comment ?
                                            </div>
                                            <TextEditor setDescription={setComment} description={comment} />
                                            <div className="popupControls">
                                                <button className="close button primary-button" onClick={handleSave}>Save</button>
                                                <button className="close button default-button" onClick={event => { setaddCommmentOpen(false); }}>Cancel</button>
                                            </div>
                                        </div>
                                    )
                                }
                              </Popup>
                           </div>
                        </div>
                       { taskComments.map(comment =>( 
                            <div className="commentLoop" key={comment._id}>
                                <div className="subValues">
                                    <div className="commentHead mb10">
                                        <div className="avatarContainer leftFloat">{getAvatar(comment.username)} </div>
                                        <div className="nameContainer leftFloat">
                                            <span className="username">{comment.username} </span> 
                                            <span className="conjunctionText">commented on </span>
                                            <span className="editDate"> { comment.createdAt ? dateFormatter(new Date(comment.createdAt)) : '' } </span>
                                        </div>
                                    </div>
                                    <div className="commentBody" dangerouslySetInnerHTML={{__html: comment.comment}}>
                                        {/* {comment.comment} */}
                                    </div>
                                </div>
                            </div>
                        )
                       ) }
                     </div>
                  </div>
    )
}