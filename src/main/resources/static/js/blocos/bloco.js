

$(document).ready(function () {

  setTimeout(function () {
    carregarBlocos();
  }, 800);

});


async function incluir_bloco() {

  const { value: titulo } = await Swal.fire({
    title: "Título do bloco",
    input: "text",
    inputLabel: "título",
    inputAttributes: {
      maxlength: "50",
      autocapitalize: "off",
      autocorrect: "off"
    }
  });
  if (titulo) {
    var formData = new FormData();
    formData.append("bloco", titulo);
    fetch('/gravar_bloco', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (response.ok) {
          window.location.reload(true);
        } else {
          Swal.fire({
            title: "Novo Bloco",
            text: "houve um erro inesperado " + response.body,
            icon: "question"
          });
        }
      })
  }
}

async function carregarBlocos() {
  try {
    const response = await fetch('/pegar_blocos', {
      method: 'POST'
    });

    if (!response.ok) {
      console.error('Erro ao buscar blocos:', response.statusText);
      return;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      const blocos = await response.json();

      // Limpar o conteúdo anterior
      $('#blocos-container').empty();

      for (const bloco of blocos) {
        // Fazer requisição assíncrona para obter as músicas do bloco
        const musicas = await obterMusicasDoBloco(bloco.id);
        const accordionId = `accordion-${bloco.id}`;
        const collapseId = `collapse-${bloco.id}`;

        // Construir a estrutura HTML para cada bloco
        const cardHtml = `
        <div class="card card-secondary card-outline" id="${accordionId}" style="margin-top:3%;">
            <a style="color:black;" class="d-block w-100" data-toggle="collapse" href="#${collapseId}">
                <div class="card-header">
                    <h4 id="nome_bloco" class="card-title w-100">
                        ${bloco.bloco}
                        <span class="badge badge-secondary">${musicas.length} musicas</span>
                    </h4>
                </div>
            </a>
            <div class="card-header">             
                <div class="card-tools">
                    <button type="button" class="btn btn-outline-secondary btn-sm dropdown-toggle" data-toggle="dropdown"
                        data-offset="-52">
                        <i class="fas fa-music"></i>
                    </button>
                    <div class="dropdown-menu" role="menu">
                        <button style="color:black !important;" type="button" class="btn btn-tool" onclick="adicionar_musica(${bloco.id})">add música
                            <i class="fas fa-plus"></i>
                        </button>
                        <li class="dropdown-divider"></li>
                        <button style="color:black !important;" type="button" class="btn btn-tool" onclick="excluir_bloco(${bloco.id})">del bloco
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div id="${collapseId}" class="collapse" data-parent="#${accordionId}">
                <div class="card-body">
                    <div>${construirListaMusicas(musicas)}</div>
                </div>
            </div>
        </div>  
    `;
        // Adicionar o card ao contêiner
        $('#blocos-container').append(cardHtml);
      }
    } else {
      console.error('Resposta não é do tipo JSON');
    }
  } catch (error) {
    console.error('Erro ao buscar blocos:', error);
  }
}
function construirListaMusicas(musicas) {
  let tabelaHtml = '<div class="row"><div class="col-md-12"><table class="table table-striped">';
  tabelaHtml += '<tbody>';

  musicas.forEach(function (musica) {
    tabelaHtml += '<tr>';
    tabelaHtml += `<td style="font-size:22px;">${musica.musica}</td>`;
    tabelaHtml += '<td>';

    tabelaHtml += `<button style="margin-right:3px;" class="btn btn-outline-primary btn-sm" type="button" onclick="ver_letra(${musica.id})"><i class="far fa-file-word"></i></button>`;
    tabelaHtml += `<button style="margin-right:3px;" class="btn btn-outline-warning btn-sm" type="button" onclick="ver_cifra(${musica.id})"><i class="fas fa-guitar"></i></button>`;
    tabelaHtml += `<button class="btn btn-outline-danger btn-sm" type="button" onclick="excluir_musica(${musica.id})" style="margin-right: 3px;"><i class="fas fa-trash"></i></button>`;

    tabelaHtml += '</td>';
    tabelaHtml += '</tr>';
  });

  tabelaHtml += '</tbody></table></div></div>';
  return tabelaHtml;
}

