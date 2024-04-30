#include <Arduino.h>
#if defined(ESP32)
  #include <WiFi.h>
#elif defined(ESP8266)
  #include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
//Biblioteke za temp senzor
#include <OneWire.h>
#include <DallasTemperature.h>

//Provide the token generation process info.
#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// Insert your network credentials
#define WIFI_SSID "-"
#define WIFI_PASSWORD "-"

// Insert Firebase project API Key
#define API_KEY "-"

// Insert RTDB URLefine the RTDB URL */
#define DATABASE_URL "https://iot-pump-45b16-default-rtdb.europe-west1.firebasedatabase.app/" 

//Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

//za temp
#define ONE_WIRE_BUS D3

OneWire oneWire(ONE_WIRE_BUS);

DallasTemperature sensors(&oneWire);

float Celsius = 0;

unsigned long sendDataPrevMillis = 0;
int sklekovi = 0;
int cucnjevi = 0;
float countPushUp = 0;
float countSquat = 0;
int zeljeniSklekovi = 0;
int zeljeniCucnjevi = 0;
bool down = false;
bool up = false;
bool signupOK = false;
const int trigPin = D7;
const int echoPin = D8;
long duration;
int distance;
const int PIN_Buzzer = D1;
const int PIN_LEDR1   = D0;
const int PIN_LEDY1   = D5;
const int PIN_LEDG1   = D4;

