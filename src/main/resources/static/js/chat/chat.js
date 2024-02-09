
var stompClient = null;
var socket = new SockJS('/marvin-ws');

socket.addEventListener('close', function (event) {

    Swal.fire({
        title: "servidor offline",
        text: "aguarde",
        showConfirmButton: false,
        icon: "warning"
    });

    setTimeout(function () {
        window.location.reload(true)
    }, 10000);
});

window.addEventListener('load', () => {

    connect_chat();

    setTimeout(() => {
        stompClient.send("/ws/mudar_status_todos_usuario", {}, JSON.stringify({}));
    }, 1500);

    setTimeout(() => {
        pegar_qtd_novas_msg();
        stompClient.send("/ws/carregar_usuarios", {}, JSON.stringify({ 'email': getCookie('usuariomarvin') }));
    }, 2500);

});


//mudar o usuario para online ou offline
$(document).ready(function () {

    $("input[data-bootstrap-switch]").each(function () {
        $(this).bootstrapSwitch('state', $(this).prop('checked'));
        //$(this).bootstrapSwitch('state', !$(this).prop('checked'));
    })

    $('#ck_on_off').on('switchChange.bootstrapSwitch', function (event, state) {

        if (state) {

            $('#nome_usuario_online').css('color', '#006400');

            stompClient.send("/ws/mudar_status_usuario", {}, JSON.stringify({
                'email': getCookie('usuariomarvin'),
                'online': 'sim'
            }));

        } else {

            $('#nome_usuario_online').css('color', '#FF0000');

            stompClient.send("/ws/mudar_status_usuario", {}, JSON.stringify({
                'email': getCookie('usuariomarvin'),
                'online': 'não'
            }));
        }
    });



    // Event listener para o campo de pesquisa
    $('#txt_pesquisa').on('input', function () {
        // Obtém o valor do campo de pesquisa
        var searchTerm = $(this).val().toLowerCase();

        // Filtra as linhas da tabela com base no termo de pesquisa
        $('#usuarios_chat tbody tr').filter(function () {
            // Oculta ou exibe as linhas com base no termo de pesquisa
            $(this).toggle($(this).text().toLowerCase().indexOf(searchTerm) > -1);
        });
    });


    //enviar msg com enter
    // Obtém o elemento de input pelo ID
    var inputElement = document.getElementById('msg_escrita');

    // Adiciona um ouvinte de evento para a tecla pressionada
    inputElement.addEventListener('keyup', function (event) {
        // Verifica se a tecla pressionada é a tecla ENTER (código 13)
        if (event.keyCode === 13) {
            enviar_msg();
        }
    });
});

function pegar_qtd_novas_msg() {

    var formData = new FormData();
    formData.append("id_u", document.querySelector('#id_user_envia').value);
    fetch('/ps/pegar_qtd_msgs_usuario', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok)
                var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(function (qtd) {
                    document.querySelector('#qtd_novas_msg').innerHTML = qtd.qtd;
                });
            } else {
                console.log("nao veio json..")
            }
        })
}

function connect_chat() {

    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/resposta/carregar_msgs', function (msns) {
            listar_msg(msns.body);
        });

        stompClient.subscribe('/resposta/listar_usuarios', function (usuarios) {
            let lista_usuarios = JSON.parse(usuarios.body);
            listar_usuários(lista_usuarios);
        });

    });
}

function listar_msg(jsonObj) {

    let msns = JSON.parse(jsonObj);

    document.querySelector('#msg_escrita').value = '';

    // Obter IDs dos usuários
    const idUsuarioEnvia = document.querySelector('#id_user_envia').value;
    const idUsuarioRecebe = document.querySelector('#id_user_recebe').value;

    if (
        (msns.id_de == idUsuarioEnvia && msns.id_para == idUsuarioRecebe) ||
        (msns.id_de == idUsuarioRecebe && msns.id_para == idUsuarioEnvia)
    ) {

        if (msns.id_de == idUsuarioEnvia) {
            document.querySelector('#messageList').value = '';
            adicionar_msgs(msns.hora_msg + ' ' + msns.data_msg, "/img/msg_enviada.png", msns.msg, "eu");
        } else {
            adicionar_msgs(msns.hora_msg + ' ' + msns.data_msg, "/img/msg_recebida.png", msns.msg, "ele");
        }
    }
}

