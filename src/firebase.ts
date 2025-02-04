import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyD8J5ukx_tcy-ceNThh-m_1mGwg3hMqVSA",
    authDomain: "prise-en-main-676d4.firebaseapp.com",
    databaseURL: "https://prise-en-main-676d4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "prise-en-main-676d4",
    storageBucket: "prise-en-main-676d4.firebasestorage.app",
    messagingSenderId: "331644422053",
    appId: "1:331644422053:web:e879c4eb7dddf90ef78a4c"
}

const app = initializeApp(firebaseConfig)

export const db = getDatabase(app)
export const firestore = getFirestore(app)