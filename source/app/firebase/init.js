const config = {
    apiKey: "AIzaSyBQ1lWW5z6N7vJya-i_zOj5CuH21K_vK6U",
    authDomain: "family3-14224.firebaseapp.com",
    databaseURL: "https://family3-14224.firebaseio.com",
    projectId: "family3-14224",
    storageBucket: "family3-14224.appspot.com",
    messagingSenderId: "270636768402"
};

const firebaseApp = firebase.initializeApp(config);

firebaseApp.firestore().settings({timestampsInSnapshots:true});

export default firebaseApp.firestore();