/**
 * AdminLTE Demo Menu
 * ------------------
 * You should not use this file in production.
 * This file is for demo purposes only.
 */

/* eslint-disable camelcase */

(function ($) {
  'use strict'

    setTimeout(function () {

        var alunos_pendentes = '';

        if (window.___browserSync___ === undefined && Number(localStorage.getItem('info_solicita')) < Date.now()) {
            localStorage.setItem('info_solicita', (Date.now()) + (1 * 60 * 12000))

            Swal.fire({
                title: "houve mudanças nesta tela, agora você vai visualizar apenas as demandas que foram solicitadas para o tipo de "+
                "atendimento que você executa ou as demandas solicitadas diretamente para você !",
                width: 600,
                padding: "3em",
                color: "#716add",
                background: "#FFF0F5",
            });
        }
    }, 1000)
})(jQuery)

