import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyCgfeFcXVvvuIp79IJD8KCahJo2PzrHDco",
    authDomain: "avian-display-193502.firebaseapp.com",
    databaseURL: "https://avian-display-193502.firebaseio.com",
    projectId: "avian-display-193502",
    storageBucket: "avian-display-193502.appspot.com",
    messagingSenderId: "661886367826",
    appId: "1:661886367826:web:1b0f2f6dd2890db0a5878b"
};
// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;