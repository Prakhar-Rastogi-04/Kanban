import { Suspense } from 'react';
import { BarComp } from '../chartComponent/bar/BarComp';
import Pie from '../chartComponent/pie/Pie';
import './confirmationWithApi.css';

export default function ConfirmationWithApi(props) {
    return (
        <div className='modal'>
            <h3 className="confirmationText">{props.confirmationMsg}</h3>
            {
                props.isChartingOn && <div className="chartSection">
                    <Suspense fallback={<div>Loading...</div>}>
                        <BarComp taskData={props.taskData} />
                    </Suspense>
                </div>
            }
            <div className="buttonSection">
                { !props.isApiSuccess && (
                    <>
                    <button className='button primary-button' onClick={props.handleAPIAction}>Yes</button>
                    <button className='button default-button' onClick={props.pressedNo}>No</button>
                    </>
                )}
                {props.isApiSuccess && <button className='button primary-button' onClick={props.handleActionAfterAPICall}>OK</button>}
            </div>
        </div>
    )
}