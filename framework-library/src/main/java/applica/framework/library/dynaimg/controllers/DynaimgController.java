package applica.framework.library.dynaimg.controllers;

import applica.framework.library.dynaimg.DynaimgGenerator;
import applica.framework.library.options.OptionsManager;
import applica.framework.library.utils.Quiet;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Created by bimbobruno on 16/03/15.
 */
@RequestMapping("/dynaimg")
public class DynaimgController {

    @Autowired
    private OptionsManager options;

    @RequestMapping(value = "/{text}", method = RequestMethod.GET)
    public @ResponseBody void generate(
            @PathVariable String text,
            String size,
            String backgroundColor,
            String foregroundColor,
            HttpServletResponse response
    ) {
        if (StringUtils.isEmpty(size)) {
            size = "300x300";
        }

        if (StringUtils.isEmpty(backgroundColor)) {
            backgroundColor = options.get("dynaimg.default.background.color");
        }

        if (StringUtils.isEmpty(foregroundColor)) {
            foregroundColor = options.get("dynaimg.default.foreground.color");
        }

        try {
            int width = 300;
            int height = 300;

            try {
                width = Integer.parseInt(size.split("x")[0]);
                height = Integer.parseInt(size.split("x")[1]);
            } catch(Exception e) {}

            DynaimgGenerator generator = new DynaimgGenerator();
            generator.setWidth(width);
            generator.setHeight(height);
            generator.setText(text);
            generator.setBackgroundColor(Color.decode(backgroundColor));
            generator.setForegroundColor(Color.decode(foregroundColor));
            BufferedImage image = generator.generate();
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImageIO.write(image, "png", os);
            InputStream in = new ByteArrayInputStream(os.toByteArray());
            String fileName = "generated.png";
            response.setContentType("image/png");
            response.setHeader("Content-Disposition", "inline;filename=" + fileName);
            IOUtils.copy(in, response.getOutputStream());
            in.close();
        } catch (IOException e) {
            Quiet.exec(() -> response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR));
        }
    }


}
