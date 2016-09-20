package applica._APPNAME_.frontend.controllers;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 5/16/13
 * Time: 9:58 AM
 */
//@ControllerAdvice
public class ControllersInitializer {

    @ExceptionHandler(Exception.class)
    public @ResponseBody String handleException() {
        return "<h1>Error in application. Please contact the site administrator</h1>";
    }




}
