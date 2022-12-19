/ inclusão de bibliotécas necessárias
#include "WiFi.h"
#include <WiFiMulti.h>
WiFiMulti wifiMulti;
#include <HTTPClient.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
const char * WIFI_FTM_SSID = "FIND_U_2";         //definir nome da rede deste dispositivo
const char * WIFI_FTM_PASS = "FIND_U_2";              //definir a senha da rede deste dispositivo
// Rede WiFi com internet
const char *AP_SSID = "Felipe_teste";             //Adicione aqui o nome da rede WiFi
const char *AP_PWD = "12345678";                  //Adicione aqui o nome da rede WiFi
/* Wi-Fi FTM Initiator
Resposnsável por acessar a rede Wi-Fi do responder / realizar o calculo de distância e enviar para a API */
const char* SSIDS[2]={"FIND_U_1","FIND_U_3"};
const char* PWD[2]={"FIND_U_1","FIND_U_3"};
// Variáveis auxiliares
int measure[2] = {0,0};
int sending = 0;
int btn_pressed = 0;
int turn_on = 0;
int buttonState = 0;
int count_run = 0;
int count_measure = 0;
int count = 0;
// macAddress
String macAddress = WiFi.macAddress();
// Configurações no FTM
// Configuração no número de frames FTM requisitados "entre 4 ou 8 pulsações" (valores permitidos: 0, 16, 24, 32, 64)
const uint8_t FTM_FRAME_COUNT = 16;
// Tempo periódico entre as requisições consecutivas de FTM em pulsações de 100 milisegundos(valores permitidos: 0 ou 2-255)
const uint16_t FTM_BURST_PERIOD = 2;
// Sinalizar a chegada do FTM
xSemaphoreHandle ftmSemaphore;
// Status do Relatório FTM recebido
bool ftmSuccess = true;
// calculo dos dados de ida e volta do FTM
void onFtmReport(arduino_event_t *event) {
  const char * status_str[5] = {"SUCCESS", "UNSUPPORTED", "CONF_REJECTED", "NO_RESPONSE", "FAIL"};
  wifi_event_ftm_report_t * report_1 = &event->event_info.wifi_ftm_report;
  wifi_event_ftm_report_t * report_2 = &event->event_info.wifi_ftm_report;
  // Setar relatório de status
  ftmSuccess = report_1->status == FTM_STATUS_SUCCESS;
  if (ftmSuccess) {
    // variável que recebe a medida calculada
    if (count_measure == 0){
      measure[0] = (float)(report_1->dist_est - 4000)/ 100.0;
      Serial.printf("FTM Estimate: Distance: %.2f m, Return Time: %u ns\n", (float)(report_1->dist_est - 4000)/ 100.0, report_1->rtt_est);
      //(report->ftm_report_data, lixo1);
    }
    if (count_measure == 1){
      measure[1] = (float)(report_2->dist_est - 4000)/ 100.0;
      Serial.printf("FTM Estimate: Distance: %.2f m, Return Time: %u ns\n", (float)(report_2->dist_est - 4000)/ 100.0, report_2->rtt_est);
      //Strcpy(report->ftm_report_data, lixo2);
    }
  } else {
    Serial.print("FTM Error: ");
    Serial.println(status_str[report_1->status]);
  }
  //free(report->ftm_report_data);
  // Informar o recebimento do relatório FTM
  xSemaphoreGive(ftmSemaphore);
  count_measure += 1;
}
// Iniciar uma sessão FTM e aguardar o retorno do relatório
bool getFtmReport(){
  if(!WiFi.initiateFTM(FTM_FRAME_COUNT, FTM_BURST_PERIOD)){
    Serial.println("FTM Error: Initiate Session Failed");
    return false;
  }
  // Retornar uma menságem de sucesso caso o relatorio retorne true
  return xSemaphoreTake(ftmSemaphore, portMAX_DELAY) == pdPASS && ftmSuccess;
}
// Função de enviar o json com a medida calculada para a API
void postDataToServer(){
  Serial.println("Posting Tag information to API...");
  // conectar a uma rede WiFi local que possui acesso à internet "a mesma que foi definida no início do código"
  wifiMulti.addAP(AP_SSID, AP_PWD);
  if(wifiMulti.run() == WL_CONNECTED) {
    HTTPClient http;
    // endereço da API
    http.begin("https://s1cm6i-3000.preview.csb.app/beacon");
    http.addHeader("Content-Type", "application/json");
    StaticJsonDocument<200> doc;
    // Campos que serão enviados para a API e adicionados ao banco de dados
    doc["macAddress"] = macAddress;
    doc["distanceA"] = measure[0];
    doc["distanceC"] = measure[1];
    String requestBody;
    serializeJson(doc, requestBody);
    int httpResponseCode = http.POST(requestBody);
    // printar o json postado na API
    if(httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
    // retornar uma mensagem de erro caso tenho ocorrido alguma falha no envio de dados para a API
    } else {
      Serial.printf("Error occurred while sending HTTP POST: %s\n");
    }
  }
}
void distances(int current){
  // Criar semáforo binário
  ftmSemaphore = xSemaphoreCreateBinary();
  // Leitor de enventos FTM
  WiFi.onEvent(onFtmReport, ARDUINO_EVENT_WIFI_FTM_REPORT);
  // Conexão com o responder
  Serial.println("Connecting to FTM Responder");
  WiFi.disconnect();
  WiFi.begin(SSIDS[current], PWD[current]);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  // Mostrar mensagem de sucesso após conexão com o responder
  Serial.println("");
  Serial.print("WiFi ");
  Serial.print(SSIDS[current]);
  Serial.print(" Connected");
  // Informações da configuração do FTM definidas no começo do código
  Serial.println("Initiating FTM session with Frame Count ");
  Serial.print(FTM_FRAME_COUNT);
  Serial.print(" and Burst Period ");
  Serial.print(FTM_BURST_PERIOD * 100);
  Serial.println(" ms");
  getFtmReport();
}
// Configurações iniciais da placa iniciar o Sketch
void setup() {
  Serial.begin(115200);
   Serial.println("Starting SoftAP 'Power Ranger' with FTM Responder support");
}
void loop(){
  delay(1000);
  // quando o botão for pressionado, ativar a leitura de FTM e ligar o LED
  if (count_run == 0){
    for(int i = 0; i<2; i++){
      distances(i);
    }
    // talvez o turn on não deixe tempo para a função acima rodar
    WiFi.disconnect();
    // Rodar a função que envia a leitura de distância para a API
    postDataToServer();
    WiFi.softAP(WIFI_FTM_SSID, WIFI_FTM_PASS, 1, 0, 4, true);
    // Apagar o Led após o envio do Json
    count_run = 1;
  }
}