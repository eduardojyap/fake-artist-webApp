const sessionReducerDefaultState = {
    accessCode: '',
    databaseCode: '',
    userId: ''
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