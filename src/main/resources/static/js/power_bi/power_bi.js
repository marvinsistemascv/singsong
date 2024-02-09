
var barChart = null;
var barChart2 = null;

  $(function () {
    //Initialize Select2 Elements
    $('.select2').select2()
    })


function filtrar_local(local){
grafico_local(local);
}

function filtrar_ps(ps){
document.querySelector('#nome_ps_filtro').innerText = ps;
filtrar_atendimentos(ps);
}

function grafico_local(local) {

    document.querySelector('#local_filtro').innerText = local;

    var formData = new FormData();
    formData.append("ps", document.querySelector('#filtro_ps').value);
    formData.append("ano", document.querySelector('#txt_ano').value);
    formData.append("local", local);

    // Verifica se já existe um gráfico e o destrói
    var graficoExistente = $('#barChartLocais').data('chart');
    if (graficoExistente) {
        graficoExistente.destroy();
    }

    fetch('/ps/pegar_atendimentos_ps_local', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                var contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json().then(function (lista) {

                        var data = lista.map(item => item.quantidade);

                        var areaChartData = {
                            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                            datasets: [
                                {
                                    label: 'total de atendiemtnos',
                                    backgroundColor: '#f56954',
                                    borderColor: '#9400D3',
                                    pointRadius: false,
                                    pointColor: '#f56954',
                                    pointStrokeColor: 'rgba(60,141,188,1)',
                                    pointHighlightFill: '#FFFFFF',
                                    pointHighlightStroke: 'rgba(60,141,188,1)',
                                    data: data
                                }
                            ]
                        }

                        var barChartCanvas = $('#barChartLocais').get(0).getContext('2d')
                        var barChartData = $.extend(true, {}, areaChartData)

                        var temp0 = areaChartData.datasets[0]
                        barChartData.datasets[0] = temp0

                        var barChartOptions = {
                            responsive: true,
                            maintainAspectRatio: false,
                            datasetFill: false
                        }

                        if (barChart2 !== null) {
                            barChart2.destroy(); // Destruir o gráfico anterior, se existir
                        }

                        barChart2 = new Chart(barChartCanvas, {
                            type: 'bar',
                            data: barChartData,
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                datasetFill: false,
                                animation: {
                                    onComplete: function () {
                                        var chartInstance = this.chart;
                                        var ctx = chartInstance.ctx;
                                        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'bottom';

                                        this.data.datasets.forEach(function (dataset, i) {
                                            var meta = chartInstance.controller.getDatasetMeta(i);
                                            meta.data.forEach(function (bar, index) {
                                                var data = dataset.data[index];
                                                ctx.fillStyle = '#000000'; // Definir a cor para branco
                                                ctx.fillText(data, bar._model.x, bar._model.y - 5);
                                            });
                                        });
                                    }
                                }
                            }
                        });
                    });
                } else {
                    console.log("Oops, não veio JSON!");
                }
            } else {
                console.log("Erro na resposta da requisição.");
            }
        });
}

function graf1(ps) {

    var formData = new FormData();
    formData.append("ps", ps);
    formData.append("ano", document.querySelector('#txt_ano').value);

    // Verifica se já existe um gráfico e o destrói
    var graficoExistente = $('.graf1').data('chart');
    if (graficoExistente) {
        graficoExistente.destroy();
    }

    fetch('/ps/pegar_total_atendimentos_ps', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(function (lista) {
                    var labels = [];
                    var data = [];
                    var backgroundColor = ['#FF1493', '#FF69B4', '#FF0000', '#FF4500', '#FF6347', '#F08080', '#FF7F50', '#FF8C00', '#FFA500', '#FFA07A', '#FFD700', '#6B8E23'];

                    for (var i = 0; i < lista.length; i++) {
                        labels.push(lista[i].mes);
                        data.push(lista[i].quantidade);
                    }

                    var donutChartCanvas = $('.graf1').get(0).getContext('2d');
                    var donutData = {
                        labels: labels,
                        datasets: [
                            {
                                data: data,
                                backgroundColor: backgroundColor,
                            }
                        ]
                    };

                    var donutOptions = {
                        maintainAspectRatio: false,
                        responsive: true,
                    };

                    // Criação do gráfico
                    var donutChart = new Chart(donutChartCanvas, {
                        type: 'doughnut',
                        data: donutData,
                        options: donutOptions
                    });

                    // Armazena o gráfico no elemento DOM para referência futura
                    $('.graf1').data('chart', donutChart);

                });
            } else {
                console.log("Oops, não veio JSON!");
            }
        } else {
            console.log("Erro na resposta da requisição.");
        }
    });
}

