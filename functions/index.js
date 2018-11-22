const functions = require('firebase-functions');

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
    if (playing) {
        
    }
    return change.after.ref.parent.child(uppercase).set(upperacase);
})