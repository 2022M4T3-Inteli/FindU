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
float measure[3] = {0,0,0};


int sending = 0;
int btn_pressed = 0;
int turn_on = 0;
int buttonState = 0;

int count = 0;
// Entradas
#define BUTTON_PIN 21
#define LED 4

// macAddress
String macAddress = WiFi.macAddress();

// Rede WiFi com internet
//const char *AP_SSID = "Inteli-COLLEGE";             //Adicione aqui o nome da rede WiFi
//const char *AP_PWD = "QazWsx@123";                  //Adicione aqui o nome da rede WiFi
const char *AP_SSID = "Inteli-welcome";             //Adicione aqui o nome da rede WiFi
const char *AP_PWD = "";                  //Adicione aqui o nome da rede WiFi

const char* SSIDS[3]={"FIND_U_1","FIND_U_2","FIND_U_3"};
const char* PWD[3]={"FIND_U_1","FIND_U_2","FIND_U_3"};


//const char *AP_SSID = "SHARE-RESIDENTE";          //Adicione aqui o nome da rede WiFi
//const char *AP_PWD = "Share@residente";           //Adicione aqui o nome da rede WiFi

//const char *AP_SSID = "Leleo da 17";          //Adicione aqui o nome da rede WiFi
//const char *AP_PWD = "SenhaDoLeo9789";           //Adicione aqui o nome da rede WiFi


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

    
    measure[count] = (float)(report->dist_est - 4000)/ 100.0;
  
    Serial.printf("FTM Estimate: Distance: %.2f m, Return Time: %u ns\n", (float)(report->dist_est - 4000)/ 100.0, report->rtt_est);
    //free(report->ftm_report_data);

  } else {
    Serial.print("FTM Error: ");
    Serial.println(status_str[report->status]);
  }
  // Informar o recebimento do relatório FTM
  xSemaphoreGive(ftmSemaphore);
  count = count + 1;
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
void postDataToServer(float measure1, float measure2, float measure3){

  Serial.print(measure1);
  Serial.print(" ");
  Serial.print(measure2);
  Serial.print(" ");
  Serial.print(measure3);
  Serial.println("Posting Tag information to API...");
  // conectar a uma rede WiFi local que possui acesso à internet "a mesma que foi definida no início do código" 
  wifiMulti.addAP(AP_SSID, AP_PWD);

  if(wifiMulti.run() == WL_CONNECTED) {
    HTTPClient http;
    // endereço da API
    http.begin("https://45gxmd-3000.preview.csb.app/tag");
    http.addHeader("Content-Type", "application/json");
    StaticJsonDocument<200> doc;

    // Campos que serão enviados para a API e adicionados ao banco de dados
    doc["macAddress"] = macAddress;
    doc["name"] = "leo silva",
    doc["category"] = "63897acf6ef42d3067e64816";
    doc["positionX"] = measure1;
    doc["positionY"] = measure2;
    doc["positionZ"] = measure2;


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
}
void loop(){
  // quando o botão for pressionado, ativar a leitura de FTM e ligar o LED
  if (turn_on == 0){
    for(int i = 0; i<2; i++){
      digitalWrite(LED, HIGH);
      distances(i);
      
    }
    // talvez o turn on não deixe tempo para a função acima rodar
    WiFi.disconnect();
    // Rodar a função que envia a leitura de distância para a API
    

    postDataToServer(measure[0], measure[1], measure[2]);
    // Apagar o Led após o envio do Json
    digitalWrite(LED, LOW);
    
  }
  turn_on = 1;

}