function filtrar_atendimentos(ps) {

    if (document.querySelector('#txt_ano').value.length > 0) {
        var formData = new FormData();
        formData.append("ps", ps);
        formData.append("ano", document.querySelector('#txt_ano').value);

        fetch('/ps/pegar_total_atendimentos_ps', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                var contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json().then(function (lista) {

                            if (barChart2 !== null) {
                                var select_ps = document.querySelector('#filtro_local');
                                    select_ps.selectedIndex = 0;
                               barChart2.destroy(); // Destruir o gráfico fr local se existir
                            }

                        var data = lista.map(item => item.quantidade);

                        var areaChartData = {
                            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                            datasets: [
                                {
                                    label: 'Atendimentos',
                                    backgroundColor: '#9400D3',
                                    borderColor: '#9400D3',
                                    pointRadius: false,
                                    pointColor: '#3b8bba',
                                    pointStrokeColor: 'rgba(60,141,188,1)',
                                    pointHighlightFill: '#FFFFFF',
                                    pointHighlightStroke: 'rgba(60,141,188,1)',
                                    data: data
                                }
                            ]
                        }

                        var barChartCanvas = $('#bar_at').get(0).getContext('2d')
                        var barChartData = $.extend(true, {}, areaChartData)

                        var temp0 = areaChartData.datasets[0]
                        barChartData.datasets[0] = temp0

                        var barChartOptions = {
                            responsive: true,
                            maintainAspectRatio: false,
                            datasetFill: false
                        }

                        if (barChart !== null) {
                            barChart.destroy(); // Destruir o gráfico anterior, se existir
                        }

                        barChart = new Chart(barChartCanvas, {
                            type: 'bar',
                            data: barChartData,
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                datasetFill: false,
                                animation: {
                                    onComplete: function () {
                                        var chartInstance = this.chart;
                                        var ctx = chartInstance.ctx;
                                        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'bottom';

                                        this.data.datasets.forEach(function (dataset, i) {
                                            var meta = chartInstance.controller.getDatasetMeta(i);
                                            meta.data.forEach(function (bar, index) {
                                                var data = dataset.data[index];
                                                ctx.fillStyle = '#000000'; // Definir a cor para branco
                                                ctx.fillText(data, bar._model.x, bar._model.y - 5);
                                            });
                                        });
                                    }
                                }
                            }
                        });

                    });
                } else {
                    console.log("Oops, não veio JSON!");
                }
            } else {
                console.log("Erro na resposta da requisição.");
            }
        });
    } else {

        var select_ps = document.querySelector('#filtro_ps');
        select_ps.selectedIndex = 0;

        Swal.fire({
            title: "Filtrar Dados",
            text: "Informe o ano!",
            icon: "warning"
        });
    }
}


//***************impressao******************


function iniciarImpressao() {
    // Chame sua função de geração de gráficos
    gerarGraficos();

    // Defina um intervalo de tempo para aguardar a conclusão da geração dos gráficos
    setTimeout(function () {
        // Inicie a impressão após o atraso
        window.print();
    }, 1000); // Ajuste o tempo conforme necessário
}

function gerarGraficos() {
    // Coloque aqui a lógica para gerar os gráficos usando JavaScript
    // Certifique-se de que os gráficos estejam prontos antes do término do atraso
}