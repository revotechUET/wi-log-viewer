import './style.css';
import React from 'react';

import spinnerGif from './spinner.gif';

export default function(props) {
    return (
    <div className = {"loading-overlay-background"}
        style={{display: props.active?"block":"none"}}>
        <img width = {90} height = {90} className="loading-overlay-page-center" onClick={()=>props.onCancel()} src={spinnerGif}/>
    </div>
    );
}