import React from 'react';
import { fromEvent } from 'rxjs';
import './style.css';
import DelayTextInput from '../DelayTextInput';

/*
    props.choices: a list of object like {display: "bla", value: "blo"}
    props.selected: "null or object with display and value field"
*/

export default class SearchableDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: this.props.initValue || {},
            edditing: false
        };

        this.contentRef = React.createRef();
    }

    componentDidMount() {
        this.setState({
            selected: this.props.initValue || {},
            edditing: false
        });
        this.clickStream = fromEvent(document, 'click').subscribe((e)=>{
            if (!this.contentRef.current.contains(e.target)) {
                if (this.state.edditing) this.setState({
                    edditing: false
                });
            }
        });
    }

    handleClick(e) {
        this.setState({
            selected: e,
            edditing: false
        });
        if (this.props.onChange) {
            this.props.onChange(e);
        }
    }

    render() {
        return (
            <div style = {{position: "relative", display: "inline-block"}} ref = {this.contentRef}>
                <div onClick = {()=>{this.setState({edditing: !this.state.edditing})}}>
                    {this.state.selected.display || "NOTHING"}
                </div>
                <div className = {this.state.edditing ? "dropdown-content" : "dropdown-content hidden"}>
                    <div>
                        <DelayTextInput />
                    </div>
                    <div>
                        {this.props.choices.map((e, idx) => (
                            <div key={idx} onClick = {()=>{this.handleClick(e)}} 
                                className = {e.value == this.state.selected.value ? "active": ""}>
                                {e.display}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}