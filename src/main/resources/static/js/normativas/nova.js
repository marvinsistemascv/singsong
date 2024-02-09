

function gravar_normativa() {

    var formData = new FormData();

    if(document.querySelector('#titulo').value.length > 0){
      formData.append("id", document.querySelector('#id_normativa_edita').value);
    }

    formData.append("titulo", document.querySelector('#titulo').value);
    formData.append("texto", document.querySelector('#texto_normativa').value);
    fetch('/ps/gravar_normativa', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok)
                var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(function (normativa) {
                  setTimeout(function () {
                   window.location.reload(true);
                  }, 2000);

                    Swal.fire({
                        tittle: normativa.titulo,
                        text: "gravada",
                        icon: "success"
                    });

                });
            } else {
                console.log("Oops, nao veio JSON!");
            }
        })
}

function editar_normativa(id) {
    var formData = new FormData();

    formData.append("id", id);

    fetch('/ps/consultar_normativa', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok)
                var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(function (normativa) {

                    document.querySelector('#id_normativa_edita').value = normativa.id;
                    document.querySelector('#titulo').value = normativa.titulo;
                    $('#texto_normativa').summernote('code', normativa.texto);

                });

            } else {
                console.log("Oops, nao veio JSON!");
            }
        })
}
function excluir_normativa(id) {
    Swal.fire({
        title: "Excluir normativa",
        text: "tem certeza que deseja excluir a normativa ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "sim, excluir"
    }).then((result) => {
        if (result.isConfirmed) {
            var formData = new FormData();

            formData.append("id", id);

            fetch('/ps/excluir_normativa', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        setTimeout(function () {
                            window.location.reload(true);
                        }, 2000);
                        Swal.fire({
                            icon: "success",
                            title: "excluir normativa",
                            text: "normativa excluída !"
                        });
                    }
                })
        }
    });
}
