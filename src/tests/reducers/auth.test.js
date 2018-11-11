import authReducer from '../../reducers/auth';

test('should login', () => {
    const action = {
        type: 'LOGIN',
        uid: 1
    };
    const state = authReducer({},action);
    expect(state).toEqual({uid: 1});
});

test('should logout', () => {
    const action = {
        type: 'LOGOUT'
    };
    const state = authReducer({uid:1},action);
    expect(state).toEqual({});
});