void setup(){
   sensors.begin();
  
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin,INPUT);
  pinMode(PIN_Buzzer,OUTPUT);
  pinMode(PIN_LEDR1,OUTPUT);
  pinMode(PIN_LEDY1,OUTPUT);
  pinMode(PIN_LEDG1,OUTPUT);

  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  /* Sign up */
  if (Firebase.signUp(&config, &auth, "", "")){
    Serial.println("ok");
    signupOK = true;
  }
  else{
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop(){
  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 500 || sendDataPrevMillis == 0)){
    sendDataPrevMillis = millis();
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin,LOW);
    duration = pulseIn(echoPin,HIGH);
    distance = duration * 0.034 / 2;
    //temp
    sensors.requestTemperatures();
    Celsius = sensors.getTempCByIndex(0);

  if(Firebase.RTDB.getInt(&fbdo, "/data/sklekoviOn")){
        if(fbdo.dataType() == "int"){
          sklekovi = fbdo.intData();
         }
  }

   if(Firebase.RTDB.getInt(&fbdo, "/data/cucnjeviOn")){
        if(fbdo.dataType() == "int"){
          cucnjevi = fbdo.intData();
         }
  }

  if(Firebase.RTDB.getInt(&fbdo, "/data/wantedPushUps")){
    if(fbdo.dataType() == "int"){
        zeljeniSklekovi = fbdo.intData();
       }
    }

  if(Firebase.RTDB.getInt(&fbdo, "/data/wantedSquats")){
    if(fbdo.dataType() == "int"){
        zeljeniCucnjevi = fbdo.intData();
    }
  }

  if(sklekovi == 1){
    if(zeljeniSklekovi != 999){
        noTone(PIN_Buzzer); 
      if(distance <= 10 ){
      down = true;
    }

    if(distance > 20){
      up = true;
    }

    if(down == true && up == true){
      down = false;
      up = false;
      countPushUp+=0.5;
    }

    if(distance <= 8){
      digitalWrite(PIN_LEDG1, HIGH);
      digitalWrite(PIN_LEDY1, LOW);
      digitalWrite(PIN_LEDR1, LOW);
    }

    if(distance > 8 && distance <= 15){
      digitalWrite(PIN_LEDG1, HIGH);
      digitalWrite(PIN_LEDY1, LOW);
      digitalWrite(PIN_LEDR1, LOW);
    }

    if(distance > 15 && distance <= 20){
      digitalWrite(PIN_LEDG1, HIGH);
      digitalWrite(PIN_LEDY1, HIGH);
      digitalWrite(PIN_LEDR1, LOW);
    }

    if(distance > 20 && distance <= 25){
      digitalWrite(PIN_LEDG1, HIGH);
      digitalWrite(PIN_LEDY1, HIGH);
      digitalWrite(PIN_LEDR1, LOW);
    }

    if(distance > 25 && distance <= 30){
      digitalWrite(PIN_LEDG1, HIGH);
      digitalWrite(PIN_LEDY1, HIGH);
      digitalWrite(PIN_LEDR1, HIGH);
    }

    if(distance > 30){
      digitalWrite(PIN_LEDG1, HIGH);
      digitalWrite(PIN_LEDY1, HIGH);
      digitalWrite(PIN_LEDR1, HIGH);
    }

    if(zeljeniSklekovi == int(countPushUp)){
      Firebase.RTDB.setFloat(&fbdo, "data/pushUpFireB", countPushUp);
      delay(1500);
      tone(PIN_Buzzer, 200); 
      delay(1500);
      noTone(PIN_Buzzer); 
      countPushUp = 0;
      digitalWrite(PIN_LEDG1, LOW);
      digitalWrite(PIN_LEDY1, LOW);
      digitalWrite(PIN_LEDR1, LOW);
    }
  } 

  } else if(cucnjevi == 1){
        if(zeljeniCucnjevi != 999){
        noTone(PIN_Buzzer); 
      if(distance <= 10 ){
      down = true;
    }

    if(distance > 50){
      up = true;
    }

    if(down == true && up == true){
      down = false;
      up = false;
      countSquat+=0.5;
    }

    if(distance <= 30){
      digitalWrite(PIN_LEDG1, HIGH);
      digitalWrite(PIN_LEDY1, LOW);
      digitalWrite(PIN_LEDR1, LOW);
    }

    if(distance > 30 && distance <= 35){
      digitalWrite(PIN_LEDG1, HIGH);
      digitalWrite(PIN_LEDY1, LOW);
      digitalWrite(PIN_LEDR1, LOW);
    }

    if(distance > 35 && distance <= 40){
      digitalWrite(PIN_LEDG1, HIGH);
      digitalWrite(PIN_LEDY1, HIGH);
      digitalWrite(PIN_LEDR1, LOW);
    }

    if(distance > 40 && distance <= 45){
      digitalWrite(PIN_LEDG1, HIGH);
      digitalWrite(PIN_LEDY1, HIGH);
      digitalWrite(PIN_LEDR1, LOW);
    }

    if(distance > 45 && distance <= 50){
      digitalWrite(PIN_LEDG1, HIGH);
      digitalWrite(PIN_LEDY1, HIGH);
      digitalWrite(PIN_LEDR1, HIGH);
    }

    if(distance > 50){
      digitalWrite(PIN_LEDG1, HIGH);
      digitalWrite(PIN_LEDY1, HIGH);
      digitalWrite(PIN_LEDR1, HIGH);
    }

    if(zeljeniCucnjevi == int(countSquat)){
      Firebase.RTDB.setFloat(&fbdo, "data/squatFireB", countSquat);
      delay(1500);
      tone(PIN_Buzzer, 200); 
      delay(1500);
      noTone(PIN_Buzzer); 
      countSquat = 0;
      digitalWrite(PIN_LEDG1, LOW);
      digitalWrite(PIN_LEDY1, LOW);
      digitalWrite(PIN_LEDR1, LOW);
    }
  }
}

  if (Firebase.RTDB.setInt(&fbdo, "data/distance", distance)){
      Serial.println("PASSED");
      Serial.println("PATH: " + fbdo.dataPath());
      Serial.println("TYPE: " + fbdo.dataType());
    }
    else {
      Serial.println("FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }

    if (Firebase.RTDB.setFloat(&fbdo, "data/pushUpFireB", countPushUp)){
      Serial.println("PASSED");
      Serial.println("PATH: " + fbdo.dataPath());
      Serial.println("TYPE: " + fbdo.dataType());
    }
    else {
      Serial.println("FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }

      if (Firebase.RTDB.setFloat(&fbdo, "data/squatFireB", countSquat)){
      Serial.println("PASSED");
      Serial.println("PATH: " + fbdo.dataPath());
      Serial.println("TYPE: " + fbdo.dataType());
    }
    else {
      Serial.println("FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }

        if (Firebase.RTDB.setFloat(&fbdo, "data/Celsius", Celsius)){
      Serial.println("PASSED");
      Serial.println("PATH: " + fbdo.dataPath());
      Serial.println("TYPE: " + fbdo.dataType());
    }
    else {
      Serial.println("FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }
  }
}
