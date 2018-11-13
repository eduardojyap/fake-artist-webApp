import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import drawAreaReducer from '../reducers/drawarea'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSTION_COMPOSE__ || compose;

export default () => {
    const store = createStore(
        combineReducers({
            drawArea: drawAreaReducer
        }),
        composeEnhancers(applyMiddleware(thunk))
    );
    return store;
};

