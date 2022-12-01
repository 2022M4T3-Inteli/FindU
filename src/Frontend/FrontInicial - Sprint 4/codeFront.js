const beacons = [];
const tags = [];
let r = -1
const grupos = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
var mapaTextura = localStorage.getItem('img');
var input_obj = document.getElementById('mapaForm')
var listaB = document.getElementById("listas_Beacon");
if(ReferenceError){
    localStorage.clear();
}
function inicializacao(){
    var allBeacon
    var tela = L.map('tela').setView([5,0], 4);
    L.tileLayer('imagens/bg_map.png', {
    maxZoom: 1,
    attribution: ''
    }).addTo(tela);
    var tagDiv = L.divIcon({className: 'my-div-icon',html:'<div class="tag" style="background: #FF0000;"></div>'});
    // requisição ajax que retorna todos os projetos cadastrados no banco de dados
    let ajax = new XMLHttpRequest();
    ajax.open("GET", "https://45gxmd-3000.preview.csb.app/tag", true);
    ajax.onreadystatechange = () => {
        if (ajax.status == 200 && ajax.readyState == 4){
            var beacon_num = 0
            var grupo
            var grupo_num = 0
            let dados = JSON.parse(ajax.responseText);
            for (let i = 0; i < dados.length; i++) {
            beacons.push(dados[i]['positionX']);
            beacons.push(dados[i]['positionY']);
            beacons.push(dados[i]['positionZ']);
            console.log(dados);
            tags[i] = L.marker([i*16,i*16],{icon:tagDiv,draggable:false}).addTo(tela).bindPopup(`Status: ${dados[i].status}<br>Nome: ${dados[i].name}<br>Categoria: ${dados[i].category}<br>Posição A1: ${dados[i].positionX}<br>Posição A2: ${dados[i].positionY}<br>Posição A3: ${dados[i].positionZ}`);
            }
            for (let i = 0; i < beacons.length; i++) {
                beacon_num += 1
                if (i % 3 == 0){
                    grupo = grupos[grupo_num]
                    beacon_num = 1
                    grupo_num +=1
                }
                console.log(grupo)
                var myIcon = L.divIcon({className: 'my-div-icon',html:`<div class="icon_beacons">${grupo}${beacon_num}</div>`});
                if (i % 2 ==0) {
                    let beacon = L.marker([-5*i,-10],{icon:myIcon,draggable:true}).addTo(tela);
                } else {
                    let beacon = L.marker([-10,5*2],{icon:myIcon,draggable:true}).addTo(tela);
                }
            }
            if (beacons.length >= 0) {
                for (let a = 0; a < (beacons.length)/3; a++) {
                    for (let i = 0; i < tags.length; i++) {
                        allBeacon += `<ul class="lista_Beacon">
                        <li><div class="quadrado">${grupos[i]}1</div> <div class="beancon" style="color:brown;"><span style="color: black;" class="material-symbols-outlined">arrow_right_alt</span> <span style="color: black;">${dados[i]['positionX']} M</span>  ${"9%"}<span class="material-symbols-outlined">${"battery_very_low"}</span></div></li>
                        <li><div class="quadrado">${grupos[i]}2</div> <div class="beancon" style="color:brown;"><span style="color: black;" class="material-symbols-outlined">arrow_right_alt</span> <span style="color: black;">${dados[i]['positionY']} M</span>  ${"11%"}<span class="material-symbols-outlined">${"battery_very_low"}</span></div></li>
                        <li><div class="quadrado">${grupos[i]}3</div> <div class="beancon" style="color:brown;"><span style="color: black;" class="material-symbols-outlined">arrow_right_alt</span> <span style="color: black;">${dados[i]['positionZ']} M</span>  ${"100%"}<span class="material-symbols-outlined">${"battery_full_alt"}</span></div></li>
                        </ul>`;
                        r += 1
                    }
                    allBeacon =  `<div class="grupo">${allBeacon}</div>`;
                    listaB.innerHTML = allBeacon;
                    allBeacon = '';
                }
            }
        }
    }
    ajax.send();
}

input_obj.addEventListener('change',function(e){
    let inputTarget = e.target;
    let file = inputTarget.files[0];
    if(file){
        localStorage.clear()
        mapaTextura = URL.createObjectURL(file);
        localStorage.setItem('img',mapaTextura);
        document.getElementById('tela').style.backgroundImage = `url(${mapaTextura})`
    }
});