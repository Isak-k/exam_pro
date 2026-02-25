import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/integrations/firebase/client';
import { AppRole, UserProfile } from '@/integrations/firebase/types';

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: AppRole
) {
  // Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Create user profile in Firestore
  const userProfile: UserProfile = {
    userId: user.uid,
    email: user.email!,
    fullName,
    avatarUrl: null,
    role,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  await setDoc(doc(db, 'users', user.uid), userProfile);

  return userCredential;
}

export async function signIn(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  return await firebaseSignOut(auth);
}

export async function resetPassword(email: string) {
  return await sendPasswordResetEmail(auth, email);
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  
  return null;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'userId' | 'createdAt'>>
) {
  const docRef = doc(db, 'users', userId);
  await setDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now()
  }, { merge: true });
}