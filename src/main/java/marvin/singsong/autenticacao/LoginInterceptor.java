package marvin.singsong.autenticacao;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class LoginInterceptor implements HandlerInterceptor {
    //    Object handler
    @Override
    public boolean preHandle
    (HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        if (CookieService.getCookie(request, "marvincantor") != null) {
            return true;

        } else {
            response.sendRedirect("/login");
            return false;
        }
    }

    @Override
    public void postHandle
            (HttpServletRequest request, HttpServletResponse response, Object
                    handler, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion
            (HttpServletRequest request, HttpServletResponse response, Object
                    handler, Exception exception) throws Exception {


    }
}