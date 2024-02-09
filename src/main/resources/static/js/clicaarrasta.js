function parseNumber(num) {
    return parseFloat(num.replace(/[^\d]/)) || 0;
}

var movePopUp = (function() {

    var startX;
    var startY;

    var currentPopUp = null;
    var currentWidth = 0;
    var currentHeight = 0;
    var currentLeft = 0;
    var currentTop = 0;
    var callMoveOnPopUp = null;
    var callMoveStopPopUp = null;

    var contentMove = '.popup .title';
    var move = false;

    var marginStop = 30;
    var maxWidth = window.innerWidth - marginStop;
    var maxHeight = window.innerHeight - marginStop;

    jQuery(contentMove).on('mousedown', function(e) {
        currentPopUp = this.parentNode.parentNode;
        currentLeft = parseNumber(currentPopUp.style.left);
        currentTop = parseNumber(currentPopUp.style.top);

        startX = e.clientX;
        startY = e.clientY;
        if (typeof(callMoveOnPopUp) == 'function')
            callMoveOnPopUp(currentPopUp);
        move = true;
    });

    jQuery(document).on('mouseup', function() {
        if (currentPopUp == null) return;
        if (typeof(callMoveStopPopUp) == 'function')
            callMoveStopPopUp(currentPopUp);
        currentPopUp = null;
        move = false;
    })

    jQuery(document).on('mousemove', function(e) {
        if (move == true) {
            var newX = currentLeft + e.clientX - startX;
            var newY = currentTop + e.clientY - startY;

            if (marginStop > e.clientX) return;
            if (marginStop > e.clientY) return;
            if (maxWidth < e.clientX) return;
            if (maxHeight < e.clientY) return;

            jQuery(currentPopUp).css({
                'left': newX,
                'top': newY,
            });
        }
    });

    return function(func1, func2) {
        callMoveOnPopUp = func1;
        callMoveStopPopUp = func2;
    }
})();

const txtArea = document.getElementById('txt_anotacao');
txtArea.addEventListener('keydown', (event) => {
    if(event.keyCode == 13) {
    salvar_lembrete();
    }
});
function salvar_lembrete(){

    var formData = new FormData();
    formData.append("lembrete", document.querySelector("#txt_anotacao").value);
    formData.append("usuario", getCookie('usuariomarvin'));
    fetch('/ps/salvar_lembrete', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok)

                var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(function (lembrete) {
                   document.querySelector("#txt_anotacao").value = '';
                   document.querySelector("#txt_anotacao").value = lembrete.lembrete+'\n';
                });
            } else {
                console.log("Oops, nao veio JSON!");
            }
        })
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