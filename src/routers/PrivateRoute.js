import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({playing,databaseCode, component: Component, ...rest}) => (
    <Route {...rest} component = {(props) => (
        (databaseCode) ? (
            <div>
            <Component {...props}/>
            </div>
        ) : (
            <Redirect to="/"/>
        )
    )}/>
);

const mapStateToProps = (state) => ({
    databaseCode: state.sessions.databaseCode
});

export default connect(mapStateToProps)(PrivateRoute)
