package marvin.singsong.autenticacao;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;


public class CookieService {

    public static void setCookie(HttpServletResponse response, String key, String valor, int tempo) throws IOException {

        Cookie cookie = new Cookie(key, valor);
        cookie.setMaxAge(tempo);
        response.addCookie(cookie);
    }

    public static String getCookie(HttpServletRequest request, String key) {

        return Optional.ofNullable(request.getCookies())
                .flatMap(cookies -> Arrays.stream(cookies)
                        .filter(cookie -> key.equals(cookie.getName()))
                        .findAny()
                ).map(e -> e.getValue())
                .orElse(null);
    }

}

















