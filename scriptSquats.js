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

var squat = document.getElementById("squat");
var sklekovi = 0;
var cucnjevi = 0;
var distanceValue = 0;
var squatBody = document.getElementById("squatBody");
squatBody.addEventListener("load", Load);

var numberOfWeight = document.getElementById("numberOfWeightS");
var numberOfMet = document.getElementById("numberOfMetS");
var burntCalories = document.getElementById("burntCaloriesS");
var startExerciseTime;

var ctx = document.getElementById('myChartSquat').getContext('2d');
var myChart;

var totalSquats = 0;
var totalCalories = 0;
var squatData = [];

function Load() {
    const dbref = ref(db);

    get(child(dbref, "data/"))
        .then((snapshot) => {
            if (snapshot.exists()) {
                squat.value = Math.floor(snapshot.val().squatFireB);
                distanceValue = snapshot.val().distance;
                updateSquatImage(distanceValue);
            } else {
                console.log("No data available");
            }
        })
        .catch((error) => {
            console.log(error);
        });

    if (document.title == "Squats") {
        cucnjevi = 1;
        sklekovi = 0;
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

function updateSquatImage(distance) {
    if (distance <= 30) {
        imgDole.classList.remove("hidden");
        imgPokret.classList.add("hidden");
        imgGore.classList.add("hidden");
    } else if (distance > 30 && distance < 40) {
        imgDole.classList.add("hidden");
        imgPokret.classList.remove("hidden");
        imgGore.classList.add("hidden");
    } else {
        imgDole.classList.add("hidden");
        imgPokret.classList.add("hidden");
        imgGore.classList.remove("hidden");
    }
}

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

function sendSquatSet(numberOfSquats) {
    update(ref(db, "data/"), {
        wantedSquats: numberOfSquats
    }).then(() => {
        console.log("Squat set sent to Firebase successfully!");
    }).catch((error) => {
        console.error("Error sending squat set to Firebase:", error);
    });
}

var totalBurntCalories = 0;

function checkExercise() {
    var enteredSquats = parseInt(document.getElementById("numberOfSquats").value);

    if (isNaN(enteredSquats)) {
        enteredSquats = 999;
    }

    sendSquatSet(enteredSquats);

    if (squat.value == 1) {
        startExerciseTime = new Date();
    }

    if (squat.value == enteredSquats) {
        var endExerciseTime = new Date();
        var exerciseDuration = (endExerciseTime - startExerciseTime) / 1000 / 3600;

        var metValue = parseFloat(numberOfMet.value);
        var weightValue = parseFloat(numberOfWeight.value);

        if (!isNaN(metValue) && !isNaN(weightValue) && !isNaN(exerciseDuration)) {
            var caloriesBurned = metValue * weightValue * exerciseDuration;
            totalBurntCalories += caloriesBurned;
            burntCalories.value = totalBurntCalories.toFixed(2);
            squat.value = enteredSquats;
            funkcija(caloriesBurned.toFixed(2));
            drawChart();
        } else {
            console.error("Invalid input for MET, weight, or exercise duration.");
        }

        showPopUp(getRandomCongratulation());
        numberOfSquats.value = "";
    }
}

function getRandomCongratulation() {
    const randomIndex = Math.floor(Math.random() * congratulationMessages.length);
    return congratulationMessages[randomIndex];
}

//Showpopup
var blur = document.getElementById("blur");
var body = document.getElementById("squatBody");

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
        <p>No. Squats</p>
        <p>${squat.value}</p >
    </div>
    <div class="cetvrti">
        <p>No. Calories</p>
        <p>${kalorije}</p >
    </div>
    <div class="ugasi">
        X
    </div>
`;
    document.querySelector(".notificationsContainerSquat").append(newTaskDiv);

    saveSquatData();

    totalSquats += parseInt(squat.value);
    totalCalories += parseFloat(kalorije);

    document.getElementById('totalSquats').innerText = totalSquats;
    document.getElementById('totalCaloriesS').innerText = totalCalories.toFixed(2);

    squatData.push({
        date: new Date().toLocaleString(),
        squats: parseInt(squat.value),
        calories: parseFloat(kalorije).toFixed(2)
    });

    createChart();
    drawChart();
}

function saveSquatData() {
    localStorage.setItem("squatdata", document.getElementById("taskoviSquat").innerHTML);
}

function showTask() {
    document.getElementById("taskoviSquat").innerHTML = localStorage.getItem("squatdata");
}

document.addEventListener("DOMContentLoaded", () => {
    showTask();
});

document.querySelector(".notificationsContainerSquat").addEventListener("click", function (e) {
    if (e.target.classList.contains("ugasi")) {
        var index = Array.from(document.querySelector(".notificationsContainerSquat").children).indexOf(e.target.parentElement);

        e.target.parentElement.remove();

        if (index !== -1 && index <= squatData.length) {

            if (squatData[index].hasOwnProperty('squats')) {
                totalSquats -= parseInt(squatData[index].squats);
            }

            if (squatData[index].hasOwnProperty('calories')) {
                totalCalories -= parseFloat(squatData[index].calories);
            }

            squatData.splice(index, 1);
            saveSquatData();

            if (document.getElementById("taskoviSquat").childElementCount <= 0) {
                localStorage.clear();
                myChart.destroy();
            }
            drawChart();
        }
    }
});

function createChart() {
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: squatData.map(entry => entry.date),
            datasets: [{
                label: 'Number of Squats',
                data: squatData.map(entry => entry.squats),
                backgroundColor: '#d9cab38f',
                borderColor: '#D9CAB3',
                borderWidth: 1
            }, {
                label: 'Calories Burned',
                data: squatData.map(entry => entry.calories),
                backgroundColor: '#6d988665',
                borderColor: '#6D9886',
                borderWidth: 1
            }]
        }
    });

    localStorage.setItem("chartSquatData", JSON.stringify(squatData));
}

function drawChart() {
    if (!squatData || squatData.length === 0) {
        return;
    }

    if (myChart) {
        myChart.destroy();
    }

    createChart();
}

document.addEventListener("DOMContentLoaded", () => {
    showTask();
    const chartSquatData = localStorage.getItem("chartSquatData");
    if (chartSquatData) {
        squatData = JSON.parse(chartSquatData);
        drawChart();
    }
    Load();
});

Load();

window.setInterval(Load, 1000);
