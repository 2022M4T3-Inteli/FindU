// inclusão de bibliotécas necessárias
#include "WiFi.h"
#include <WiFiMulti.h>
WiFiMulti wifiMulti;
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Arduino_JSON.h>
#include <iostream>
#include <array>
using namespace std;
// Variáveis auxiliares
float measure[3] = { 0, 0, 0 };
int count_measure = 0;
// Entradas
int buzzer1 = 15;
// macAddress
String macAddress = WiFi.macAddress();
// Rede WiFi com internet
const char *AP_SSID = "nome da rede";             //Adicione aqui o nome da rede WiFi
const char *AP_PWD = "senha da rede";                  //Adicione aqui o nome da rede WiFi
const char *SSIDS[3] = { "FIND_U_1", "FIND_U_2", "FIND_U_3" };
const char *PWD[3] = { "FIND_U_1", "FIND_U_2", "FIND_U_3" };
// Configurações no FTM
// Configuração no número de frames FTM requisitados "entre 4 ou 8 pulsações" (valores permitidos: 0, 16, 24, 32, 64)
const uint8_t FTM_FRAME_COUNT_measure = 16;
// Tempo periódico entre as requisições consecutivas de FTM em pulsações de 100 milisegundos(valores permitidos: 0 ou 2-255)
const uint16_t FTM_BURST_PERIOD = 2;
// Sinalizar a chegada do FTM
xSemaphoreHandle ftmSemaphore;
// Status do Relatório FTM recebido
bool ftmSuccess = true;
// calculo dos dados de ida e volta do FTM
void onFtmReport(arduino_event_t *event) {
  const char *status_str[5] = { "SUCCESS", "UNSUPPORTED", "CONF_REJECTED", "NO_RESPONSE", "FAIL" };
  wifi_event_ftm_report_t *report_1 = &event->event_info.wifi_ftm_report;
  wifi_event_ftm_report_t *report_2 = &event->event_info.wifi_ftm_report;
  wifi_event_ftm_report_t *report_3 = &event->event_info.wifi_ftm_report;
  // Setar relatório de status
  ftmSuccess = report_1->status == FTM_STATUS_SUCCESS;
  if (ftmSuccess) {
    // variável que recebe a medida calculada
    if (count_measure == 0) {
      measure[0] = (float)(report_1->dist_est - 4000) / 100.0;
      Serial.printf("FTM Estimate: Distance: %.2f m, Return Time: %u ns\n", (float)(report_1->dist_est - 4000) / 100.0, report_1->rtt_est);
    }
    if (count_measure == 1) {
      measure[1] = (float)(report_2->dist_est - 4000) / 100.0;
      Serial.printf("FTM Estimate: Distance: %.2f m, Return Time: %u ns\n", (float)(report_2->dist_est - 4000) / 100.0, report_2->rtt_est);
    }
    if (count_measure == 2)
      Serial.println("leleo");
    measure[2] = (float)(report_3->dist_est - 4000) / 100.0;
    Serial.printf("FTM Estimate: Distance: %.2f m, Return Time: %u ns\n", (float)(report_3->dist_est - 4000) / 100.0, report_3->rtt_est);
  } else {
    Serial.print("FTM Error: ");
    Serial.println(status_str[report_1->status]);
  }
  // Informar o recebimento do relatório FTM
  xSemaphoreGive(ftmSemaphore);
  count_measure += 1;
}
// Iniciar uma sessão FTM e aguardar o retorno do relatório
bool getFtmReport() {
  if (!WiFi.initiateFTM(FTM_FRAME_COUNT_measure, FTM_BURST_PERIOD)) {
    Serial.println("FTM Error: Initiate Session Failed");
    return false;
  }
  // Retornar uma menságem de sucesso caso o relatorio retorne true
  return xSemaphoreTake(ftmSemaphore, portMAX_DELAY) == pdPASS && ftmSuccess;
}
// Função de enviar o json com a medida calculada para a API
void postDataToServer() {
  delay(1000);
  Serial.println("Posting Tag information to API...");
  // conectar a uma rede WiFi local que possui acesso à internet "a mesma que foi definida no início do código"
  wifiMulti.addAP(AP_SSID, AP_PWD);
  if (wifiMulti.run() == WL_CONNECTED) {
    Serial.print(" measure 1 ");
    Serial.print(measure[0]);
    Serial.print(" measure 2 ");
    Serial.print(measure[1]);
    Serial.print(" measure 3: ");
    Serial.print(measure[2]);
    HTTPClient http;
    // endereço da API
    http.begin("https://s1cm6i-3000.preview.csb.app/tag");
    http.addHeader("Content-Type", "application/json");
    StaticJsonDocument<200> doc;
    // Campos que serão enviados para a API e adicionados ao banco de dados
    doc["macAddress"] = macAddress;
    doc["positionX"] = measure[0];
    doc["positionY"] = measure[1];
    doc["positionZ"] = measure[2];
    String requestBody;
    serializeJson(doc, requestBody);
    int httpResponseCode = http.POST(requestBody);
    // printar o json postado na API
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
      // retornar uma mensagem de erro caso tenho ocorrido alguma falha no envio de dados para a API
    } else {
      Serial.printf("Error occurred while sending HTTP POST: %s\n");
    }
  }
}
void distances(int current) {
  // Criar semáforo binário
  ftmSemaphore = xSemaphoreCreateBinary();
  // Leitor de enventos FTM
  WiFi.onEvent(onFtmReport, ARDUINO_EVENT_WIFI_FTM_REPORT);
  // Conexão com o responder
  Serial.println("Connecting to FTM Responder");
  WiFi.disconnect();
  delay(1000);
  WiFi.begin(SSIDS[current], PWD[current]);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  // Mostrar mensagem de sucesso após conexão com o responder
  Serial.println("");
  Serial.print("WiFi ");
  Serial.print(SSIDS[current]);
  Serial.print(" Connected");
  // Informações da configuração do FTM definidas no começo do código
  Serial.println("Initiating FTM session with Frame Count_measure ");
  Serial.print(FTM_FRAME_COUNT_measure);
  Serial.print(" and Burst Period ");
  Serial.print(FTM_BURST_PERIOD * 100);
  Serial.println(" ms");
  getFtmReport();
}
// Configurações iniciais da placa iniciar o Sketch
void setup() {
  Serial.begin(115200);
  pinMode(buzzer1, OUTPUT);
  postDataToServer();
}
void loop() {
  delay(1000);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
  //Send an HTTP POST request every 10 minutes
  //Check WiFi connection status
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String serverPath = "https://s1cm6i-3000.preview.csb.app/tag";
    // Your Domain name with URL path or IP address with path
    http.begin(serverPath.c_str());
    // Send HTTP GET request
    int httpResponseCode = http.GET();
    if (httpResponseCode > 0) {
      String payload = http.getString();
      JSONVar myObject = JSON.parse(payload);
      JSONVar keys = myObject.keys();
      for (int i = 0; i < myObject.length(); i++) {
        Serial.println(myObject[i]["buzzer"]);
        Serial.println(myObject[i]["macAddress"]);
        int buzzer = myObject[i]["buzzer"];
        if (myObject[i]["macAddress"] == WiFi.macAddress()) {
          if (buzzer == 1) {
            tone(buzzer1, 500);
          } else {
            tone(buzzer1, 0);
          }
        }
      }
      http.end();
    } else {
      Serial.println("WiFi Disconnected");
    }
  }
}