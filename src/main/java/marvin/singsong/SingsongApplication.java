package marvin.singsong;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import marvin.singsong.model.UsuarioModel;
import marvin.singsong.repository.UsuarioRepository;

@SpringBootApplication
public class SingsongApplication {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public static void main(String[] args) {
        SpringApplication.run(SingsongApplication.class, args);
    }

    @PostConstruct
    public void init() {
        System.out.println("EXECUTOU O INIT");
        // Verifica se o usuário padrão já existe
        UsuarioModel u = usuarioRepository.checarLoginPadrao();
        if (u == null) {
            // Cria o usuário padrão
            UsuarioModel usuarioPadrao = new UsuarioModel();
            usuarioPadrao.setEmail("admin@admin.com");
            usuarioPadrao.setSenha("123");
            usuarioPadrao.setSit("Ativo");
            usuarioPadrao.setTipo("usuario");
            usuarioPadrao.setNome("userpadrão");
            usuarioRepository.save(usuarioPadrao);
        }
    }
}
