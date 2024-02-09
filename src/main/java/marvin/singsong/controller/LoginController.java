package marvin.singsong.controller;

import marvin.singsong.autenticacao.CookieService;
import marvin.singsong.model.UsuarioModel;
import marvin.singsong.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
public class LoginController {

    @Autowired
    UsuarioRepository usuarioRepository;

    @GetMapping("/login")
    public ModelAndView abrir_login() {
        ModelAndView mv = new ModelAndView("login");
        return mv;
    }

    @PostMapping("/checar_login")
    @ResponseBody
    public ResponseEntity<Void> checar_login(UsuarioModel u, HttpServletResponse response) {
        UsuarioModel usuario = usuarioRepository.checarLogin(u.getEmail(), u.getSenha());
        if (usuario != null) {
            try {
                CookieService.setCookie(response, "marvincantor", usuario.getEmail(), (60 * 60 * 60));
            } catch (IOException e) {
                e.printStackTrace();
            }
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}

