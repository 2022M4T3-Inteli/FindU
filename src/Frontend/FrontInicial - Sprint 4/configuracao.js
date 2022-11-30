var tabela_configuracao = document.getElementById('corpo-tabela-tags');

let ajax = new XMLHttpRequest();
ajax.open("GET", "https://45gxmd-3000.preview.csb.app/tag", true);
ajax.onreadystatechange = () => {
    if (ajax.status == 200 && ajax.readyState == 4) {
        let dados = JSON.parse(ajax.responseText);
        console.log(dados);
        for (let i = 0; i < dados.length; i++) {
            // tabela_configuracao.append('<tr> <th> predroor </th></tr>');
            $("#corpo-tabela-tags")[0].innerHTML += `
            <tr id="tag_${dados[i]._id}">
                <td>${dados[i].name}</td>
                <td> <span class="${dados[i].category.color}"> ${dados[i].category.name} </td>
                <td> <ion-icon name="trash-outline"> </ion-icon> <ion-icon name="create-outline" onclick="patchEmployee('tag_${dados[i]._id}');"> <ion-icon> 
                </td>
            </tr>
            `
        }
    }
}

function atualizar(id) {
    //fazer aparecer o modal
    alert(id);

}


function patchEmployee(id) {
    var url = `https://45gxmd-3000.preview.csb.app/tag`;
    var res;

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send(); //A execução do script pára aqui até a requisição retornar do servidor

    res = JSON.parse(xhttp.responseText);

    document.getElementById("name_form_2").value = res[0].name;
    document.getElementById("category_form_2").value = res[0].category.name;
    document.getElementById("color_form_2").value = res[0].category.color;


    document
        .getElementById("patchButton")
        .setAttribute("onClick", `javascript: patchEmployeeII(${id})`);

    var patchModal = new bootstrap.Modal(document.getElementById("patchModal"), {
        keyboard: false,
    });
    patchModal.show();
}

function patchEmployeeII(_id) {
    var name = document.getElementById("name_form_2").value;
    var category = document.getElementById("category_form_2").value;
    var color = document.getElementById("color_form_2").value;

    var url = "https://45gxmd-3000.preview.csb.app/tag";

    $.ajax({
        type: "PATCH",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            "_id": _id,
            "name": name,
            "category.name": category,
            "category.color": color,
        }),
        success: function (res) {
            console.log(res);
        },
    });
    window.location.reload(); //essa função mágica faz com que atualize a página, sem haver a necessidade de recarregar manualmente para ver a adição do profissional na tabela
}



ajax.send();


