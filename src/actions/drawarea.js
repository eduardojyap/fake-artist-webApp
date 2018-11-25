import database from '../firebase/firebase';

export const startDrawing = (point) => ({
    type: 'NEW_DRAW',
    point
});

export const addLine = (line, turnId) => {
    return {
        type: 'ADD_LINE',
        line,
        turnId
    }
};

export const startAddLine = (line,databaseCode,turnId) => {
    return (dispatch) => {
        return database.ref(`sessions/${databaseCode}/lines`).push({line: JSON.stringify(line.toJSON()), turnId}).then(() => {
            dispatch(addLine(line,turnId));
        })
    }
}

export const removeLines = () => ({
    type: 'REMOVE_LINES'
})

export const startRemoveLines = (databaseCode) => {
    return (dispatch) => {
        return database.ref(`sessions/${databaseCode}/lines`).remove().then(() => {
            dispatch(removeLines());
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