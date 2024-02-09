package marvin.singsong.autenticacao;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class LoginInterceptaAppConfig extends WebMvcConfigurerAdapter {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        registry.addInterceptor(new marvin.singsong.autenticacao.LoginInterceptor())
                .excludePathPatterns(

//                        ROTAS MODULO ADMINISTRADOR
                        "/login",
                        "/checar_login",
                        "/novo_login",


//************************************************************************************************************
//                        ROTAS DE IMPORTAÇÕES
//                        "/image/**",
                        "/adm/status/**",
                        "/img/**",
                        "/css/**",
                        "/js/**",
                        "/favicon.ico",
                        "/js/fontawesome-free/css/**",
                        "/path/to/js.cookie.mjs",
                        "/maxcdn.bootstrapcdn.com/**",
                        "/cdnjs.cloudflare.com/**",
                        "/webjars/**",
                        "/fontawesome.com/**",
                        "/js.nicedit.com/**",
                        "/novo.campoverde.mt.gov.br/**",
                        "/fonts.googleapis.com/**",
                        "/image/icone.png",
                        "/ajax.googleapis.com/**",
                        "/cdnjs.cloudflare.com/**",
                        "/thymeleaf.org",
                        "/www.ultraq.net/thymeleaf/layout",
                        "/unpkg.com/**",
                        "/www.w3.org/1999/xhtml"

                );
    }

}