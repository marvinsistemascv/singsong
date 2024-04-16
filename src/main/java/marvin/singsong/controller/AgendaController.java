package marvin.singsong.controller;


import marvin.singsong.model.AgendaModel;
import marvin.singsong.model.ResumoFinanceiroModel;
import marvin.singsong.repository.AgendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class AgendaController {

    @Autowired
    AgendaRepository agendaRepository;

    @PostMapping("/grava_agenda")
    @ResponseBody
    public List<AgendaModel> grava_agenda(AgendaModel a) {
        a.setSit("agendado");
        a.setCor_evt("#FF6347");
        agendaRepository.save(a);
        return agendaRepository.pegar_agendamentos();
    }

    @PostMapping("/concluir_evento")
    @ResponseBody
    public ResponseEntity<Void> concluir_agenda(Integer id) {

        AgendaModel a = agendaRepository.pegar_agenda_id(id);
        a.setSit("finalizado");
        a.setCor_evt("#228B22");
        agendaRepository.save(a);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/cancelar_evento")
    @ResponseBody
    public ResponseEntity<Void> cacnelar_agenda(Integer id) {

        AgendaModel a = agendaRepository.pegar_agenda_id(id);
        a.setSit("cancelado");
        a.setCor_evt("#BEBEBE");
        agendaRepository.save(a);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/pegar_agendamentos")
    @ResponseBody
    public List<AgendaModel> grava_agendamentos() {
        return agendaRepository.pegar_agendamentos();
    }

    @PostMapping("/pegar_agenda")
    @ResponseBody
    public AgendaModel pegar_agenda(Integer id) {
        return agendaRepository.pegar_agenda_id(id);
    }

    @PostMapping("/pegar_resumo_financeiro")
    @ResponseBody
    public ResumoFinanceiroModel pegar_resumo_financeiro() {

        ResumoFinanceiroModel resumo = new ResumoFinanceiroModel();
        resumo.setReceber(agendaRepository.pegar_valores_receber());
        resumo.setRecebido(agendaRepository.pegar_valores_recebidos());

        return resumo;
    }
}
