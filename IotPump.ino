#include <Arduino.h>
#if defined(ESP32)
  #include <WiFi.h>
#elif defined(ESP8266)
  #include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>

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
#define DATABASE_URL "-" 

//Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int sklekovi = 0;
int cucnjevi = 0;
float countPushUp = 0;
float countSquat = 0;
int zeljeniSklekovi = 0;
bool down = false;
bool up = false;
bool signupOK = false;
const int trigPin = D7;
const int echoPin = D8;
long duration;
int distance;
const int PIN_LED   = D0;
const int PIN_Buzzer = D1;

void setup(){
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin,INPUT);
  pinMode(PIN_LED,OUTPUT);
  pinMode(PIN_Buzzer,OUTPUT);

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

  if(sklekovi == 1){
    if(zeljeniSklekovi != 999){
        noTone(PIN_Buzzer); 
      digitalWrite(PIN_LED, LOW);
      if(distance <= 10 ){
      down = true;
      digitalWrite(PIN_LED, HIGH);
    }

    if(distance > 20){
      up = true;
      digitalWrite(PIN_LED, LOW);
    }

    if(down == true && up == true){
      down = false;
      up = false;
      countPushUp+=0.5;
    }

  if(zeljeniSklekovi == int(countPushUp)){
    Firebase.RTDB.setFloat(&fbdo, "data/pushUpFireB", countPushUp);
    delay(1500);
    tone(PIN_Buzzer, 200); 
    delay(1500);
    noTone(PIN_Buzzer); 
    countPushUp = 0;
    }
  }

  } else if(cucnjevi == 1){
    noTone(PIN_Buzzer); 
     digitalWrite(PIN_LED, LOW);
      if(distance <= 30 ){
      down = true;
       digitalWrite(PIN_LED, HIGH);
      tone(PIN_Buzzer, 100); 
    }

    if(distance > 50){
       digitalWrite(PIN_LED, LOW);
       noTone(PIN_Buzzer); 
      up = true;
    }

    if(down == true && up == true){
      if(countSquat == 0){
      down = false;
      up = false;
      countSquat++;
      } else{
      down = false;
      up = false;
      countSquat+=0.5;
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
  }
}
