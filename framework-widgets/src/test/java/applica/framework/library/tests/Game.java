package applica.framework.library.tests;

import applica.framework.SEntity;
import applica.framework.annotations.ManyToMany;
import applica.framework.annotations.OneToMany;

import java.util.ArrayList;
import java.util.List;

/**
 * Applica (www.applicamobile.com)
 * User: bimbobruno
 * Date: 31/10/14
 * Time: 12:29
 */
public class Game extends SEntity {

    public static final String GTA_ID = "game1";
    private String name;
    private Brand brand;
    private Brand manyToOneBrand;
    private String brandId;
    private List<Player> players = new ArrayList<>();
    @OneToMany
    private List<Player> oneToManyPlayers = new ArrayList<>();

    @ManyToMany
    private List<Player> manyToManyPlayers = new ArrayList<>();

    private List<String> playerIds = new ArrayList<>();

    public Game(String id, String name, Brand brand, String brandId, List<Player> players, List<String> playerIds) {
        setId(id);
        this.name = name;
        this.brand = brand;
        this.manyToOneBrand = brand;
        this.brandId = brandId;
        this.players = players;
        this.playerIds = playerIds;
        this.oneToManyPlayers = players;
        this.manyToManyPlayers = players;
    }

    public Game() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }

    public List<String> getPlayerIds() {
        return playerIds;
    }

    public void setPlayerIds(List<String> playerIds) {
        this.playerIds = playerIds;
    }

    public String getBrandId() {
        return brandId;
    }

    public void setBrandId(String brandId) {
        this.brandId = brandId;
    }

    public Brand getManyToOneBrand() {
        return manyToOneBrand;
    }

    public void setManyToOneBrand(Brand manyToOneBrand) {
        this.manyToOneBrand = manyToOneBrand;
    }

    public List<Player> getOneToManyPlayers() {
        return oneToManyPlayers;
    }

    public void setOneToManyPlayers(List<Player> oneToManyPlayers) {
        this.oneToManyPlayers = oneToManyPlayers;
    }

    public List<Player> getManyToManyPlayers() {
        return manyToManyPlayers;
    }

    public void setManyToManyPlayers(List<Player> manyToManyPlayers) {
        this.manyToManyPlayers = manyToManyPlayers;
    }

    @Override
    public String toString() {
        return name;
    }
}
