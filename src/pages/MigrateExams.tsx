import { useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Loader2, CheckCircle, AlertCircle, Database, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MigrateExams() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<{ updated: number; skipped: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

  const runMigration = async () => {
    setStatus('running');
    setError(null);
    setProgress('Starting migration...');
    
    try {
      const examsRef = collection(db, 'exams');
      setProgress('Fetching exams from database...');
      const snapshot = await getDocs(examsRef);
      
      const total = snapshot.docs.length;
      let updated = 0;
      let skipped = 0;
      
      setProgress(`Found ${total} exams. Checking each one...`);
      
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        
        // Check if examId is missing or doesn't match doc.id
        if (!data.examId || data.examId !== docSnap.id) {
          setProgress(`Updating exam: ${data.title || docSnap.id}`);
          await updateDoc(doc(db, 'exams', docSnap.id), {
            examId: docSnap.id
          });
          updated++;
        } else {
          skipped++;
        }
      }
      
      setResult({ updated, skipped, total });
      setStatus('success');
      setProgress('Migration completed!');
    } catch (err: any) {
      console.error('Migration error:', err);
      setError(err.message || 'Unknown error occurred');
      setStatus('error');
      setProgress('Migration failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-3xl p-8 text-white shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Database className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">Exam Migration</h1>
              <p className="text-cyan-50 mt-1">Fix published exams visibility issue</p>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <Alert className="border-cyan-200 bg-cyan-50 dark:bg-cyan-950/20">
          <AlertCircle className="h-5 w-5 text-cyan-600" />
          <AlertDescription className="text-cyan-900 dark:text-cyan-100">
            <strong className="block mb-2">Why is this needed?</strong>
            <p className="text-sm">
              Published exams aren't showing up for students because the <code className="bg-cyan-100 dark:bg-cyan-900 px-1 rounded">examId</code> field 
              is missing from existing exam documents. This migration will add it automatically.
            </p>
          </AlertDescription>
        </Alert>

        {/* Migration Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-b">
            <CardTitle className="text-2xl">Migration Tool</CardTitle>
            <CardDescription className="text-base">
              This will update all existing exams to include the examId field
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            {/* Idle State */}
            {status === 'idle' && (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What will happen:</h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>✓ Scan all exams in the database</li>
                    <li>✓ Add missing examId fields</li>
                    <li>✓ Skip exams that already have examId</li>
                    <li>✓ Make published exams visible to students</li>
                  </ul>
                </div>
                
                <Button 
                  onClick={runMigration} 
                  size="lg"
                  className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-lg"
                >
                  <Database className="h-5 w-5 mr-2" />
                  Run Migration Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            )}

            {/* Running State */}
            {status === 'running' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4 py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                  <div>
                    <p className="font-semibold text-lg">Migration in progress...</p>
                    <p className="text-sm text-muted-foreground">{progress}</p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/30 rounded-xl p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Please don't close this page until migration is complete.
                  </p>
                </div>
              </div>
            )}

            {/* Success State */}
            {status === 'success' && result && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-6 bg-green-50 dark:bg-green-950/20 border-2 border-green-500 rounded-2xl">
                  <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-green-900 dark:text-green-100">
                      Migration Completed Successfully!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your exams are now visible to students
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card className="border-2 border-cyan-200 dark:border-cyan-800">
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold text-cyan-600">{result.total}</p>
                      <p className="text-sm text-muted-foreground mt-1">Total Exams</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-green-200 dark:border-green-800">
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold text-green-600">{result.updated}</p>
                      <p className="text-sm text-muted-foreground mt-1">Updated</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-gray-200 dark:border-gray-800">
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold text-gray-600">{result.skipped}</p>
                      <p className="text-sm text-muted-foreground mt-1">Skipped</p>
                    </CardContent>
                  </Card>
                </div>

                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertDescription className="text-green-900 dark:text-green-100">
                    <strong className="block mb-1">Next Steps:</strong>
                    <p className="text-sm">
                      1. Ask students to refresh their browser<br/>
                      2. Published exams should now appear in "Available Exams"<br/>
                      3. You can safely close this page
                    </p>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-6 bg-red-50 dark:bg-red-950/20 border-2 border-red-500 rounded-2xl">
                  <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-red-900 dark:text-red-100">
                      Migration Failed
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {error}
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={runMigration} 
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Safety Note */}
        <Alert>
          <AlertDescription className="text-sm">
            <strong>Safe to run multiple times:</strong> This migration will only update exams that are missing the examId field. 
            Exams that already have it will be skipped.
          </AlertDescription>
        </Alert>
      </div>
    </DashboardLayout>
  );
}
