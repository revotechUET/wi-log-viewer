import './LoadingOverlay.css';
import React from 'react';

export default function(props) {
    return (
    <div className = {"loading-overlay-background"}
        style={{display: props.active?"block":"none"}}>
        <button className="loading-overlay-page-center" onClick={()=>props.onCancel()}>Cancel</button>
    </div>
    );
}