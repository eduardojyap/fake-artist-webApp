import database from '../firebase/firebase';

const generateAccessCode = () => {
    var code = "";
    var possible = "afghijkloqrsuwxy23456789";
  
    for(var i=0; i < 6; i++){
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return code;
}

export const addPlayer = (userId) => {
    return {
        type: 'NEW_PLAYER',
        userId
    }
};

export const startAddPlayer = (databaseCode,name) => {
    return (dispatch) => {
        return database.ref(`sessions/${databaseCode}/indices`).once('value').then((snapshot)=> {
            let order = [0,1,2,3,4,5,6,7,8,9];
            for (let i = 0; i < 10; i++) {
                const childVal = snapshot.child(i).val();
                if (childVal.name === undefined) {
                    database.ref(`sessions/${databaseCode}/indices/${i}`).update({name}).then(() => {
                        dispatch(addPlayer(i))
                    })
                    return true;
                }
            }
        })
    }
}


export const createSession = (accessCode,databaseCode) => {
    return {
        type: 'CREATE_SESSION',
        accessCode,
        databaseCode
    }
};

export const startCreateSession = (name) => {
    return (dispatch) => {
        const accessCode = generateAccessCode();
        let order = [0,1,2,3,4,5,6,7,8,9];
        /*order = order.sort( () => Math.random() - 0.5);*/
        order = order.map((value) => {return {index: value}});
        return database.ref('sessions').push({accessCode, playing: false,indices: order}).then((ref) => {
            dispatch(createSession(accessCode,ref.key));
            dispatch(startAddPlayer(ref.key,name))
        })
    }
};

export const joinSession = (accessCode,databaseCode) => {
    return {
        type: 'JOIN_SESSION',
        accessCode,
        databaseCode
    }
};

export const startJoinSession = (name,accessCode) => {
    return (dispatch) => {
        return database.ref('sessions').once('value').then((snapshot) => {
            let databaseCode = '';
            snapshot.forEach((childSnapshot) => {
                const currCode = childSnapshot.val().accessCode;
                if (currCode === accessCode.trim()) {
                    if (!childSnapshot.val().playing) {
                        databaseCode = childSnapshot.key;
                    }
                }
            })
            return databaseCode;
        }).then((databaseCode) => {
            if (databaseCode) {
                dispatch(joinSession(accessCode.trim(),databaseCode));
                dispatch(startAddPlayer(databaseCode,name))
            } else {
                throw new PermissionDenied();
            }
        })
    }
};

export const leaveSession = () => {
    return {
        type: 'LEAVE_SESSION'
    }
};

export const startLeaveSession = (databaseCode,userId) => {
    return (dispatch) => {
        return database.ref(`sessions/${databaseCode}/indices/${userId}/name`).remove().then(() => {
            database.ref(`sessions/${databaseCode}/indices`).off()
            dispatch(leaveSession());
        })
    }
};

export const setTurnId = (turnId) => {
    return {
        type: 'SET_TURN_ID',
        turnId
    }
}