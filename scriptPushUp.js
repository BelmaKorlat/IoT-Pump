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
// Dodani elementi za težinu, MET, vrijeme i potrošene kalorije
var numberOfWeight = document.getElementById("numberOfWeight");
var numberOfMet = document.getElementById("numberOfMet");
var burntCalories = document.getElementById("burntCalories");
var startExerciseTime;

//load funkcija
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
    checkExercise();
}

function controlExercise() {
    update(ref(db, "data/"), {
        sklekoviOn: parseInt(sklekovi),
        cucnjeviOn: parseInt(cucnjevi)
    }).catch((error) => {
        alert("error" + error);
    });
}

//Mijenjanje slika na osnovu distance
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

//ispisivanje poruke uspjeha kada korisnik zavrsi set
const congratulationMessages = [
    "Congratulations! You've nailed it!",
    "Awesome job! Keep up the good work!",
    "Fantastic! You're doing great!",
    "Way to go! You're a push-up pro!",
    "Outstanding! You crushed that set!",
    "Incredible work! Your push-up game is strong!",
    "Amazing job! You're making progress!",
    "Fantastic effort! You're pushing boundaries!",
    "Bravo! You've conquered the push-ups!",
    "Impressive! Keep up the excellent work!",
    "Superb! You're a push-up superstar!",
    "Well done! You nailed those push-ups!",
    "Terrific job! Your strength is shining!",
    "Excellent! You're on fire with those push-ups!",
    "Great work! Your dedication is paying off!",
    "Kudos to you! You're a push-up champion!",
    "Outstanding performance! You're unstoppable!",
    "Brilliant! You've mastered the art of push-ups!",
    "Spectacular! Your fitness journey is thriving!"
];

function sendPushUpSet(numberOfPushUps) {
    update(ref(db, "data/"), {
        wantedPushUps: numberOfPushUps
    }).then(() => {
        console.log("Push-up set sent to Firebase successfully!");
    }).catch((error) => {
        console.error("Error sending push-up set to Firebase:", error);
    });
}

var totalBurntCalories = 0;

//funkcija gdje se brojac zaustavlja u trenutku kada korisnik uradi onoliko sklekova koliko je unio da zeli uraditi
function checkExercise() {
    var enteredPushUps = parseInt(document.getElementById("numberOfPushUps").value);

    if (isNaN(enteredPushUps)) {
        enteredPushUps = 999;
    }

    sendPushUpSet(enteredPushUps);

    if (pushUp.value == 1) {
        startExerciseTime = new Date();
    }

    if (pushUp.value == enteredPushUps) {

        var endExerciseTime = new Date();
        var exerciseDuration = (endExerciseTime - startExerciseTime) / 1000 / 3600; // pretvaramo u sate

        var metValue = parseFloat(numberOfMet.value);
        var weightValue = parseFloat(numberOfWeight.value);

        if (!isNaN(metValue) && !isNaN(weightValue) && !isNaN(exerciseDuration)) {
            var caloriesBurned = metValue * weightValue * exerciseDuration;
            totalBurntCalories += caloriesBurned; // Ažuriranje ukupne sume kalorija
            burntCalories.value = totalBurntCalories.toFixed(2);
            funkcija(caloriesBurned.toFixed(2));
        } else {
            console.error("Invalid input for MET, weight, or exercise duration.");
        }

        showPopUp(getRandomCongratulation());
        numberOfPushUps.value = "";
    }
}

function getRandomCongratulation() {
    const randomIndex = Math.floor(Math.random() * congratulationMessages.length);
    return congratulationMessages[randomIndex];
}

//showpopup
var blur = document.getElementById("blur");
var body = document.getElementById("pushUpBody");

function closepopup() {
    blur.classList.add("hidden");
    body.classList.remove("stop-scrolling");
}

function showPopUp(congratulationMessage) {
    const popuptext = document.querySelector(".popuptext");
    popuptext.textContent = congratulationMessage;
    blur.classList.remove("hidden");
    body.classList.add("stop-scrolling");
    window.scrollTo(0, 0);
}

var btnOk = document.getElementsByClassName("btnok")[0];
btnOk.addEventListener("click", closepopup);

var i = 0;

//funkcija za spremanje podataka, historija
function funkcija(kalorije) {
    var currentTime = new Date();
    var day = currentTime.getDate();
    var month = currentTime.getMonth() + 1;
    var year = currentTime.getFullYear();
    var hours = currentTime.getHours().toString().padStart(2, "0");
    var minutes = currentTime.getMinutes().toString().padStart(2, "0");
    var seconds = currentTime.getSeconds().toString().padStart(2, "0");

    var formattedDate = `${day}.${month}.${year}`;
    var formattedTime = `${hours}:${minutes}:${seconds}`;

    i += 1;

    var newTaskDiv = document.createElement("div");
    newTaskDiv.className = "notifikacija";
    newTaskDiv.innerHTML = `
    <div class="prvi">
        <p>Serija</p>
        <p>${i}</p>
    </div>
    <div class="drugi">
        <p>Datum i vrijeme</p>
        <p>${formattedDate} / ${formattedTime}</p>
    </div>
    <div class="treci">
        <p>Broj sklekova</p>
        <p>${pushUp.value}</p >
    </div>
    <div class="cetvrti">
        <p>Broj kalorija</p>
        <p>${kalorije}</p >
    </div>
    <div class="ugasi">
        X
    </div>
`;
    document.querySelector(".notificationsContainer").append(newTaskDiv);

    saveData();
}

function saveData() {
    localStorage.setItem("data", document.getElementById("taskovi").innerHTML);
}

function showTask() {
    document.getElementById("taskovi").innerHTML = localStorage.getItem("data");
}

document.addEventListener("DOMContentLoaded", () => {
    showTask();
});

//za brisanje
document.querySelector(".notificationsContainer")
    .addEventListener("click", function (e) {
        if (e.target.classList.contains("ugasi")) {
            e.target.parentElement.remove();
            saveData();
        }
    });



Load();
window.setInterval(Load, 1000);

