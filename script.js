// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBXTbiWSqe9sKhGSqIhWTLslIH1BARZRBY",
    authDomain: "iot-pump-45b16.firebaseapp.com",
    databaseURL: "https://iot-pump-45b16-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "iot-pump-45b16",
    storageBucket: "iot-pump-45b16.appspot.com",
    messagingSenderId: "769474338176",
    appId: "1:769474338176:web:711d24572a44123efc7565"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { getDatabase, ref, set, child, update, remove, get }
    from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

const db = getDatabase();

var sklekovi = 0;
var cucnjevi = 0;
var dugme = document.getElementById("blinkButton");
var blink = 0;

function Load() {
    update(ref(db, "data/"), {
        cucnjeviOn: cucnjevi,
        sklekoviOn: sklekovi
    }).then(() => {
    }).catch((error) => {
    });
}

function funkcija() {
    blink = 1;
    update(ref(db, "data/"), {
        blinkaj: blink
    }).then(() => {
        setTimeout(() => {
            blink = 0;
            update(ref(db, "data/"), {
                blinkaj: blink
            }).then(() => {
            }).catch((error) => {
            });
        }, 2000);
    }).catch((error) => {
        console.error("Error sending push-up set to Firebase:", error);
    });
}

dugme.addEventListener("click", funkcija);

Load();