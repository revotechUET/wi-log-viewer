import React from 'react';


export default class Editable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            edditing: false,
            value: this.props.initValue || ""
        }
    }

    componentDidMount() {
        this.setState({
            edditing: false,
            value: this.props.initValue || ""
        });
    }

    changeValue(e) {
        let value = e.target.value;
        this.setState({
            value: value
        });
    }

    render() {
        if (this.state.edditing) {
            return (
                <div>
                    <input onBlur={()=>{this.setState({edditing: false});}} onChange={(e)=>{this.changeValue(e)}} 
                    style={{border: "none", width: "100%", height:"30px"}}/>
                </div>
            );
        } else {
            return (
                <div>
                    <div onClick={()=>{this.setState({edditing: true})}} style={{width: "100%", height:"100%", minHeight: "30px"}}>{this.state.value}</div>
                </div>
            );
        }
    }
}