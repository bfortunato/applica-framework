package applica._APPNAME_.frontend.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 25/10/13
 * Time: 18:40
 */
@Controller
@RequestMapping("/home")
public class HomeController {

    @RequestMapping("/index")
    public String index() {
        return "home/index";
    }

}
