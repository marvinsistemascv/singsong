package marvin.singsong.controller;

import marvin.singsong.model.MusicaModel;
import marvin.singsong.repository.MusicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class MusicaController {

    @Autowired
    MusicaRepository musicaRepository;

    @PostMapping("/pegar_musicas/{id_bloco}")
    @ResponseBody
    public List<MusicaModel> pegar_musicas(@PathVariable("id_bloco") Integer id_bloco) {
        return musicaRepository.pegar_musicas_bloco(id_bloco);
    }

    @PostMapping("/pegar_musica_id")
    @ResponseBody
    public MusicaModel pegar_musica_id(Integer id_mudica) {
        return musicaRepository.pegar_musica_id(id_mudica);
    }

    @PostMapping("/incluir_musica")
    @ResponseBody
    public ResponseEntity<Void> incluir_musica(MusicaModel m) {
        musicaRepository.save(m);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/excluir_musica")
    @ResponseBody
    public ResponseEntity<Void> excluir_musica(Integer id) {
        musicaRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