async function ver_cifra(id) {

  var formData = new FormData();
  formData.append("id_musica", id);
  fetch('/ver_cifra', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok)
        var contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then(async function (musica) {
          if (musica.cifra) {
            window.open(musica.cifra, '_blank');
          } else {
            const { value: url } = await Swal.fire({
              input: "url",
              inputLabel: "incluir a cifra",
              inputPlaceholder: "cole o link aqui..."
            });
            if (url) {
              incluir_cifra(musica.id, url);
            }

          }

        })
      }
    });
}

function incluir_letra(id, letra) {

  var formData = new FormData();
  formData.append("id", id);
  formData.append("letra", letra);

  fetch('/incluir_letra', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        window.location.reload(true);
      }
    })

}

function ver_letra(id) {

  var formData = new FormData();
  formData.append("id_musica", id);
  fetch('/ver_letra', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok)
        var contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then(async function (musica) {
          if (musica.letra != null) {
            document.querySelector('#letra_musica').innerText = musica.letra;
            document.querySelector('#id_letra_edita').value = musica.id;
            $("#letra").modal({
              show: true
            });
          } else {
            const { value: letra } = await Swal.fire({
              input: "textarea",
              inputLabel: "incluir a letra",
              inputPlaceholder: "cole a letra aqui..."
            });
            if (letra) {
              incluir_letra(musica.id, letra);
            }

          }

        })
      } else {
        console.log('carai mano');
      }
    });
}

function incluir_cifra(id, url) {

  var formData = new FormData();
  formData.append("id", id);
  formData.append("cifra", url);

  fetch('/incluir_cifra', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        window.location.reload(true);
      }
    })

}

function construirListaMusicas_bkp(musicas) {
  let listaHtml = '<div class="row"><div class="col-md-6"><ul>';

  musicas.forEach(function (musica, index) {
    if (index < Math.ceil(musicas.length / 2)) {
      // Primeira coluna
      listaHtml += `<li>${musica.musica + '  '}<a style="color:#FF4500;" type="button" onclick="excluir_musica(${musica.id})"><img src="/img/lixeira.png" width="30px" height="30px"></a><a style="color:#FF4500;" type="button" onclick="excluir_musica(${musica.id})"><img src="/img/cifra.png" width="40px" height="40px"></a></li>`;
    }
  });

  listaHtml += '</ul></div><div class="col-md-6"><ul>';

  musicas.forEach(function (musica, index) {
    if (index >= Math.ceil(musicas.length / 2)) {
      // Segunda coluna
      listaHtml += `<li>${musica.musica + '  '}<a style="color:#FF4500;" type="button" onclick="excluir_musica(${musica.id})"><img src="/img/lixeira.png" width="20px" height="20px"></a></li>`;
    }
  });

  listaHtml += '</ul></div></div>';
  return listaHtml;
}
//  function construirListaMusicas(musicas) {
//    let listaHtml = '<ul>';
//    musicas.forEach(function(musica) {
//      listaHtml += `<div class="col-12"><li>${musica.musica}<a style="color:#FF4500;"type="button" onclick="excluir_musuca(${musica.id})">X</a></li></div>`;
//    });
//    listaHtml += '</ul>';
//    return listaHtml;
//  }

async function obterMusicasDoBloco(idBloco) {
  try {
    const response = await fetch(`/pegar_musicas/${idBloco}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Erro ao obter músicas do bloco ${idBloco}:`, response.statusText);
      return [];
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      const musicas = await response.json();
      return musicas;
    } else {
      console.error(`Resposta para músicas do bloco ${idBloco} não é do tipo JSON`);
      return [];
    }
  } catch (error) {
    console.error(`Erro ao obter músicas do bloco ${idBloco}:`, error);
    return [];
  }
}
async function adicionar_musica2(id_bloco) {

  const { value: musica } = await Swal.fire({
    title: "adicionar musica",
    input: "text",
    inputLabel: "musica",
    inputAttributes: {
      maxlength: "50",
      autocapitalize: "off",
      autocorrect: "off"
    }
  });
  if (musica) {
    var formData = new FormData();
    formData.append("id_bloco", id_bloco);
    formData.append("musica", musica);
    fetch('/incluir_musica', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (response.ok) {
          window.location.reload(true);
        } else {
          window.location.reload(true);
        }
      })
  }
}

