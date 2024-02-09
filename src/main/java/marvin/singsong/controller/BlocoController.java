package marvin.singsong.controller;

import marvin.singsong.model.BlocoModel;
import marvin.singsong.repository.BlocoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.Mapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class BlocoController {

    @Autowired
    BlocoRepository blocoRepository;

    @PostMapping("/gravar_bloco")
    @ResponseBody
    public ResponseEntity<Void> gravar_bloco(BlocoModel b) {
        System.out.println("pegadno blocos...");
        blocoRepository.save(b);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/pegar_blocos")
    @ResponseBody
    public List<BlocoModel> pegar_blocos() {
        return blocoRepository.pegar_blocos();
    }

    @PostMapping("/excluir_bloco")
    @ResponseBody
    public ResponseEntity<Void> excluir_bloco(Integer id) {
        blocoRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
