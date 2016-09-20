package applica._APPNAME_.admin.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 2/22/13
 * Time: 3:18 PM
 */
@Controller
public class HomeController {

    @RequestMapping("/")
    public String index() {
        return "index";
    }

}
