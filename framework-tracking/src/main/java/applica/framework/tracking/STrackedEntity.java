package applica.framework.tracking;

import applica.framework.SEntity;

import java.util.Date;

/**
 * Created by bimbobruno on 23/10/15.
 */
public class STrackedEntity extends SEntity implements TrackedEntity {

    private Date creationDate;
    private Date lastUpdate;

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public Date getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(Date lastUpdate) {
        this.lastUpdate = lastUpdate;
    }
}
