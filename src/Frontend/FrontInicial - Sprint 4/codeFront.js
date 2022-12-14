if (localStorage.getItem("message")) {
  if (localStorage.getItem("message") == "map photo") {
    toastShow();
    localStorage.removeItem("message");
  }
}

function addToastPhoto() {
  localStorage.setItem("message", "map photo");
}

function toastShow() {
  swal("Planta baixa enviada com sucesso!", "", "success", {
    dangerMode: true,
  });
}

const positionBeacons = [];
const positionXY = [];
//var y2; // Posição relativa da tag no eixo y
//var x2; // Posição relativa da tag no eixo x

// Listas responsáveis por armazenar uma referência das tags e dos beacon
const beacons = [];
const tags = [];

const grupos = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
]; // Classificações para grupo de três beacons

var mapaTextura = localStorage.getItem("img"); // variável que armazena o mapa
var input_obj = document.getElementById("mapaForm"); // Input
var search = document.getElementById("serach_input");

var listaB = document.getElementById("listas_Beacon"); // Local na página index referênte a lista de beacons

// Inicialização do objeto L.map da biblioteca leaflet
var tela = L.map("tela").setView([5, 0], 4);
L.tileLayer("imagens/bg_map.png", {
  maxZoom: 4,
  attribution: "",
}).addTo(tela);

// Barra de pesquisa das tags
search.addEventListener('change', function (e) {
  var input = e.target.value.toLowerCase();
  if (input != "") {
    for (let a = 0; a < tags.length; ) {
      if (
        document.getElementsByClassName("tag")[a].classList[1] != `c_${input}`
      ) {
        document.getElementsByClassName("tag")[a].style["display"] = "none";
      } else {
        document.getElementsByClassName("tag")[a].style["display"] = "flex";
      }
      a += 1;
    }
  } else {
    for (let a = 0; a < tags.length; ) {
      document.getElementsByClassName("tag")[a].style["display"] = "flex";
      a += 1;
    }
  }
});

// Alterador da imagem da página
input_obj.addEventListener('change',function(e){
  let inputTarget = e.target;
  console.log(e)
  console.log(inputTarget)
  let file = inputTarget.files[0];
  if(file){
      mapaTextura = URL.createObjectURL(file);
      console.log(mapaTextura);
      let url = "https://s1cm6i-3000.preview.csb.app/upload";
      let formData = new FormData();
      formData.append("testImage", file);
      $.ajax({
          url: url,
          type: "POST",
          data: formData,
          contentType: false,
          processData: false
      }).done(function(response){
          console.log(response);
          addToastPhoto();
      }).fail(function(error){
          console.log(error);
      }).always(function(){
          console.log('Success');
          location.reload();
      });
  }
  localStorage.setItem('name', `https://s1cm6i-3000.preview.csb.app/${file.name}`);
});

let urlImages = localStorage.getItem('name');

let ajax = new XMLHttpRequest();

ajax.open('GET', urlImages, true);
ajax.onreadystatechange = () => {
  if(ajax.status === 200 && ajax.readyState === 4) {
      document.getElementById('tela').style.backgroundImage = `url(${localStorage.getItem('name')})`;
  }
}

ajax.send();

// Cria uma requição ao servidor para conseguir as informações da tag
function tagsCoordenate() {
  let ajax = new XMLHttpRequest();
  ajax.open("GET", "https://s1cm6i-3000.preview.csb.app/tag", true);
  ajax.onreadystatechange = () => {
    if (ajax.status == 200 && ajax.readyState == 4) {
      let dados = JSON.parse(ajax.responseText);
      positionBeacons.push(dados[0]["positionY"]);
      positionBeacons.push(dados[0]["positionX"]);
      positionBeacons.push(dados[0]["positionZ"]);
      console.log("Dados");
      beaconCoordenates();
    }
  };
  ajax.send();
}

