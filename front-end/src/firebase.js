import firebase from 'firebase';


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCKGBr38ISGIBOovclczAOo-Vyafu3ZGfs",
    authDomain: "mern-redux-whatsapp-clone.firebaseapp.com",
    projectId: "mern-redux-whatsapp-clone",
    storageBucket: "mern-redux-whatsapp-clone.appspot.com",
    messagingSenderId: "304652857554",
    appId: "1:304652857554:web:7242fe9193d6c64189fd0b",
    measurementId: "G-VXMBRH2PN7"
  };

const firebaseApp = firebase.initializeApp (firebaseConfig);

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {auth, provider};