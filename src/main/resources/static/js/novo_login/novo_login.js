function aceitar_user(id){

Swal.fire({
  title: "Novo Usuário",
  text: "confira se os dados estão corretos e evite acessos indevidos, "+
  "confirma os dados inseridos ?, ",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "sim , confirmo",
  cancelButtonText: "Cancela"
}).then((result) => {
  if (result.isConfirmed) {

    var formData = new FormData();
    formData.append("id", id);

    fetch('/ps/aceitar_novo_login', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("não foi possível gravar local");
            } else {

                asAlertMsg({
                    type: "success",
                    title: "Autorização",
                    message: "Novo Usuário Ativado",
                    button: {
                        text: "sair",
                        bg: "success"
                    }
                });

                iniciarTempo();
            }
        })
  }
});
}

function negar_user(id){

if(confirm('Negar o Pedido de Login ?')){

    var formData = new FormData();
    formData.append("id", id);

    fetch('/ps/negar_novo_login', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("não foi possível gravar local");
            } else {
                asAlertMsg({
                    type: "error",
                    title: "Autorização",
                    message: "Novo Usuário Inativo",
                    button: {
                        text: "sair",
                        bg: "error"
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