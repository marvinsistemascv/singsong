package marvin.singsong;

import java.io.File;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import marvin.singsong.model.UsuarioModel;
import marvin.singsong.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
@EnableScheduling
public class SingsongApplication {
    @Autowired
    private UsuarioRepository usuarioRepository;
    private static final Logger LOGGER = LoggerFactory.getLogger(SingsongApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(SingsongApplication.class, args);
    }

    @PostConstruct
    public void init() {
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
        realizarBackupAutomatico();
    }

    @Scheduled(cron = "0 0 19 * * *")
    public void realizarBackupAutomatico() {

        String arquivo = null;
        arquivo = "SEU_LOCAL_DE_BKP/backup.sql";
        try {
            File file = new File(arquivo);

            if (file.exists()) {

                Runtime bck = Runtime.getRuntime();
                bck.exec("C:/Program Files/MySQL/MySQL Server 8.0/bin/mysqldump.exe -v -v -v --host=localhost "
                        + "--user=root --password=SUA_SENHA --port=3306 --protocol=tcp --force --allow-keywords --compress  "
                        + "--add-drop-table --default-character-set=latin1 --hex-blob  --result-file=" + arquivo
                        + " --databases marvin_singsong");

            } else {

                Runtime bck = Runtime.getRuntime();
                bck.exec("C:/Program Files/MySQL/MySQL Server 8.0/bin/mysqldump.exe -v -v -v --host=localhost " +
                        "--user=root --password=SUA_SENHA --port=3306 --protocol=tcp --force --allow-keywords --compress  " +
                        "--add-drop-table --default-character-set=latin1 --hex-blob  --result-file=" + arquivo
                        + " --databases marvin_singsong");
            }
            LOGGER.info("========= BKP Automatico Realizado com Sucesso =========== " + arquivo);
        } catch (Exception e) {
            LOGGER.info("==========BKP Automatico NÃO Realizado ==============" + e);
        }
    }
}
