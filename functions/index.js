 functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

exports.onGameStart = 
functions.database.ref('/sessions/{databaseCode}/playing')
.onUpdate((change) => {
    const playing = change.after.val();
    if (playing) {
        return change.after.ref.parent.once('value').then((snapshot) => {
            return snapshot.val().indices;
        }).then( (indices) => {
            let order = [0,1,2,3,4,5,6,7,8,9];
            order = shuffle(order)
            for (let i = 0; i < 10; i++) {
                if (indices[order[i]].name !== undefined) {
                    return change.after.ref.parent.update({turn: indices[order[i]].index, order})
                }
            }
        })
    }
    return null;
})

exports.onTurnEnd = functions.database.ref('/sessions/{databaseCode}/lines').onWrite((change) => {
    return change.after.ref.parent.once('value').then((snapshot) => {
        let order = snapshot.val().order;
        let turn = snapshot.val().turn;
        const indices = snapshot.val().indices;
        let found = false;
        for (let i = 0; i < 10; i++) {
            const curr_i = order[i]
            if (found === true && indices[curr_i].name !== undefined) {
                turn = indices[curr_i].index;
                return change.after.ref.parent.update({turn})
            }
            if (indices[curr_i].index === turn) {
                found = true;
            }
        }
        for (let i = 0; i < 10; i++) {
            const curr_i = order[i]
            if (indices[curr_i].name !== undefined) {
                turn = indices[curr_i].index;
                return change.after.ref.parent.update({turn})
            }
        }
        return null;
    })
})

/*
exports.onPlayerLeave = functions.database.ref('/sessions/{databaseCode}/indices/{i}/name').onDelete((snapshot) => {
    return snapshot.ref.parent.once('value').then((snapshot) => {
        functions.database.ref(`/sessions/${databaseCode}.turn`)
        return snapshot.val().index;
    }).then((index) => {

    })
})
*/