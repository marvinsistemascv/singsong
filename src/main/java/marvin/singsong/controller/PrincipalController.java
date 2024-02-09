package marvin.singsong.controller;

import marvin.singsong.autenticacao.CookieService;
import marvin.singsong.model.UsuarioModel;
import marvin.singsong.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
public class PrincipalController {
    @Autowired
    UsuarioRepository usuarioRepository;

    @GetMapping("/home")
    public ModelAndView abrir_home(HttpServletRequest request) {
        ModelAndView mv = new ModelAndView("home");
        UsuarioModel usuario = usuarioRepository.pegarUsuariosEmail(CookieService.getCookie(request, "marvincantor"));


        return mv;
    }
}
