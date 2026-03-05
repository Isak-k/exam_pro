import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/integrations/firebase/client";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { UserProfile } from "@/lib/auth";
import { seedDatabase } from "@/lib/seed-data";

export default function AdminSetup() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("isak@gmail.com");
  const [password, setPassword] = useState("Isak1234");
  const [status, setStatus] = useState<string>("");
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedDatabase();
      toast({
        title: "Success",
        description: "Database seeded with sample data.",
      });
    } catch (error: any) {
      console.error("Seed error:", error);
      toast({
        title: "Error",
        description: "Failed to seed database.",
        variant: "destructive",
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleSetup = async () => {
    setLoading(true);
    setStatus("Starting setup...");
    
    try {
      let user;
      let isNewUser = false;

      // Try to sign in first
      try {
        setStatus("Attempting to sign in...");
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        setStatus("Signed in successfully.");
      } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
          setStatus("User not found. Creating new user...");
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            user = userCredential.user;
            isNewUser = true;
            setStatus("User created successfully.");
          } catch (createError: any) {
            throw new Error(`Failed to create user: ${createError.message}`);
          }
        } else {
          throw error;
        }
      }

      if (!user) throw new Error("No user object found");

      // Update or create user profile in Firestore with admin role
      setStatus("Updating user profile in Firestore...");
      const userRef = doc(db, "users", user.uid);
      
      const userProfile: UserProfile = {
        userId: user.uid,
        email: user.email!,
        fullName: "Admin User", // Default name
        avatarUrl: null,
        role: "admin",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      // If user exists, we might want to preserve existing data but ensure role is admin
      if (!isNewUser) {
        await setDoc(userRef, { role: "admin", updatedAt: Timestamp.now() }, { merge: true });
      } else {
        await setDoc(userRef, userProfile);
      }

      setStatus("Success! User is now an admin.");
      toast({
        title: "Success",
        description: `Account ${email} is now setup as Admin.`,
      });

    } catch (error: any) {
      console.error("Setup error:", error);
      setStatus(`Error: ${error.message}`);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Account Setup</CardTitle>
          <CardDescription>
            Create or update the admin account for testing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="text" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <div className="bg-muted p-4 rounded-md text-sm font-mono whitespace-pre-wrap">
            {status || "Ready to setup"}
          </div>

          <Button 
            className="w-full" 
            onClick={handleSetup} 
            disabled={loading}
          >
            {loading ? "Processing..." : "Setup Admin Account"}
          </Button>
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Populate Database</h3>
            <p className="text-sm text-gray-500 mb-4">
              Add sample students, exams, and results to verify the dashboard.
            </p>
            <Button 
              onClick={handleSeed} 
              disabled={seeding || loading}
              variant="outline"
              className="w-full"
            >
              {seeding ? "Seeding..." : "Seed Database with Sample Data"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
