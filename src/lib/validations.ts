import { z } from "zod";

// Auth validations
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password must be less than 72 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  role: z.enum(["admin", "student"]),
});

export const passwordResetSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export const newPasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password must be less than 72 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Exam validations
export const examSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  duration_minutes: z
    .number()
    .min(1, "Duration must be at least 1 minute")
    .max(480, "Duration cannot exceed 8 hours"),
  max_attempts: z
    .number()
    .min(1, "Must allow at least 1 attempt")
    .max(10, "Cannot exceed 10 attempts"),
});

export const questionSchema = z.object({
  question_text: z
    .string()
    .trim()
    .min(1, "Question text is required")
    .max(2000, "Question must be less than 2000 characters"),
  options: z
    .array(z.string().trim().min(1, "Option cannot be empty"))
    .min(2, "At least 2 options are required")
    .max(6, "Maximum 6 options allowed"),
  correct_option_index: z
    .number()
    .min(0, "Please select a correct answer"),
  marks: z
    .number()
    .min(1, "Marks must be at least 1")
    .max(100, "Marks cannot exceed 100"),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type NewPasswordInput = z.infer<typeof newPasswordSchema>;
export type ExamInput = z.infer<typeof examSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;

// Localized Schema Factories
export const getLoginSchema = (t: any) => z.object({
  email: z
    .string()
    .trim()
    .min(1, t("validations.required", { field: t("common.email") }))
    .email(t("validations.email.invalid"))
    .max(255, t("validations.email.max")),
  password: z
    .string()
    .min(1, t("validations.required", { field: t("common.password") }))
    .min(6, t("validations.password.min")),
});

export const getSignupSchema = (t: any) => z.object({
  name: z
    .string()
    .trim()
    .min(1, t("validations.required", { field: t("common.fullName") }))
    .max(100, t("validations.name.max"))
    .regex(/^[a-zA-Z\s'-]+$/, t("validations.name.pattern")),
  email: z
    .string()
    .trim()
    .min(1, t("validations.required", { field: t("common.email") }))
    .email(t("validations.email.invalid"))
    .max(255, t("validations.email.max")),
  password: z
    .string()
    .min(6, t("validations.password.min"))
    .max(72, t("validations.password.max"))
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      t("validations.password.complexity")
    ),
  role: z.enum(["admin", "student"]),
});

export const getPasswordResetSchema = (t: any) => z.object({
  email: z
    .string()
    .trim()
    .min(1, t("validations.required", { field: t("common.email") }))
    .email(t("validations.email.invalid")),
});

export const getNewPasswordSchema = (t: any) => z.object({
  password: z
    .string()
    .min(6, t("validations.password.min"))
    .max(72, t("validations.password.max"))
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      t("validations.password.complexity")
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: t("validations.password.match"),
  path: ["confirmPassword"],
});

export const getExamSchema = (t: any) => z.object({
  title: z
    .string()
    .trim()
    .min(1, t("validations.required", { field: t("admin.exams.form.title") }))
    .max(200, t("validations.exam.titleMax")),
  description: z
    .string()
    .trim()
    .max(1000, t("validations.exam.descMax"))
    .optional(),
  duration_minutes: z
    .number()
    .min(1, t("validations.exam.durationMin"))
    .max(480, t("validations.exam.durationMax")),
  max_attempts: z
    .number()
    .min(1, t("validations.exam.attemptsMin"))
    .max(10, t("validations.exam.attemptsMax")),
});

export const getQuestionSchema = (t: any) => z.object({
  question_text: z
    .string()
    .trim()
    .min(1, t("validations.required", { field: t("admin.exams.questions.questionText") }))
    .max(2000, t("validations.question.textMax")),
  options: z
    .array(z.string().trim().min(1, t("validations.question.optionEmpty")))
    .min(2, t("validations.question.optionsMin"))
    .max(6, t("validations.question.optionsMax")),
  correct_option_index: z
    .number()
    .min(0, t("validations.question.correctOption")),
  marks: z
    .number()
    .min(1, t("validations.question.marksMin"))
    .max(100, t("validations.question.marksMax")),
});
