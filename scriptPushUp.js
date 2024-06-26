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
// Elementi za težinu, MET, vrijeme i potrošene kalorije
var numberOfWeight = document.getElementById("numberOfWeight");
var numberOfMet = document.getElementById("numberOfMet");
var burntCalories = document.getElementById("burntCalories");
var startExerciseTime;
// Postavljanje grafa
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
    readTemperature();
    fetchAndSetName();
}

function fetchAndSetName() {
    const userRef = ref(db, 'data/name');;

    get(userRef)
        .then((snapshot) => {
            const userName = snapshot.val();
            if (userName) {
                document.getElementById('userName').textContent = `${extractFirstName(userName)}, TIME FOR PUSH-UPS`;
            } else {
                console.log("No name found!");
            }
        })
        .catch((error) => {
            console.log("Error getting data:", error);
        });
}

function extractFirstName(fullName) {
    const firstSpaceIndex = fullName.indexOf(' ');

    if (firstSpaceIndex === -1) {
        return fullName;
    }

    return fullName.substring(0, firstSpaceIndex);
}


//Dobavljanje temperature
function readTemperature() {
    const temperatureSpan = document.getElementById("temperatureValue");

    const temperatureRef = ref(db, 'data/Celsius');

    get(temperatureRef)
        .then((snapshot) => {
            const temperatureData = snapshot.val();
            if (temperatureData) {
                const currentTemperature = temperatureData;
                updateTemperatureDisplay(currentTemperature, temperatureSpan);
            } else {
                console.log("No temperature data available.");
            }
        })
        .catch((error) => {
            console.error("Error reading temperature from Firebase:", error);
        });
}

// Funkcija za ažuriranje prikaza temperature
function updateTemperatureDisplay(temperature, temperatureSpan) {
    if (temperatureSpan) {
        temperatureSpan.textContent = temperature.toFixed(2) + "°C";
    }
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
    if (distance < 10) {
        pushUp1.classList.remove("hidden");
        pushUp2.classList.add("hidden");
    } else if (distance > 10) {
        pushUp1.classList.add("hidden");
        pushUp2.classList.remove("hidden");
    }
}

document.getElementById("showExercise").addEventListener("click", showExercise);
document.getElementById("closeExercise").addEventListener("click", closeExercise);

function showExercise() {
    document.querySelector(".imgBtn").classList.add("hidden");

    let videoBtn = document.querySelector(".videoBtn");
    videoBtn.classList.remove("hidden");

    let video = videoBtn.querySelector("video");
    video.classList.remove("hidden");
    video.play();
}

