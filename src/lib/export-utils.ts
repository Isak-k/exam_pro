import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ExamResultData {
  studentName: string;
  studentEmail: string;
  examTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  submittedAt: string;
  timeSpent: string;
}

export interface ExamSummary {
  title: string;
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
}

// Export results to CSV
export function exportToCSV(data: ExamResultData[], filename: string): void {
  const headers = [
    "Student Name",
    "Email",
    "Exam",
    "Score",
    "Max Score",
    "Percentage",
    "Submitted At",
    "Time Spent",
  ];

  const rows = data.map((row) => [
    row.studentName,
    row.studentEmail,
    row.examTitle,
    row.score.toString(),
    row.maxScore.toString(),
    `${row.percentage}%`,
    row.submittedAt,
    row.timeSpent,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

// Export results to PDF
export function exportToPDF(
  data: ExamResultData[],
  summary: ExamSummary,
  filename: string
): void {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(30, 64, 175);
  doc.text("Exam Results Report", 14, 20);

  // Exam summary
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Exam: ${summary.title}`, 14, 35);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 42);

  // Summary stats
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  const summaryY = 55;
  doc.text(`Total Attempts: ${summary.totalAttempts}`, 14, summaryY);
  doc.text(`Average Score: ${summary.averageScore}%`, 14, summaryY + 7);
  doc.text(`Highest Score: ${summary.highestScore}%`, 100, summaryY);
  doc.text(`Lowest Score: ${summary.lowestScore}%`, 100, summaryY + 7);
  doc.text(`Pass Rate (60%+): ${summary.passRate}%`, 14, summaryY + 14);

  // Results table
  const tableData = data.map((row) => [
    row.studentName,
    row.studentEmail,
    `${row.score}/${row.maxScore}`,
    `${row.percentage}%`,
    row.submittedAt,
    row.timeSpent,
  ]);

  autoTable(doc, {
    startY: summaryY + 25,
    head: [["Student", "Email", "Score", "%", "Submitted", "Time"]],
    body: tableData,
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: 255,
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 50 },
      2: { cellWidth: 20 },
      3: { cellWidth: 15 },
      4: { cellWidth: 35 },
      5: { cellWidth: 25 },
    },
  });

  doc.save(`${filename}.pdf`);
}

// Export all results to PDF (multi-exam summary)
export function exportAllResultsToPDF(
  data: ExamResultData[],
  filename: string
): void {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(30, 64, 175);
  doc.text("All Student Results Report", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

  // Calculate overall stats
  const totalAttempts = data.length;
  const avgScore = data.length
    ? Math.round(data.reduce((sum, r) => sum + r.percentage, 0) / data.length)
    : 0;
  const passCount = data.filter((r) => r.percentage >= 60).length;
  const passRate = totalAttempts ? Math.round((passCount / totalAttempts) * 100) : 0;

  // Summary stats
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  const summaryY = 40;
  doc.text(`Total Attempts: ${totalAttempts}`, 14, summaryY);
  doc.text(`Average Score: ${avgScore}%`, 14, summaryY + 7);
  doc.text(`Pass Rate (60%+): ${passRate}%`, 100, summaryY);

  // Results table
  const tableData = data.map((row) => [
    row.studentName,
    row.studentEmail,
    row.examTitle,
    `${row.score}/${row.maxScore}`,
    `${row.percentage}%`,
    row.submittedAt,
    row.timeSpent,
  ]);

  autoTable(doc, {
    startY: summaryY + 15,
    head: [["Student", "Email", "Exam", "Score", "%", "Submitted", "Time"]],
    body: tableData,
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: 255,
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 7,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 },
      3: { cellWidth: 18 },
      4: { cellWidth: 12 },
      5: { cellWidth: 28 },
      6: { cellWidth: 20 },
    },
  });

  doc.save(`${filename}.pdf`);
}

// Export all exams summary to CSV
export function exportAllResultsToCSV(data: ExamResultData[], filename: string): void {
  exportToCSV(data, filename);
}

// Format seconds to readable time
export function formatTimeSpent(seconds: number | null): string {
  if (!seconds) return "N/A";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}
