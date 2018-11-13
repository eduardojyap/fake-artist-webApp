import Immutable from 'immutable';

const drawAreaReducerDefaultState =         
{ isDrawing: false,
    lines: new Immutable.List() }

export default (state = drawAreaReducerDefaultState,action) => {
    switch(action.type) {
        case 'NEW_DRAW':
            return {
                lines: state.lines.push(new Immutable.List([action.point])),
                isDrawing: true
            };
        case 'KEEP_DRAW':
                return {
                    ...state,
                    lines: state.lines.updateIn([state.lines.size - 1], (line) => line.push(action.point))
                };
        case 'STOP_DRAW':
            return {
                ...state,
                isDrawing: false
            };
        default:
            return state;
    }
};