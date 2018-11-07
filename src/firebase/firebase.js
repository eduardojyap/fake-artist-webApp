import * as firebase from 'firebase'

const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
  };

firebase.initializeApp(config);
const database = firebase.database();
export { firebase, database as default }

/*
database.ref('expenses')
  .on('value')
  .then ((snapshot) => {
      const expenses = [];
      snapshot.forEach((childSnapshot) => {
        expenses.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
        });
      });
      console.log(expenses);
  })

/*database.ref('expenses').push({
    description: 'rent',
    note: '',
    amount: 3000,
    createdAt: 0
});
database.ref().set({
    name: 'Eduardo Yap',
    age: 22,
    isSingle: true,
    location: {
        city: 'Philadelphia',
        country: 'USA'
    }
  }).then(() => {
      console.log('data is saved');
  }).catch((e) => {
      console.log('This failed',e)
  })
*/