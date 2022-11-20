// variáveis que armazenam beacons e tags
var beacons = [];
const tags = [];

function inicializacao(){   
    // configurando mapa
    var tela = L.map('tela').setView([5,0], 4);
    L.tileLayer('https://images.tcdn.com.br/img/img_prod/1102995/papel_de_parede_grid_azul_marinho_33_1_93a5945ec5a8fdbd1fd2ee6d69ae0faf.jpg', {
    maxZoom: 4,
    attribution: ''
    }).addTo(tela);         
    // requisição ajax que retorna todos as tags cadastradas no banco de dados
    let ajax = new XMLHttpRequest();
    ajax.open("GET", "https://api-findu.cyclic.app/tag", true);
    ajax.onreadystatechange = () => {
        if (ajax.status == 200 && ajax.readyState == 4){
            let dados = JSON.parse(ajax.responseText);
            for (let i = 0; i < dados.length; i++) {
            beacons.push(dados[i]['positionX']);
            beacons.push(dados[i]['positionY']);
            beacons.push(dados[i]['positionZ']);
            console.log(dados);
            // colocando as tags no mapa
            tags[i] = L.marker([0,0],{draggable:false}).addTo(tela).bindPopup(`Status: ${dados[0].status}<br>Nome: ${dados[0].name}<br>Categoria: ${dados[0].category}<br>Posição A1: ${dados[0].positionX}<br>Posição A2: ${dados[0].positionY}<br>Posição A3: ${dados[0].positionZ}`);
            }
            // colocando os beacons no mapa
            for (let i = 0; i < beacons.length; i++) {
                let myIcon = L.icon({
                    iconUrl: `../beaconImage/A${i+1}.png`,
                    iconSize: [32, 32],
                    iconAnchor: [22, 94],
                    popupAnchor: [-3, -76],
                    shadowUrl: '../beaconImage/A1_shadow.png',
                    shadowSize: [38, 38],
                    shadowAnchor: [22, 94]
                });
                if (i % 2 ==0) {
                    let beacon = L.marker([-5*i,-10],{icon:myIcon,draggable:true}).addTo(tela);
                } else {
                    let beacon = L.marker([-10,5*2],{icon:myIcon,draggable:true}).addTo(tela);
                }
            }
            // atualizando lista de beacons com as informações do banco de dados
            if (beacons.length >= 0) {
                var listaB = document.getElementById("listas_Beacon");

                for (let i = 0; i < (beacons.length)/3; i++) {
                    listaB.innerHTML += `<ul id=\"lista_Beacon${i}\"><li class=\"beancon\"><div class=\"quadrado\">${"A"+1}</div><span style=\"color: BLACK;\">${dados[0]['positionX']}</span>${"9%"} <span class=\"material-symbols-outlined\">${"battery_very_low"}</span></li><li class=\"beancon\"><div class=\"quadrado\">${"A"+2}</div><span style=\"color: BLACK;\">${dados[0]['positionY']}</span>${"12%"} <span class=\"material-symbols-outlined\">${"battery_very_low"}</span></li><li class=\"beancon\"><div class=\"quadrado\">${"A"+3}</div><span style=\"color: BLACK;\">${dados[0]['positionZ']}</span>${"10%"} <span class=\"material-symbols-outlined\">${"battery_very_low"}</span></li></ul>`;
                        
                }
            }
        }
    }
    // enviando requisição ajax
    ajax.send();
}