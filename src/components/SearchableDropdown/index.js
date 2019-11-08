import React from 'react';
import { fromEvent } from 'rxjs';

export default class SearchableDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: this.props.initValue || {},
            edditing: false
        };
    }

    componentDidMount() {
        this.setState({
            selected: this.props.initValue || {},
            edditing: false
        });
        this.clickStream = fromEvent(document, 'click').subscribe((e)=>{
            console.log(e);
        });
    }

    render() {
        return (
            <div>
                hello
            </div>
        );
    }
}