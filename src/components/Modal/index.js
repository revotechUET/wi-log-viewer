import React from 'react';
import './style.css';

export default class Modal extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props);
    }

    render() {
        return (
            <div className = "modal-background">
                <div className="modal-center">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

