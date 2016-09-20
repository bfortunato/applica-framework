package applica.framework.data.mongodb;

import applica.framework.library.utils.ProgramException;
import com.mongodb.BasicDBObject;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

public class Query extends BasicDBObject {

	public static Query mk() { return new Query(); }
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 4425327108749584645L;
	
	/**
	 * Query by Object ID
	 * @param id
	 * @return
	 */
	public Query id(String id) {
		this.put("_id", new ObjectId(id));
		return this;
	}
	
	/**
	 * Query by Object ID specifying path 
	 * @param id
	 * @return
	 */
	public Query id(String path, String id) {
		this.put(path + "._id", new ObjectId(id));
		return this;
	}
	
	/**
	 * Use eq for "equal"
	 */
	public Query eq(String key, Object value) {
		this.put(key, value);		
		return this;
	}
	
	/**
	 * Use ne for "not equals"
	 */
	public Query ne(String key, Object value) {
		this.put(key, new BasicDBObject("$ne", value));		
		return this;
	}
	
	/**
	 * Use gt for "greater than"
	 */
	public Query gt(String key, Object value) {
		this.put(key, new BasicDBObject("$gt", value));		
		return this;
	}
	
	/**
	 * Use gte for "greater than or equals"
	 */
	public Query gte(String key, Object value) {
		this.put(key, new BasicDBObject("$gte", value));		
		return this;
	}
	
	/**
	 * Use lt for "less than"
	 */
	public Query lt(String key, Object value) {
		this.put(key, new BasicDBObject("$lt", value));		
		return this;
	}

	/*/
	 * Use lte for "less than or equals"
	 */
	public Query lte(String key, Object value) {
		this.put(key, new BasicDBObject("$lte", value));
		return this;
	}

	/*
		User range for "greater than to less than or equals"
	 */
	public Query range(String key, List<?> values){
		if(!values.isEmpty() && values.get(0) != null && values.get(1) != null){
			this.put(key, new BasicDBObject("$gt", values.get(0)).append("$lte", values.get(1)));
		}
		return this;
	}


	/**
	 * Use in to find elements in values list
	 */
	public Query in(String key, List<?> values) {
		this.put(key, new BasicDBObject("$in", values));		
		return this;
	}

    /**
     * Use in to find elements not in values list
     */
    public Query nin(String key, List<?> values) {
        this.put(key, new BasicDBObject("$nin", values));
        return this;
    }

	public OrExpression or() {
		OrExpression or = new OrExpression(this);
		return or;
	}
	
	/**
	 * Use or to make or logic for queries
	 * @param ors
	 * @return
	 */
	public Query or(List<Query> ors) {
		this.put("$or", ors);
		return this;
	}
	
	/**
	 * Use and to make and logic for queries
	 * @param ands
	 * @return
	 */
	public Query and(List<Query> ands) {
		this.put("$and", ands);
		return this;
	}
	
	public AndExpression and() {
		AndExpression and = new AndExpression(this);
		return and;
	}
	
	public Query like(String key, String search) {
		this.put(key, Pattern.compile(String.format("%s", search), Pattern.CASE_INSENSITIVE));
		return this;
	}
	
	/**
	 * Use js to make complex queries using js language
	 */
	public Query js(String js) {
		return this;
	}

	public abstract class BinaryExpression {
		protected Query parent;
		protected List<Query> expressions = new ArrayList<>();
		
		public BinaryExpression(Query parent) {
			if(parent == null) throw new ProgramException("missing parent");
			this.parent = parent;
		}
		
		protected abstract void flushParent();
		
		public BinaryExpression add(Query query) {
			expressions.add(query);
			return this;
		}
		
		public Query finish() {
            if(expressions.size() == 1) {
			    parent.putAll((Map)expressions.get(0));
            } else if(expressions.size() > 1) {
                flushParent();
            }
			return parent;
		}
	}

    public class AndExpression extends BinaryExpression {
		public AndExpression(Query parent) {
			super(parent);
		}

		@Override
		protected void flushParent() {
			parent.and(expressions);
		}		
	}

    public class OrExpression extends BinaryExpression {
		public OrExpression(Query parent) {
			super(parent);
		}

		@Override
		protected void flushParent() {
			parent.or(expressions);
		}		
	}
	
}
