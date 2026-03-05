import { db } from "@/integrations/firebase/client";
import { collection, doc, writeBatch, Timestamp } from "firebase/firestore";

export async function seedDatabase() {
  const batch = writeBatch(db);
  const now = Timestamp.now();
  const yesterday = new Timestamp(now.seconds - 86400, 0);
  const lastWeek = new Timestamp(now.seconds - 7 * 86400, 0);

  console.log("Starting database seed...");

  // 1. Create dummy students (Profiles only)
  const students = [
    {
      userId: "student1",
      email: "alice@example.com",
      fullName: "Alice Johnson",
      role: "student",
      avatarUrl: null,
      createdAt: lastWeek,
      updatedAt: lastWeek
    },
    {
      userId: "student2",
      email: "bob@example.com",
      fullName: "Bob Smith",
      role: "student",
      avatarUrl: null,
      createdAt: lastWeek,
      updatedAt: lastWeek
    },
    {
      userId: "student3",
      email: "charlie@example.com",
      fullName: "Charlie Brown",
      role: "student",
      avatarUrl: null,
      createdAt: lastWeek,
      updatedAt: lastWeek
    }
  ];

  students.forEach((student) => {
    const ref = doc(db, "users", student.userId);
    batch.set(ref, student);
  });

  // 2. Create Exams
  const exams = [
    {
      examId: "exam1",
      title: "Introduction to React",
      description: "Basic concepts of React.js including components, state, and props.",
      durationMinutes: 60,
      passingScore: 70,
      isPublished: true,
      createdAt: lastWeek,
      updatedAt: lastWeek,
      createdBy: "admin1",
      questions: [],
      questionCount: 10,
      resultsPublished: true,
      startTime: yesterday,
      endTime: new Timestamp(now.seconds + 7 * 86400, 0)
    },
    {
      examId: "exam2",
      title: "Advanced TypeScript",
      description: "Deep dive into generics, utility types, and decorators.",
      durationMinutes: 90,
      passingScore: 80,
      isPublished: true,
      createdAt: yesterday,
      updatedAt: yesterday,
      createdBy: "admin1",
      questions: [],
      questionCount: 15,
      resultsPublished: false,
      startTime: now,
      endTime: new Timestamp(now.seconds + 14 * 86400, 0)
    },
    {
      examId: "exam3",
      title: "Web Accessibility (Draft)",
      description: "WCAG 2.1 guidelines and best practices.",
      durationMinutes: 45,
      passingScore: 75,
      isPublished: false,
      createdAt: now,
      updatedAt: now,
      createdBy: "admin1",
      questions: [],
      questionCount: 20,
      resultsPublished: false,
      startTime: null,
      endTime: null
    }
  ];

  exams.forEach((exam) => {
    const ref = doc(db, "exams", exam.examId);
    batch.set(ref, exam);
  });

  // 3. Create Exam Attempts
  const attempts = [
    {
      attemptId: "attempt1",
      examId: "exam1",
      studentId: "student1",
      studentName: "Alice Johnson",
      studentEmail: "alice@example.com",
      examTitle: "Introduction to React",
      startTime: yesterday,
      endTime: new Timestamp(yesterday.seconds + 3600, 0),
      isSubmitted: true,
      submittedAt: new Timestamp(yesterday.seconds + 3600, 0),
      score: 85,
      totalScore: 85,
      maxScore: 100,
      answers: {}
    },
    {
      attemptId: "attempt2",
      examId: "exam1",
      studentId: "student2",
      studentName: "Bob Smith",
      studentEmail: "bob@example.com",
      examTitle: "Introduction to React",
      startTime: yesterday,
      endTime: new Timestamp(yesterday.seconds + 3500, 0),
      isSubmitted: true,
      submittedAt: new Timestamp(yesterday.seconds + 3500, 0),
      score: 65,
      totalScore: 65,
      maxScore: 100,
      answers: {}
    }
  ];

  attempts.forEach((attempt) => {
    const ref = doc(db, "examAttempts", attempt.attemptId);
    batch.set(ref, attempt);
  });

  await batch.commit();
  console.log("Database seeded successfully!");
}
