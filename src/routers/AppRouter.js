import React from 'react';
import createHistory from 'history/createBrowserHistory';
import { Router, Route, Switch } from 'react-router-dom';
import NewPage from '../components/NewPage';
import CreatePage from '../components/CreatePage';
import JoinPage from '../components/JoinPage';
import LobbyPage from '../components/LobbyPage';
import PrivateRoute from './PrivateRoute'

export const history = createHistory();

const AppRouter = () => (
    <Router history={history}>
        <Switch>
                <Route path="/" component={NewPage} exact={true}/>
                <Route path="/create" component={CreatePage} exact={true}/>
                <Route path="/join" component={JoinPage} exact={true}/>
                <PrivateRoute path="/lobby" component={LobbyPage} exact={true}/>
        </Switch>
    </Router>
);

export default AppRouter;