import React from 'react';
import { fromEvent, BehaviorSubject, combineLatest } from 'rxjs';
import './style.less';
import DelayTextInput from '../DelayTextInput';
import InfiniteScrollVirtualList from '../InfiniteScrollVirtualList';
import PropTypes from 'prop-types';
import {findFilteredDataFn} from './../../utils/observable.util';
import ReactResizeDetector from 'react-resize-detector';

/*
    props.choicesFlow: a observable list of object (BehaviorSubject)
    props.selected: "null or object with display and value field"
    props.onChange: trigger if a click happen
    props.elComponent: component will receive a value in observable list, then render
    props.elHeight: height of element (for performance rendering)
    props.getDisplay: a function that turn from object to display

*/


export default class PerformanceDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            edditing: false,
            searchValue: ""
        };
        this.contentRef = React.createRef();
        this.searchFlow = new BehaviorSubject("");
        //this.filteredDataFlow = combineLatest(this.props.choicesFlow, this.searchFlow).pipe(findFilteredDataFn);
        this.filteredDataFlow = combineLatest(this.props.choicesFlow, this.searchFlow).pipe(findFilteredDataFn);
        this.resizeEvent = new BehaviorSubject(0);
    }

    componentDidMount() {
        this.filteredDataFlow = combineLatest(this.props.choicesFlow, this.searchFlow).pipe(findFilteredDataFn);
        this.searchFlow.next("");
        this.setState({
            edditing: false
        });
        this.clickStream = fromEvent(document, 'click').subscribe((e)=>{
            if (!this.contentRef.current.contains(e.target)) {
                console.log('click outside!');
                if (this.state.edditing) this.setState({
                    edditing: false
                });
            }
        });
        //this.props.choicesFlow.subscribe((e)=>console.log(e));
    }

    componentWillUnmount() {
        if (this.clickStream) this.clickStream.unsubscribe();
    }

    handleClick(e) {
        this.setState({
            edditing: false
        });
        if (this.props.onChange) {
            this.props.onChange(e);
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

    doChangeSearch(e) {
        this.searchFlow.next(e);
    }

    render() {
        return (
            <div style = {{position: "relative", display: "inline-block", width: "100%", height: "100%"}} ref = {this.contentRef}>
                <div style = {{width: "100%", height: "100%"}} onClick = {()=>{this.setState({edditing: !this.state.edditing})}} >
                    {
                        this.props.getDisplay(this.props.selected)
                    }
                </div>
                <div className = {this.state.edditing ? "dropdown-content-performance" : "dropdown-content-performance hidden"}>
                    <div className="dropdown-carret-performance"></div>
                    <div className="dropdown-search-performance">
                        <DelayTextInput placeholder="Search" onChange = {(e)=>{this.doChangeSearch(e)}}/>
                    </div>
                    <div className="dropdown-list-item-performance" style = {{maxHeight: "300px"}}>
                        {/* {this.getFilteredList(this.props.choices).map((e, idx) => (
                            <div key={idx} onClick = {()=>{this.handleClick(e)}} 
                                className = {e.value == this.props.value ? "active": ""} style={{height: "10px"}}>
                                {e.display}
                            </div>
                        ))} */}
                        <ReactResizeDetector handleHeight >
                            <InfiniteScrollVirtualList dataFlow={this.filteredDataFlow} 
                                                    elHeight={this.props.elHeight}
                                                    elComponent = {this.props.elComponent}
                                                    onElementClick = {(e)=>{this.handleClick(e);}}
                            />
                        </ReactResizeDetector>

                    </div>
                </div>
            </div>
        );
    }
}

PerformanceDropdown.propsType = {
    choicesFlow: PropTypes.object.isRequired,
    selected: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    elComponent: PropTypes.func.isRequired,
    elHeight: PropTypes.number.isRequired,
    getDisplay: PropTypes.func.isRequired,
    filterFn: PropTypes.func
}