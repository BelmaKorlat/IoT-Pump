# IoT Pump
Welcome to IoT Pump, an innovative IoT project designed to assist with your workout routines. This project leverages NodeMCU ESP8266, ultrasonic sensor HC-SR04, temperature sensor DS18B12, LEDs, and a buzzer to create an interactive and informative fitness experience. The project also incorporates Firebase for database management and HTML, CSS, and JavaScript for the web interface.

## Project Overview
### Features
##### Workout Selection:
- On the homepage, users can choose between push-ups or squats.

##### Exercise Guidance:
- For push-ups, users are presented with a title, logo, image, and a video demonstrating proper exercise form.
- Users can input their personal data to calculate BMI, body fat percentage, ideal weight, and calorie intake for weight loss, maintenance, or gain.

##### Workout Parameters:
- Users set the intensity and the number of repetitions they wish to complete.

##### Interactive Exercise Experience:
- During the workout, an image changes as the user moves up and down.
- Body temperature is continuously monitored and recorded throughout the exercise.

##### Progress Tracking:
- Upon completing the desired number of repetitions, a popup message congratulates the user.
- Workout data is saved in history, which can be reviewed or deleted if needed.
- Graphs are generated based on the recorded data.
- The average body temperature is displayed in the workout history.

## Components Used
### Hardware
- NodeMCU ESP8266
- Ultrasonic Sensor HC-SR04
- Temperature Sensor DS18B12
- LEDs
- Buzzer

### Software
- Firebase (Database)
- HTML, CSS, JavaScript (Web Interface)

## Future Enhancements
- Adding support for pull-up exercises.
- Implementing additional functionalities for an enhanced user experience.

## Getting Started
To get started with IoT Pump, follow these steps:

### Download the Project
[Download the project as a ZIP file](https://github.com/BelmaKorlat/IoT-Pump/archive/refs/heads/main.zip "Download the project as a ZIP file") and extract it.

### Set Up Hardware
1. Connect the NodeMCU ESP8266 to the ultrasonic sensor, temperature sensor, LEDs, and buzzer as per the circuit diagram provided in the repository.

### Configure Firebase
1. Create a Firebase project and configure the database.
2. Update the Firebase configuration in the project files.

### Run the Web Interface
1. Open the index.html file in a web browser to access the IoT Pump interface.

### Start Working Out
1. Choose your exercise (push-ups or squats) and follow the on-screen instructions to start your workout.

## Images
### Desktop Version

## License
This project is licensed under the MIT License. See the LICENSE file for details.

We hope you enjoy using IoT Pump and find it helpful in achieving your fitness goals. Stay tuned for more updates and features!

Feel free to reach out with any questions or feedback. Happy exercising!

