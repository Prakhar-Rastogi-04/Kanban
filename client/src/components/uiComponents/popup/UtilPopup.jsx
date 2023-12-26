import './utilPopup.css';
import Popup from 'reactjs-popup';
import UtilForm from '../form/UtilForm';
export default function UtilPopup ({props, name, task}) {
    const [notify, setNotify, formContent, formData, setFormData, handleChange, handleSubmit] = props;
   const resetPopup = () => {
    setNotify({msg:'', err:'', isShow:false, isError:false});
   }
    return(
        <Popup trigger={<button className="edit button default-button">{name}</button>} modal nested>   
            {
                close => (
                        <div className='modal center-text'>
                        <div className="alert capitalise">{notify.isShow && ( <div className="content"> {notify.msg}</div>)}</div>
                        <div className="editFieldsContainer">
                        { !notify.isShow && <UtilForm 
                            handleSubmit={handleSubmit} 
                            handleChange={handleChange} 
                            setFormData={setFormData} 
                            formData = {formData}
                            formContent = {formContent}
                            close ={close}
                            />}
                        </div>
                        <div className="popupControls">
                          {notify.isShow &&  <button className="close button primary-button" onClick={event => { resetPopup(); close(); }}>Ok</button>}
                        </div>
                        </div>
                )
            }
        </Popup>
    )
}