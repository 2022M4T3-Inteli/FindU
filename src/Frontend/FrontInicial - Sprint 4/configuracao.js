var tabela_configuracao = document.getElementById('corpo-tabela-tags');

let ajax = new XMLHttpRequest();
ajax.open("GET", "https://45gxmd-3000.preview.csb.app/tag", true);
ajax.onreadystatechange = () => {
    if (ajax.status == 200 && ajax.readyState == 4) {
        let dados = JSON.parse(ajax.responseText);
        console.log(dados);
        for (let i = 0; i < dados.length; i++) {
            $("#corpo-tabela-tags").append(`<tr id="tag_${dados[i]._id}">
                <td>${dados[i].name}</td>
                <td><span class="${dados[i].category.color}"> ${dados[i].category.name} </td>
                <td><ion-icon name="trash-outline"></ion-icon><ion-icon name="create-outline" onclick="patchEmployee('${dados[i]._id}');"><ion-icon></td>
            </tr>
            `
            )
        }
    }
}

ajax.send();

function patchEmployee(id) {
    let url = `https://45gxmd-3000.preview.csb.app/tag`;
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url, false);
    xhttp.send();

    let res = JSON.parse(xhttp.responseText);

    for(let i = 0; i < res.length; i++) {
        if(res[i]._id == id) {
            document.getElementById("id_form_2").value = res[i]._id;
            document.getElementById("name_form_2").value = res[i].name;
            document.getElementById("category_form_2").value = res[i].category.name;
            document.getElementById("color_form_2").value = res[i].category.color;
        }
    }
    var patchModal = new bootstrap.Modal(document.getElementById("patchModal"), {
        keyboard: false,
    });
    patchModal.show();
}

function update() {
    let id = document.getElementById("id_form_2").value;
    console.log(typeof id);
    let name = document.getElementById("name_form_2").value;
    let category = document.getElementById("category_form_2").value;
    let url = "https://45gxmd-3000.preview.csb.app/tag";
    $.ajax({
        type: "PATCH",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            id: id,
            name: name,
            category: category
        }),
        success: function (res) {
            console.log(res);
            window.location.reload();
        },
    });
}


let addCategory = document.getElementById('addCategory');

addCategory.addEventListener('click', () => {
    var createModal = new bootstrap.Modal(document.getElementById("createModal"), {
        keyboard: false,
    });
    createModal.show();
});