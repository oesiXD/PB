import firebase from 'firebase/app'

require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");
require("firebase/functions");


const firebaseConfig = {
  apiKey: "AIzaSyBGGlPdDKZK_kMHzIa9P-HaGzcgUjTgjzo",
  authDomain: "pruebaspc-b4814.firebaseapp.com",
  databaseURL: "https://pruebaspc-b4814.firebaseio.com",
  projectId: "pruebaspc-b4814",
  storageBucket: "",
  messagingSenderId: "922238338311",
  appId: "1:922238338311:web:0b88b807b8f6991f4631a2",
  measurementId: "G-KL0F91DZ0P"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth()
  const db = firebase.firestore()
  const storage = firebase.storage()
  const functions = firebase.functions()

  export {
    firebase,
    auth,
    db,
    storage,
    functions
  }
