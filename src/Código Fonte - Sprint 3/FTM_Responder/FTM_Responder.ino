// incluir biblioteca WiFi
#include "WiFi.h"


const char * WIFI_FTM_SSID = "WiFi_FTM_Responder_FIND_U";         //definir nome da rede deste dispositivo
const char * WIFI_FTM_PASS = "ftm_responder_FIND_U";              //definir a senha da rede deste dispositivo

void setup() {
  Serial.begin(115200);
  Serial.println("Starting SoftAP with FTM Responder support");
  // Habilitar a AP com suporte para FTM
  WiFi.softAP(WIFI_FTM_SSID, WIFI_FTM_PASS, 1, 0, 4, true);
}

void loop() {
  delay(1000);
}
