 functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.onDataUpdate = 
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