// Cria uma requição ao servidor para conseguir as informações do beacon
function beaconCoordenates() {
  let ajax = new XMLHttpRequest();
  ajax.open("GET", "https://s1cm6i-3000.preview.csb.app/beacon", true);
  ajax.onreadystatechange = () => {
    if (ajax.status == 200 && ajax.readyState == 4) {
      let dados = JSON.parse(ajax.responseText);
      //y2 = dados[0]["distanceA"];
      //x2 = dados[0]["distanceC"];
      for (let index = 0; index < dados.length; index++) {
        console.log("Tamanho: "+index);
        positionXY.push(dados[index]["distanceA"]);
        positionXY.push(dados[index]["distanceC"]);
        
      }
      for (let index = 0; index < (positionBeacons.length)/3; index++) {
        if (index % 3 == 0){
          medias(index);
        }
        
      }
    }
  };
  ajax.send();
}

// distancias entre a tag e os beacons
// distancias entre o beacon B e os beacons A e C
// calcula eixo y do tag em relação aos beacons, tomando o beacon A como referencial
function tag_y_a(i) {
  quadrado_dA1 = Math.pow(positionBeacons[i], 2); // 0 3 6 9 // d1
  quadrado_dA2 = Math.pow(positionBeacons[i+1], 2); // d2
  quadrado_beacon_a = Math.pow(positionXY[i], 2);
  produto_beacon_a = 2 * positionXY[i];
  yb_relativo_a =
    (quadrado_dA1 - quadrado_dA2 + quadrado_beacon_a) / produto_beacon_a;
  console.log("tag_y_a ", yb_relativo_a);
  return yb_relativo_a;
}
// calcula eixo x do tag em relação aos beacons, tomando o beacon A como referencial
function tag_x_a(i) {
  quadrado_dA1 = Math.pow(positionBeacons[i], 2);
  yb_relativo_a = tag_y_a(i);
  xb_relativo_a = Math.sqrt(quadrado_dA1 - yb_relativo_a);
  console.log("tag_x_a ", xb_relativo_a);
  return xb_relativo_a;
}
// calcula eixo y do tag em relação aos beacons, tomando o beacon B como referencial
function tag_y_b(i) {
  quadrado_dA1 = Math.pow(positionBeacons[i], 2);
  quadrado_dA3 = Math.pow(positionBeacons[i+2], 2);
  quadrado_beacon_b = Math.pow(positionXY[i+1], 2);
  produto_beacon_b = 2 * positionXY[i+1];
  yb_relativo_b =
    (quadrado_dA1 - quadrado_dA3 + quadrado_beacon_b) / produto_beacon_b;
  console.log("tag_y_b ", yb_relativo_b);
  return yb_relativo_b;
}
// calcula eixo x do tag em relação aos beacons, tomando o beacon B como referencial
function tag_x_b(i) {
  quadrado_dA1 = Math.pow(positionBeacons[i], 2);
  yb_relativo_b = tag_y_b(i);
  xb_relativo_b = Math.sqrt(quadrado_dA1 - yb_relativo_b);
  console.log("tag_x_b ", xb_relativo_b);
  return xb_relativo_b;
}
// medias das 2 medidas
function medias(i) {
  yb_relativo_a = tag_y_a(i);
  xb_relativo_a = tag_x_a(i);
  yb_relativo_b = tag_y_b(i);
  xb_relativo_b = tag_x_b(i);
  media_x = (xb_relativo_a + xb_relativo_b) / 2;
  media_y = (yb_relativo_a + yb_relativo_b) / 2;
  console.log(media_x);
  console.log(media_y);
  plotTag(media_x, media_y);
}

