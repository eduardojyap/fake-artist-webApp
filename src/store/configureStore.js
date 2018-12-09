import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import drawAreaReducer from '../reducers/drawarea';
import sessionsReducer from '../reducers/sessions';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSTION_COMPOSE__ || compose;

export default () => {
    const store = createStore(
        combineReducers({
            drawArea: drawAreaReducer,

            sessions: sessionsReducer
        }),
        composeEnhancers(applyMiddleware(thunk))
    );
    return store;
};

