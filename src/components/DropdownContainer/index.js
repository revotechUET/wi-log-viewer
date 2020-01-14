import React from 'react';
import { fromEvent } from 'rxjs';
import './style.less';

/*
    props.choices: a list of object like {display: "bla", value: "blo"}
    props.selected: "null or object with display and value field"
*/

export default class DropdownContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            edditing: false
        };

        this.contentRef = React.createRef();
        this.displayRef = React.createRef();
    }

    componentDidMount() {
        this.setState({
            edditing: false
        });
        this.clickStream = fromEvent(document, 'mousedown').subscribe((e)=>{
            if (!this.contentRef.current.contains(e.target)) {
                if (this.state.edditing) this.setState({
                    edditing: false
                });
            }
        });
        //console.log(this.displayRef.current.clientHeight);
    }

    componentWillUnmount() {
        if (this.clickStream) this.clickStream.unsubscribe();
    }

    handleClick(e) {
        this.setState({
            edditing: false
        });
        if (this.props.onChange) {
            this.props.onChange(e.value);
        }
    }

    render() {
        return (
            <div style = {{position: "relative", display: "inline-block", width: "100%", height: "100%"}} ref = {this.contentRef}>
                <div style = {{width: "100%", height: "100%"}} onClick = {()=>{this.setState({edditing: !this.state.edditing})}} ref={this.displayRef}>
                    {this.props.display}
                </div>
                <div className = {this.state.edditing ? "dropdown-content-container" : "dropdown-content-container hidden"}
                        style={{top: (this.displayRef.current || {clientHeight: 30}).clientHeight + 3}}
                >
                    <div className="dropdown-carret"></div>
                    <div className="dropdown-content-children" style = {{maxHeight: "300px"}}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}