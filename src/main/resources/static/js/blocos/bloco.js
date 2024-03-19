

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

        // Construir a estrutura HTML para cada bloco
        const cardHtml = `
<div class="card card-danger card-outline">
    <div class="card-header">
        <h5 class="card-title" id="nome_bloco"><b>${bloco.bloco}</b></h5>
        <div class="card-tools">
            <button type="button" class="btn btn-outline-success btn-sm dropdown-toggle" data-toggle="dropdown" data-offset="-52">
                <i class="fas fa-music"></i>
            </button>
            <div class="dropdown-menu" role="menu">
                <button type="button" class="btn btn-tool" onclick="adicionar_musica(${bloco.id})">add música
                    <i class="fas fa-plus"></i>
                </button>
                <li class="dropdown-divider"></li>
                <button type="button" class="btn btn-tool" onclick="excluir_bloco(${bloco.id})">del bloco
                    <i class="fas fa-trash"></i>
                </button>
           </div>
        </div>
    </div>
    <div class="card-body">
        <div>${construirListaMusicas(musicas)}</div>
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
  let tabelaHtml = '<div class="row"><div class="col-md-12"><table class="table">';
  tabelaHtml += '<tbody>';

  musicas.forEach(function (musica) {
    tabelaHtml += '<tr>';
    tabelaHtml += `<td>${musica.musica}</td>`;
    tabelaHtml += '<td>';
    tabelaHtml += `<button class="btn btn-outline-danger btn-sm" type="button" onclick="excluir_musica(${musica.id})" style="margin-right: 10px;"><i class="fas fa-trash"></i></button>`;
    tabelaHtml += `<button class="btn btn-outline-warning btn-sm" type="button" onclick="ver_cifra(${musica.id})"><i class="fas fa-guitar"></i></button>`;
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
          Swal.fire({
            title: "Novo Bloco",
            text: "houve um erro inesperado " + response.body,
            icon: "question"
          });
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
      Swal.fire({
        title: 'Erro',
        text: 'Falha ao enviar a solicitação para o servidor. ' + error,
        icon: 'error'
      });
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