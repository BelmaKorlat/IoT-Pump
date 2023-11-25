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

var pushUp = document.getElementById("pushUp");
var sklekovi = 0;
var cucnjevi = 0;

var distanceValue = 0;
var pushUpBody = document.getElementById("pushUpBody");
pushUpBody.addEventListener("load", Load());

function Load() {
    const dbref = ref(db);

    get(child(dbref, "data/"))
        .then((snapshot) => {
            if (snapshot.exists()) {
                pushUp.value = Math.floor(snapshot.val().pushUpFireB);
                distanceValue = snapshot.val().distance;
                updatePushUpImage(distanceValue);
            } else {
                console.log("No data available");
            }
        })
        .catch((error) => {
            console.log(error);
        });

    if (document.title == "Push-Ups") {
        sklekovi = 1;
        cucnjevi = 0;
    }
    console.log(document.title);

    controlExercise();
}

function controlExercise() {
    update(ref(db, "data/"), {
        sklekoviOn: parseInt(sklekovi),
        cucnjeviOn: parseInt(cucnjevi)
    }).catch((error) => {
        alert("error" + error);
    });
}

function updatePushUpImage(distance) {
    if (distance <= 10) {
        imgDole.classList.remove("hidden");
        imgPokret.classList.add("hidden");
        imgGore.classList.add("hidden");
    } else if (distance > 10 && distance < 20) {
        imgDole.classList.add("hidden");
        imgPokret.classList.remove("hidden");
        imgGore.classList.add("hidden");
    } else {
        imgDole.classList.add("hidden");
        imgPokret.classList.add("hidden");
        imgGore.classList.remove("hidden");
    }
}

Load();
// reset();
window.setInterval(Load, 1000);

