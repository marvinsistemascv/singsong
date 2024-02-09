


//function gravar_ps() {
//
//    var formData = new FormData();
//    var ps = document.getElementById('nome_ps').value;
//
//    formData.append("nome_ps", document.getElementById('nome_ps').value);
//    formData.append("crp", document.getElementById('crp').value);
//    formData.append("tipo_profissional", document.getElementById('tipo_profissional').value);
//    formData.append("cell_ps", document.getElementById('cell_ps').value);
//
//    fetch('/ps/gravar_ps', {
//        method: 'POST',
//        body: formData
//    })
//        .then(response => {
//            if (!response.ok) {
//                throw new Error("não foi possível gravar local");
//            } else {
//                asAlertMsg({
//                    type: "success",
//                    title: "Novo Profissional",
//                    message: "Profissional\n" + ps + "\ncadastrado",
//                    button: {
//                        text: "OK",
//                        bg: "success"
//                    }
//                });
//                iniciarTempo();
//            }
//        })
//}

function excluir_ps(id) {

    if (confirm('Excluir o Profissional ?')) {

        var formData = new FormData();
        var ps = document.getElementById('nome_ps').value;

        formData.append("id", id);

        fetch('/ps/excluir_ps/'+id, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("não foi possível gravar local");
                } else {
                    asAlertMsg({
                        type: "warning",
                        title: "Excluir",
                        message: "Profissional\n" + ps + "\nexcluído",
                        button: {
                            text: "OK",
                            bg: "success"
                        }
                    });
                    iniciarTempo();
                }
            })
    }
}

var temporizador;
function iniciarTempo() {
    temporizador = setInterval(meuTempo, 3000);

}
function meuTempo() {
    window.location.reload(true);
    pararTempo();
}

function pararTempo() {
    clearInterval(temporizador);
}

function ativar_ps(id){

    var formData = new FormData();
    formData.append("id", id);
    fetch('/ps/ativar_ps', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                var contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json().then(function (lista_ps) {
                         listar_ps(lista_ps);
                    });
                } else {
                    console.log("Oops, não veio JSON!");
                }
            } else {
                console.log("Erro na requisição:", response.status);
            }
        })
}

function inativar_ps(id){

    var formData = new FormData();
    formData.append("id", id);
    fetch('/ps/inativar_ps', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                var contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json().then(function (lista_ps) {
                         listar_ps(lista_ps);
                    });
                } else {
                    console.log("Oops, não veio JSON!");
                }
            } else {
                console.log("Erro na requisição:", response.status);
            }
        })
}

function listar_ps(lista_ps){

          $("#tabla_ps").html("");
          $("#tabla_ps").html(
            "<thead>" +
            "   <tr>" +
            "   <th>Nome</th>" +
            "   <th>Cel</th>" +
            "   <th>Reg</th>" +
            "   <th>Status</th>" +
            "   <th>Opções</th>" +
            "   </tr>" +
            "</thead>" +
            "<tbody>" +
            "</tbody>"
          );
          for (var i in lista_ps) {
            $("#tabla_ps tbody").append("<tr>");
            $("#tabla_ps tbody").append("<td>" + lista_ps[i].nome_ps + "</td>");
            $("#tabla_ps tbody").append("<td>" + lista_ps[i].cell_ps + "</td>");
            $("#tabla_ps tbody").append("<td>" + lista_ps[i].crp + "</td>");
            $("#tabla_ps tbody").append("<td>" + lista_ps[i].sit + "</td>");
            $("#tabla_ps tbody").append("<td><button type='button' class='btn btn-outline-success btn-sm' onclick='ativar_ps(" + lista_ps[i].id + ")'><span class='far fa-thumbs-up' title='Ativar' aria-hidden='true'></span></button></td>");
            $("#tabla_ps tbody").append("<td><button type='button' class='btn btn-outline-warning btn-sm' onclick='inativar_ps(" + lista_ps[i].id + ")'><span class='far fa-thumbs-down' title='inativar' aria-hidden='true'></span></button></td>");
            $("#tabla_ps tbody").append("<td><button type='button' class='btn btn-outline-danger btn-sm' onclick='excluir_ps(" + lista_ps[i].id + ")'><span class='fas fa-trash' title='Ativar' aria-hidden='true'></span></button></td>");
            $("#tabla_ps tbody").append("</tr>");
          }
}