#include <Wire.h>
#include <SPI.h>
#include <UNIT_PN532.h>
#include <WiFi.h>
#include <WebServer.h>
#include <WebSocketsServer.h>

#define PN532_SCK  (18)
#define PN532_MOSI (23)
#define PN532_SS   (5)
#define PN532_MISO (19)

UNIT_PN532 nfc(PN532_SS);

const char* ssid = "TIGO-F419";
const char* password = "2NJ555300936";

WebServer server;
WebSocketsServer webSocket = WebSocketsServer(81);

void setup() {
  Serial.begin(115200);
  nfc.begin();
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("No se encontró la placa PN53x");
    while (1);
  }
  Serial.print("Chip encontrado PN5");
  Serial.println((versiondata >> 24) & 0xFF, HEX);
  Serial.print("Firmware ver. ");
  Serial.print((versiondata >> 16) & 0xFF, DEC);
  Serial.print('.'); Serial.println((versiondata >> 8) & 0xFF, DEC);
  nfc.setPassiveActivationRetries(0xFF);
  nfc.SAMConfig();

  Serial.println("Conectando a WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Conectado a la red WiFi");

  server.on("/", HTTP_GET, []() {
    server.send(200, "text/plain", "Hola desde ESP32");
  });

  server.begin();
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);

  Serial.println("Esperando una tarjeta ISO14443A ...");
}

void loop() {
  server.handleClient();
  webSocket.loop();

  uint8_t uid[7];
  uint8_t uidLength;

  if (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength)) {
    // Remover comentarios para medición de tiempos
    // unsigned long startTime = millis();
    
    String uidString = "";
    for (uint8_t i = 0; i < uidLength; i++) {
      if (uid[i] < 0x10) {
        uidString += "0"; // Agregar un cero inicial para valores menores de 0x10
      }
      uidString += String(uid[i], HEX);
    }

    webSocket.broadcastTXT(uidString);

    // unsigned long endTime = millis();
    // Serial.print("Tiempo de transmisión: ");
    // Serial.print(endTime - startTime);
    // Serial.println(" ms");
  }
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  // Manejar eventos de WebSocket si es necesario
}
