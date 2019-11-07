import React from 'react';

import FixedHeightComponent from './FixedHeight.component';
/*
    props:
        elHeight: element height,
        dataFlow: a observable data
            dataflow is a observable stream that emit new object value:
            {type: 0||1, value: Array}
            If type = 0 it means there is a brand new data, scroll will reset to 0
            If type = 1 it means there is a new data created by loading (adding) more data into it
            type = 1 will not reset the scroll
        onRequestMore: request for a scroll. param: last element,  and length of current list
        elComponent: a Component to render like with props.value like: <Component elValue={a obj} />

*/

class InfiniteScrollList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            list: []
        }
        this.viewLength = 0;
        this.scrollContainer = React.createRef();
    }


    componentDidMount() {
        this.viewLength = Math.ceil(this.scrollContainer.current.clientHeight / this.props.elHeight);
        this.props.dataFlow.subscribe((value)=>{
            //check if it's a new or a add more
            //console.log(value);
            this.setState({
                list: value.value
            }, ()=>{
                //handle re-count
                if (value.type == 0) {
                    this.scrollContainer.current.scrollTop = 0;
                    // this.setState({
                    //     currentIndex: 0
                    // });
                }
            });
        });
        // this.setState({
        //     currentIndex: 0,
        //     list: []
        // });
    }

    componentWillUnmount() {
        this.props.dataFlow.unsubscribe();
    }

    handleScroll(e) {
        let scrollTop = e.target.scrollTop;
        let scrollHeight = e.target.scrollHeight;
        let clientHeight = e.target.clientHeight;
        e.preventDefault();
        // console.log('scrollTop:', scrollTop);
        if (scrollHeight - scrollTop === clientHeight) {
            this.props.onRequestMore(this.state.list[this.state.list.length-1], this.state.list.length);
        }

        this.setState({
            currentIndex: Math.floor(scrollTop/this.props.elHeight) 
        });

    }

    render() {
        return (
            <div ref={this.scrollContainer} style={{height: "100%", width:"100%", overflow:" auto"}} onScroll={(e) => {this.handleScroll(e);}}>
                <div style={{height: this.props.elHeight * this.state.list.length}}>
                    {this.state.list
                    //filter that idx must in current view
                    .filter((e, idx)=>(idx >= this.state.currentIndex && idx <= this.state.currentIndex + this.viewLength))
                    .map((value, idx)=> <FixedHeightComponent component = {<this.props.elComponent elValue = {value} />} 
                                            fixedHeight = {this.props.elHeight} currentIndex = {this.state.currentIndex} key = {idx} />
                    )}
                </div>
            </div>
        );
    }
}

export default InfiniteScrollList;