function selecionar_usuario(id) {
    //busca os dados do professor para editar
    var formData = new FormData();
    formData.append("id", id);
    fetch('/ps/selecionar_usuario_chat', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok)
                var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(function (usuario_selecionado) {

                    if (usuario_selecionado.online === 'não') {
                        Swal.fire({
                            title: "Usuário offLine?",
                            text: "usuário está offline, seguir mesmo assim ?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes, seguir!"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                confirmar_usuario_selecionado(usuario_selecionado);
                            }
                        });
                    } else {
                        confirmar_usuario_selecionado(usuario_selecionado);
                    }
                });
            }
        })
}

function confirmar_usuario_selecionado(usuario) {

    //esse é um <H6>
    document.querySelector('#nome_user_select_chat').innerHTML = usuario.nome;
    //esse é um <small>
    document.querySelector('#local_user_select_chat').innerHTML = usuario.local;

    document.querySelector('#id_user_recebe').value = usuario.id;

    buscar_msgs_u1_u2(usuario.id, document.querySelector('#id_user_envia').value);


}

function buscar_msgs_u1_u2(id_u1, id_u2) {

    var formData = new FormData();
    formData.append("id_para", document.querySelector('#id_user_envia').value);
    formData.append("id_de", document.querySelector('#id_user_recebe').value);

    fetch('/ps/pegar_msgs_u1_u2', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok)
                var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(function (msns) {

                    // Obtém a referência para o elemento UL com o ID "messageList"
                    var messageList = document.getElementById("messageList");
                    // Remove todos os elementos <li> dentro do elemento UL
                    while (messageList.firstChild) {
                        messageList.removeChild(messageList.firstChild);
                    }
                    for (var i = 0; i < msns.length; i++) {
                        if (msns[i].id_de == document.querySelector('#id_user_envia').value) {
                            adicionar_msgs(msns[i].hora_msg + ' ' + msns[i].data_msg, "/img/msg_enviada.png", msns[i].msg, "eu");
                        } else {
                            adicionar_msgs(msns[i].hora_msg + ' ' + msns[i].data_msg, "/img/msg_recebida.png", msns[i].msg, "ele");
                        }
                    }

                    setTimeout(function () {
                        stompClient.send("/ws/atualizar_notificacao", {}, JSON.stringify({
                            'id_para': document.querySelector('#id_user_envia').value,
                            'id_de': document.querySelector('#id_user_recebe').value
                        }));
                    }, 1000);

                    rolarParaBaixo();
                });
            } else {
                console.log("nao veio json..")
            }
        })

}

// Função para rolar para baixo
function rolarParaBaixo() {
    var chatHistory = document.querySelector('.chat-history');
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function enviar_msg() {

    if (document.querySelector('#id_user_recebe').value > 0 && document.querySelector('#id_user_envia').value > 0) {

        stompClient.send("/ws/enviar_msg", {}, JSON.stringify({

            'id_de': document.querySelector('#id_user_envia').value,
            'id_para': document.querySelector('#id_user_recebe').value,
            'msg': document.querySelector('#msg_escrita').value

        }));

        setTimeout(function () {
            stompClient.send("/ws/atualizar_notificacao", {}, JSON.stringify({
                'id_para': document.querySelector('#id_user_envia').value,
                'id_de': document.querySelector('#id_user_recebe').value
            }));
        }, 1000);
    } else {
        Swal.fire("você não selecionou ninguém para essa conversa!");
    }
}



function adicionar_msgs(time, avatarSrc, text, de) {

    // Criação dos elementos HTML
    var li = document.createElement("li");
    li.className = "clearfix";

    var divMessageData = document.createElement("div");
    if (de === 'eu') {
        divMessageData.className = "message-data text-right";
    } else {
        divMessageData.className = "message-data";
    }
    var spanTime = document.createElement("span");
    spanTime.className = "message-data-time";
    spanTime.textContent = time;

    var imgAvatar = document.createElement("img");
    imgAvatar.src = avatarSrc;

    var divMessage = document.createElement("div");
    if (de === 'eu') {
        divMessage.className = "message other-message float-right";
    } else {
        divMessage.className = "message my-message";
    }

    divMessage.textContent = text;

    // Construção da estrutura
    divMessageData.appendChild(spanTime);
    divMessageData.appendChild(imgAvatar);
    li.appendChild(divMessageData);
    li.appendChild(divMessage);

    // Adição à lista
    document.getElementById("messageList").appendChild(li);
    rolarParaBaixo();
}

function buscar_usuários() {

    fetch('/ps/pegar_msgs_u1_u2', {
        method: 'POST'
    })
        .then(response => {
            if (response.ok)
                var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(function (listaUsuarios) {
                    listar_usuários(listaUsuarios);
                });
            } else {
                console.log("nao veio json..")
            }
        })
}

