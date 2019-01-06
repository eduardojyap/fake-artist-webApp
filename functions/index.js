
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const num_players = 10

const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

exports.onGameStart = 
functions.database.ref('/sessions/{databaseCode}/playing')
.onUpdate((change,context) => {
    const playing = change.after.val();
    if (playing) {
        return admin.database().ref(`/sessions/${context.params.databaseCode}`).once('value').then((snapshot)=> {
            const indices = snapshot.val().indices;
            const qm = snapshot.val().qm;
            let order = [0,1,2,3,4,5,6,7,8,9];
            order = shuffle(order)
            for (let i = 0; i < num_players; i++) {
                if (indices[order[i]].name !== undefined && qm !== indices[order[i]].index) {
                    return change.after.ref.parent.update({turn: indices[order[i]].index, order})
                }
            }
        })
    }
    return null;
})

exports.onTurnEnd = functions.database.ref('/sessions/{databaseCode}/lines').onWrite((change) => {
    return change.after.ref.parent.once('value').then((snapshot) => {
        const order = snapshot.val().order;
        let turn = snapshot.val().turn;
        const qm = snapshot.val().qm;
        const indices = snapshot.val().indices;
        let found = false;
        for (let i = 0; i < num_players; i++) {
            const curr_i = order[i]
            if (found === true && indices[curr_i].name !== undefined && indices[curr_i].index !== qm) {
                turn = indices[curr_i].index;
                return change.after.ref.parent.update({turn})
            }
            if (indices[curr_i].index === turn) {
                found = true;
            }
        }
        for (let i = 0; i < num_players; i++) {
            const curr_i = order[i]
            if (indices[curr_i].name !== undefined && indices[curr_i].index !== qm) {
                turn = indices[curr_i].index;
                return change.after.ref.parent.update({turn})
            }
        }
        return null;
    })
})



exports.onPlayerLeave = functions.database.ref('/sessions/{databaseCode}/indices/{i}/name').onDelete((change,context) => {
    return admin.database().ref(`/sessions/${context.params.databaseCode}`).once('value').then((snapshot) => {
        const playing = snapshot.val().playing;
        let turn = snapshot.val().turn;
        const order = snapshot.val().order;
        const indices = snapshot.val().indices;
        const qm = snapshot.val().qm;
        let found = false;
        if (playing && context.params.i == turn) {
            for (let i = 0; i < num_players; i++) {
                const curr_i = order[i]
                if (found === true && indices[curr_i].name !== undefined && indices[curr_i].index !== qm) {
                    turn = indices[curr_i].index;
                    return admin.database().ref(`/sessions/${context.params.databaseCode}`).update({turn});
                }
                if (indices[curr_i].index === turn) {
                    found = true;
                }
            }
            for (let i = 0; i < num_players; i++) {
                const curr_i = order[i]
                if (indices[curr_i].name !== undefined && indices[curr_i].index !== qm) {
                    turn = indices[curr_i].index;
                    return admin.database().ref(`/sessions/${context.params.databaseCode}`).update({turn});
                }
            }
        }
        return null;
    })

})