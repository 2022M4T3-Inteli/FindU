var dA1  // y
var dA2  // x
var dA3  // z
var y2
var x2
const beacons = [];
const tags = [];
const grupos = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'] // Classificações para grupo de três beacons
var mapaTextura = localStorage.getItem('img');
var input_obj = document.getElementById('mapaForm')
var listaB = document.getElementById("listas_Beacon");
if(ReferenceError){
    localStorage.clear();
}
var tela = L.map('tela').setView([5,0], 4);
L.tileLayer('imagens/bg_map.png', {
maxZoom: 4,
attribution: ''
}).addTo(tela);
/*function inicializacao(){
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
                    let beacon = L.marker([0,0],{icon:myIcon,draggable:true}).addTo(tela);
                } else {
                    let beacon = L.marker([(dados[0]['positionY']*3.5),(dados[0]['positionY']*3.5)],{icon:myIcon,draggable:true}).addTo(tela);
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
*/
input_obj.addEventListener('change',function(e){
    let inputTarget = e.target;
    console.log(e)
    console.log(inputTarget)
    let file = inputTarget.files[0];
    if(file){
        localStorage.clear()
        mapaTextura = URL.createObjectURL(file);
        localStorage.setItem('img',mapaTextura);
        document.getElementById('tela').style.backgroundImage = `url(${mapaTextura})`
    }
});
function tagsCoordenate(){
    let ajax = new XMLHttpRequest();
    ajax.open("GET", "https://sd5nhr-3000.preview.csb.app/tag", true);
    ajax.onreadystatechange = () => {
    if (ajax.status == 200 && ajax.readyState == 4){
        let dados = JSON.parse(ajax.responseText);
        dA1 = dados[0]['positionY']
        dA2 = dados[0]['positionX']
        dA3 = dados[0]['positionZ']
        console.log('Dados')
        console.log(`${dA1}, ${dA2}, ${dA3}`)
        beaconCoordenates()
    }
}
ajax.send();
}
function beaconCoordenates() {
    let ajax = new XMLHttpRequest();
    ajax.open("GET", "https://sd5nhr-3000.preview.csb.app/beacon", true);
    ajax.onreadystatechange = () => {
    if (ajax.status == 200 && ajax.readyState == 4){
        let dados = JSON.parse(ajax.responseText);
        y2 = dados[0]['distanceA']
        x2 = dados[0]['distanceC']
        console.log(`Coordenadas: x=${x2}, y=${y2}`)
        medias()
    }
}
ajax.send();
}
// distancias entre a tag e os beacons
// distancias entre o beacon B e os beacons A e C
// calcula eixo y do tag em relação aos beacons, tomando o beacon A como referencial
function tag_y_a(){
    quadrado_dA1 = Math.pow(dA1, 2);
    quadrado_dA2 = Math.pow(dA2, 2);
    quadrado_beacon_a = Math.pow(y2, 2);
    produto_beacon_a = 2 * (y2);
    yb_relativo_a = (quadrado_dA1 - quadrado_dA2 + quadrado_beacon_a) / produto_beacon_a;
    console.log('tag_y_a ',yb_relativo_a)
    return yb_relativo_a
}
// calcula eixo x do tag em relação aos beacons, tomando o beacon A como referencial
function tag_x_a(){
    quadrado_dA1 = Math.pow(dA1, 2);
    yb_relativo_a = tag_y_a();
    xb_relativo_a = Math.sqrt(quadrado_dA1 - yb_relativo_a);
    console.log('tag_x_a ',xb_relativo_a)
    return xb_relativo_a
}
// calcula eixo y do tag em relação aos beacons, tomando o beacon B como referencial
function tag_y_b(){
    quadrado_dA1 = Math.pow(dA1, 2);
    quadrado_dA3 = Math.pow(dA3, 2);
    quadrado_beacon_b = Math.pow(x2, 2);
    produto_beacon_b = 2 * (x2);
    yb_relativo_b = (quadrado_dA1 - quadrado_dA3 + quadrado_beacon_b) / produto_beacon_b;
    console.log('tag_y_b ',yb_relativo_b)
    return yb_relativo_b
}
// calcula eixo x do tag em relação aos beacons, tomando o beacon B como referencial
function tag_x_b(){
    quadrado_dA1 = Math.pow(dA1, 2);
    yb_relativo_b = tag_y_b();
    xb_relativo_b = Math.sqrt(quadrado_dA1 - yb_relativo_b);
    console.log('tag_x_b ',xb_relativo_b)
    return xb_relativo_b
}
// medias das 2 medidas
function medias(){
    yb_relativo_a = tag_y_a();
    xb_relativo_a = tag_x_a();
    yb_relativo_b = tag_y_b();
    xb_relativo_b = tag_x_b();
    media_x = (xb_relativo_a + xb_relativo_b) / 2;
    media_y = (yb_relativo_a + yb_relativo_b) / 2;
    console.log(media_x);
    console.log(media_y);
    plotTag(media_x,media_y);
}
function plotTag(x,y){
    var allBeacon = '';
    // requisição ajax que retorna todos os projetos cadastrados no banco de dados
    let ajax = new XMLHttpRequest();
    ajax.open("GET", "https://sd5nhr-3000.preview.csb.app/tag", true);
    ajax.onreadystatechange = () => {
        if (ajax.status == 200 && ajax.readyState == 4){
            var beacon_num = 0
            var grupo
            var grupo_num = 0
            let dados = JSON.parse(ajax.responseText);
            for (let i = 0; i < dados.length; i++) {
                let tagDiv = L.divIcon({className: 'my-div-icon',html:`<div class="tag" style="background: ${dados[i].category.color};"></div>`});
            beacons.push(dados[i]['positionX']);
            beacons.push(dados[i]['positionY']);
            beacons.push(dados[i]['positionZ']);
            console.log(dados);
            tags[i] = L.marker([x,y],{icon:tagDiv,draggable:false}).addTo(tela).bindPopup(`Nome: ${dados[i].name}<br>Categoria: ${dados[i].category.name}<br>Posição A1: ${dados[i].positionX}<br>Posição A2: ${dados[i].positionY}<br>Posição A3: ${dados[i].positionZ}`);
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
                if (i % 3 ==0) {
                    let beacon = L.marker([x2,0],{icon:myIcon,draggable:false}).addTo(tela);
                } else if ((i - 1) % 3 ==0){
                    let beacon = L.marker([0,y2],{icon:myIcon,draggable:false}).addTo(tela);
                } else{let beacon = L.marker([0,0],{icon:myIcon,draggable:false}).addTo(tela);}
            }
            if (beacons.length > 0) {
                for (let a = 0; a < (beacons.length)/3; a++) {
                    for (let i = 0; i < tags.length; i++) {
                        allBeacon += `<ul class="lista_Beacon">
                        <li><div class="quadrado">${grupos[i]}</div> <div class="beancon" style="color:green;"><span style="color: black;" class="material-symbols-outlined">arrow_right_alt</span> <span style="color: black;">${dados[i]['positionX']} M</span>  ${"80%"}<span class="material-symbols-outlined">${"battery_horiz_075"}</span></div></li>
                        <li><div class="quadrado">${grupos[i]}</div> <div class="beancon" style="color:green;"><span style="color: black;" class="material-symbols-outlined">arrow_right_alt</span> <span style="color: black;">${dados[i]['positionY']} M</span>  ${"80%"}<span class="material-symbols-outlined">${"battery_horiz_075"}</span></div></li>
                        <li><div class="quadrado">${grupos[i]}</div> <div class="beancon" style="color:green;"><span style="color: black;" class="material-symbols-outlined">arrow_right_alt</span> <span style="color: black;">${dados[i]['positionZ']} M</span>  ${"100%"}<span class="material-symbols-outlined">${"battery_full_alt"}</span></div></li>
                        </ul>`;
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