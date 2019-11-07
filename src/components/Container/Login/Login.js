import React from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import userService from './../../../service/user.service';
import apiService from './../../../service/api.service';

import './style.less';
import LoadingOverlay from '../../LoadingOverlay';

class Login extends React.Component {
    constructor(props) {
        super(props);
        console.log('Login:', props);
        this.usernameRef = React.createRef();
        this.passwordRef = React.createRef();
        this.state = {
            username: "",
            password: "",
            disable: ""
        }
        this.loginSubcriber = null;
        this.cancelLoginSubmit = this.cancelLoginSubmit.bind(this);
    }

    componentDidMount() {
        this.urlSnapshot = this.props.location.state.urlSnapshot || this.props.urlSnapshot;
    }

    componentWillUnmount() {
        if (this.loginSubcriber) {
            this.loginSubcriber.unsubscribe();
            this.loginSubcriber = null;
        }
    }

    handeChange(e) {
        let target = e.target;
        this.setState((state) => {
            state[target.name] = target.value;
            return state;
        });
    }

    disable() {
        this.setState({
            disable: "disabled"
        });
    }


    enable() {
        this.setState({
            disable: ""
        });
    }

    clearField() {
        this.setState({
            username: "",
            password: ""
        });
    }


    cancelLoginSubmit() {
        if (this.loginSubcriber) {
            this.loginSubcriber.unsubscribe();
            this.loginSubcriber = null;
        }
        this.enable();
    }

    submitLogin() {
        //check if requesting...
        if (!this.state.disable) {
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
            //this.loadSub = loadingOverlayService.pushLoad();
            this.loginSubcriber = apiService.login(this.state.username, this.state.password)
                .subscribe({
                    next: (rs) => {
                        rs = rs.data;
                        //this.cancelLoginSubmit();
                        userService.setToken(rs.content.token);
                        toast.success("Login successfully");
                        // if (this.loadSub) {
                        //     this.loadSub();
                        // }
                        //console.log(userService.isLogin());
                        this.props.history.push(this.urlSnapshot);
                    },
                    error: (e) => {
                        toast.error(e.message);
                        // if (this.loadSub) {
                        //     this.loadSub();
                        // }
                        //this.cancelLoginSubmit();
                        this.clearField();
                        this.enable();
                    }
                });
        }
    }

    render() {
        return (
            // <div className = "Login">
            //     <div onKeyDown = {(e)=>{if (e.keyCode == 13) return this.submitLogin();}}>
            //         <input disabled = {this.state.disable} ref = {this.usernameRef} name="username" value = {this.state.username} onChange = {(e)=>this.handeChange(e)} />
            //         <input disabled = {this.state.disable} ref = {this.passwordRef} name="password" type="password" value = {this.state.password} onChange = {(e)=>this.handeChange(e)} />
            //         <button onClick = {()=>this.submitLogin()}>Login</button>
            //         <LoadingOverlay active = {this.state.disable} onCancel = {this.cancelLoginSubmit}/>
            //     </div>
            // </div>
            <div className="dialog-login" onKeyDown={(e) => { if (e.keyCode == 13) return this.submitLogin(); }}>
                <div className="left-dialog-login">
                    <div className="logo"></div>
                    <div className="info-dialog-login"> </div>
                    <div className="description">&copy; 2019 Revotech</div>
                </div>
                <div className="right-dialog-login">
                    <div style={{ marginBottom: '10px' }}>Login to</div>
                    <div style={{ marginBottom: '40px', fontWeight: '500', fontSize: '20px' }}>I2G Log View</div>
                    <input className="input-login" placeholder="Username" disabled = {this.state.disable} ref = {this.usernameRef} name="username" value = {this.state.username} onChange = {(e)=>this.handeChange(e)} />
                    <input className="input-login" placeholder="Password" disabled = {this.state.disable} ref = {this.passwordRef} name="password" type="password" value = {this.state.password} onChange = {(e)=>this.handeChange(e)} />
                    <input className="submit-login" type="Submit" value="LOGIN" onChange={(e) => { e.preventDefault() }} onClick={(e) => { this.submitLogin(); }} />
                    <div style={{ fontSize: '10px', fontStyle: 'italic', marginTop: '20px' }}> Please contact us via support@i2g.cloud for any trouble signing in to I2G log view.</div>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);