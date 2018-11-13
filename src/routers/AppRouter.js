import React from 'react';
import createHistory from 'history/createBrowserHistory';
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import DrawArea from '../components/DrawAreaTest';

export const history = createHistory();

const AppRouter = () => (
    <Router history={history}>
        <div>
                <Switch>
                <Route path="/" component={DrawArea} exact={true}/>
            </Switch>
        </div>
    </Router>
);

export default AppRouter;