const playersReducerDefaultState = []

export default (state = playersReducerDefaultState,action) => {
    switch(action.type) {
        case 'NEW_PLAYER':
            console.log(action);
            const player = {
                id: state.size, 
                name: action.name
            }
            return [...state, player];
        default:
            return state;
    }
};