package war;

import java.util.LinkedList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.io.Serializable;

public class Broadcaster implements Serializable {
    private static final long serialVersionUID = 1L;
    static ExecutorService executorService =
        Executors.newSingleThreadExecutor();

    public interface BroadcastListener {
        void receiveBroadcast(Note note);
    }

    private static LinkedList<BroadcastListener> listeners =
        new LinkedList<BroadcastListener>();

    public static synchronized void register(
            BroadcastListener listener) {
        listeners.add(listener);
            }

    public static synchronized void unregister(
            BroadcastListener listener) {
        listeners.remove(listener);
            }

    public static synchronized void broadcast(
            final Note note) {
        for (final BroadcastListener listener: listeners)
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    listener.receiveBroadcast(note);
                }
            });
     }
}
