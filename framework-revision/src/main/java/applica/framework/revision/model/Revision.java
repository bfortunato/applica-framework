package applica.framework.revision.model;

import applica.framework.AEntity;
import applica.framework.library.utils.DateUtils;
import applica.framework.widgets.entities.EntityId;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@EntityId("revision")
public class Revision extends AEntity {

    //entità di cui rappresenta la revisione
    private long code; //incrementale univoco per entity-entityId
    private String entityId;
    private String entity;
    private String type; //costante della classe RevisionType
    private String creatorId;
    private Date date;


    //eventuali lista di modifiche. Se creazione  conterrà il valore della entità.
    private List<AttributeDifference> differences = new ArrayList<>();

    public Revision() {}

    public long getCode() {
        return code;
    }

    public void setCode(long code) {
        this.code = code;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getEntity() {
        return entity;
    }

    public void setEntity(String entity) {
        this.entity = entity;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public List<AttributeDifference> getDifferences() {
        return differences;
    }

    public void setDifferences(List<AttributeDifference> differences) {
        this.differences = differences;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    public String getDateToString() {
        return DateUtils.getStringFromDate(date, DateUtils.FORMAT_DATE_DATEPICKER_WITH_HOURS);
    }

    public boolean hasDifferences() {
        return differences.size() > 0;
    }
}
