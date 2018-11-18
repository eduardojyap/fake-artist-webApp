import database from '../firebase/firebase';

export const startDrawing = (point) => ({
    type: 'NEW_DRAW',
    point
});

export const addLine = (line) => ({
    type: 'ADD_LINE',
    line
});

export const startAddLine = (line,databaseCode) => {
    return (dispatch) => {
        return database.ref(`sessions/${databaseCode}/lines`).push(JSON.stringify(line.toJSON())).then(() => {
            dispatch(addLine(line));
        })
    }
}

export const keepDrawing = (point) => ({
    type: 'KEEP_DRAW',
    point
});

export const stopDrawing = () => ({
    type: 'STOP_DRAW'
});