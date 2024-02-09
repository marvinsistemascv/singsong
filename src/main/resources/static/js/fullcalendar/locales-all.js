[].push.apply(FullCalendar.globalLocales, function () {
  'use strict';


  var l0 = {
    code: 'pt-br',
    buttonText: {
      prev: 'Anterior',
      next: 'Próximo',
      month: 'Mês',
    },
    weekText: 'Sm',
    allDayText: 'dia inteiro',
    moreLinkText: function(n) {
      return 'mais +' + n
    },
    noEventsText: 'Não há eventos para mostrar',
  };

  var l1 = {
    code: 'pt',
    week: {
      dow: 1, // Monday is the first day of the week.
      doy: 4, // The week that contains Jan 4th is the first week of the year.
    },
    buttonText: {
      prev: 'Anterior',
      next: 'Seguinte',
       month: 'Mês',
    },
    weekText: 'Sem',
    allDayText: 'Todo o dia',
    moreLinkText: 'mais',
    noEventsText: 'Não há eventos para mostrar',
  };


  var localesAll = [
    l0, l1,
  ];

  return localesAll;

}());
