



window.addEventListener('load', () => {
  listar_prf_ed();

  setTimeout(function () {
  $('#div_edita_prof').css("display", "none")
  }, 2500);

});


function editar_ed(id) {

  var cpf_editado = document.querySelector('#cpf_ed');
  cpf_editado.disabled = true;

  var formData = new FormData();
  formData.append("id", id);
  fetch('/ps/consultar_profissional_ed', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok) {
        var contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json().then(function (profissiol) {

           $('#div_edita_prof').css("display", "block")

            document.querySelector('#id_ed_edita').value = id;
            document.querySelector('#nome_ed').value = profissiol.nome;
            document.querySelector('#cpf_ed').value = profissiol.cpf;
            document.querySelector('#sus_ed').value = profissiol.sus;
            document.querySelector('#tipo_profissional_ed').value = profissiol.funcao;
            document.querySelector('#local_atendimento_ed').value = profissiol.local_atendimento;
            document.querySelector('#local_trabalho_ed').value = profissiol.local_trabalho;
            document.querySelector('#cell_ed').value = profissiol.celular;
            document.querySelector('#endereco_ed').value = profissiol.endereco;
            document.querySelector('#bairro_ed').value = profissiol.bairro;
            document.querySelector('#cidade_ed').value = profissiol.cidade;
          });
        } else {
          asAlertMsg({
            type: "error",
            title: "ERRO...",
            message: "ouve um erro"
          });
        }
      }
    });
}


//function gravar_prof_ed() {
//  var cpf = document.querySelector('#cpf_ed').value;
//
//  if (cpf.length == 14) {
//    var formData = new FormData();
//
//    var id_ed_edita = document.querySelector('#id_ed_edita').value;
//    if (id_ed_edita.length > 0) {
//      formData.append("id", id_ed_edita);
//    }
//    formData.append("nome", document.querySelector('#nome_ed').value);
//    formData.append("cpf", document.querySelector('#cpf_ed').value);
//    formData.append("sus", document.querySelector('#sus_ed').value);
//    formData.append("funcao", document.querySelector('#tipo_profissional_ed').value);
//    formData.append("local_atendimento", document.querySelector('#local_atendimento_ed').value);
//    formData.append("local_trabalho", document.querySelector('#local_trabalho_ed').value);
//    formData.append("celular", document.querySelector('#cell_ed').value);
//    formData.append("endereco", document.querySelector('#endereco_ed').value);
//    formData.append("bairro", document.querySelector('#bairro_ed').value);
//    formData.append("cidade", document.querySelector('#cidade_ed').value);
//
//    fetch('/ps/gravar_profissional_ed', {
//      method: 'POST',
//      body: formData
//    })
//      .then(response => {
//        if (!response.ok) {
//          setTimeout(function () {
//            asAlertMsg({
//              type: "error",
//              title: "ERRO...",
//              message: "profissional não\ngravado !"
//            });
//          }, 5000);
//        } else {
//
//          asAlertMsg({
//            type: "success",
//            title: "Novo Profissional",
//            message: "profissional gravado\ncom sucesso!"
//          });
//          setTimeout(function () {
//            listar_prf_ed();
//          }, 1500);
//        }
//      })
//  } else {
//    asAlertMsg({
//      type: "error",
//      title: "ERRO...",
//      message: "cpf obrigatório\ninválido",
//      timer: 3000,
//    });
//  }
//}

function listar_prf_ed() {

  fetch('/ps/profissionais_ed', {
    method: 'POST'
  })

    .then(response => {
      if (response.ok) {
        var contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json().then(function (profissionais) {
            $("#tabla_profissionais_ed").html("");
            $("#tabla_profissionais_ed").html(
              "<thead>" +
              "   <tr>" +
              "   <th>Nome</th>" +
              "   <th>Cpf</th>" +
              "   <th>Função</th>" +
              "   <th>Local Trabalho</th>" +
              "   <th>Celular</th>" +
              "   <th>status</th>" +
              "   </tr>" +
              "</thead>" +
              "<tbody>" +
              "</tbody>"
            );
            for (var i in profissionais) {
              $("#tabla_profissionais_ed tbody").append("<tr>");
              $("#tabla_profissionais_ed tbody").append("<td>" + profissionais[i].nome + "</td>");
              $("#tabla_profissionais_ed tbody").append("<td>" + profissionais[i].cpf + "</td>");
              $("#tabla_profissionais_ed tbody").append("<td>" + profissionais[i].funcao + "</td>");
              $("#tabla_profissionais_ed tbody").append("<td>" + profissionais[i].local_trabalho + "</td>");
              $("#tabla_profissionais_ed tbody").append("<td>" + profissionais[i].celular + "</td>");
               $("#tabla_profissionais_ed tbody").append("<td>" + profissionais[i].sit+ "</td>");
              $("#tabla_profissionais_ed tbody").append("<td>");
              $("#tabla_profissionais_ed tbody").append("<button type='button' class='btn btn-outline-primary btn-sm' onclick='editar_ed(" + profissionais[i].id + ")'><i class='fas fa-pen'></i></button>");
              $("#tabla_profissionais_ed tbody").append("<button type='button' class='btn btn-outline-success btn-sm' onclick='ativar_prof_ed(" + profissionais[i].id + ")'><i class='far fa-thumbs-up'></i></button>");
              $("#tabla_profissionais_ed tbody").append("<button type='button' class='btn btn-outline-warning btn-sm' onclick='inativar_prof_ed(" + profissionais[i].id + ")'><i class='far fa-thumbs-down'></i></button>");
              $("#tabla_profissionais_ed tbody").append("<button type='button' class='btn btn-outline-danger btn-sm' onclick='excluir_ed(" + profissionais[i].id + ")'><i class='fas fa-trash'></i></button>");
              $("#tabla_profissionais_ed tbody").append("</td>");
              $("#tabla_profissionais_ed tbody").append("</tr>");
            }
          });
        } else {
          console.log("Oops, nao veio JSON!");
        }
      }
    })
}


function excluir_ed(id) {
if(confirm('Excluir o profissional? ')){
  var formData = new FormData();
  formData.append("id", id);
  fetch('/ps/excluir_profissional_ed', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        asAlertMsg({
          type: "error",
          title: "ERRO...",
          message: "profissional não\nexcluído"
        });
      } else {
        asAlertMsg({
          type: "success",
          title: "Profissional",
          message: "profissional excluído\ncom sucesso!"
        });
        setTimeout(function () {
          listar_prf_ed();
        }, 1500);
      }
    })
  }
}

function ativar_prof_ed(id) {
  var formData = new FormData();
  formData.append("id", id);
  fetch('/ps/ativar_prof_ed', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok) {
        setTimeout(function () {
        listar_prf_ed();
        }, 800);
      }
    })
}
function inativar_prof_ed(id) {
  var formData = new FormData();
  formData.append("id", id);
  fetch('/ps/inativar_prof_ed', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok) {
        setTimeout(function () {
        listar_prf_ed();
        }, 800);
      }
    })
}