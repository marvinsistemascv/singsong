$(document).ready(function () {
  setTimeout(function () {
    carregar_agendamentos();
    pegar_resumo_valores();
  }, 800);
    setTimeout(function () {
      pegar_resumo_valores();
    }, 950);
}); //end document.ready block

function carregar_agendamentos() {
  //busca os dados do professor para editar

    // Obtendo referência do calendário
    var calendar = $('#calendario');

    // Destruindo o calendário existente, se houver
    if (calendar && calendar.fullCalendar) {
      calendar.fullCalendar('destroy');
    }

  var formData = new FormData();
  fetch('/pegar_agendamentos', {
    method: 'POST'
  })
    .then(response => {
      if (response.ok)
        var contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then(function (result) {

          var events = new Array();
          $.each(result, function (i, item) {

            events.push({
              event_id: result[i].id,
              title: result[i].local_evt,
              start: result[i].data_evt,
              end: result[i].data_evt,
              cache: result[i].cache,
              sit: result[i].sit,
              color: result[i].cor_evt,
              allDay: true
            });
          })
            calendar = $('#calendario').fullCalendar({
            defaultView: 'month',
            timeZone: 'local',
            editable: false,
            selectable: true,
            selectHelper: true,
            dayNames: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro',
              'Outubro', 'Novembro', 'Dezembro'
            ],
            showNonCurrentDates: true,
            select: async function (start, end) {

              var options = { day: 'numeric', month: 'numeric', year: 'numeric', };
              const data_evt = new Date(end);
              adicionar_agenda(data_evt);
            },
            events: events,
            eventRender: function (event, element, view) {

              element.bind('click', function () {
                  if(event.sit == 'agendado'){
                  ver_detalhes_evt(event);
                  }else{
                 const Toast = Swal.mixin({
                   toast: true,
                   position: "top-end",
                   showConfirmButton: false,
                   timer: 3000,
                   timerProgressBar: true,
                   didOpen: (toast) => {
                     toast.onmouseenter = Swal.stopTimer;
                     toast.onmouseleave = Swal.resumeTimer;
                   }
                 });
                 Toast.fire({
                   icon: "warning",
                   title: "evento encerrado"
                 });
                  }
              });
            }
          }); //end fullCalendar block
          // Parte para ajustar o tamanho da fonte dos nomes dos meses
          calendar.fullCalendar('option', {
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro',
              'Outubro', 'Novembro', 'Dezembro'
            ],
            monthNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            monthNameFormat: 'MMMM YYYY'
          });
          // CSS para definir o tamanho da fonte dos nomes dos meses
          $('.fc-toolbar h2').css('font-size', '14px');
          // CSS para definir o tamanho da fonte dos botões de navegação
          $('.fc-button').css('font-size', '9px');
          // CSS para definir o tamanho da fonte dos números dos dias
          $('.fc-day-number').css('font-size', '12px');
          // CSS para definir o tamanho da fonte diretamente no JavaScript
          $('.fc-month-view .fc-day-header.fc-widget-header').css('font-size', '14px'); // Ajuste o tamanho da fonte conforme necessário
        });
      } else {
        console.log("Oops, nao veio JSON!");
      }

    })
    pegar_resumo_valores();
}

function formatarData(timestamp) {
  const data = new Date(timestamp);
  const dia = String(data.getDate()+1).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // Lembrando que os meses são base 0, então é necessário adicionar 1.
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

async function ver_detalhes_evt(evento) {

  console.log(evento)
  var data_formatada = formatarData(evento.start);
  var valor_cache = evento.cache.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  await Swal.fire({

    title: evento.title,
    html: `
          <p>${data_formatada}</p>
          <p>${'cachê : ' + valor_cache}</p>
        `,
    showCancelButton: true,
    showDenyButton: true,
    denyButtonText: 'cancelado',
    denyButtonColor: '#FF6347',
    confirmButtonText: 'feito',
    confirmButtonColor: '#228B22',
    cancelButtonText: 'voltar',
    focusConfirm: false,
  }).then((result) => {
    if (result.isConfirmed) {
      concluir_evento(evento.event_id);
    } else if (result.isDenied) {
      cancelar_evento(evento.event_id);
    }
  });
}

function concluir_evento(id) {

  Swal.fire({
    title: "Evento",
    text: "o evento ja foi realizado?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "não",
    confirmButtonText: "sim"
  }).then((result) => {
    if (result.isConfirmed) {

      const formData = new FormData();
      formData.append('id', id);

      fetch('/concluir_evento', {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (response.ok) {
            setTimeout(() => {
              carregar_agendamentos();
            }, 800);
          }
        });
    }
  });
}

function cancelar_evento(id) {
  Swal.fire({
    title: "Evento",
    text: "o evento foi cancelado?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "não",
    confirmButtonText: "sim"
  }).then((result) => {
    if (result.isConfirmed) {

      const formData = new FormData();
      formData.append('id', id);

      fetch('/cancelar_evento', {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (response.ok) {
            setTimeout(() => {
              carregar_agendamentos();
            }, 800);
          }
        });
    }
  });
}

async function adicionar_agenda(data_evt) {

  $('#agenda').modal('hide');

  //formatar a data do evendo para melhor visualização
  var options = { day: 'numeric', month: 'numeric', year: 'numeric', };
  const data_evt_formatada = new Date(data_evt);
  var dta = data_evt_formatada.toLocaleDateString('UTC', options);

  const { value: formValues } = await Swal.fire({
    title: 'Nova Agenda para : ' + dta,
    html:
      '<div class="form-group">' +
      '<input id="local" type="text" class="form-control" placeholder="local do show">' +
      '<input id="cache" type="number" class="form-control" placeholder="valor do cachê">' +
      '</div>',
    focusConfirm: false,
    preConfirm: () => {
      return [
        data_evt,
        document.getElementById('local').value,
        document.getElementById('cache').value
      ];
    }
  });

  if (formValues) {
    const [data_evt, local, cache] = formValues;

    if (!local) {
      Swal.fire({
        title: 'Erro',
        text: 'informe o local',
        icon: 'error'
      });
      return;
    }

    const formData = new FormData();
    formData.append('data_evt', data_evt);
    formData.append('local_evt', local);
    formData.append('cache', cache);

    try {
      const response = await fetch('/grava_agenda', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const responseData = await response.json();
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "evento adicionado"
        });
        setTimeout(() => {
          carregar_agendamentos();
          $('#agenda').modal('show');
        }, 500);
        setTimeout(() => {
          $('#agenda').modal('show');
        }, 700);

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

function pegar_resumo_valores() {

  fetch('/pegar_resumo_financeiro', {
    method: 'POST'
  })
    .then(response => {
      if (response.ok)

        var contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then(function (resumo) {

           const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

          document.querySelector('#recebido').innerHTML = 'recebido :' + formatoMoeda.format(resumo.recebido);
          document.querySelector('#receber').innerHTML = 'à receber :' + formatoMoeda.format(resumo.receber);

        });
      }
    })
}