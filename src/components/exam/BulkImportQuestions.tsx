import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, AlertCircle, CheckCircle2, FileUp, Sparkles, Loader2 } from "lucide-react";
import { parseQuestions } from "@/lib/question-parser";
import { saveQuestionsBatch } from "@/lib/firebase-exams";
import { useToast } from "@/hooks/use-toast";
import { Question } from "@/integrations/firebase/types";
import { useTranslation } from "react-i18next";
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for pdfjs-dist
// Using CDN to avoid worker bundling issues with Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface BulkImportQuestionsProps {
  examId: string;
  onImportSuccess: () => void;
  currentQuestionCount: number;
}

export function BulkImportQuestions({ examId, onImportSuccess, currentQuestionCount }: BulkImportQuestionsProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [questionCount, setQuestionCount] = useState(20); // Default 20 questions
  const [parseResult, setParseResult] = useState<{
    count: number;
    errors: string[];
    preview?: any[];
  } | null>(null);
  const { toast } = useToast();

  // Get API key from environment variable
  const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY || "";

  const handleAnalyze = () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = parseQuestions(text, t);
      
      setParseResult({
        count: result.questions.length,
        errors: result.errors,
        preview: result.questions // Show all questions for verification
      });
    } catch (error) {
      console.error("Parsing error:", error);
      setParseResult({
        count: 0,
        errors: [t("admin.exams.bulkImport.unexpectedError")],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      // Clean up the text
      const cleanText = fullText
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
        
      if (cleanText.length < 50) {
        throw new Error("Could not extract enough text from PDF. The file might be image-based or encrypted.");
      }
      
      return cleanText;
    } catch (error: any) {
      console.error("PDF extraction error:", error);
      throw new Error(error.message || "Failed to extract text from PDF.");
    }
  };

  const generateMCQsFromAI = async (pdfText: string, apiKey: string): Promise<string> => {
    const prompt = `You are an expert educational assessment generator.
Your task is to generate exactly ${questionCount} high-quality multiple-choice questions based ONLY on the provided study material.

CRITICAL REQUIREMENTS:
- Generate EXACTLY ${questionCount} questions.
- Use ONLY the provided text. Do not use outside knowledge.
- Questions should test understanding and application of concepts found in the text.
- Avoid simple recall questions if possible; focus on key concepts.
- Each question must have exactly 4 options labeled A, B, C, and D.
- Only ONE correct answer per question.
- Mark the correct answer with * at the end of the correct option text (e.g., "Option B *").
- Include a concise explanation for the correct answer.

QUESTION QUALITY STANDARDS:
- Ensure questions are directly supported by the text.
- Distractors (wrong answers) should be plausible but clearly incorrect based on the text.
- Use clear and precise language.

FORMAT (strictly follow):
1. Question text?
A. Option A
B. Option B *
C. Option C
D. Option D
Explanation: Explanation here.

2. Next question...
[Continue for exactly ${questionCount} questions]

IMPORTANT:
- Generate EXACTLY ${questionCount} questions
- Do NOT include introductions, summaries, or extra text
- Do NOT number beyond ${questionCount}

Study Material:
${pdfText.substring(0, 30000)}`; // Limit to 30k chars to avoid token limits

    try {
      // Using Google Gemini API - trying available models in order
      // First try: gemini-1.5-flash (recommended for most use cases)
      let response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            }
          })
        }
      );

      // If gemini-1.5-flash doesn't work, try gemini-1.5-pro (more capable but slower)
      if (!response.ok) {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: prompt
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
              }
            })
          }
        );
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response from AI API. Please check your API key and try again.");
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error: any) {
      console.error("AI API Error:", error);
      throw new Error(error.message || "Failed to generate questions from AI. Please check your API key and internet connection.");
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Missing Requirements",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "API Key Not Configured",
        description: "Please contact your administrator to configure the Google AI API key.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Extract text from PDF
      toast({
        title: "Processing PDF",
        description: "Extracting text from your PDF file...",
      });
      
      const pdfText = await extractTextFromPDF(selectedFile);
      
      // Generate MCQs using AI
      toast({
        title: "Generating Questions",
        description: "AI is creating multiple-choice questions from your content...",
      });
      
      const generatedText = await generateMCQsFromAI(pdfText, apiKey);
      
      // Set the generated text for analysis
      setText(generatedText);
      
      toast({
        title: "Questions Generated!",
        description: "AI has generated questions from your PDF. Click 'Analyze' to review them before importing.",
      });
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate MCQs from PDF.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImport = async () => {
    if (!parseResult || parseResult.count === 0 || parseResult.errors.length > 0) return;

    setIsImporting(true);
    try {
      // Use the already parsed result instead of re-parsing to ensure consistency
      // But re-parsing is safer if state is stale. Since we reset on text change, it's fine.
      // However, let's use the preview data directly if available to match what user saw.
      const questions = parseResult.preview || parseQuestions(text, t).questions;
      
      // Map parsed questions to Firestore schema
      const questionsToSave: Omit<Question, 'questionId' | 'createdAt'>[] = questions.map((q, index) => ({
        examId,
        questionText: q.questionText,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        marks: 1, // Default marks
        orderIndex: currentQuestionCount + index + 1, // Append to end
        feedbackType: 'hidden', // Default feedback
        explanation: q.explanation || undefined
      }));

      await saveQuestionsBatch(examId, questionsToSave);
      
      toast({
        title: t("admin.exams.bulkImport.successTitle"),
        description: t("admin.exams.bulkImport.successDesc", { count: questions.length }),
      });
      
      setOpen(false);
      setText("");
      setParseResult(null);
      onImportSuccess();
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: t("admin.exams.bulkImport.failedTitle"),
        description: t("admin.exams.bulkImport.failedDesc"),
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          {t("admin.exams.bulkImport.trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] lg:max-w-[1200px] max-h-[90vh] p-0 flex flex-col">
        <div className="p-4 sm:p-6 border-b">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {t("admin.exams.bulkImport.title")}
            </DialogTitle>
            <DialogDescription className="text-sm">
              Import questions by typing/pasting text or generate them from PDF using AI.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          <Tabs defaultValue="manual" className="flex flex-col h-full py-4">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="manual" className="flex items-center gap-2 text-xs sm:text-sm">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Manual Input</span>
                <span className="sm:hidden">Manual</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2 text-xs sm:text-sm">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">AI Generation</span>
                <span className="sm:hidden">AI</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="flex-1 flex flex-col space-y-4 mt-0">
              <div className="flex-1 overflow-hidden flex flex-col gap-4">
                {!parseResult ? (
                  <Textarea
                    placeholder={t("admin.exams.bulkImport.placeholder")}
                    className="flex-1 min-h-[250px] sm:min-h-[300px] font-mono text-xs sm:text-sm resize-none"
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                    }}
                  />
                ) : (
                   <ScrollArea className="flex-1 border rounded-md p-3 sm:p-4 bg-muted/20">
                     <div className="space-y-4 sm:space-y-6">
                       {parseResult.preview?.map((q, i) => (
                         <div key={i} className="bg-card border rounded-lg p-3 sm:p-4 shadow-sm">
                           <div className="font-semibold mb-2 flex gap-2 text-sm sm:text-base">
                             <span className="text-muted-foreground">{i + 1}.</span>
                             <span>{q.questionText}</span>
                           </div>
                           <div className="grid gap-2 pl-4 sm:pl-6">
                             {q.options.map((opt: string, optIndex: number) => (
                               <div 
                                 key={optIndex} 
                                 className={`text-xs sm:text-sm p-2 rounded border flex items-center gap-2 ${
                                   optIndex === q.correctOptionIndex 
                                     ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300 font-medium" 
                                     : "border-transparent bg-muted/50"
                                 }`}
                               >
                                 <span className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full border text-xs bg-background flex-shrink-0">
                                   {String.fromCharCode(65 + optIndex)}
                                 </span>
                                 <span className="flex-1">{opt}</span>
                                 {optIndex === q.correctOptionIndex && (
                                   <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                 )}
                               </div>
                             ))}
                           </div>
                           {q.explanation && (
                             <div className="mt-2 text-xs sm:text-sm text-muted-foreground italic pl-4 sm:pl-6 border-l-2 border-muted">
                               <span className="font-semibold not-italic mr-1">{t("admin.exams.bulkImport.explanation")}</span>
                               {q.explanation}
                             </div>
                           )}
                         </div>
                       ))}
                     </div>
                   </ScrollArea>
                )}
              </div>
            </TabsContent>

            <TabsContent value="ai" className="flex-1 flex flex-col space-y-4 overflow-hidden mt-0">
              <ScrollArea className="flex-1 pr-2 sm:pr-4">
                <div className="space-y-4">
                  <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertTitle className="text-blue-800 dark:text-blue-300 text-sm sm:text-base">
                      AI MCQ Generation
                    </AlertTitle>
                    <AlertDescription className="text-blue-700 dark:text-blue-400 text-xs sm:text-sm">
                      Upload a PDF file to automatically generate university-level multiple-choice questions.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="question-count" className="text-sm">Number of Questions</Label>
                        <Input
                          id="question-count"
                          type="number"
                          min="1"
                          max="100"
                          value={questionCount}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val > 0) setQuestionCount(val);
                            else if (e.target.value === "") setQuestionCount(0);
                          }}
                          className="text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter 1-100 questions
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pdf-file" className="text-sm">PDF File</Label>
                        <Input
                          id="pdf-file"
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="cursor-pointer text-sm"
                        />
                        {selectedFile && (
                          <p className="text-xs text-muted-foreground truncate">
                            {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                      </div>
                    </div>

                    <Button 
                      onClick={handleFileUpload} 
                      disabled={!selectedFile || !apiKey || isGenerating}
                      className="w-full text-sm"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileUp className="h-4 w-4 mr-2" />
                          Generate {questionCount} MCQs
                        </>
                      )}
                    </Button>
                  </div>

                  {text && (
                    <div className="border-t pt-4 mt-4">
                      <Label className="text-sm font-medium">Generated Questions Preview</Label>
                      <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="mt-2 min-h-[150px] sm:min-h-[200px] font-mono text-xs sm:text-sm"
                        placeholder="Generated questions will appear here..."
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Review and edit, then click "Analyze Text" below.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {parseResult && (
          <div className="px-4 sm:px-6 py-3 border-t">
            {parseResult.errors.length > 0 ? (
              <Alert variant="destructive" className="text-sm">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-sm">
                  {t("admin.exams.bulkImport.parsingErrors")}
                </AlertTitle>
                <AlertDescription className="text-xs">
                  <ul className="list-disc pl-4 mt-2 space-y-1 max-h-[80px] overflow-y-auto">
                    {parseResult.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-300 text-sm">
                  {t("admin.exams.bulkImport.readyToImport")}
                </AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400 text-xs">
                  {t("admin.exams.bulkImport.foundQuestions", { count: parseResult.count })}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="p-4 sm:p-6 border-t bg-muted/30">
          <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
            <Button 
              variant="outline" 
              onClick={() => {
                if (parseResult) {
                  setParseResult(null);
                } else {
                  setOpen(false);
                }
              }}
              className="w-full sm:w-auto text-sm"
            >
              {parseResult ? t("admin.exams.bulkImport.editText") : t("admin.exams.bulkImport.cancel")}
            </Button>
            {!parseResult ? (
               <Button 
                 onClick={handleAnalyze} 
                 disabled={!text.trim() || isAnalyzing}
                 className="w-full sm:w-auto text-sm"
               >
                 {isAnalyzing ? t("admin.exams.bulkImport.analyzing") : t("admin.exams.bulkImport.analyze")}
               </Button>
            ) : (
               <Button 
                 onClick={handleImport} 
                 disabled={isImporting || parseResult.count === 0 || parseResult.errors.length > 0}
                 className="w-full sm:w-auto text-sm"
               >
                 {isImporting ? t("admin.exams.bulkImport.importing") : t("admin.exams.bulkImport.import")}
               </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