// Função para preencher a tabela com dados de usuários
async function listar_usuários(listaUsuarios) {
    // Limpar a tabela antes de preenchê-la novamente
    $("#usuarios_chat").html("");

    // Criar elementos da tabela
    var tableHead =
        "<thead>" +
        "<tr>" +
        // Adicione cabeçalhos da tabela aqui, se necessário
        "</tr>" +
        "</thead>";

    var tableBody = "<tbody>";

    // Array para armazenar todas as promessas das requisições fetch
    var fetchPromises = [];

    // Função para processar cada usuário
    function processarUsuario(usuario) {
        const url = '/ps/qtd_msgs_entre_usuarios';
        // Criar um objeto FormData e adicionar os parâmetros necessários
        var formData = new FormData();
        formData.append('para', document.querySelector('#id_user_envia').value);
        formData.append('de', usuario.id);

        // Adicionar a promessa da requisição fetch ao array
        fetchPromises.push(
            fetch(url, {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    var numeroMensagensNaoLidas = data.qtd;

                    // Restante do seu código
                    tableBody += "<tr>" +

                        "<td><i class='far fa-comments'></i><a type='button' onclick='selecionar_usuario(" + usuario.id + ")'>" + usuario.nome + "<small>" + usuario.local + "</small></a>";
                    tableBody += (usuario.online === 'sim') ? "<span class='badge badge-success'>on</span>" : "<span class='badge badge-danger'>off</span>";
                    // Adicionar badge de mensagens não lidas se houver alguma
                    if (numeroMensagensNaoLidas > 0) {
                        tableBody += "<span class='badge badge-danger'>" + numeroMensagensNaoLidas + "</span>";
                    }
                    tableBody += "</td></tr>";
                })
                .catch(error => console.error('Erro na requisição:', error))
        );
    }

    // Processar cada usuário e remove o usuário logado da lista
    for (var i in listaUsuarios) {
        if (listaUsuarios[i].email !== getCookie('usuariomarvin')) {
            processarUsuario(listaUsuarios[i]);
        }
    }

    // Aguardar todas as requisições serem concluídas antes de prosseguir
    await Promise.all(fetchPromises);

    tableBody += "</tbody>";

    // Adicionar elementos à tabela no DOM
    $("#usuarios_chat").append(tableHead);
    $("#usuarios_chat").append(tableBody);
}


function getCookie(k) {
    var cookies = " " + document.cookie;
    var key = " " + k + "=";
    var start = cookies.indexOf(key);

    if (start === -1) return null;

    var pos = start + key.length;
    var last = cookies.indexOf(";", pos);

    if (last !== -1) return cookies.substring(pos, last);

    return cookies.substring(pos);
};

function fechar_chat() {

    stompClient.send("/ws/mudar_status_usuario", {}, JSON.stringify({
        'email': getCookie('usuariomarvin'),
        'online': 'não'
    }));
    $("input[data-bootstrap-switch]").each(function () {
        $(this).bootstrapSwitch('state', !$(this).prop('checked'));
    })
    $('#chatModal').modal('hide');
}

function concordar_termos_lgpd() {
    stompClient.send("/ws/aceitar_lgpd", {}, JSON.stringify({
        'id': document.querySelector("#id_user_lgpd").value
    }));
}

function discordar_termos_lgpd() {
    window.location.replace("/ps/login");
}