const sessionReducerDefaultState = {
    accessCode: '',
    databaseCode: '',
    userId: '',
    color: null
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
        default:
            return state;
    }
};