function closeExercise() {
    let videoBtn = document.querySelector(".videoBtn");
    videoBtn.classList.add("hidden");

    let video = videoBtn.querySelector("video");
    video.pause();
    video.classList.add("hidden");

    document.querySelector(".imgBtn").classList.remove("hidden");
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

// Function to send personal details to Firebase RTDB
function sendPersonalDetails() {
    update(ref(db, "data/"), {
        gender: document.getElementById("gender").value.toUpperCase(),
        weight: parseFloat(document.getElementById("numberOfWeight").value),
        name: document.getElementById("firstLastName").value,
        age: parseInt(document.getElementById("age").value),
        height: parseFloat(document.getElementById("height").value)
    }).then(() => {
        readPersonalDetails();
        healthStatisticsFunction();
    }).catch((error) => {
        alert("Error: " + error);
    });
}

document.getElementById("saveButton").addEventListener("click", sendPersonalDetails);

function readPersonalDetails() {
    const genderRef = ref(db, 'data/gender');
    const weightRef = ref(db, 'data/weight');
    const nameRef = ref(db, 'data/name');
    const ageRef = ref(db, 'data/age');
    const heightRef = ref(db, 'data/height');

    get(genderRef)
        .then((snapshot) => {
            document.getElementById("gender").value = snapshot.val();
        })
        .catch((error) => {
            console.error("Error reading gender from Firebase:", error);
        });

    get(weightRef)
        .then((snapshot) => {
            document.getElementById("numberOfWeight").value = snapshot.val();
        })
        .catch((error) => {
            console.error("Error reading weight from Firebase:", error);
        });

    get(nameRef)
        .then((snapshot) => {
            document.getElementById("firstLastName").value = snapshot.val();
        })
        .catch((error) => {
            console.error("Error reading name from Firebase:", error);
        });

    get(ageRef)
        .then((snapshot) => {
            document.getElementById("age").value = snapshot.val();
        })
        .catch((error) => {
            console.error("Error reading age from Firebase:", error);
        });

    get(heightRef)
        .then((snapshot) => {
            document.getElementById("height").value = snapshot.val();
        })
        .catch((error) => {
            console.error("Error reading height from Firebase:", error);
        });
}

// Učitavanje podataka iz Firebase-a prilikom pokretanja stranice
document.addEventListener("DOMContentLoaded", () => {
    readPersonalDetails();
    healthStatisticsFunction();
});

function clearPersonalDetails() {
    var BMISpan = document.getElementById("BMIspan");
    var BMItxt = document.getElementById("BMItxt");
    var FatSpan = document.getElementById("bodyFatSpan");
    var idealWeightSpan = document.getElementById("idealWeightSpan");
    var LosingWeight = document.getElementById("LosingWeight");
    var maintainWeight = document.getElementById("maintainWeight");
    var gainWeight = document.getElementById("gainWeight");
    document.getElementById('userName').textContent = `TIME FOR PUSH-UPS`

    BMISpan.textContent = "";
    BMItxt.textContent = "";
    FatSpan.textContent = "";
    idealWeightSpan.textContent = "";
    LosingWeight.textContent = "";
    maintainWeight.textContent = "";
    gainWeight.textContent = "";

    update(ref(db, "data/"), {
        gender: "",
        weight: 0,
        name: "",
        age: 0,
        height: 0
    }).then(() => {
        readPersonalDetails();
        healthStatisticsFunction();
    }).catch((error) => {
        alert("error" + error);
    });
}

document.getElementById("deleteButton").addEventListener("click", clearPersonalDetails);

//Health statistics
function healthStatisticsFunction() {
    const genderRef = ref(db, 'data/gender');
    const weightRef = ref(db, 'data/weight');
    const ageRef = ref(db, 'data/age');
    const heightRef = ref(db, 'data/height');
    var genderVal;
    var weightVal;
    var ageVal;
    var heightVal;

    var BMISpan = document.getElementById("BMIspan");
    var BMItxt = document.getElementById("BMItxt");
    var FatSpan = document.getElementById("bodyFatSpan");
    var Fattxt = document.getElementById("Fattxt");
    var idealWeightSpan = document.getElementById("idealWeightSpan");
    var LosingWeight = document.getElementById("LosingWeight");

    Promise.all([
        get(genderRef).then((snapshot) => { genderVal = snapshot.val(); }),
        get(weightRef).then((snapshot) => { weightVal = snapshot.val(); }),
        get(ageRef).then((snapshot) => { ageVal = snapshot.val(); }),
        get(heightRef).then((snapshot) => { heightVal = snapshot.val(); })
    ]).then(() => {
        if (!isNaN(weightVal) && !isNaN(heightVal)) {
            var bmi = (weightVal / ((heightVal / 100) * (heightVal / 100))).toFixed(2);

            if (!isNaN(bmi)) {
                BMISpan.innerHTML = bmi + " kg/m^2";

                if (bmi <= 18.5) {
                    BMItxt.innerHTML = "Underweight"
                }

                if (bmi > 18.5 && bmi <= 24.9) {
                    BMItxt.innerHTML = "Normal weight"
                }
                if (bmi > 24.9 && bmi < 29.9) {
                    BMItxt.innerHTML = "Overweight"
                }
                if (bmi > 29.9 && bmi < 34.9) {
                    BMItxt.innerHTML = "Obesity Class II"
                }
                if (bmi > 34.9 && bmi < 39.9) {
                    BMItxt.innerHTML = "Obesity Class III"
                }
                if (bmi > 40) {
                    BMItxt.innerHTML = "Morbid obesity"
                }

                var genderNumber = genderVal === 'M' ? 1 : 0;

                // Postotak tjelesne masti
                if (!isNaN(ageVal) && !isNaN(genderNumber)) {
                    FatSpan.innerHTML = ((((1.20 * bmi) + (0.23 * ageVal) - (10.8 * genderNumber) - 5.4) / 100) * 100).toFixed(2) + " %";
                    if (parseFloat(FatSpan.innerHTML) <= 18.5) {
                        Fattxt.innerHTML = "Low value"
                    }
                    if (parseFloat(FatSpan.innerHTML) > 18.5 && parseFloat(FatSpan.innerHTML) <= 24.9) {
                        Fattxt.innerHTML = "Normal value"
                    }
                    if (parseFloat(FatSpan.innerHTML) > 24.9 && parseFloat(FatSpan.innerHTML) <= 29.9) {
                        Fattxt.innerHTML = "Increased value"
                    }
                    if (parseFloat(FatSpan.innerHTML) > 29.9) {
                        Fattxt.innerHTML = "High value"
                    }
                }

                if (!isNaN(heightVal)) {
                    idealWeightSpan.innerHTML = (22 * ((heightVal / 100) * (heightVal / 100))).toFixed(2) + " kg";
                }

                //Kalorije
                if (!isNaN(weightVal) && !isNaN(heightVal) && !isNaN(ageVal) && !isNaN(genderNumber)) {
                    if (genderNumber === 1) {
                        LosingWeight.innerHTML = (88.362 + (13.397 * weightVal) + (4.799 * heightVal) - (5.677 * ageVal)).toFixed(2) + " Cal/day";
                        maintainWeight.innerHTML = (66.47 + (13.75 * weightVal) + (5.003 * heightVal) - (6.75 * ageVal)).toFixed(2) + " Cal/day";
                        gainWeight.innerHTML = ((66.47 + (13.75 * weightVal) + (5.003 * heightVal) - (6.75 * ageVal)) + 500).toFixed(2) + " Cal/day";
                    }
                    if (genderNumber === 0) {
                        LosingWeight.innerHTML = (447.593 + (9.247 * weightVal) + (3.098 * heightVal) - (4.330 * ageVal)).toFixed(2) + " Cal/day";
                        maintainWeight.innerHTML = (655.1 + (9.563 * weightVal) + (1.850 * heightVal) - (4.676 * ageVal)).toFixed(2) + " Cal/day";
                        gainWeight.innerHTML = ((655.1 + (9.563 * weightVal) + (1.850 * heightVal) - (4.676 * ageVal)) + 500).toFixed(2) + " Cal/day";
                    }
                }
            }
            genderNumber = null;
        }
    }).catch((error) => {
        console.error("Error reading data from Firebase:", error);
    });
}

// Provjera unosa za spol
function validateGenderInput(event) {
    const spol = ['M', 'F'];

    const input = event.target.value.toUpperCase();

    if (!spol.includes(input)) {
        event.target.value = '';
    }
}

document.getElementById("gender").addEventListener("input", validateGenderInput);

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

            // Računanje prosječne temperature
            var temperatureInputs = document.querySelectorAll("#temperatureValue");
            var temperatureSum = 0;
            var temperatureCount = 0;
            temperatureInputs.forEach(function (i) {
                var temperatureValue = parseFloat(i.textContent); // Dobavljanje temperature iz teksta
                if (!isNaN(temperatureValue)) {
                    temperatureSum += temperatureValue;
                    temperatureCount++;
                }
            });
            var averageTemperature = temperatureCount > 0 ? temperatureSum / temperatureCount : 0;

            // Dodavanje kalorija i prosječne temperature u historiju
            funkcija(caloriesBurned.toFixed(2), averageTemperature.toFixed(2));

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
    numberOfMet.value = null;
    numberOfPushUps.value = null;
    burntCalories.value = null;
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
function funkcija(kalorije, prosjecnaTemperatura) {
    var currentTime = new Date();
    var day = currentTime.getDate();
    var month = currentTime.getMonth() + 1;
    var year = currentTime.getFullYear();
    var hours = currentTime.getHours().toString().padStart(2, "0");
    var minutes = currentTime.getMinutes().toString().padStart(2, "0");
    var seconds = currentTime.getSeconds().toString().padStart(2, "0");

    var formattedDate = `${day}.${month}.${year}`;
    var formattedTime = `${hours}:${minutes}:${seconds}`;

    // Brojanje div elemenata
    var brojSetova = document.querySelectorAll('.notificationsContainer > div').length;

    var newTaskDiv = document.createElement("div");
    newTaskDiv.className = "notifikacija";
    newTaskDiv.innerHTML = `
    <div class="prvi">
        <p>${brojSetova + 1}</p>
    </div>
    <div class="drugi">
        <p>${formattedDate} / ${formattedTime}</p>
    </div>
    <div class="treci">
        <p>${pushUp.value}</p >
    </div>
    <div class="cetvrti">
        <p>${kalorije}</p >
    </div>
    <div class="peti">
        <p>${prosjecnaTemperatura}°C</p>
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

    // Ažuriranje podataka za graf
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
        var index = Array.from(document.querySelector(".notificationsContainer").children).indexOf(e.target.parentElement);

        e.target.parentElement.remove();

        if (index !== -1 && index <= pushUpData.length) {

            if (pushUpData[index].hasOwnProperty('pushUps')) {
                totalPushUps -= parseInt(pushUpData[index].pushUps);
            }

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
    if (myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height * 4);
    gradient.addColorStop(1, '#6c2c91');
    gradient.addColorStop(0.6944, '#c41c78');
    gradient.addColorStop(0, '#6c1c46');

    const gradientCalories = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height * 4);
    gradientCalories.addColorStop(1, '#D0008E');
    gradientCalories.addColorStop(0.6944, '#FF9300');
    gradientCalories.addColorStop(0, '#FAFF95');
    // Kreiranje grafa
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: pushUpData.map(entry => entry.date),
            datasets: [{
                label: 'Number of Push-ups',
                data: pushUpData.map(entry => entry.pushUps),
                backgroundColor: gradient
            }, {
                label: 'Calories Burned',
                data: pushUpData.map(entry => entry.calories),
                backgroundColor: gradientCalories
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

// Učitavaje podataka iz localStorage-a prilikom pokretanja stranice
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
