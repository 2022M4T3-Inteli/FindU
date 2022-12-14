/* Wi-Fi FTM Initiator
Resposnsável por acessar a rede Wi-Fi do responder / realizar o calculo de distância e enviar para a API */


// inclusão de bibliotécas necessárias
#include "WiFi.h"
#include <WiFiMulti.h>
WiFiMulti wifiMulti;
#include <HTTPClient.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Variáveis auxiliares
float measure = 0;
int sending = 0;
int btn_pressed = 0;
int turn_on = 0;
int buttonState = 0;

// Entradas
#define BUTTON_PIN 21
#define LED 4

// Rede WiFi com internet
const char *AP_SSID = "Inteli-COLLEGE";             //Adicione aqui o nome da rede WiFi
const char *AP_PWD = "QazWsx@123";                  //Adicione aqui o nome da rede WiFi


//const char *AP_SSID = "SHARE-RESIDENTE";          //Adicione aqui o nome da rede WiFi
//const char *AP_PWD = "Share@residente";           //Adicione aqui o nome da rede WiFi


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
  wifi_event_ftm_report_t * report = &event->event_info.wifi_ftm_report;
  // Setar relatório de status
  ftmSuccess = report->status == FTM_STATUS_SUCCESS;
  if (ftmSuccess) {
    // variável que recebe a medida calculada
    measure = (float)(report->dist_est - 4000)/ 100.0;
    Serial.printf("FTM Estimate: Distance: %.2f m, Return Time: %u ns\n", (float)(report->dist_est - 4100)/ 100.0, report->rtt_est);
    // Ponteiro para Relatório FTM com entradas múltiplas
    free(report->ftm_report_data);
  } else {
    Serial.print("FTM Error: ");
    Serial.println(status_str[report->status]);
  }
  // Informar o recebimento do relatório FTM
  xSemaphoreGive(ftmSemaphore);

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
void postDataToServer() {
  
  Serial.println("Posting Tag information to API...");
  // conectar a uma rede WiFi local que possui acesso à internet "a mesma que foi definida no início do código" 
  wifiMulti.addAP(AP_SSID, AP_PWD);

  if(wifiMulti.run() == WL_CONNECTED) {
    HTTPClient http;
    // endereço da API
    http.begin("https://api-findu.cyclic.app/tag");
    http.addHeader("Content-Type", "application/json");
    StaticJsonDocument<200> doc;

    // Campos que serão enviados para a API e adicionados ao banco de dados
    doc["status"] = 1;
    doc["name"] = "Tag 1 Beta";
    doc["category"] = "Eletrônico";
    doc["positionX"] = measure;
    doc["positionY"] = measure;
    doc["positionZ"] = measure;

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


// Configurações iniciais da placa iniciar o Sketch
void setup() {
  Serial.begin(115200);

  // configuração do Led e do botão do modelo físico
  pinMode(21, INPUT_PULLUP);
  pinMode(4, OUTPUT);

  // Criar semáforo binário
  ftmSemaphore = xSemaphoreCreateBinary();
  
  // Leitor de enventos FTM
  WiFi.onEvent(onFtmReport, ARDUINO_EVENT_WIFI_FTM_REPORT);
  
  // Conexão com o responder
  Serial.println("Connecting to FTM Responder");
  WiFi.begin("WiFi_FTM_Responder_FIND_U", "ftm_responder_FIND_U");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  // Mostrar mensagem de sucesso após conexão com o responder
  Serial.println("");
  Serial.println("WiFi Connected");

  // Informações da configuração do FTM definidas no começo do código
  Serial.print("Initiating FTM session with Frame Count ");
  Serial.print(FTM_FRAME_COUNT);
  Serial.print(" and Burst Period ");
  Serial.print(FTM_BURST_PERIOD * 100);
  Serial.println(" ms");
}

void loop(){
  delay(1000);

  // configurar botão para manter o estado ativado quando pressionado
  buttonState = digitalRead(BUTTON_PIN);
  if (buttonState == HIGH && btn_pressed == 0){
      btn_pressed = 1;
  }
  if (buttonState == LOW && btn_pressed == 1){
    btn_pressed = 0;
    if(turn_on == 0){
      turn_on = 1;
    } else {
      turn_on = 0;
    }
  }
  // quando o botão for pressionado, ativar a leitura de FTM e ligar o LED
  if (turn_on == 1){
    digitalWrite(LED, HIGH);
    while(getFtmReport());
    turn_on = 0;
  } else {
  }

  // Enviar a medida calculada após a leitura ser feita
  if (measure > 0 && sending == 0) {
    // Desconectar-se da rede WiFi do responder
    WiFi.disconnect();
    // Rodar a função que envia a leitura de distância para a API
    postDataToServer();
    // Apagar o Led após o envio do Json
    digitalWrite(LED, LOW);
    sending = 1;
  }
}
