package applica.framework.security.tests;

import applica.framework.ApplicationContextProvider;
import applica.framework.security.Role;
import applica.framework.security.Security;
import applica.framework.security.User;
import applica.framework.security.authorization.AuthorizationService;
import applica.framework.security.authorization.BaseAuthorizationService;
import applica.framework.security.authorization.Permissions;
import applica.framework.security.tests.auth.CrudAuthorizationContext;
import applica.framework.security.token.*;
import junit.framework.Assert;
import org.junit.Test;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.context.NoSuchMessageException;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.*;

/**
 * Applica (www.applica.guru)
 * User: bimbobruno
 * Date: 25/09/14
 * Time: 12:52
 */
public class AuthTest {

    @Test
    public void token() throws TokenGenerationException, TokenValidationException, TokenFormatException, TokenExpiredException {
        User user = new TestUser();
        DefaultAuthTokenGenerator generator = new DefaultAuthTokenGenerator();
        String token = generator.generate(user);
        System.out.println(token);
        DefaultAuthTokenValidator validator = new DefaultAuthTokenValidator();
        validator.validate(user, token);
    }

    @Test
    public void authorizationAndPermissionsTest() {
        new ApplicationContextProvider().setApplicationContext(new MockApplicationContext());

        Permissions.instance().scan(CrudAuthorizationContext.class.getPackage());
        Permissions.instance().registerStatic("static:permission");

        TestUser testUser = new TestUser();

        Assert.assertEquals(true, Security.with(testUser).isPermitted("static:permission"));
        Assert.assertEquals(true, Security.with(testUser).isPermitted("crud:create"));
        Assert.assertEquals(false, Security.with(testUser).isPermitted("crud:update"));
        Assert.assertEquals(false, Security.with(testUser).isPermitted("crud:delete"));
    }

    class TestUser implements applica.framework.security.User {

        @Override
        public String getUsername() {
            return "test";
        }

        @Override
        public String getPassword() {
            return "password";
        }

        @Override
        public boolean isActive() {
            return false;
        }

        @Override
        public Date getRegistrationDate() {
            return null;
        }

        @Override
        public List<? extends Role> getRoles() {
            return Arrays.asList(new TestRole());
        }
    }

    class TestRole implements Role {

        @Override
        public String getRole() {
            return "administrator";
        }

        @Override
        public List<String> getPermissions() {
            return Arrays.asList(
                    "static:permission",
                    "crud:create",
                    "crud:delete"
            );
        }
    }

    class MockApplicationContext implements ApplicationContext {

        @Override
        public String getId() {
            return null;
        }

        @Override
        public String getApplicationName() {
            return null;
        }

        @Override
        public String getDisplayName() {
            return null;
        }

        @Override
        public long getStartupDate() {
            return 0;
        }

        @Override
        public ApplicationContext getParent() {
            return null;
        }

        @Override
        public AutowireCapableBeanFactory getAutowireCapableBeanFactory() throws IllegalStateException {
            return null;
        }

        @Override
        public void publishEvent(ApplicationEvent applicationEvent) {

        }

        @Override
        public BeanFactory getParentBeanFactory() {
            return null;
        }

        @Override
        public boolean containsLocalBean(String s) {
            return false;
        }

        @Override
        public boolean containsBeanDefinition(String s) {
            return false;
        }

        @Override
        public int getBeanDefinitionCount() {
            return 0;
        }

        @Override
        public String[] getBeanDefinitionNames() {
            return new String[0];
        }

        @Override
        public String[] getBeanNamesForType(Class<?> aClass) {
            return new String[0];
        }

        @Override
        public String[] getBeanNamesForType(Class<?> aClass, boolean b, boolean b2) {
            return new String[0];
        }

        @Override
        public <T> Map<String, T> getBeansOfType(Class<T> tClass) throws BeansException {
            return null;
        }

        @Override
        public <T> Map<String, T> getBeansOfType(Class<T> tClass, boolean b, boolean b2) throws BeansException {
            return null;
        }

        @Override
        public String[] getBeanNamesForAnnotation(Class<? extends Annotation> aClass) {
            return new String[0];
        }

        @Override
        public Map<String, Object> getBeansWithAnnotation(Class<? extends Annotation> aClass) throws BeansException {
            return null;
        }

        @Override
        public <A extends Annotation> A findAnnotationOnBean(String s, Class<A> aClass) throws NoSuchBeanDefinitionException {
            return null;
        }

        @Override
        public Object getBean(String s) throws BeansException {
            return null;
        }

        @Override
        public <T> T getBean(String s, Class<T> tClass) throws BeansException {
            return null;
        }

        @Override
        public <T> T getBean(Class<T> tClass) throws BeansException {
            if (tClass.isAssignableFrom(AuthorizationService.class)) {
                Object a = new BaseAuthorizationService();
                try {
                    Field field = a.getClass().getDeclaredField("applicationContext");
                    field.setAccessible(true);
                    field.set(a, this);
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                } catch (NoSuchFieldException e) {
                    e.printStackTrace();
                }
                return (T) a;
            } else if (tClass.isAssignableFrom(CrudAuthorizationContext.class)) {
                return (T)new CrudAuthorizationContext();
            }

            throw new RuntimeException("Bad class initialization");
        }

        @Override
        public Object getBean(String s, Object... objects) throws BeansException {
            return null;
        }

        @Override
        public <T> T getBean(Class<T> aClass, Object... objects) throws BeansException {
            return null;
        }

        @Override
        public boolean containsBean(String s) {
            return false;
        }

        @Override
        public boolean isSingleton(String s) throws NoSuchBeanDefinitionException {
            return false;
        }

        @Override
        public boolean isPrototype(String s) throws NoSuchBeanDefinitionException {
            return false;
        }

        @Override
        public boolean isTypeMatch(String s, Class<?> aClass) throws NoSuchBeanDefinitionException {
            return false;
        }

        @Override
        public Class<?> getType(String s) throws NoSuchBeanDefinitionException {
            return null;
        }

        @Override
        public String[] getAliases(String s) {
            return new String[0];
        }

        @Override
        public Environment getEnvironment() {
            return null;
        }

        @Override
        public String getMessage(String s, Object[] objects, String s2, Locale locale) {
            return null;
        }

        @Override
        public String getMessage(String s, Object[] objects, Locale locale) throws NoSuchMessageException {
            return null;
        }

        @Override
        public String getMessage(MessageSourceResolvable messageSourceResolvable, Locale locale) throws NoSuchMessageException {
            return null;
        }

        @Override
        public Resource[] getResources(String s) throws IOException {
            return new Resource[0];
        }

        @Override
        public Resource getResource(String s) {
            return null;
        }

        @Override
        public ClassLoader getClassLoader() {
            return null;
        }
    }

}
