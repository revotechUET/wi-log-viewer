import React from 'react';
import { fromEvent } from 'rxjs';
import './style.less';
import DelayTextInput from '../DelayTextInput';

/*
    props.choices: a list of object like {display: "bla", value: "blo"}
    props.selected: "null or object with display and value field"
    props.onChange: "on change a value"
    props.searchable: "put it into props to active search bar"
*/

export default class SearchableDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            edditing: false,
            searchValue: ""
        };

        this.contentRef = React.createRef();
    }

    componentDidMount() {
        this.setState({
            edditing: false,
            searchValue: ""
        });
        this.clickStream = fromEvent(document, 'click').subscribe((e)=>{
            if (!this.contentRef.current.contains(e.target)) {
                if (this.state.edditing) this.setState({
                    edditing: false
                });
            }
        });
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

    getFilteredList(list) {
        if (this.state.searchValue.length > 0) {
            return list.filter((e)=>JSON.stringify(e).toLowerCase().includes(this.state.searchValue.toLowerCase()));
        }
        return list;
    }

    getDisplayFromValue(e) {
        let idx = this.props.choices.findIndex((el)=>el.value == e);
        if (idx < 0) return null;
        return this.props.choices[idx].display;
    }

    getSearchField() {
        if (this.props.searchable) {
            return (
                <div className="dropdown-search">
                <DelayTextInput placeholder="Search" 
                onChange = {(e)=>{this.setState({searchValue: e})}}/>
                </div>
            )
        }
        return <div></div>
    }

    render() {
        return (
            <div style = {{position: "relative", display: "inline-block"}} ref = {this.contentRef}>
                <div onClick = {()=>{this.setState({edditing: !this.state.edditing})}}>
                    {
                        this.getDisplayFromValue(this.props.value) || "Empty"
                    }
                </div>
                <div className = {this.state.edditing ? "dropdown-content" : "dropdown-content hidden"}>
                    <div className="dropdown-carret"></div>
                        {this.getSearchField()}
                    <div className="dropdown-list-item" style = {{maxHeight: this.props.maxHeight || "300px", overFlow: "auto"}}>
                        {this.getFilteredList(this.props.choices).map((e, idx) => (
                            <div key={idx} onClick = {()=>{this.handleClick(e)}} 
                                className = {e.value == this.props.value ? "active": ""}>
                                {e.display}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}