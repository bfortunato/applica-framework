package applica._APPNAME_.frontend.controllers;

import applica.framework.library.options.OptionsManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 5/16/13
 * Time: 9:05 AM
 */
@Controller
public class MainController {

    @Autowired
    private OptionsManager options;

    @RequestMapping("/")
    public String index() {
        return "redirect:/home/index";
    }

}
