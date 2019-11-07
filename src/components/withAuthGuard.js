/*
################  WARNING ###################
    This file is just for test. Im trying to use HighOrderComponent pattern 
    to create a function(props) that return truthly component if valid
    and redirect if false. 
    Wrap your component: export default withAuthGuard(component, guardCheck, pathToRedirect)
    and pass to <Route path = "/auth" component = {AuthComponent} /> 
    It work, but I realized that function component will be removed from js if it
    get unmounted, so I can't pass a whole page into it, I need to re-render all of it
    if I get back to this route.
    If you proved that I was wrong, rollback my work and finish my code.
    I think it should work one day.
################  WARNING ###################
*/

// import {withRouter, Redirect} from 'react-router-dom';
// import React from 'react';

// function withAuthGuard(component, validator, redirectTo, outSideProps) {
//     let Component = component;
//     return withRouter(function(props) {
//         if (validator())
//             return <Component {...outSideProps} />;
//         else {
//             return <Redirect to={{pathname: redirectTo, state: {urlSnapshot: props.location.pathname + props.location.search}}}/>
//         }
//     });
// }

// export default withAuthGuard;


// function FakeComponent(props) {
//     return <h1>Hello component</h1>;
// }

// export default withAuthGuard(FakeComponent, false, "/hello");