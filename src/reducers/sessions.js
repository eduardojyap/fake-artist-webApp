const sessionReducerDefaultState = {
    accessCode: '',
    databaseCode: '',
    userId: '',
    turnId: 99
}

export default (state = sessionReducerDefaultState,action) => {
    switch(action.type) {
        case 'CREATE_SESSION':
            return {
                ...state,
                accessCode: action.accessCode,
                databaseCode: action.databaseCode
            }
        case 'JOIN_SESSION':
            return {
                ...state,
                accessCode: action.accessCode,
                databaseCode: action.databaseCode
            }
        case 'LEAVE_SESSION':
            return {
                ...state,
                accessCode:'',
                databaseCode:'',
                userId:''
            }
        case 'NEW_PLAYER':
            return {
                ...state,
                userId: action.userId
            }
        case 'SET_TURN_ID':
            return {
                ...state,
                turnId: action.turnId
            }
        default:
            return state;
    }
};