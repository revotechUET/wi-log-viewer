import React from 'react';
import Popup from '../../components/DropdownContainer';
import DropdownContainer from '../../components/DropdownContainer';
import DatePicker from '../../components/DatePicker';
import constant from './constant';

import './time-selector.less';
import SearchableDropdown from '../../components/SearchableDropdown';
import { getTime } from 'date-fns';

/*
    TYPE: 0 = relative;  1 = absolute; 2 = NOW
*/

export default class TimeSelector extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            from: {
                type: 0,
                value: {
                    number: 1,
                    relative: "d"
                }
            },
            to: {
                type: 2,
                value: "NOW"
            }
        }
    }

    componentDidMount() {
        this.setState({
            from: {
                type: 0,
                value: {
                    number: 1,
                    relative: "d"
                }
            },
            to: {
                type: 2,
                value: "NOW"
            }
        });
    }

    onChangeTime(e, field) {
        //console.log(e);
        if (field == 'from') {
            this.setState({
                from: e
            })
        } else {
            this.setState({
                to: e
            })
        }
    }

    render() {
        return (
            <div>
                <div>
                    <span>From:</span>
                    <TimePicker value={this.state.from} onChange={(e) => this.onChangeTime(e, 'from')} />
                </div>
                <div>
                    <span>To:</span>
                    <TimePicker value={this.state.to} onChange={(e) => this.onChangeTime(e, 'to')} />
                </div>
            </div>
        );
    }
}

class TimePicker extends React.Component {

    /*
        TimeMode: 0 ~ relative, 1 = absolute, 2 = NOW
    */
    constructor(props) {
        super(props);

    }

    componentDidMount() {
    }

    getTimeISOString(e) {
        let date = new Date(e);
        if (isValidDate(date)) return (date.toISOString());
        return
    }

    onTimeChange(e) {
        // let date = new Date(e);
        // if (isValidDate(date)) console.log(date.toISOString());
        this.props.onChange(e);
    }

    onTimeModeChange(e) {
        let newTimeMode = e.target.value;
        if (newTimeMode == 0) {
            this.onTimeChange({
                type: newTimeMode,
                value: {
                    number: 1,
                    relative: "d"
                }
            });
        } else if (newTimeMode == 1) {
            this.onTimeChange({
                type: newTimeMode,
                value: this.getTimeISOString(new Date())
            });
        } else {
            this.onTimeChange({
                type: 2,
                value: "NOW"
            })
        }
    }

    onTimeValueChange(e) {
        this.onTimeChange({
            type: this.props.value.type,
            value: this.getTimeISOString(e)
        });
    }

    onChangeNumberRelative(e) {
        let number = e.target.value;
        this.onTimeChange({
            type: this.props.value.type,
            value: {
                number: number,
                relative: this.props.value.value.relative
            }
        });
    }

    onChangeRelativeType(e) {
        let relative = e.target.value;
        this.onTimeChange({
            type: this.props.value.type,
            value: {
                number: this.props.value.value.number,
                relative: relative
            }
        });
    }

    getTimeSelector() {
        //console.log(this.props.value.type);
        if (this.props.value.type == 0) {
            return (
                <div>
                    <input type="number" value = {this.props.value.value.number} onChange = {e=>this.onChangeNumberRelative(e)}/>
                    <select value = {this.props.value.value.relative} onChange = {e=>this.onChangeRelativeType(e)}>
                        {
                            constant.relativeTime.map(e=>(
                            <option key = {e.value} value = {e.value}>{e.display}</option>
                            ))
                        }
                    </select>
                </div>
            )
        } else if (this.props.value.type == 1) {
            return (
                <div>
                    <DatePicker selected={new Date(this.props.value.value)} inline showTimeSelect onChange={(date) => { this.onTimeValueChange(date) }} />
                </div>
            );
        }
        return (
            <div>
                
            </div>
        );
    }

    render() {
        return (
            <div >
                <DropdownContainer display={<DisplayTime />}>
                    <div>
                        <input onChange={(e) => this.onTimeModeChange(e)}
                            type="radio" value={0}
                            checked={this.props.value.type == 0} />
                        <span>Relative</span>
                        <input onChange={(e) => this.onTimeModeChange(e)}
                            type="radio" value={1}
                            checked={this.props.value.type == 1} />
                        <span>Absolute</span>
                        <input onChange={(e) => this.onTimeModeChange(e)}
                            type="radio" value={2}
                            checked={this.props.value.type == 2} />
                        <span>Now</span>
                    </div>
                    {
                        this.getTimeSelector()
                    }
                </DropdownContainer>
            </div>
        );
    }
}

function DisplayTime(props) {
    return (
        <div className="display-time" style={{ height: "33px" }}>
            TIME
        </div>
    );
}


function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}