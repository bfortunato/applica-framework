package applica.framework;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.*;
import java.io.File;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 07/10/14
 * Time: 17:02
 */
public class AppContext {

    private static AppContext s_current;

    public static AppContext current() {
        if (s_current == null) {
            s_current = new AppContext();
            s_current.init();
        }

        return s_current;
    }

    private String appDir;
    private String appName;
    private String archetype;
    Document document;

    private void init() {
        appDir = Paths.get("").toAbsolutePath().toString();
        File manifest = new File(appPath("app.manifest"));
        if (manifest.exists()) {
            DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();

            try {
                DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
                document = documentBuilder.parse(manifest);
                Element root = document.getDocumentElement();
                appName = root.getElementsByTagName("appname").item(0).getTextContent();
                archetype = root.getElementsByTagName("archetype").item(0).getTextContent();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

    public String appPath(String path) {
        String normalized = path;
        if (path.startsWith("\\") || path.startsWith("/")) {
            normalized = path.substring(1, path.length());
        }
        return String.format("%s%s%s", appDir, File.separator, normalized);
    }

    public String relativePath(String path) {
        String rel = path.replace(appPath("/"), "");
        if (rel.startsWith(File.separator)) {
            return ".".concat(rel);
        } else {
            return SystemUtils.multiplatformPath("./".concat(rel));
        }
    }

    public String getAppName() {
        return appName;
    }

    public List<String> getMappingIncludes(String webApp) {
        List<String> includes = new ArrayList<>();

        XPathFactory xPathfactory = XPathFactory.newInstance();
        XPath xpath = xPathfactory.newXPath();
        try {
            XPathExpression expr = xpath.compile(String.format("applica/webapps/webapp[@name='%s']/mappings/includes/*", webApp));
            NodeList nodeList = (NodeList) expr.evaluate(document, XPathConstants.NODESET);
            for (int i = 0; i < nodeList.getLength(); i++) {
                Node node = nodeList.item(i);
                includes.add(node.getTextContent().trim());
            }
        } catch (XPathExpressionException e) {
            e.printStackTrace();
        }

        return includes;
    }

    public String getArchetype() {
        return archetype;
    }
}