// Plota na tela as posições dos beacons e da tag no mapa, atualiza a lista de beacons existente
function plotTag(x, y) {
  var allBeacon = "";
  // requisição ajax que retorna todos os projetos cadastrados no banco de dados
  let ajax = new XMLHttpRequest();
  ajax.open("GET", "https://s1cm6i-3000.preview.csb.app/tag", true);
  ajax.onreadystatechange = () => {
    if (ajax.status == 200 && ajax.readyState == 4) {
      var beacon_num = 0;
      var grupo;
      var grupo_num = 0;
      let dados = JSON.parse(ajax.responseText);
      for (let i = 0; i < dados.length; i++) {
        let tagDiv = L.divIcon({
          className: "my-div-icon",
          html: `<div class="tag c_${dados[
            i
          ].category.name.toLowerCase()}" style="background: ${
            dados[i].category.color
          };"></div>`,
        }); // Configuração da aparência da tag 
        beacons.push(dados[i]["positionX"]);
        beacons.push(dados[i]["positionY"]);
        beacons.push(dados[i]["positionZ"]);
        tags[i] = dados;
        let = L.marker([x, y], { icon: tagDiv, draggable: false })
          .addTo(tela)
          .bindPopup(
            `Nome: ${dados[i].name}<br>Categoria: ${dados[i].category.name}<br>Posição A1: ${dados[i].positionX}<br>Posição A2: ${dados[i].positionY}<br>Posição A3: ${dados[i].positionZ}`
          );
      }
      var a = 0;
      for (let i = 0; i < beacons.length; i++) {
        beacon_num += 1;
        if (i % 3 == 0) {
          grupo = grupos[grupo_num];
          beacon_num = 1;
          grupo_num += 1;
        }
        var myIcon = L.divIcon({
          className: "my-div-icon",
          html: `<div class="icon_beacons">${grupo}${beacon_num}</div>`,
        }); // Configuração da aparência do beacon
        // Esse é o if responável por fazer os beacons aparecerem em um ângulo reto entre si
        if (i % 3 == 0) {
          let beacon = L.marker([positionXY[a+1], 0], {
            icon: myIcon,
            draggable: false,
          }).addTo(tela);
          console.log(`${grupo}${beacon_num}:(${positionXY[a+1]},${0})`)
        } else if ((i - 1) % 3 == 0) {
          let beacon = L.marker([0, positionXY[a]], {
            icon: myIcon,
            draggable: false,
          }).addTo(tela);
          console.log(`${grupo}${beacon_num}:(${0},${positionXY[a]})`)
          a+=1
        } else {
          let beacon = L.marker([0, 0], {
            icon: myIcon,
            draggable: false,
          }).addTo(tela);
        }
      }

      // Caso haja beacons esse if atualiza a lista de beacons do página index
      if (beacons.length > 0) {
        for (let a = 0; a < beacons.length / 3; a++) {
          for (let i = 0; i < tags.length; i++) {
            allBeacon += `<ul class="lista_Beacon">
                        <li><div class="quadrado">${
                          grupos[i]
                        }1</div> <div class="beancon" style="color:green;"><span style="color: black;" class="material-symbols-outlined">arrow_right_alt</span> <span style="color: black;">${
              dados[i]["positionX"]
            } M</span>  ${"80%"}<span class="material-symbols-outlined">${"battery_horiz_075"}</span></div></li>
                        <li><div class="quadrado">${
                          grupos[i]
                        }2</div> <div class="beancon" style="color:green;"><span style="color: black;" class="material-symbols-outlined">arrow_right_alt</span> <span style="color: black;">${
              dados[i]["positionY"]
            } M</span>  ${"80%"}<span class="material-symbols-outlined">${"battery_horiz_075"}</span></div></li>
                        <li><div class="quadrado">${
                          grupos[i]
                        }3</div> <div class="beancon" style="color:green;"><span style="color: black;" class="material-symbols-outlined">arrow_right_alt</span> <span style="color: black;">${
              dados[i]["positionZ"]
            } M</span>  ${"100%"}<span class="material-symbols-outlined">${"battery_full_alt"}</span></div></li>
                        </ul>`;
          }
          allBeacon = `<div class="grupo">${allBeacon}</div>`;
          listaB.innerHTML = allBeacon;
          allBeacon = "";
        }
      }
    }
  };
  ajax.send();
}