async function adicionar_musica(id_bloco) {

  $('#modal_calendario_letivo').modal('hide');

  const { value: formValues } = await Swal.fire({
    title: 'Incluir Música',
    html:
      '<input id="musica" type="text" class="form-control" placeholder="música">' +
      '<input id="cifra" type="text" class="form-control" placeholder="link da cifra">',
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById('musica').value,
        document.getElementById('cifra').value
      ];
    }
  });

  if (formValues) {
    const [musica, cifra] = formValues;

    if (!musica) {
      Swal.fire({
        title: 'Erro',
        text: 'informe o nome da musica',
        icon: 'error'
      });
      return;
    }

    const formData = new FormData();
    formData.append('id_bloco', id_bloco);
    formData.append('musica', musica);
    formData.append('cifra', cifra);

    try {
      const response = await fetch('/incluir_musica', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const responseData = await response.json();
        Swal.fire({
          title: 'Sucesso',
          text: responseData.message,
          timer: 2000,
          icon: 'success'
        });
        setTimeout(() => {
          window.location.reload(true);
        }, 800);

      } else {
        const errorData = await response.json();
        Swal.fire({
          title: 'Erro',
          text: errorData.message,
          icon: 'error'
        });
      }
    } catch (error) {
      window.location.reload(true);
    }
  }
}

function excluir_musica(id) {

  Swal.fire({
    title: "Remover Música",
    text: "confirma  ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "não",
    confirmButtonText: "sim"
  }).then((result) => {
    if (result.isConfirmed) {

      var formData = new FormData();
      formData.append("id", id);

      fetch('/excluir_musica', {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (!response.ok) {
            asAlertMsg({
              type: "error",
              title: "Evento",
              message: "evento não adicionado",
              button: {
                text: "sair",
                bg: "error"
              }
            });
          } else {
            $('#event_entry_modal').modal('hide');
            setTimeout(function () {
              window.location.reload(true);
            }, 300);

          }
        })

    }
  });
}
function excluir_bloco(id) {
  Swal.fire({
    title: "Remover bloco?",
    text: "confirma  ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "não",
    confirmButtonText: "sim"
  }).then((result) => {
    if (result.isConfirmed) {

      var formData = new FormData();
      formData.append("id", id);

      fetch('/excluir_bloco', {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (!response.ok) {
            asAlertMsg({
              type: "error",
              title: "Evento",
              message: "evento não adicionado",
              button: {
                text: "sair",
                bg: "error"
              }
            });
          } else {
            $('#event_entry_modal').modal('hide');
            setTimeout(function () {
              window.location.reload(true);
            }, 300);

          }
        })

    }
  });
}
function editar_letra() {
  Swal.fire({
    title: "Editar",
    text: "Confirma edição?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim"
  }).then((result) => {
    if (result.isConfirmed) {

      $('#letra').modal('hide');

      const formData = new FormData();
      formData.append("id_musica", document.querySelector('#id_letra_edita').value);

      fetch('/ver_letra', {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Erro ao buscar a letra.");
          }
          return response.json();
        })
        .then(async (musica) => {
          // Exibindo a letra atual no textarea
          const { value: novaLetra } = await Swal.fire({
            title: "Editar",
            input: "textarea",
            inputValue: musica.letra,
            showCancelButton: true,
            confirmButtonText: "Salvar",
            cancelButtonText: "Cancelar",
            customClass: {
              popup: 'swal-wide' // Classe personalizada para largura maior
            }
          });

          if (novaLetra !== undefined) {
            // Confirmar e enviar a nova letra ao servidor
            Swal.fire({
              title: "Salvar alterações?",
              text: "Deseja enviar as alterações para o servidor?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Sim",
              cancelButtonText: "Não",
            }).then((saveResult) => {
              if (saveResult.isConfirmed) {
                const saveData = new FormData();
                saveData.append("id", document.querySelector('#id_letra_edita').value);
                saveData.append("letra", novaLetra);

                fetch('/incluir_letra', {
                  method: 'POST',
                  body: saveData
                })
                  .then(saveResponse => {
                    if (!saveResponse.ok) {
                      throw new Error("Erro ao salvar a letra.");
                    } else {
                      Swal.fire("Sucesso", "A letra foi salva com sucesso!", "success");
                    }
                  });
              }
            })
              .catch(error => {
                console.error(error);
                Swal.fire("Erro", "Não foi possível carregar a letra.", "error");
              });
          }
        });
    }
  });
}
