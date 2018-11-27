import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter, {history} from './routers/AppRouter'
import configureStore from './store/configureStore';
import {login,logout} from './actions/auth';
import { Provider} from 'react-redux';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'react-dates/lib/css/_datepicker.css';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

const store = configureStore();

const jsx = (
    <Provider store={store}>
        <AppRouter />
    </Provider>
);


ReactDOM.render(<div className="center-screen">{jsx}</div>,document.getElementById('app'));
/*
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        store.dispatch(login(user.uid));
        renderApp();
        if (history.location.pathname === '/') {
            history.push('/dashboard');
        }
    } else {
        store.dispatch(logout());
        renderApp()
        history.push('/');
    }
});*/