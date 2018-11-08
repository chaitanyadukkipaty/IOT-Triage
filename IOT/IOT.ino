#include <SPI.h>
#include <MFRC522.h>

#include <ESP8266WiFi.h>
#include <WiFiClient.h> 
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include "ArduinoJson.h"

#define SS_PIN 15
#define RST_PIN 5
 
MFRC522 rfid(SS_PIN, RST_PIN); // Instance of the class

MFRC522::MIFARE_Key key; 

// Init array that will store new NUID 
byte nuidPICC[4];

String a;
String b;
String c;
String d;
 
 
const char* ssid = "OnePlus 5"; // your wireless network name (SSID)
const char* password = "chaitanya"; // your Wi-Fi network password
void setup() { 
  Serial.begin(115200);
  SPI.begin(); // Init SPI bus
  rfid.PCD_Init(); // Init MFRC522 

  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }

 WiFi.begin(ssid, password);
   
    while (WiFi.status() != WL_CONNECTED) 
    {
      delay(1000);
      Serial.println();
      Serial.println("Connecting to WiFi.......");
    } 

    Serial.print("Connected to ");Serial.print(ssid);Serial.println(".");
    
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());  //IP address assigned to your ESP
}
 
void loop() {

//---------------------HTTP OBJECT & SETTING POST DATA TYPE ----------------------
      HTTPClient http;    //Declare object of class HTTPClient
          
      http.begin("http://192.168.43.77:3000/");        
      http.addHeader("Content-Type", "application/json");    //Specify content-type header


//---------------JSON OBJECT CREATED---------------------------------

      StaticJsonBuffer<200> jsonBuffer;
      JsonObject& root = jsonBuffer.createObject();

  // Look for new cards
  if ( ! rfid.PICC_IsNewCardPresent())
    return;

  // Verify if the NUID has been readed
  if ( ! rfid.PICC_ReadCardSerial())
    return;


//--------COPY CARD DETAILS TO ARRAY (BYTE FORM)---------------------
       for (byte i = 0; i < 4; i++) 
       {
            nuidPICC[i] = rfid.uid.uidByte[i];
       }

//------- COVERT FROM BYTE TO STRING IN HEX FORM ---------------------
      a=String(nuidPICC[0],HEX);
      b=String(nuidPICC[1],HEX);
      c=String(nuidPICC[2],HEX);
      d=String(nuidPICC[3],HEX);

// ---------CONVERT STRINGS TO UPPER CASE ----------------------------
      a.toUpperCase();
      b.toUpperCase();
      c.toUpperCase();
      d.toUpperCase();

    Serial.println();

 // ------ LOADING JSON OBJECT WITH UNIQUE ID -------------------------
      root["Uid"]=(a+b+c+d);  //JSON

 
       rfid.PICC_HaltA();
       rfid.PCD_StopCrypto1();

// -----PRINT TO SERIAL MONITOR----------------------------------------
      root.printTo(Serial);
      Serial.println();
      delay(2000);

//-----------STORE JSON IN CHARACTER ARRAY------------------------------
      char JSONmessageBuffer[100];
      root.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
      Serial.println(JSONmessageBuffer);

//---------POST FUNCTION TO SERVER---------------------------------------
      int httpCode = http.POST(JSONmessageBuffer);   //Send the request

//--------END HTTP CONNECTION--------------------------------------------
      http.end(); 
      Serial.println();  
}
