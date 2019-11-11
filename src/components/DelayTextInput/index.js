import React from 'react';
import {BehaviorSubject, timer} from 'rxjs';
import {debounce} from 'rxjs/operators'

export default class DelayTextInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
        //console.log(this.props);
        this.onChangeValueStream = new BehaviorSubject("");
        this.onChangeValueStream = this.onChangeValueStream.pipe(debounce(()=>timer(this.props.debounceTime)));
    }

    componentDidMount() {
        this.onChangeValueStream.next(this.props.initValue || "");
        this.subcriber = this.onChangeValueStream.subscribe((value)=>{
            if (this.props.onChange) {
                this.props.onChange(value);
            }
        });
    }

    componentWillUnmount() {
        if (this.subcriber) {
            this.subcriber.unsubscribe();
        }
    }

    changeValue(e) {
        let value = e.target.value;
        this.onChangeValueStream.next(value);
        this.setState({
            value: value
        });
    }

    render() {
        let {debounceTime, onChange, initValue, ...passProps} = this.props;
        return (
                <input {...passProps} onChange={(e)=>{this.changeValue(e);}} value={this.state.value}/>
        );
    }
}

