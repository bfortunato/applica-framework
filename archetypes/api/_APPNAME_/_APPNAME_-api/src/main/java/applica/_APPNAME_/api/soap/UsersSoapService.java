package applica._APPNAME_.api.soap;

import applica._APPNAME_.domain.data.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;

import javax.jws.WebMethod;
import javax.jws.WebService;

/**
 * Created by bimbobruno on 10/24/17.
 */

@WebService
public class UsersSoapService {

    @Autowired
    private UsersRepository usersRepository;

    @WebMethod
    public UsersSoapResponse allUsers() {
        UsersSoapResponse response = new UsersSoapResponse();
        response.setUsers(usersRepository.find(null).getRows());
        response.setCount(response.getUsers().size());

        return response;
    }

}
