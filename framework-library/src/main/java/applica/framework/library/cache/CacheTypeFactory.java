package applica.framework.library.cache;

/**
 * Created by antoniolovicario on 04/11/16.
 */
public class CacheTypeFactory {

    //------------------------UTENTI-------------------------
    public static String getUserPath(int userId) {
        return String.format("user.%s", userId);
    }

    public static String getUserOnlineFriends(int userId) {
        return String.format("%s.friends.online", getUserPath(userId));
    }

    public static String getUserGroupsByCategoryPath(int userId, int groupCategory) {
        return String.format("%s.groups.%s", getUserPath(userId), groupCategory);
    }

    public static String getUserRolesPath(int userId) {
        return String.format("%s.roles", getUserPath(userId));
    }

    //---------------NOTIFICHE DI UTENTI------------------
    //esempio: user.userId.notifications
    public static String getUserNotificationsRootPath(int userId) {
        return String.format("%s.notifications", getUserPath(userId));
    }

    //esempio: user.userId.notifications.requests || user.userId.notifications.standard
    public static String getUserNotificationsPath(int userId, boolean friendshipRequests) {
        return String.format("%s.%s", getUserNotificationsRootPath(userId), friendshipRequests ? "requests" : "standard");
    }

    //esempio user.userId.notifications.requests.datas || user.userId.notifications.standard.datas
    public static String getUserNotificationsDataPath(int userId, Boolean friendshipRequests) {
        String path;
        if (friendshipRequests == null)
            path = "all";
        else
            path = friendshipRequests  ? "requests" : "standard";
        return String.format("%s.%s.datas", getUserNotificationsRootPath(userId), path );
    }


    //---------------GRUPPI------------------
    //esempio: group.userId.standardInfos
    public static String getGroupStandardInfosPath(int groupId) {
        return String.format("%s.standardInfos", getGroupRootPath(groupId));
    }

    //esempio group.groupId
    public static String getGroupRootPath(int groupId) {
        return String.format("group.%s", groupId);
    }

    //esempio: group.groupId.datas
    public static String getGroupDatasPath(int groupId) {
        return String.format("%s.datas", getGroupRootPath(groupId));
    }


    //group.groupId.members
    public static String getGroupMembers(int groupId) {
        return String.format("%s.members", getGroupRootPath(groupId));
    }
    //group.groupId.members.owners
    public static String getGroupOwners(int groupId) {
        return String.format("%s.owners", getGroupMembers(groupId));
    }


    //-------------PROFILI UTENTE-------------
    //Esempio profile.userId
    public static String getUserProfilePath(int userId) {
        return String.format("profile.%s", userId);
    }

    //Esempio: profile.userId.type.subtype
    public static String getProfilesPath(int userId, int profileType, Integer subtype) {
        return String.format("%s.%s%s", getUserProfilePath(userId), profileType, subtype != null ? "." + subtype : "" );
    }


    //------------ISTITUTI-------------
    //esempio: institute.id
    public static String getInstitutePath(int instituteId) {
        return String.format("institute.%s", instituteId);
    }

    //esempio: institute.id.schools
    public static String getInstituteSchoolsPath(int instituteId) {
        return String.format("%s.schools", getInstitutePath(instituteId));
    }

    public static String getSchoolPath(int schoolId) {
            return String.format("school.%s", schoolId);
    }
}
