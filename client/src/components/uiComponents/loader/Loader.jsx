import Popup from 'reactjs-popup';
import './loader.css';

export default function Loader ({isOpen , msg}) {
    const PF = process.env.REACT_APP_PUBLIC_ASSETS
    return (
        <Popup open={isOpen} modal >
            { () => (<div className="loaderParent">
                <h4>{msg}</h4>
                <img src={PF+'/loading.gif'} alt="loading" className="loaderGif" />
            </div>)}
        </Popup>
        
    )
}