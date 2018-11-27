import Immutable from 'immutable';

const drawAreaReducerDefaultState =         
{ isDrawing: false,
    lines: new Immutable.List() }

export default (state = drawAreaReducerDefaultState,action) => {
    switch(action.type) {
        case 'ADD_LINE':
            return {
                lines: state.lines.push({line: action.line, turnId: action.turnId}),
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
        case 'REMOVE_LINES':
            return {
                ...state,
                lines: new Immutable.List()
            };
        default:
            return state;
    }
};