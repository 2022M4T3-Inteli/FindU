// lógica que mostra o modal de tag atualizada
if(localStorage.getItem('message')){
    if(localStorage.getItem('message') == 'updated tag'){
        toastShow();
        localStorage.removeItem('message');
    }
}

function addToastUpdate(){
    localStorage.setItem('message', 'updated tag');
}

function toastShow(){
    swal("Tag atualizada com sucesso!", '', "success", {
        dangerMode: true,
    });
}

// lógica que mostra o modal de tag criada
if(localStorage.getItem('message')){
    if(localStorage.getItem('message') == 'create category'){
        toastShowCategory();
        localStorage.removeItem('message');
    }
}

function addToastToCreateCategory(){
    localStorage.setItem('message', 'create category');
}

function toastShowCategory(){
    swal("Categoria cadastrada com sucesso!", '', "success", {
        dangerMode: true,
    });
}

// variável que armazena a tabela de tags
var tabela_configuracao = document.getElementById('corpo-tabela-tags');
// variável que retorna se precisa mostras as categorias
let showCategories = true;

// requisição ajax que retorna as tags cadastradas no sistemas e atualiza elas na página
let ajax = new XMLHttpRequest();
ajax.open("GET", "https://sd5nhr-3000.preview.csb.app/tag", true);
ajax.onreadystatechange = () => {
    if (ajax.status == 200 && ajax.readyState == 4) {
        let dados = JSON.parse(ajax.responseText);
        console.log(dados);
        for (let i = 0; i < dados.length; i++) {
            $("#corpo-tabela-tags").append(`<tr id="tag_${dados[i]._id}">
                <td>${dados[i].name}</td>
                <td><span class="${dados[i].category.color}"> ${dados[i].category.name} </td>
                <td><ion-icon onclick="deleteTag('${dados[i]._id}')" name="trash-outline"></ion-icon><ion-icon name="create-outline" onclick="patchTag('${dados[i]._id}');"><ion-icon></td>
            </tr>
            `
            )
        }
    }
}

ajax.send();

// função que atualiza tag
function patchTag(id) {
    let urlCategories = "https://sd5nhr-3000.preview.csb.app/category";
    let ajax = new XMLHttpRequest();
    ajax.open('GET', urlCategories, true);
    if(showCategories) {
        ajax.onreadystatechange = () => {
            if(ajax.status === 200 && ajax.readyState === 4) {
                let response = JSON.parse(ajax.responseText);
                console.log(response);
                for(let i = 0; i < response.length; i++) {
                    $('#categories').append(`<option value="${response[i]._id}">${response[i].name}</option>`)
                }
            }
        }
        ajax.send();
        showCategories = false;
    }

    let url = `https://sd5nhr-3000.preview.csb.app/tag`;
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url, false);
    xhttp.send();

    let res = JSON.parse(xhttp.responseText);

    for(let i = 0; i < res.length; i++) {
        if(res[i]._id == id) {
            document.getElementById("id_form_2").value = res[i]._id;

            if(res[i].name == undefined) {
                document.getElementById("name_form_2").value = `Tag ${i}`;
            } else {
                document.getElementById("name_form_2").value = res[i].name;
            }
        }
    }
    var patchModal = new bootstrap.Modal(document.getElementById("patchModal"), {
        keyboard: false,
    });
    patchModal.show();

    addToastUpdate();

}

// função que atualiza informações da tag
function update() {
    let id = document.getElementById("id_form_2").value;
    let name = document.getElementById("name_form_2").value;
    let category = document.getElementById("categories").value;

    let urlTag = "https://sd5nhr-3000.preview.csb.app/tag";

    $.ajax({
        type: "PATCH",
        url: urlTag,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            id: id,
            name: name,
            category: category
        }),
        success: function (res) {
            window.location.reload();
            console.log(res);
        },
        error: function(exception) {
            console.log(exception)
        }
    });
}

// mostra modal de criar categoria na tela
let addCategory = document.getElementById('addCategory');

addCategory.addEventListener('click', () => {
    var createModal = new bootstrap.Modal(document.getElementById("createModal"), {
        keyboard: false,
    });
    createModal.show();
});

// função que cria uma nova categoria no sistema
function createCategory() {
    let name = document.getElementById("name_create_category").value;
    let color = document.getElementById("color_create_category").value;

    console.log(name);
    console.log(color);

    let url = "https://sd5nhr-3000.preview.csb.app/category";

    $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            name: name,
            color: color
        }),
        success: function (res) {
            window.location.reload();
            console.log(res);
        },
    });

    addToastToCreateCategory();
}

// função que deleta tag do sistema
function deleteTag(id) {
    swal({
        title: "Deseja excluir essa tag?",
        icon: "info",
        buttons: [
            'Cancelar', 'Excluir'
        ],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            let url = `https://sd5nhr-3000.preview.csb.app/tag/${id}`;
            $.ajax({
                type: 'DELETE',
                url: url,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify({
                    message: 'Deleting tag'
                })
            })
          swal("Tag deletada com sucesso!", {
            icon: "success",
            dangerMode: true
          }).then((ok) =>{
            if(ok){
               location.reload();
            }
          })
         }
      });
}