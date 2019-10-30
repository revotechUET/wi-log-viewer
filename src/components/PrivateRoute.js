import React from 'react';
import {Route, withRouter, Redirect} from 'react-router-dom';

// function AsyncPrivateRoute(props) {
//     return <Route exact path={props.path} component = {()=>{
//         if (props.valid) return <LoadingMiddleWare props = {props} />;
//         else return <props.redirect {...getProps(props)} />;
//     }}/>
// }

function PrivateRoute(props) {
    //console.log(typeof(new Promise((res,rej)=>{res(true);})));
    console.log('PrivateRoute:', props);
    return <Route exact = {props.exact || true} path={props.path} component = {()=>{
        if (props.valid) return <props.component {...getProps(props)}  />;
        else return typeof(props.redirect).toString() === "string" ? <Redirect to={{pathname: props.redirect, state: getUrlSnapShot(props)}} />
                                                            : <props.redirect {...getProps(props)} />;
    }}/>
}

function getUrlSnapShot(props) {
    if (!props.urlSnapshot) {
        if (props.location.state) {
            if (props.location.state.urlSnapshot) {
                return {
                    urlSnapshot: props.history.location.pathname
                } 
            } else {
                return {
                    urlSnapshot: props.history.location.pathname
                } 
            }
        } else {
            return {
                urlSnapshot: props.history.location.pathname
            } 
        }
    }
    return {};
}

function getProps(props) {
    if (props.props) {
        return Object.assign(getUrlSnapShot(props),props.props);
    } else {
        return getUrlSnapShot(props);
    }
}

export default withRouter(PrivateRoute);