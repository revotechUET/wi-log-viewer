import React from 'react';
import {Route, withRouter} from 'react-router-dom';


function AsyncPrivateRoute(props) {
    //console.log('Async:', props);
    return <Route exact = {props.exact || true} path={props.path} 
                component = {()=>(<LoadingMiddleWare {...props} ourProps = {props.props} urlSnapshot = {getUrlSnapShot(props)}/>)} 
            />;
}

class LoadingMiddleWare extends React.Component {
    constructor(props) {
        super(props);
        //console.log(this.props);
        this.state = {
            loading: true,
            auth: false
        }
    }

    componentDidMount() {
        this.setState({loading: true, auth: false}, ()=>{
            this.props.validator.then((rs)=>{
                if (rs) {
                    this.setState({
                        loading: false,
                        auth: true
                    });
                } else {
                    this.setState({
                        loading: false,
                        auth: false
                    });
                }
            }).catch(e=>{
                console.log(e);
                this.setState({
                    loading: false,
                    auth: false
                });
            });
        });
    }

    render() {
        let props = this.props;
        if (this.state.loading) {
            return <h1>Loading...</h1>;
        }
        if (this.state.auth) {
            return <props.component {...props.ourProps} urlSnapshot = {props.urlSnapshot}/>;
        }
        return <props.redirect urlSnapshot = {props.urlSnapshot} />;
    }

}

function getUrlSnapShot(props) {
    return {
        urlSnapshot: props.history.location.pathname
    }
}

// function getProps(props) {
//     if (props.props) {
//         return Object.assign({urlSnapshot: props.history.location.pathname},props.props);
//     } else {
//         return {urlSnapshot: props.history.location.pathname};
//     }
// }


export default withRouter(AsyncPrivateRoute);