package applica._APPNAME_.api.soap;

import applica._APPNAME_.domain.model.User;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by bimbobruno on 10/24/17.
 */
public class UsersSoapResponse {

    private int count;
    private List<User> users = new ArrayList<>();

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}
