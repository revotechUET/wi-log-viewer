import React, { Suspense } from 'react';
import { BrowserRouter, Switch, Redirect, withRouter, Route } from 'react-router-dom';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import './App.css';


import userService from './../service/user.service';

//import AsyncPrivateRoute from './AsyncPrivateRoute';
import PrivateRoute from './PrivateRoute';
import HomePage from './../container/HomePage';
import Login from './../container/Login';

toast.configure({
    autoClose: 3000,
    draggable: false,
    position: toast.POSITION.TOP_RIGHT,
    style: {
        fontSize: "15px"
    }
});


class App extends React.Component {
    constructor(props) {
        super(props);
        console.log('App:', this.props);
    }

    componentDidMount() {
        this.tokenSub = userService.getTokenSub().subscribe(() => {
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        if (this.tokenSub) {
            this.tokenSub.unsubscribe(); ///
        }
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Switch>
                            <PrivateRoute path="/" exact={true} component={HomePage} valid={userService.isLogin()} redirect={"/login"} />
                            <PrivateRoute path="/login" exact={true} component={Login} valid={!userService.isLogin()} redirect={"/"} />
                            <Route path="/test" exact component={() => <h1>Hello</h1>} />
                            <Redirect to="/" />
                        </Switch>
                    </Suspense>
                </BrowserRouter>
            </div>
        );
    }
}


export default App;