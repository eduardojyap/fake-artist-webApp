
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const num_players = 10;

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
            let order = [...Array(num_players).keys()];
            order = shuffle(order);
            for (let i = 0; i < num_players; i++) {
                const curr_i = order[i]
                if (indices[curr_i].name !== undefined && qm !== indices[curr_i].index) {
                    return change.after.ref.parent.update({turn: indices[curr_i].index, order});
                }
            }
        })
    }
    return null;
})

exports.onTurnEnd = functions.database.ref('/sessions/{databaseCode}/lines').onWrite((change,context) => {
    return admin.database().ref(`/sessions/${context.params.databaseCode}`).once('value').then((snapshot) => {
        const val = snapshot.val()
        let turn = val.turn;
        const order = val.order;
        const indices = val.indices;
        const qm = val.qm;
        for (let i = 0; i < num_players; i++) {
            const curr_i = order[i];
            if (found === true && indices[curr_i].name !== undefined && indices[curr_i].index !== qm) {
                turn = indices[curr_i].index;
                return admin.database().ref(`/sessions/${context.params.databaseCode}`).update({turn});
            }
            if (indices[curr_i].index === turn) {
                found = true;
            }
        }
        for (let i = 0; i < num_players; i++) {
            const curr_i = order[i];
            if (indices[curr_i].name !== undefined && indices[curr_i].index !== qm) {
                turn = indices[curr_i].index;
                return admin.database().ref(`/sessions/${context.params.databaseCode}`).update({turn});
            }
        }
        return null;
    })
})



exports.onPlayerLeave = functions.database.ref('/sessions/{databaseCode}/indices/{i}/name').onDelete((change,context) => {
    return admin.database().ref(`/sessions/${context.params.databaseCode}`).once('value').then((snapshot) => {
        const val = snapshot.val()
        const playing = val.playing;
        let turn = val.turn;
        const order = val.order;
        const indices = val.indices;
        const qm = val.qm;
        let found = false;
        if (playing && context.params.i == turn) {
            for (let i = 0; i < num_players; i++) {
                const curr_i = order[i];
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