package applica._APPNAME_.admin.controllers;

import applica._APPNAME_.admin.facade.SetupFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 03/02/14
 * Time: 17:32
 */
@Controller
@RequestMapping("/setup")
public class SetupController {

    @Autowired
    private SetupFacade setupFacade;

    @RequestMapping("/admin")
    public @ResponseBody String admin(HttpServletRequest request, HttpServletResponse response) {
        if (request.getServerName().equals("localhost")) {
            setupFacade.createAdmin(false);
            return "OK";
        } else {
            try {
                response.sendError(HttpServletResponse.SC_FORBIDDEN);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return "";
    }

}
