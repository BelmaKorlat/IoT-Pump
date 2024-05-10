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

var numberOfWeightS = document.getElementById("numberOfWeightS");
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
    readTemperature();
}

window.addEventListener('DOMContentLoaded', () => {
    const banner = document.querySelector('.banner');
    const notificationContainer = document.querySelector('#taskoviSquat');


    const bannerHeight = banner.offsetHeight;
    const initialPosition = banner.offsetTop;

    window.addEventListener('scroll', () => {
        const containerTop = notificationContainer.getBoundingClientRect().top;

        if (containerTop <= bannerHeight) {
            banner.style.position = 'absolute';
            banner.style.top = containerTop + 'px';
        } else {
            banner.style.position = 'fixed';
            banner.style.top = '35px';
        }

        if (window.pageYOffset <= initialPosition) {
            banner.style.position = 'absolute';
            banner.style.top = initialPosition + 'px';
        }
    });
});

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

// Function to send personal details to Firebase RTDB
function sendPersonalDetails() {
    update(ref(db, "data/"), {
        gender: document.getElementById("genderS").value.toUpperCase(),
        weight: parseFloat(document.getElementById("numberOfWeightS").value),
        name: document.getElementById("firstLastNameS").value,
        age: parseInt(document.getElementById("ageS").value),
        height: parseFloat(document.getElementById("heightS").value)
    }).then(() => {
        // Calling a function to read and display data after it's sent to Firebase
        readPersonalDetails();
        healthStatisticsFunction();
    }).catch((error) => {
        alert("Error: " + error);
    });
}

document.getElementById("saveButtonS").addEventListener("click", sendPersonalDetails);

function readPersonalDetails() {
    const genderRef = ref(db, 'data/gender');
    const weightRef = ref(db, 'data/weight');
    const nameRef = ref(db, 'data/name');
    const ageRef = ref(db, 'data/age');
    const heightRef = ref(db, 'data/height');

    get(genderRef)
        .then((snapshot) => {
            document.getElementById("genderS").value = snapshot.val();
        })
        .catch((error) => {
            console.error("Error reading gender from Firebase:", error);
        });

    get(weightRef)
        .then((snapshot) => {
            document.getElementById("numberOfWeightS").value = snapshot.val();
        })
        .catch((error) => {
            console.error("Error reading weight from Firebase:", error);
        });

    get(nameRef)
        .then((snapshot) => {
            document.getElementById("firstLastNameS").value = snapshot.val();
        })
        .catch((error) => {
            console.error("Error reading name from Firebase:", error);
        });

    get(ageRef)
        .then((snapshot) => {
            document.getElementById("ageS").value = snapshot.val();
        })
        .catch((error) => {
            console.error("Error reading age from Firebase:", error);
        });

    get(heightRef)
        .then((snapshot) => {
            document.getElementById("heightS").value = snapshot.val();
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

document.getElementById("deleteButtonS").addEventListener("click", clearPersonalDetails);

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

document.getElementById("genderS").addEventListener("input", validateGenderInput);

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
        var weightValue = parseFloat(numberOfWeightS.value);

        if (!isNaN(metValue) && !isNaN(weightValue) && !isNaN(exerciseDuration)) {
            var caloriesBurned = metValue * weightValue * exerciseDuration;
            totalBurntCalories += caloriesBurned;
            burntCalories.value = totalBurntCalories.toFixed(2);
            squat.value = enteredSquats;

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
    numberOfMetS.value = null;
    numberOfSquats.value = null;
    burntCaloriesS.value = null;
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
    var brojSetova = document.querySelectorAll('.notificationsContainerSquat > div').length;

    var newTaskDiv = document.createElement("div");
    newTaskDiv.className = "notifikacija";
    newTaskDiv.innerHTML = `
    <div class="prvi">
        <p>Set</p>
        <p>${brojSetova + 1}</p>
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
    <div class="peti">
        <p>Average Temperature: </p>
        <p>${prosjecnaTemperatura}°C</p>
    </div>
    <div class="ugasi">
        X
    </div>
`;
    document.querySelector(".notificationsContainerSquat").append(newTaskDiv);

    saveSquatData();

    totalSquats += parseInt(squat.value);
    totalCalories += parseFloat(kalorije);

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
                backgroundColor: '#52057B',
                borderColor: '#D9CAB3',
                borderWidth: 1
            }, {
                label: 'Calories Burned',
                data: squatData.map(entry => entry.calories),
                backgroundColor: '#BC6FF1',
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
