package applica._APPNAME_.api.controllers;

import applica._APPNAME_.services.responses.ResponseCode;
import applica.framework.library.responses.Response;
import applica.framework.library.responses.ValueResponse;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * Created by bimbobruno on 06/12/2016.
 */
@RestController
@RequestMapping("/grids")
public class GridsController {

    @Autowired
    private ApplicationContext context;

    @GetMapping("/{id}")
    public Response getGrid(@PathVariable String id) {
        Resource resource = context.getResource(String.format("classpath:/grids/%s.json", id));
        if (!resource.exists()) {
            return new Response(ResponseCode.ERROR_NOT_FOUND);
        } else {
            try {
                String content = IOUtils.toString(resource.getInputStream(), "UTF8");
                return new ValueResponse(content);
            } catch (IOException e) {
                return new Response(Response.ERROR);
            }
        }
    }

}
