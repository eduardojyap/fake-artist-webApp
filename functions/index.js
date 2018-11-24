 functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.onGameStart = 
functions.database.ref('/sessions/{databaseCode}/playing')
.onUpdate((change) => {
    const playing = change.after.val();
    console.log(playing);
    if (playing) {
        return change.after.ref.parent.once('value').then((snapshot) => {
            console.log('snapshot:',snapshot.val());
            console.log('snapshot.indices',snapshot.val().indices);
            return snapshot.val().indices;
        }).then( (indices) => {
            console.log('indices',indices);
            for (let i = 0; i < 10; i++) {
                if (indices[i].name !== undefined) {
                    console.log(indices[i].name)
                    return change.after.ref.parent.update({turn: indices[i].index})
                }
            }
        })
    }
    return null;
})

exports.onTurnEnd = functions.database.ref('/sessions/{databaseCode}/lines').onWrite((change) => {
    return change.after.ref.parent.once('value').then((snapshot) => {
        let turn = snapshot.val().turn;
        const indices = snapshot.val().indices;
        let found = false;
        for (let i = 0; i < 10; i++) {
            if (found === true && indices[i].name !== undefined) {
                turn = indices[i].index;
                console.log('1st loop turn',turn)
                return change.after.ref.parent.update({turn})
            }
            if (indices[i].index === turn) {
                console.log('turn',turn)
                found = true;
            }
        }
        for (let i = 0; i < 10; i++) {
            if (indices[i].name !== undefined) {
                turn = indices[i].index;
                console.log('2nd loop turn',turn)
                return change.after.ref.parent.update({turn})
            }
        }
        return null;
    })
})