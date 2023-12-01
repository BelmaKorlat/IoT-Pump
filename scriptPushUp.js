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
pushUpBody.addEventListener("load", Load);
// Dodani elementi za težinu, MET, vrijeme i potrošene kalorije
var numberOfWeight = document.getElementById("numberOfWeight");
var numberOfMet = document.getElementById("numberOfMet");
var burntCalories = document.getElementById("burntCalories");
var startExerciseTime;
// Postavljanje grafikona
var ctx = document.getElementById('myChart').getContext('2d');
var myChart;
// Postavljanje početnih vrijednosti
var totalPushUps = 0;
var totalCalories = 0;
var pushUpData = [];

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

//Ispisivanje poruke uspjeha kada korisnik zavrsi set
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

//Funkcija gdje se brojac zaustavlja u trenutku kada korisnik uradi onoliko sklekova koliko je unio da zeli uraditi
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
            pushUp.value = enteredPushUps;
            funkcija(caloriesBurned.toFixed(2));
            drawChart();
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

//Showpopup
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

//Funkcija za spremanje podataka, historija
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
        <p>Set</p>
        <p>${i}</p>
    </div>
    <div class="drugi">
        <p>Date and Time</p>
        <p>${formattedDate} / ${formattedTime}</p>
    </div>
    <div class="treci">
        <p>No. Push-ups</p>
        <p>${pushUp.value}</p >
    </div>
    <div class="cetvrti">
        <p>No. Calories</p>
        <p>${kalorije}</p >
    </div>
    <div class="ugasi">
        X
    </div>
`;
    document.querySelector(".notificationsContainer").append(newTaskDiv);

    savePushUpData();

    // Ažuriranje ukupnog broja sklekova i kalorija
    totalPushUps += parseInt(pushUp.value); // Dodajemo samo ako je pushUp.value broj
    totalCalories += parseFloat(kalorije);

    // Ažuriranje HTML-a s ukupnim vrijednostima
    document.getElementById('totalPushUps').innerText = totalPushUps;
    document.getElementById('totalCalories').innerText = totalCalories.toFixed(2);

    // Ažuriranje podataka za grafikon
    pushUpData.push({
        date: new Date().toLocaleString(),
        pushUps: parseInt(pushUp.value), // Dodajemo samo ako je pushUp.value broj
        calories: parseFloat(kalorije).toFixed(2)
    });

    createChart();
    drawChart();
}

function savePushUpData() {
    localStorage.setItem("pushUpdata", document.getElementById("taskovi").innerHTML);
}

function showTask() {
    document.getElementById("taskovi").innerHTML = localStorage.getItem("pushUpdata");
}

// Funkcija koja se izvršava kada se stranica učita
document.addEventListener('DOMContentLoaded', function () {
    showTask();
});

//za brisanje
document.querySelector(".notificationsContainer").addEventListener("click", function (e) {
    if (e.target.classList.contains("ugasi")) {
        // Dobivanje indeksa izbrisane notifikacije
        var index = Array.from(document.querySelector(".notificationsContainer").children).indexOf(e.target.parentElement);

        // Uklanjanje notifikacije iz HTML-a
        e.target.parentElement.remove();

        // Ažuriranje pushUpData, totalPushUps, totalCalories i lokalnog pohranjivanja
        if (index !== -1 && index <= pushUpData.length) {

            // Provjeri je li svojstvo pushUps definirano prije pristupanja
            if (pushUpData[index].hasOwnProperty('pushUps')) {
                totalPushUps -= parseInt(pushUpData[index].pushUps);
            }

            // Provjeri je li svojstvo calories definirano prije pristupanja
            if (pushUpData[index].hasOwnProperty('calories')) {
                totalCalories -= parseFloat(pushUpData[index].calories);
            }

            pushUpData.splice(index, 1);
            savePushUpData();

            if (document.getElementById("taskovi").childElementCount <= 0) {
                localStorage.clear();
                myChart.destroy();
            }
            drawChart();
        }
    }
});

function createChart() {
    // Uništi postojeći grafikon ako postoji
    if (myChart) {
        myChart.destroy();
    }

    // Kreiranje grafa
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: pushUpData.map(entry => entry.date),
            datasets: [{
                label: 'Number of Push-ups',
                data: pushUpData.map(entry => entry.pushUps),
                backgroundColor: '#d9cab38f',
                borderColor: '#D9CAB3',
                borderWidth: 1
            }, {
                label: 'Calories Burned',
                data: pushUpData.map(entry => entry.calories),
                backgroundColor: '#6d988665',
                borderColor: '#6D9886',
                borderWidth: 1
            }]
        }
    });

    // Spremi graf u localStorage
    localStorage.setItem("chartPushUpData", JSON.stringify(pushUpData));
}

function drawChart() {
    // Ako nema podataka, ne crta se graf
    if (!pushUpData || pushUpData.length === 0) {
        return;
    }

    if (myChart) {
        myChart.destroy();
    }

    createChart();
}

// Učitaj podatke iz localStorage-a prilikom pokretanja stranice
document.addEventListener("DOMContentLoaded", () => {
    showTask();
    const chartPushUpData = localStorage.getItem("chartPushUpData");
    if (chartPushUpData) {
        pushUpData = JSON.parse(chartPushUpData);
        drawChart();
    }
    Load();
});

Load();

window.setInterval(Load, 1000);
