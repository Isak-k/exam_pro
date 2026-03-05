import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth, db, storage } from '@/integrations/firebase/client';

export default function FirebaseDiagnostic() {
  const envVars = {
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Firebase Diagnostic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Environment Variables:</h3>
            <div className="space-y-1 text-sm font-mono">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span>{key}:</span>
                  <span className={value ? 'text-green-600' : 'text-red-600'}>
                    {value ? '✓ Loaded' : '✗ Missing'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Firebase Services:</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Auth:</span>
                <span className={auth ? 'text-green-600' : 'text-red-600'}>
                  {auth ? '✓ Initialized' : '✗ Failed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Firestore:</span>
                <span className={db ? 'text-green-600' : 'text-red-600'}>
                  {db ? '✓ Initialized' : '✗ Failed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Storage:</span>
                <span className={storage ? 'text-green-600' : 'text-red-600'}>
                  {storage ? '✓ Initialized' : '✗ Failed'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Firebase Config (Partial):</h3>
            <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
              <div>Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Not loaded'}</div>
              <div>Auth Domain: {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'Not loaded'}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">User Status:</h3>
            <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
              <UserStatus />
            </div>
          </div>

          <div className="text-xs text-muted-foreground mt-4">
            Check the browser console (F12) for more detailed Firebase logs.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UserStatus() {
  const [user, setUser] = React.useState<any>(null);
  const [role, setRole] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [status, setStatus] = React.useState("");

  React.useEffect(() => {
    return auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        try {
          // Check role in Firestore
          const docRef = await import("firebase/firestore").then(m => m.doc(db, "users", u.uid));
          const docSnap = await import("firebase/firestore").then(m => m.getDoc(docRef));
          if (docSnap.exists()) {
            setRole(docSnap.data().role);
          } else {
            setRole("No Profile");
          }
        } catch (e) {
          console.error(e);
          setRole("Error fetching role");
        }
      }
      setLoading(false);
    });
  }, []);

  const makeAdmin = async () => {
    if (!user) return;
    setStatus("Updating...");
    try {
      const { doc, setDoc, Timestamp } = await import("firebase/firestore");
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { 
        role: "admin", 
        updatedAt: Timestamp.now(),
        email: user.email,
        userId: user.uid
      }, { merge: true });
      setRole("admin");
      setStatus("Success! You are now an admin.");
    } catch (e: any) {
      setStatus("Error: " + e.message);
    }
  };

  if (loading) return <div>Loading user...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div className="space-y-2">
      <div>UID: {user.uid}</div>
      <div>Email: {user.email}</div>
      <div className="flex items-center gap-2">
        <span>Role: </span>
        <span className={role === 'admin' ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
          {role || "None"}
        </span>
      </div>
      {role !== 'admin' && (
        <div className="mt-2">
          <button 
            onClick={makeAdmin}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
          >
            Fix Permissions (Make Me Admin)
          </button>
        </div>
      )}
      {status && <div className="text-xs mt-1 text-blue-600">{status}</div>}
    </div>
  );
}