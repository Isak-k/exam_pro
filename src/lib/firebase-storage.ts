import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { storage } from '@/integrations/firebase/client';

export interface UploadResult {
  url: string;
  path: string;
  fullPath: string;
}

export async function uploadAvatar(userId: string, file: File): Promise<UploadResult> {
  // Create a unique filename
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const path = `avatars/${userId}/${fileName}`;
  
  const storageRef = ref(storage, path);
  
  // Upload file
  const snapshot = await uploadBytes(storageRef, file);
  
  // Get download URL
  const url = await getDownloadURL(snapshot.ref);
  
  return {
    url,
    path,
    fullPath: snapshot.ref.fullPath
  };
}

export async function uploadExamImage(examId: string, file: File): Promise<UploadResult> {
  // Create a unique filename
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const path = `exam-images/${examId}/${fileName}`;
  
  const storageRef = ref(storage, path);
  
  // Upload file
  const snapshot = await uploadBytes(storageRef, file);
  
  // Get download URL
  const url = await getDownloadURL(snapshot.ref);
  
  return {
    url,
    path,
    fullPath: snapshot.ref.fullPath
  };
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

export async function getDownloadURL(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
}

// File validation helpers
export function validateImageFile(file: File): string | null {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return 'Please select an image file';
  }
  
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return 'File size must be less than 5MB';
  }
  
  return null;
}