import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { signUp, signIn, signOut } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { handleFirebaseError } from '@/lib/firebase-utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function FirebaseTest() {
  const { user, profile, role, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      console.log('Starting signup...');
      await signUp(email, password, fullName, 'student');
      setMessage('✓ Account created successfully! You can now sign in.');
    } catch (error) {
      const errorMsg = handleFirebaseError(error);
      setMessage('✗ ' + errorMsg);
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      console.log('Starting signin...');
      await signIn(email, password);
      setMessage('✓ Signed in successfully!');
    } catch (error) {
      const errorMsg = handleFirebaseError(error);
      setMessage('✗ ' + errorMsg);
      console.error('Signin error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setMessage('✓ Signed out successfully!');
    } catch (error) {
      const errorMsg = handleFirebaseError(error);
      setMessage('✗ ' + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">Loading auth state...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Firebase Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    <p><strong>Signed in as:</strong> {user.email}</p>
                    <p><strong>User ID:</strong> {user.uid}</p>
                    <p><strong>Name:</strong> {profile?.full_name || 'Loading...'}</p>
                    <p><strong>Role:</strong> {role || 'Loading...'}</p>
                  </div>
                </AlertDescription>
              </Alert>
              <Button onClick={handleSignOut} disabled={isLoading} className="w-full">
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  <strong>Note:</strong> This uses Firebase, not Supabase. You need to create a new account here.
                </AlertDescription>
              </Alert>
              
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleSignUp} disabled={isLoading} className="flex-1">
                  {isLoading ? 'Creating...' : 'Sign Up'}
                </Button>
                <Button onClick={handleSignIn} disabled={isLoading} className="flex-1" variant="outline">
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </div>
          )}
          {message && (
            <Alert variant={message.includes('✓') ? 'default' : 'destructive'}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}