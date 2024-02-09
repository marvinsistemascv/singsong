
function excluirlocal(id) {

    if (confirm('Excluir o Local\nde Atendimento ?')) {
        var formData = new FormData();
        formData.append("id", id);

        fetch('/ps/excluir_local', {
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
                        message: "local excludo",
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

function handleInput(e) {
    var ss = e.target.selectionStart;
    var se = e.target.selectionEnd;
    e.target.value = e.target.value.toUpperCase();
    e.target.selectionStart = ss;
    e.target.selectionEnd = se;
};

function gravar_local_atendimento() {

    var formData = new FormData();
    var local = document.getElementById('local').value;

    formData.append("local", document.getElementById('local').value);

    fetch('/ps/gravar_local', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("não foi possível gravar local");
            } else {
                asAlertMsg({
                    type: "success",
                    title: "Novo Local",
                    message: "Local\n" + local + "\ncadastrado",
                    button: {
                        text: "OK",
                        bg: "success"
                    }
                });
                iniciarTempo();
            }
        })
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


function consultar_aluno_cadastro() {

    var cpf = document.getElementById('cpf').value;

    if (cpf.length == 14) {

                                      var formData = new FormData();
        formData.append("cpf", cpf);
                            fetch('/ps/consultar_aluno_cpf', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok)

                    var contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json().then(function (aluno) {
                        asAlertMsg({
                            type: "error",
                            title: "Novo Aluno",
                            message: "o aluno\n" + aluno.nome + "\njá está cadastrado\nem :"+aluno.local_atendimento,
                            button: {
                                text: "ok",
                                bg: "error"
                            }
                        });
                    });
                } else {
                    gravar_aluno();
                }
            })
            .then();
    } else {
        asAlertMsg({
            type: "error",
            title: "CPF INVÁLIDO",
            message: "insira o cpf correto",
            button: {
                text: "sair",
                bg: "error"
            }
        });
    }
}


function gravar_aluno() {

    if (document.getElementById('nome').value.length > 0 &&
        document.getElementById('cpf').value.length == 14 &&
        document.getElementById('data_nasc').value.length > 0 &&
        document.getElementById('local_atendimento').value.length > 0) {

        var formData = new FormData();
        var aluno = document.getElementById('nome').value;
        formData.append("nome", document.getElementById('nome').value);
        formData.append("cpf", document.getElementById('cpf').value);
        formData.append("data_nasc", document.getElementById('data_nasc').value);
        formData.append("local_atendimento", document.getElementById('local_atendimento').value);
        formData.append("celular", document.getElementById('celular').value);
        formData.append("celular2", document.getElementById('celular2').value);
        formData.append("serie", document.getElementById('serie').value);
        formData.append("turma", document.getElementById('turma').value);
        formData.append("professor", document.getElementById('professor').value);
        formData.append("periodo", document.getElementById('periodo').value);
        formData.append("referencia", document.getElementById('referencia').value);

        formData.append("endereco", document.getElementById('endereco').value);
        formData.append("numero", document.getElementById('numero').value);
        formData.append("bairro", document.getElementById('bairro').value);
        formData.append("cidade", document.getElementById('cidade').value);
        formData.append("uf", document.querySelector('#uf').value);

        fetch('/ps/gravar_aluno', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("não foi possível gravar local");
                } else {
                    asAlertMsg({
                        type: "success",
                        title: "Novo Aluno",
                        message: "Aluno\n" + aluno + "\ncadastrado",
                        button: {
                            text: "OK",
                            bg: "success"
                        }
                    });
                    iniciarTempo();
                }
            })
    } else {
        asAlertMsg({
            type: "error",
            title: "Dados do Aluno",
            message: "dados mínimos não preenchidos\npara gravar novo aluno",
            button: {
                text: "OK",
                bg: "error"
            }
        });
    }
}

$(document).ready(function () {
    $('#tabela_agendamentos').DataTable({
        "responsive": true, "lengthChange": true, "autoWidth": false,
        "buttons": ["print"],
        "language": {
            "search": "Pesquisar",
            "paginate": {
                "first": "",
                "last": "<<",
                "next": ">>",
                "previous": "<<"
            },
            "lengthMenu": "Mostrando _MENU_ registros por página",
            "zeroRecords": "Nada encontrado",
            "info": "Mostrando página _PAGE_ de _PAGES_",
            "infoEmpty": "Nenhum registro disponível",
            "infoFiltered": "(filtrado de _MAX_ registros no total)"
        }
    }).buttons().container().appendTo('#tabela_agendamentos_wrapper .col-md-6:eq(0)');
});

$(document).ready(function () {
    $('#tabela_acompanhamentos').DataTable({
        "responsive": true, "lengthChange": true, "autoWidth": false,
        "buttons": ["print"],
        "language": {
            "search": "Pesquisar",
            "paginate": {
                "first": "",
                "last": "<<",
                "next": ">>",
                "previous": "<<"
            },
            "lengthMenu": "Mostrando _MENU_ registros por página",
            "zeroRecords": "Nada encontrado",
            "info": "Mostrando página _PAGE_ de _PAGES_",
            "infoEmpty": "Nenhum registro disponível",
            "infoFiltered": "(filtrado de _MAX_ registros no total)"
        }
    }).buttons().container().appendTo('#tabela_acompanhamentos_wrapper .col-md-6:eq(0)');
});
