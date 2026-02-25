import { useOffline } from '@/hooks/use-offline';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi, CloudOff } from 'lucide-react';
import { useState, useEffect } from 'react';

export function OfflineIndicator() {
  const { isOnline, wasOffline } = useOffline();
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowOnlineMessage(true);
      const timer = setTimeout(() => {
        setShowOnlineMessage(false);
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (isOnline && !showOnlineMessage) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
      {!isOnline ? (
        <Alert className="shadow-2xl border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <CloudOff className="h-5 w-5 text-yellow-600 dark:text-yellow-400 animate-pulse" />
            </div>
            <AlertDescription className="text-yellow-900 dark:text-yellow-100">
              <strong className="block text-base font-semibold mb-1">Offline Mode</strong>
              <span className="text-sm">
                You're working offline. All changes are saved locally and will sync automatically when you're back online.
              </span>
            </AlertDescription>
          </div>
        </Alert>
      ) : showOnlineMessage ? (
        <Alert className="shadow-2xl border-2 border-green-500 bg-green-50 dark:bg-green-950/30 backdrop-blur-sm animate-scale-in">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <AlertDescription className="text-green-900 dark:text-green-100">
              <strong className="block text-base font-semibold mb-1">Back Online!</strong>
              <span className="text-sm">
                Connection restored. Syncing your data now...
              </span>
            </AlertDescription>
          </div>
        </Alert>
      ) : null}
    </div>
  );
}