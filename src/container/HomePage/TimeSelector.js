import React from 'react';
import Popup from '../../components/DropdownContainer';
import DropdownContainer from '../../components/DropdownContainer';
import DatePicker from '../../components/DatePicker';

import './time-selector.less';

/*
    TYPE: 0 = relative;  1 = absolute
*/

export default class TimeSelector extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            time: {}
        }
    }

    render() {
        return (
            <div>
                <div>
                    <span>From:</span>
                    <TimePicker />
                </div>
                <div>
                    <span>To:</span>
                    <TimePicker />
                </div>
            </div>
        );
    }
}

function TimePicker(props) {
    return (
        <div >
            <DropdownContainer display = {<DisplayTime />}>
                <div style={{height: "300px", width: "400px"}}>SELECTOR</div>
            </DropdownContainer>
        </div>
    );
}

function DisplayTime(props) {
    return (
        <div className = "display-time" style = {{height: "33px"}}>
            TIME
        </div>
    );
}

function Selector() {

}