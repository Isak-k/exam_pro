import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
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

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  
  // Check if user profile exists
  const userProfile = await getUserProfile(user.uid);
  
  // If user doesn't exist, this is their first sign-in
  // Return the user and a flag indicating they need to complete profile
  if (!userProfile) {
    return {
      user,
      isNewUser: true,
      needsProfileSetup: true
    };
  }
  
  return {
    user,
    isNewUser: false,
    needsProfileSetup: false
  };
}

export async function completeGoogleSignUpProfile(
  userId: string,
  email: string,
  fullName: string,
  departmentId: string,
  role: AppRole = 'student'
) {
  const userProfile: UserProfile = {
    userId,
    email,
    fullName,
    avatarUrl: null,
    role,
    departmentId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  await setDoc(doc(db, 'users', userId), userProfile);
  return userProfile;
}