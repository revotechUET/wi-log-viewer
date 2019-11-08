import './style.less';
import React from 'react';

import spinner from './spinner.gif'
export default function (props) {
    return (
        <div className={"loading-overlay-background"} style={{ display: props.active ? "flex" : "none" }}>
            <div onClick={() => props.onCancel()} className="spinner">
                <div className="ti ti-close"></div>
                <img src={spinner}></img>
            </div>
        </div>
    );
}