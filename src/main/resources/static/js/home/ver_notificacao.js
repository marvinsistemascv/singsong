function ver_notificacao(id) {

    var formData = new FormData();
    formData.append("id", id);
    fetch('/ps/consultar_acompanhamento', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                var contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json().then(function (acomp) {

                        document.querySelector('#id_acomp_muda_not').value = acomp.id;

                        if(acomp.tratativa == null){
                        acomp.tratativa = 'a tratativa ainda não foi incluída';
                        }
                        if(acomp.devolutiva == null){
                        acomp.devolutiva = 'a devolutiva ainda não foi incluída';
                        }

                        //document.querySelector('#trtativa_not').innerHTML = acomp.tratativa;
                        $('#txt_devolutiva').summernote('code', "<img src='/img/logo_cv.jpg' width='100%' height='10%'><br>"+'<br>ALUNO:<br>'+acomp.nome_aluno + '<br>-TRATAIVA-<br>' + acomp.tratativa + '<br>-DEVOLUTIVA-<br>' + acomp.devolutiva);

                        //document.querySelector('#devolutiva_not').innerHTML = acomp.devolutiva;

                        $("#notificacao_modal").modal({
                            show: true
                        });
                    });
                } else {
                    console.log("Oops, nao veio JSON!");
                }
            }
        })
}

function confirmar_recebimento_notificacao() {

    if (confirm('Confirmar a leitrura da notificação ?')) {
        var formData = new FormData();
        formData.append("id", document.querySelector('#id_acomp_muda_not').value);
        fetch('/ps/retirar_notificacao_acompanhamento', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    setTimeout(function () {
                        window.location.reload(true)
                    }, 1500);

                } else {

                }
            })
    }
}