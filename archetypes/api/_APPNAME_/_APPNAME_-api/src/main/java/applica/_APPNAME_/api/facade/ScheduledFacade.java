package applica._APPNAME_.api.facade;

import applica._APPNAME_.services.AccountService;
import applica._APPNAME_.services.CachingService;
import applica.framework.fileserver.FileServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Created by antoniolovicario on 22/03/17.
 */
@Component
public class ScheduledFacade {

    @Autowired
    private AccountService accountService;


    @Autowired
    private FileServer fileServer;

    @Autowired
    private CachingService cachingService;

    //Esegue questa funzione ogni giorno alle 00.00
    //secondi -  minuti  -ore - giorno mese - mese -giorno settimana
    @Scheduled(cron = "0 01 00 * * ? ")
    public void checkInactiveUser() throws IOException {
        accountService.deactivateInactiveUsers();
    }


    //Ogni minuto esegue il check delle notifiche da inviare (es: meeting)
    @Scheduled(cron = "0 0/5 * * * *")
    public void everyMinuteTask() throws IOException {
        cachingService.clearCaches();

    }

    @Scheduled(cron = "0 0 0 * * *") //ogni giorno a mezzanotte
    //@Scheduled(cron = "0 0/1 * * * *")
    public void deleteTempFiles() {
        //Cancello i tempi files
        fileServer.deleteOldFiles("files/_temp/", 1);
    }


}

