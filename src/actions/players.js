export const addPlayer = (name) => {
    return {
        type: 'NEW_PLAYER',
        name
    }
};

export const startAddPlayer = (name,accessCode) => {
    return (dispatch, getState) => {
        return database.ref('sessions/users').push({name}).then(() => {
            dispatch(addPlayer(name))
        })
    }
}