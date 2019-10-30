import React from 'react';
import {withRouter} from 'react-router-dom';
import {toast} from 'react-toastify';

import userService from './../../../service/user.service';
import ApiService from './../../../service/api.service';

class Login extends React.Component{
    constructor(props) {
        super(props);
        console.log('Login:', props);
        this.apiService = new ApiService(this.props.history);
        this.usernameRef = React.createRef();
        this.passwordRef = React.createRef();
        this.state = {
            username: "",
            password: "",
            disable: false
        }
    }

    componentDidMount() {
        this.urlSnapshot = this.props.location.state.urlSnapshot || this.props.urlSnapshot;
    }

    handeChange(e) {
        let target = e.target;
        this.setState((state)=>{
            state[target.name] = target.value;
            return state;
        });
    }

    disable() {
        this.setState({
            disable: true
        });
    }

    enable() {
        this.setState({
            disable: true
        });
    }

    clearField() {
        this.setState({
            username: "",
            password: ""
        })
    }

    submitLogin() {
        //check null
        if (this.state.username.length == 0) {
            //username null
            toast.error("Username can not null!");
            this.usernameRef.current.focus();
        }
        if (this.state.password.length == 0) {
            //username null
            toast.error("Password can not null!");
            this.passwordRef.current.focus();
        }
        this.disable();
        this.apiService.login(this.state.username, this.state.password)
        .then(rs=>{
            userService.setToken(rs.content.token);
            //console.log(userService.isLogin());
            this.props.history.push(this.urlSnapshot);
        })
        .catch(e=>{
            toast.error(e.message);
            this.clearField();
            this.enable();
        });
    }

    render() {
        return (
            <div onKeyDown = {(e)=>{if (e.keyCode == 13) return this.submitLogin();}}>
                <input disable = {this.state.disable.toString()} ref = {this.usernameRef} name="username" value = {this.state.username} onChange = {(e)=>this.handeChange(e)} />
                <br />
                <br />
                <input disable = {this.state.disable.toString()} ref = {this.passwordRef} name="password" type="password" value = {this.state.password} onChange = {(e)=>this.handeChange(e)} />
            </div>
        );
    }
}

export default withRouter(Login);