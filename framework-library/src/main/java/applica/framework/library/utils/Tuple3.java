package applica.framework.library.utils;

public class Tuple3<T1, T2, T3> {
    private T1 v1;
    private T2 v2;
    private T3 v3;

    public Tuple3() {
    }

    public Tuple3(T1 v1, T2 v2, T3 v3) {
        super();
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
    }

    public T1 getV1() {
        return v1;
    }

    public void setV1(T1 v1) {
        this.v1 = v1;
    }

    public T2 getV2() {
        return v2;
    }

    public void setV2(T2 v2) {
        this.v2 = v2;
    }

    public T3 getV3() {
        return v3;
    }

    public void setV3(T3 v3) {
        this.v3 = v3;
    }
}
