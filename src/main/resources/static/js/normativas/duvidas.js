async function enviar_pergunta(){
const { value: text } = await Swal.fire({
  input: "textarea",
  inputLabel: "Dúvidas/Sugestões",
  inputPlaceholder: "descreva aqui...",
  inputAttributes: {
    "aria-label": "descreva aqui..."
  },
  showCancelButton: true
});
if (text) {
    var formData = new FormData();

    formData.append("user_mandou", getCookie('usuariomarvin'));
    formData.append("duvida", text);

    fetch('/ps/gravar_duvida', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                console.log('erro na intercorrencia');
            } else {

                Swal.fire({
                    icon: "success",
                    title: "agradecemos pelo seu contato, em breve você será respondido por um colaborador da equipe",
                    showConfirmButton: false
                });

                setTimeout(function () {
                  window.location.reload(true);
                }, 5000);
            }
        })
}
}

async function responder_duvida(id) {
    Swal.fire({
        title: "Responder a Dúvida/Sugestão",
        text: "Você vai responder a dúvida?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, responder"
    }).then(async (result) => {  // Adicione 'async' aqui
        if (result.isConfirmed) {

            //fecha o modal com as duvidas
            $('#duvidas').modal('hide');

            // Busca os dados da dúvida para editar
            var formData = new FormData();
            formData.append("id", id);

            try {
                const response = await fetch('/ps/consultar_duvida', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const contentType = response.headers.get("content-type");

                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        const duvida = await response.json();

                        const { value: text } = await Swal.fire({
                            input: "textarea",
                            inputLabel: duvida.duvida,
                            width: '400px',  // Defina a largura desejada
                            inputPlaceholder: "Responda aqui...",
                            confirmButtonText: "responder",
                            cancelButtonText: "cancelar",
                            inputAttributes: {
                                "aria-label": "Responda aqui..."
                            },
                            showCancelButton: true
                        });

                        if (text) {
                            //envia a resposta ao endpoint
                            Swal.fire(text);
                            //busca os dados do professor para editar
                            var formData = new FormData();
                            formData.append("id", id);
                            formData.append("user_respondeu", getCookie('usuariomarvin'));
                            formData.append("resposta", text);
                            fetch('/ps/responder_duvida', {
                                method: 'POST',
                                body: formData
                            })
                                .then(response => {
                                    if (response.ok) {
                                        setTimeout(function () {
                                            window.location.reload(true);
                                        }, 5000);

                                        Swal.fire({
                                            title: "Resposta",
                                            text: "sua resposta foi enviada !",
                                            icon: "success"
                                        });
                                    }
                                })
                        }
                    } else {
                        console.log("Oops, não veio JSON!");
                    }
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
            }
        }
    });
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