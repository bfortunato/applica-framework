package applica.framework.tracking;

import java.util.Date;

/**
 * Created by bimbobruno on 23/10/15.
 */
public interface TrackedEntity {

    Date getCreationDate();
    void setCreationDate(Date creationDate);

    Date getLastUpdate();
    void setLastUpdate(Date lastUpdate);

}
