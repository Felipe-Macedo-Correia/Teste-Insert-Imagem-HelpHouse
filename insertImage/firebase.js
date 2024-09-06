import firebase from "firebase/app";
import  "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBpfzZ2RAh1vlDRAYGc_naOeQHh-nvqoG4",
  authDomain: "insertimage-74586.firebaseapp.com",
  projectId: "insertimage-74586",
  storageBucket: "insertimage-74586.appspot.com",
  messagingSenderId: "277707986199",
  appId: "1:277707986199:web:3a502d8ed921509f2e1352",
  measurementId: "G-CQJ91S888G"
}

if(!firebase.app.length){
    firebase.initializeApp(firebaseConfig)
}

export { firebase };