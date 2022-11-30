var beacons = [];
const tags = [];

function inicializacao() {
    //confirm("Oi");
    var tela = L.map('tela').setView([5, 0], 4);
    L.tileLayer('https://images.tcdn.com.br/img/img_prod/1102995/papel_de_parede_grid_azul_marinho_33_1_93a5945ec5a8fdbd1fd2ee6d69ae0faf.jpg', {
        maxZoom: 4,
        attribution: ''
    }).addTo(tela);
    // requisição ajax que retorna todos os projetos cadastrados no banco de dados
    let ajax = new XMLHttpRequest();
    ajax.open("GET", "https://45gxmd-3000.preview.csb.app/tag", true);
    ajax.onreadystatechange = () => {
        if (ajax.status == 200 && ajax.readyState == 4) {
            let dados = JSON.parse(ajax.responseText);
            for (let i = 0; i < dados.length; i++) {
                beacons.push(dados[i]['positionX']);
                beacons.push(dados[i]['positionY']);
                beacons.push(dados[i]['positionZ']);
                console.log(dados);
                tags[i] = L.marker([0, 0], { draggable: false }).addTo(tela).bindPopup(`Status: ${dados[0].status}<br>Nome: ${dados[0].name}<br>Categoria: ${dados[0].category}<br>Posição A1: ${dados[0].positionX}<br>Posição A2: ${dados[0].positionY}<br>Posição A3: ${dados[0].positionZ}`);
            }
            for (let i = 0; i < beacons.length; i++) {
                let myIcon = L.icon({
                    iconUrl: `../beaconImage/A${i + 1}.png`,
                    iconSize: [32, 32],
                    iconAnchor: [22, 94],
                    popupAnchor: [-3, -76],
                    shadowUrl: '../beaconImage/A1_shadow.png',
                    shadowSize: [38, 38],
                    shadowAnchor: [22, 94]
                });
                if (i % 2 == 0) {
                    let beacon = L.marker([-5 * i, -10], { icon: myIcon, draggable: true }).addTo(tela);
                } else {
                    let beacon = L.marker([-10, 5 * 2], { icon: myIcon, draggable: true }).addTo(tela);
                }
            }
            if (beacons.length >= 0) {
                var listaB = document.getElementById("listas_Beacon");

                for (let i = 0; i < (beacons.length) / 3; i++) {
                    listaB.innerHTML += `<ul id="lista_Beacon"><li><div class="quadrado">${"A" + 1}</div> <div class="beancon" style="color:brown;"><span style="color: black;" class="material-symbols-outlined">arrow_right_alt</span> <span style="color: black;">${dados[0]['positionX']} M</span>  ${"9%"}<span class="material-symbols-outlined">${"battery_very_low"}</span></div></li><li><div class="quadrado">${"A" + 2}</div> <div class="beancon" style="color:brown;"><span style="color: black;" class="material-symbols-outlined">arrow_right_alt</span> <span style="color: black;">${dados[0]['positionY']} M</span>  ${"11%"}<span class="material-symbols-outlined">${"battery_very_low"}</span></div></li><li><div class="quadrado">${"A" + 3}</div> <div class="beancon" style="color:brown;"><span style="color: black;" class="material-symbols-outlined">arrow_right_alt</span> <span style="color: black;">${dados[0]['positionZ']} M</span>  ${"100%"}<span class="material-symbols-outlined">${"battery_full_alt"}</span></div></li></ul>`;

                }
            }
        }
    }
    ajax.send();
}