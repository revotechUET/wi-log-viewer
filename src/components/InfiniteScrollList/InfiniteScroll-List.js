import React from 'react';

import FixedHeightComponent from './FixedHeight.component';
/*
    props:
        elHeight: element height,
        dataFlow: a observable data
        onRequestMore: request for a scroll
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
        console.log('Mounted');
        this.viewLength = Math.ceil(this.scrollContainer.current.clientHeight / this.props.elHeight);
        this.props.dataFlow.subscribe((value)=>{
            this.setState({
                list: value
            });
        });
        this.setState({
            currentIndex: 0,
            list: []
        });
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
            console.log('reach bottom');
            this.props.onRequestMore();
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
                    .filter((e, idx)=>(idx >= this.state.currentIndex && idx < this.state.currentIndex + this.viewLength))
                    .map((value, idx)=>( <div style={{transform: `translateY(${this.state.currentIndex * this.props.elHeight}px)`}}>
                        <this.props.elComponent elValue={value} key={idx} height={this.props.elHeight} />
                    </div>))}
                </div>
            </div>
        );
    }
}

export default InfiniteScrollList;