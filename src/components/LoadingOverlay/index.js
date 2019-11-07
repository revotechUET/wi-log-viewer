import './style.css';
import React from 'react';

import spinnerGif from './../../assets/images/spinner.gif';

export default function(props) {
    return (
    <div className = {"loading-overlay-background"}
        style={{display: props.active?"block":"none"}}>
        <button className="loading-overlay-page-center" onClick={()=>props.onCancel()}>Cancel</button>
        <img src={spinnerGif}/>
    </div>
    );
}