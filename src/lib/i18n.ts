import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      "common": {
        "examPro": "ExamPro",
        "signIn": "Sign In",
        "back": "Back",
        "getStarted": "Get Started Now",
        "learnMore": "Learn More",
        "welcomeBack": "Welcome Back",
        "signInSubtitle": "Sign in to continue to your dashboard",
        "email": "Email",
        "password": "Password",
        "login": "Login",
        "signup": "Sign Up",
        "forgotPassword": "Forgot Password?",
        "noAccount": "Don't have an account?",
        "hasAccount": "Already have an account?",
        "or": "OR",
        "fullName": "Full Name",
        "confirmPassword": "Confirm Password",
        "selectRole": "Select Role",
        "student": "Student",
        "teacher": "Teacher",
        "admin": "Admin",
        "department": "Department",
        "selectDepartment": "Select your department",
        "loading": "Loading...",
        "noDepartments": "No departments available",
        "install": {
          "title": "Install ExamPro",
          "desc": "Add to your home screen for easier access",
          "button": "Install",
          "ios": {
            "title": "Install on iOS",
            "step1": "Tap the Share button",
            "step2": "Select 'Add to Home Screen'"
          }
        },
        "viewAll": "View All",
        "profile": "Profile",
        "settings": "Settings",
        "signOut": "Sign Out",
        "footer": {
          "privacy": "Privacy Policy",
          "terms": "Terms of Service",
          "support": "Support",
          "contact": "Contact",
          "rights": "© {{year}} ExamPro. All rights reserved."
        },
        "resetPassword": {
          "sentTitle": "Reset email sent",
          "sentDesc": "Check your inbox for password reset instructions.",
          "failedTitle": "Failed to send reset email",
          "failedDesc": "Please try again later",
          "checkEmail": "Check your email",
          "sentTo": "We've sent a password reset link to",
          "backToSignIn": "Back to sign in",
          "title": "Forgot password?",
          "subtitle": "Enter your email and we'll send you a reset link"
        }
      },
      "admin": {
        "exams": {
          "title": "Manage Exams",
          "titleMy": "My Exams",
          "subtitle": "Create and manage all examinations",
          "subtitleMy": "Manage your created exams",
          "create": "Create Exam",
          "tabs": {
            "all": "All",
            "published": "Published",
            "drafts": "Drafts"
          },
          "empty": {
            "title": "No exams found",
            "description": "Get started by creating your first exam.",
            "action": "Create Exam"
          },
          "form": {
            "createTitle": "Create New Exam",
            "editTitle": "Edit Exam",
            "subtitle": "Set up your exam details",
            "basicInfo": "Basic Information",
            "settings": "Exam Settings",
            "title": "Exam Title",
            "titlePlaceholder": "e.g., Midterm Exam - Mathematics",
            "description": "Description",
            "descriptionPlaceholder": "Describe what this exam covers...",
            "department": "Department",
            "selectDepartment": "Select a department",
            "allDepartments": "All Departments",
            "departmentHelp": "Exams assigned to \"All Departments\" will be visible to everyone.",
            "duration": "Duration (minutes)",
            "maxAttempts": "Max Attempts",
            "startTime": "Start Time (Optional)",
            "endTime": "End Time (Optional)",
            "shuffleQuestions": "Shuffle Questions",
            "shuffleQuestionsDesc": "Randomize question order for each student",
            "shuffleOptions": "Shuffle Options",
            "shuffleOptionsDesc": "Randomize answer options order",
            "cancel": "Cancel",
            "create": "Create & Add Questions",
            "creating": "Creating...",
            "save": "Save Changes",
            "saving": "Saving..."
          },
          "questions": {
            "title": "Questions",
            "add": "Add Question",
            "addFirst": "Add Your First Question",
            "noQuestions": "No questions yet",
            "questionText": "Question Text",
            "questionPlaceholder": "Enter your question here...",
            "options": "Options (select the correct answer)",
            "optionPlaceholder": "Option {{number}}",
            "explanation": "Explanation (Optional)",
            "explanationPlaceholder": "Explain why the answer is correct...",
            "explanationHelp": "Shown immediately in \"Instant Feedback\" mode after selection, or only after submission in \"Hidden\" mode.",
            "feedbackType": "Feedback Type",
            "instantFeedback": "Instant Feedback",
            "hiddenFeedback": "Hidden (After Submit)",
            "marks": "Marks",
            "feedback": "Feedback:",
            "on": "ON (Instant)",
            "off": "OFF (Hidden)",
            "publish": "Publish",
            "unpublish": "Unpublish",
            "save": "Save",
            "saving": "Saving...",
            "deleteTitle": "Delete Question",
            "deleteDesc": "Are you sure you want to delete this question? This action cannot be undone.",
            "deleteCancel": "Cancel",
            "deleteConfirm": "Delete"
          },
          "toasts": {
            "errorLoading": "Error loading exam",
            "questionDeleted": "Question deleted",
            "settingsUpdated": "Settings Updated",
            "examUpdated": "Exam updated successfully",
            "published": "Exam published",
            "unpublished": "Exam unpublished",
            "publishedDesc": "Students can now take this exam.",
            "unpublishedDesc": "Students can no longer access this exam.",
            "invalidQuestions": "Invalid questions",
            "fillAllFields": "Please fill in all question fields and options.",
            "examSaved": "Exam saved!",
            "saveFailed": "Failed to save",
            "cannotPublish": "Cannot publish",
            "addQuestionFirst": "Add at least one question before publishing.",
            "updateFailed": "Failed to update",
            "feedbackUpdate": "Feedback settings updated to {{type}}"
          },
          "bulkImport": {
            "trigger": "Bulk Import",
            "title": "Bulk Import Questions",
            "description": "Paste your questions below. Follow the format: \"1. Question Text\", \"A. Option\", and identify the answer with \"*\" or \"Answer: X\".",
            "placeholder": "1. What is 2 + 2?\nA. 3\nB. 4 *\nC. 5\nD. 6\n\n2. What is the capital of France?\nA. London\nB. Berlin\nC. Paris\nAnswer: C",
            "explanation": "Explanation:",
            "parsingErrors": "Parsing Errors",
            "readyToImport": "Ready to Import",
            "foundQuestions": "Found {{count}} valid questions. Review the preview above to ensure options are assigned correctly.",
            "editText": "Edit Text",
            "cancel": "Cancel",
            "analyze": "Analyze Text",
            "analyzing": "Analyzing...",
            "import": "Import Questions",
            "importing": "Importing...",
            "successTitle": "Import Successful",
            "successDesc": "Successfully imported {{count}} questions.",
            "failedTitle": "Import Failed",
            "failedDesc": "Failed to save questions to database.",
            "parseError": "Parsing error",
            "unexpectedError": "An unexpected error occurred during parsing.",
            "errors": {
              "missingText": "Question {{n}}: Missing question text.",
              "minOptions": "Question {{n}}: Must have at least 2 options.",
              "noCorrect": "Question {{n}}: No correct answer detected. Use '*' or 'Answer: X'.",
              "indexBounds": "Question {{n}}: Correct answer index out of bounds."
            }
          }
        },
        "results": {
          "title": "All Student Results",
          "subtitle": "View all exam results across all students in one place",
          "export": {
            "button": "Export Results",
            "csv": "Export as CSV",
            "pdf": "Export as PDF"
          },
          "stats": {
            "totalAttempts": "Total Attempts",
            "avgScore": "Average Score",
            "passRate": "Pass Rate",
            "examsWithResults": "Exams with Results"
          },
          "searchPlaceholder": "Search by student name, email, or exam...",
          "filterExam": "Filter by exam",
          "allExams": "All Exams",
          "table": {
            "title": "Results",
            "student": "Student",
            "email": "Email",
            "exam": "Exam",
            "score": "Score",
            "percentage": "Percentage",
            "submitted": "Submitted",
            "timeSpent": "Time Spent",
            "status": "Status"
          },
          "status": {
            "published": "Published",
            "hidden": "Hidden"
          },
          "empty": {
            "title": "No results found",
            "filter": "Try adjusting your filters",
            "description": "Results will appear once students complete exams"
          }
        },
        "analytics": {
          "title": "Analytics",
          "subtitle": "Overview of exam performance and statistics",
          "stats": {
            "totalStudents": "Total Students",
            "totalExams": "Total Exams",
            "completedAttempts": "Completed Attempts",
            "averageScore": "Average Score"
          },
          "charts": {
            "examPerformance": "Exam Performance",
            "scoreDistribution": "Score Distribution",
            "avgScoreLabel": "Avg Score %"
          },
          "empty": {
            "title": "No data yet",
            "description": "Analytics will appear once students complete exams"
          }
        }
      },
      "student": {
        "exams": {
          "title": "Available Exams",
          "subtitle": "Browse and take your exams",
          "empty": {
            "title": "No exams available",
            "description": "There are no published exams available at the moment. Please check back later."
          }
        },
        "results": {
          "title": "My Results",
          "subtitle": "View your exam performance",
          "status": {
            "passed": "Passed",
            "failed": "Failed",
            "pending": "Results Pending"
          },
          "marks": "marks",
          "time": "Time: {{time}}",
          "submitted": "Submitted: {{date}}",
          "exam": {
            "notFound": "Exam not found",
            "maxAttempts": "Maximum attempts reached",
            "maxAttemptsDesc": "You have already taken this exam {{count}} times.",
            "errorLoading": "Error loading exam",
            "loading": "Loading exam...",
            "startFailed": "Failed to start exam",
            "submitted": "Exam submitted!",
            "submittedDesc": "Your exam has been submitted successfully.",
            "submitFailed": "Failed to submit exam",
            "startDialog": {
              "title": "Start Exam",
              "desc": "Are you ready to start the exam? The timer will begin immediately.",
              "duration": "Duration: {{minutes}} minutes",
              "questions": "Questions: {{count}}",
              "timer": "The timer will start as soon as you begin",
              "warning": "Do not refresh or leave this page",
              "cancel": "Cancel",
              "start": "Start Exam"
            },
            "submitDialog": {
              "title": "Submit Exam",
              "desc": "Are you sure you want to submit? You cannot change your answers after submission.",
              "answered": "You have answered {{answered}} of {{total}} questions.",
              "warning": "Warning: You have {{unanswered}} unanswered questions.",
              "continue": "Continue Exam",
              "submitting": "Submitting...",
              "cancel": "Cancel",
              "submit": "Submit Exam"
            },
            "question": "Question {{current}} of {{total}}",
            "previous": "Previous",
            "next": "Next",
            "submit": "Submit",
            "timeRemaining": "Time Remaining",
            "questionNavigator": "Question Navigator",
            "timeUp": {
              "title": "Time's up!",
              "description": "Your exam is being submitted automatically."
            },
            "shortcuts": {
              "trigger": "Shortcuts",
              "title": "Keyboard Shortcuts",
              "next": "Next question",
              "prev": "Previous",
              "select": "Select option",
              "submit": "Submit"
            },
            "card": {
              "marks": "{{count}} mark",
              "marks_plural": "{{count}} marks",
              "explanation": "Explanation:"
            }
          },
          "review": "Review Answers",
          "pendingMessage": "Your results will be available once the examiner publishes them.",
          "empty": {
            "title": "No results yet",
            "description": "Complete an exam to see your results here"
          }
        },
        "messages": {
          "title": "Messages",
          "subtitle": "Contact administrators",
          "send": "Send",
          "sending": "Sending...",
          "newMessage": "New Message",
          "writeMessage": "Write your message...",
          "writeComment": "Write your comment or question to the admins...",
          "noMessages": "No messages yet",
          "noMessagesDesc": "Start a conversation with the administrators",
          "messageSent": "Message sent",
          "messageSentDesc": "Your message has been sent to the administrators",
          "sendFailed": "Failed to send",
          "sendFailedDesc": "Please try again",
          "writeMessageError": "Write a message",
          "writeMessageErrorDesc": "Please enter your comment.",
          "deleteConfirm": "Are you sure you want to delete this message? This action cannot be undone.",
          "messageDeleted": "Message deleted",
          "deleteFailed": "Failed to delete",
          "deleteFailedDesc": "Please try again"
        }
      },
      "dashboard": {
        "welcome": "Welcome back, {{name}}!",
        "adminSubtitle": "Here's what's happening with your exams",
        "studentSubtitle": "Here's an overview of your progress",
        "createExam": "Create Exam",
        "recentExams": "Recent Exams",
        "availableExams": "Available Exams",
        "upcomingExams": "Upcoming Exams",
        "menu": {
          "dashboard": "Dashboard",
          "manageExams": "Manage Exams",
          "allResults": "All Results",
          "students": "Students",
          "analytics": "Analytics",
          "examiners": "Examiners",
          "departments": "Departments",
          "myResults": "My Results",
          "availableExams": "Available Exams"
        },
        "stats": {
          "totalExams": "Total Exams",
          "activeExams": "Active Exams",
          "totalStudents": "Total Students",
          "completedAttempts": "Completed Attempts",
          "availableExams": "Available Exams",
          "completedExams": "Completed Exams",
          "averageScore": "Average Score",
          "upcomingExams": "Upcoming Exams"
        },
        "noExams": "No exams yet",
        "createFirstExam": "Create your first exam to get started",
        "noAvailableExams": "No exams available",
        "checkBackLater": "Check back later for new exams",
        "noUpcomingExams": "No upcoming exams",
        "caughtUp": "You're all caught up!"
      },
      "aiAssistant": {
        "title": "AI Study Assistant",
        "subtitle": "AI tools and ready-to-use prompts for effective studying",
        "description": "Get AI-powered help with your studies using Google NotebookLM",
        "notebookDescription": "Upload documents, ask questions, and get instant answers.",
        "loading": "Loading AI Study Assistant...",
        "error": "Unable to load AI Study Assistant",
        "errorDescription": "The AI Study Assistant could not be loaded. Please try again.",
        "openExternal": "Open in External Browser",
        "note": "Note: These tools open in your browser. You may need to sign in with your Google account for NotebookLM.",
        "launch": "Launch",
        "prompts": {
          "b1": {
            "title": "Friendly Teacher & Study Partner",
            "description": "Step-by-step learning with examples and practice questions",
            "prompt": "Act as a friendly teacher and study partner.\n\nFirst ask me: \"Which language would you like to study in?\"\nWait for my answer and then continue the lesson using that language.\n\nAfter that, ask me for the topic or the file I want to study:\n[User enters topic or uploads file]\n\nInstructions for teaching:\n1. First give a short and simple summary of what I am going to learn.\n2. After the summary, ask me to type \"Next\" to start Step 1.\n3. Break the topic into small steps or subtopics.\n4. Start with Step 1 only.\n5. Give a clear and simple explanation.\n6. Use simple words and daily life examples.\n7. Provide at least 3 examples for the step.\n8. Give 5 multiple-choice questions (MCQs) to test understanding.\n9. Ask one short question where I explain the idea in my own words.\n10. End the step with a short summary.\n\nAfter completing the step, stop and wait for me.\nI will type \"Next\" to continue learning.\n\nTeach like a supportive friend and make learning easy and enjoyable."
          },
          "b2": {
            "title": "Explain Like I'm 5",
            "description": "Get simple explanations for complex topics",
            "prompt": "First ask me: \"Which language would you like me to explain in?\"\nWait for my answer and use that language for the explanation.\n\nThen explain [TOPIC] to me like I'm 5 years old. Use simple words and examples."
          },
          "b3": {
            "title": "Study Guide Creator",
            "description": "Create a study guide for any subject",
            "prompt": "First ask me: \"Which language would you like the study guide in?\"\nWait for my answer and create the guide in that language.\n\nCreate a comprehensive study guide for [SUBJECT/TOPIC]. Include key concepts, definitions, and practice questions."
          },
          "b4": {
            "title": "Homework Helper",
            "description": "Get help understanding homework problems",
            "prompt": "First ask me: \"Which language would you like me to help you in?\"\nWait for my answer and provide help in that language.\n\nHelp me understand this homework problem: [PASTE PROBLEM]. Explain the concept and guide me through the solution step by step."
          },
          "b5": {
            "title": "Vocabulary Builder",
            "description": "Learn new words and their usage",
            "prompt": "First ask me: \"Which language would you like to learn vocabulary in?\"\nWait for my answer and teach in that language.\n\nTeach me 10 important vocabulary words related to [SUBJECT]. For each word, provide: definition, example sentence, and a memory trick."
          },
          "i1": {
            "title": "Expert Tutor & Guide",
            "description": "Structured learning with technical concepts and practice",
            "prompt": "Act as an expert tutor and guide.\n\nFirst ask me: \"Which language would you like to study in?\"\nWait for my answer and continue the lesson using that language.\n\nThen ask me for the topic or the file I want to study:\n[User enters topic or uploads file]\n\nInstructions for teaching:\n1. Give a short overview of what I will learn.\n2. Ask me to type \"Next\" to begin Step 1.\n3. Divide the topic into logical steps.\n4. Start with Step 1 only.\n5. Provide a clear and structured explanation.\n6. Use simple language but include important technical ideas.\n7. Provide daily life examples.\n8. Give at least 3 examples.\n9. Provide 5 MCQs to test understanding.\n10. Ask one short explanation question.\n11. End with a short step summary.\n\nAfter completing the step, stop and wait for me.\nI will type \"Next\" to continue."
          },
          "i2": {
            "title": "Essay Outline Generator",
            "description": "Create structured essay outlines",
            "prompt": "First ask me: \"Which language would you like the essay outline in?\"\nWait for my answer and create the outline in that language.\n\nCreate a detailed essay outline for the topic: [TOPIC]. Include: thesis statement, 3-5 main points with supporting arguments, and conclusion."
          },
          "i3": {
            "title": "Concept Connector",
            "description": "Link related concepts together",
            "prompt": "First ask me: \"Which language would you like me to explain in?\"\nWait for my answer and explain in that language.\n\nExplain how [CONCEPT A] relates to [CONCEPT B] in [SUBJECT]. Show the connections and provide real-world examples."
          },
          "i4": {
            "title": "Practice Test Creator",
            "description": "Generate practice questions",
            "prompt": "First ask me: \"Which language would you like the practice test in?\"\nWait for my answer and create the test in that language.\n\nCreate a practice test for [SUBJECT/TOPIC] with 10 questions. Include: 5 multiple choice, 3 short answer, and 2 essay questions. Provide answer key."
          },
          "i5": {
            "title": "Research Assistant",
            "description": "Get help with research topics",
            "prompt": "First ask me: \"Which language would you like me to assist you in?\"\nWait for my answer and provide assistance in that language.\n\nI'm researching [TOPIC]. Provide: 1) Key areas to explore, 2) Important questions to answer, 3) Suggested sources, 4) How to organize my findings."
          },
          "a1": {
            "title": "Expert Professor & Mentor",
            "description": "Deep mastery-level learning with advanced concepts",
            "prompt": "Act as an expert professor and mentor.\n\nFirst ask me: \"Which language would you like to study in?\"\nWait for my answer and continue the lesson using that language.\n\nThen ask me for the topic or the file I want to study:\n[User enters topic or uploads file]\n\nInstructions for teaching:\n1. Give a short overview of the topic and what I will master.\n2. Ask me to type \"Next\" to start Step 1.\n3. Divide the topic into advanced modules or sections.\n4. Start with Step 1 only.\n5. Provide deep but clear explanations.\n6. Include both technical explanations and simple explanations.\n7. Provide daily life and real-world examples.\n8. Give at least 3 examples.\n9. Provide 5 challenging MCQs.\n10. Ask one conceptual question to test deeper understanding.\n11. Mention common mistakes students make.\n12. End the step with a short summary.\n\nAfter completing each step, stop and wait.\nI will type \"Next\" to continue learning."
          },
          "a2": {
            "title": "Critical Analysis Guide",
            "description": "Analyze texts and arguments critically",
            "prompt": "First ask me: \"Which language would you like the analysis in?\"\nWait for my answer and provide the analysis in that language.\n\nAnalyze [TEXT/ARGUMENT] critically. Evaluate: 1) Main thesis and supporting arguments, 2) Strengths and weaknesses, 3) Logical fallacies, 4) Evidence quality, 5) Alternative perspectives, 6) Implications and conclusions."
          },
          "a3": {
            "title": "Socratic Tutor",
            "description": "Learn through guided questioning",
            "prompt": "First ask me: \"Which language would you like to learn in?\"\nWait for my answer and conduct the session in that language.\n\nAct as a Socratic tutor for [SUBJECT/TOPIC]. Instead of giving direct answers, guide me to discover the answer through thoughtful questions. Challenge my assumptions and help me think critically."
          },
          "a4": {
            "title": "Thesis Development",
            "description": "Develop strong thesis statements",
            "prompt": "First ask me: \"Which language would you like to work in?\"\nWait for my answer and help me in that language.\n\nHelp me develop a strong thesis for my paper on [TOPIC]. Guide me through: 1) Narrowing the focus, 2) Formulating a clear argument, 3) Ensuring it's debatable, 4) Making it specific and supportable, 5) Refining the language."
          },
          "admin1": {
            "title": "MCQ Generator (Admin Only)",
            "description": "Generate exam questions with answers and explanations",
            "prompt": "Act as an expert exam question generator.\n\nFirst ask me: \"Which language would you like the questions in?\"\nWait for my answer and generate all questions in that language.\n\nI want to generate multiple-choice questions for exams.\n\nTopic:\n[Enter the topic here]\n\nDifficulty level:\n[Easy / Medium / Hard]\n\nNumber of questions:\n[Enter number]\n\nInstructions:\n1. Generate high-quality multiple-choice questions based on the topic.\n2. Each question must have 4 choices (A, B, C, D).\n3. Mark the correct answer using * at the end of the correct option.\n4. After each question, provide a short explanation of the correct answer.\n5. Use clear and simple language appropriate for the selected language.\n6. Avoid repeating questions.\n7. Make questions suitable for students.\n\nFormat the output exactly like this:\n\n1. Question here?\nA. Choice\nB. Choice\nC. Correct answer *\nD. Choice\n\nExplanation: Write a short explanation of why the answer is correct."
          }
        }
      },
      "mindMap": {
        "title": "Mind Map Generator",
        "subtitle": "Powered by CogniGuide AI",
        "description": "Create AI-powered mind maps to visualize and organize your study materials",
        "loading": "Loading Mind Map Generator...",
        "error": "Unable to load Mind Map Generator",
        "errorDescription": "The Mind Map Generator could not be loaded. Please try again.",
        "openExternal": "Open in External Browser",
        "note": "Note: Create visual mind maps to better understand complex topics.",
        "launch": "Launch"
      },
      "chatgpt": {
        "title": "ChatGPT",
        "description": "Chat with AI to get explanations, solve problems, and learn new concepts interactively."
      },
      "gemini": {
        "title": "Google Gemini",
        "description": "Google's advanced AI assistant for research, writing, and creative problem-solving."
      },
      "exam": {
        "status": {
          "published": "Published",
          "draft": "Draft",
          "ended": "Ended",
          "upcoming": "Upcoming",
          "active": "Active",
          "notAvailable": "Not Yet Available",
          "alreadyAttempted": "Already Attempted"
        },
        "action": {
          "start": "Start Exam",
          "edit": "Edit",
          "results": "Results"
        },
        "info": {
          "min": "min",
          "questions": "questions",
          "attempts": "attempts",
          "startsIn": "Starts in {{time}} min",
          "starts": "Starts {{time}}",
          "endsIn": "Ends in {{time}} min",
          "openNow": "Open now"
        },
        "stat": {
          "vsLastWeek": "vs last week"
        }
      },
      "hero": {
        "badge": "The #1 Assessment Platform",
        "titlePre": "Master Your",
        "titleHighlight": "Assessments",
        "description": "Empower your institution with secure, scalable, and intelligent examination solutions. Designed for modern education."
      },
      "features": {
        "heading": "Everything You Need",
        "subheading": "A complete suite of tools designed to make online examinations effortless and effective.",
        "secure": {
          "title": "Secure & Reliable",
          "desc": "Enterprise-grade security with role-based access control and anti-cheating measures."
        },
        "timed": {
          "title": "Timed Assessments",
          "desc": "Automated timing controls with auto-submission and real-time countdowns."
        },
        "results": {
          "title": "Instant Results",
          "desc": "Immediate grading and feedback delivery to students upon submission."
        },
        "analytics": {
          "title": "Deep Analytics",
          "desc": "Comprehensive performance reports and insights for students and examiners."
        },
        "badges": {
          "freeSetup": "Free Setup",
          "secure": "Secure",
          "fast": "Fast"
        }
      },
      "validations": {
        "required": "{{field}} is required",
        "email": {
          "invalid": "Please enter a valid email address",
          "max": "Email must be less than 255 characters"
        },
        "password": {
          "min": "Password must be at least 6 characters",
          "max": "Password must be less than 72 characters",
          "complexity": "Password must contain at least one uppercase letter, one lowercase letter, and one number",
          "match": "Passwords don't match"
        },
        "name": {
          "max": "Name must be less than 100 characters",
          "pattern": "Name can only contain letters, spaces, hyphens, and apostrophes"
        },
        "exam": {
          "titleMax": "Title must be less than 200 characters",
          "descMax": "Description must be less than 1000 characters",
          "durationMin": "Duration must be at least 1 minute",
          "durationMax": "Duration cannot exceed 8 hours",
          "attemptsMin": "Must allow at least 1 attempt",
          "attemptsMax": "Cannot exceed 10 attempts"
        },
        "question": {
          "textMax": "Question must be less than 2000 characters",
          "optionEmpty": "Option cannot be empty",
          "optionsMin": "At least 2 options are required",
          "optionsMax": "Maximum 6 options allowed",
          "correctOption": "Please select a correct answer",
          "marksMin": "Marks must be at least 1",
          "marksMax": "Marks cannot exceed 100"
        }
      }
    }
  },
  om: {
    translation: {
      "common": {
        "examPro": "ExamPro",
        "signIn": "Seeni",
        "back": "Duubatti",
        "getStarted": "Amma Jalqabi",
        "learnMore": "Odeeffannoo Dabalata",
        "welcomeBack": "Baga Nagaan Deebite",
        "signInSubtitle": "Dashboard kee argachuuf seeni",
        "email": "Imeelii",
        "password": "Jecha Darbii",
        "login": "Seeni",
        "signup": "Galmaa'i",
        "forgotPassword": "Jecha Darbii Dagattee?",
        "noAccount": "Akkaawuntii hin qabduu?",
        "hasAccount": "Akkaawuntii qabdaa?",
        "or": "Ykn",
        "fullName": "Maqaa Guutuu",
        "confirmPassword": "Jecha Darbii Mirkaneessi",
        "selectRole": "Gahee Filadhu",
        "student": "Barataa",
        "teacher": "Barsiisaa",
        "admin": "Bulchaa",
        "department": "Department",
        "selectDepartment": "Department kee filadhu",
        "loading": "Fe'aa jira...",
        "noDepartments":  "Department hin jiru",
        "install": {
          "title": "ExamPro Fe'i",
          "desc": "Salphaatti argachuuf gara home screen kee galchi",
          "button": "Fe'i",
          "ios": {
            "title": "iOS irratti fe'i",
            "step1": "Share cuqaasi",
            "step2": "'Add to Home Screen' filadhu"
          }
        },
        "viewAll": "Hunda Ilaali",
        "profile": "Pirofaayilii",
        "settings": "Qindaa'ina",
        "signOut": "Ba'i",
        "footer": {
          "privacy": "Imaammata Dhuunfaa",
          "terms": "Waliigaltee Tajaajilaa",
          "support": "Deeggarsa",
          "contact": "Quunnamtii",
          "rights": "© {{year}} ExamPro. Mirgi Abbummaa Seeraan Eegamaadha."
        },
        "resetPassword": {
          "sentTitle": "Ergaan deebisanii saaguu ergameera",
          "sentDesc": "Qajeelfama jecha iccitii deebisanii saaguuf inbox keessan ilaalaa.",
          "failedTitle": "Ergaa deebisanii saaguu ergul dadhabame",
          "failedDesc": "Maaloo booda irra deebi'aa yaalaa",
          "checkEmail": "Email keessan ilaalaa",
          "sentTo": "Liinkii jecha iccitii deebisanii saaguu gara kanatti ergineerra",
          "backToSignIn": "Gara seensatti deebi'aa",
          "title": "Jecha iccitii irraanfattanii?",
          "subtitle": "Email keessan galchaa, nutis liinkii deebisanii saaguu isiniif ergina"
        }
      },
      "admin": {
        "exams": {
          "title": "Qormaata Bulchi",
          "titleMy": "Qormaata Koo",
          "subtitle": "Qormaata hunda uumi fi bulchi",
          "subtitleMy": "Qormaata ati uumte bulchi",
          "create": "Qormaata Uumi",
          "tabs": {
            "all": "Hunda",
            "published": "Maxxanfame",
            "drafts": "Wixinee"
          },
          "empty": {
            "title": "Qormaanni hin argamne",
            "description": "Qormaata jalqabaa uumuun jalqabi",
            "action": "Qormaata Uumi"
          },
          "form": {
            "createTitle": "Qormaata Haaraa Uumi",
            "editTitle": "Qormaata Gulaali",
            "subtitle": "Bal'inaan qormaata kee qopheessi",
            "basicInfo": "Odeeffannoo Bu'uuraa",
            "settings": "Qindaa'ina Qormaataa",
            "title": "Mataduree Qormaataa",
            "titlePlaceholder": "fkn, Qormaata Walakkaa - Herrega",
            "description": "Ibsa",
            "descriptionPlaceholder": "Waa'ee qormaata kanaa ibsi...",
            "department": "Muummee",
            "selectDepartment": "Muummee filadhu",
            "allDepartments": "Muummee Hunda",
            "departmentHelp": "Qormaanni \"Muummee Hunda\"f kenname namoota hundaaf ni mul'ata.",
            "duration": "Yeroo (daqiiqaa)",
            "maxAttempts": "Yaalii Ol'aanaa",
            "startTime": "Yeroo Jalqabaa (Filannoo)",
            "endTime": "Yeroo Xumuraa (Filannoo)",
            "shuffleQuestions": "Gaaffiiwwan Makaa",
            "shuffleQuestionsDesc": "Tartiiba gaaffii barataa hundaaf makaa",
            "shuffleOptions": "Filannoo Makaa",
            "shuffleOptionsDesc": "Tartiiba filannoo deebii makaa",
            "cancel": "Haqi",
            "create": "Uumi & Gaaffii Dabali",
            "creating": "Uumaa jira...",
            "save": "Jijjiirama Galchi",
            "saving": "Galchaa jira..."
          },
          "toasts": {
            "errorLoading": "Qormaata fe'uu hin dandeenye",
            "questionDeleted": "Gaaffiin haqameera",
            "settingsUpdated": "Qindaa'inni haaromfameera",
            "examUpdated": "Qormaanni milkaa'inaan haaromfameera",
            "published": "Qormaanni maxxanfameera",
            "unpublished": "Qormaanni maxxansa irraa ka'eera",
            "publishedDesc": "Barattoonni amma qormaata kana fudhachuu danda'u.",
            "unpublishedDesc": "Barattoonni kana booda qormaata kana argachuu hin danda'an.",
            "invalidQuestions": "Gaaffilee dogoggoraa",
            "fillAllFields": "Maaloo dirree gaaffii fi filannoowwan hunda guutaa.",
            "examSaved": "Qormaanni olkaa'ameera!",
            "saveFailed": "Olkaa'uu hin dandeenye",
            "cannotPublish": "Maxxansuu hin danda'amu",
            "addQuestionFirst": "Osoo hin maxxansin dura yoo xiqqaate gaaffii tokko dabalaa.",
            "updateFailed": "Haaromsuu hin dandeenye",
            "feedbackUpdate": "Haalli deebii gara {{type}} jijjiirameera"
          },
          "bulkImport": {
            "trigger": "Gaaffii Baay'ee Galchi",
            "title": "Gaaffii Baay'ee Galchi",
            "description": "Gaaffiiwwan kee armaan gaditti maxxi. Format kana hordofi: \"1. Gaaffii\", \"A. Filannoo\", fi deebii \"*\" ykn \"Answer: X\" dhaan adda baasi.",
            "placeholder": "1. 2 + 2 meeqa?\nA. 3\nB. 4 *\nC. 5\nD. 6\n\n2. Magaalaa guddoo Faransaay eenyu?\nA. London\nB. Berlin\nC. Paris\nAnswer: C",
            "explanation": "Ibsa:",
            "parsingErrors": "Dogoggora",
            "readyToImport": "Galchuuf Qophaa'eera",
            "foundQuestions": "Gaaffiiwwan sirrii {{count}} argameera. Filannoowwan sirrii ta'uu isaanii mirkaneessuuf preview olitti ilaali.",
            "editText": "Barruu Gulaali",
            "cancel": "Haqi",
            "analyze": "Barruu Xiinxali",
            "analyzing": "Xiinxalaa jira...",
            "import": "Gaaffiiwwan Galchi",
            "importing": "Galchaa jira...",
            "successTitle": "Milkaa'inaan Galcheera",
            "successDesc": "Gaaffiiwwan {{count}} milkaa'inaan galcheera.",
            "failedTitle": "Galchuu Dadhabe",
            "failedDesc": "Gaaffiiwwan kuusaa deetaatti galchuu dadhabe.",
            "parseError": "Dogoggora Xiinxaluu",
            "unexpectedError": "Dogoggorri hin eegamne uumameera.",
            "errors": {
              "missingText": "Gaaffii {{n}}: Barruun gaaffii hin jiru.",
              "minOptions": "Gaaffii {{n}}: Yoo xiqqaate filannoo 2 qabaachuu qaba.",
              "noCorrect": "Gaaffii {{n}}: Deebiin sirrii hin argamne. '*' ykn 'Answer: X' fayyadamaa.",
              "indexBounds": "Gaaffii {{n}}: Lakkoofsi deebii sirrii daangaa ala."
            }
          }
        },
        "results": {
          "title": "Bu'aa Barattoota Hunda",
          "subtitle": "Bu'aa qormaata barattoota hunda bakka tokkotti ilaali",
          "export": {
            "button": "Bu'aa Ergi",
            "csv": "CSV dhaan Ergi",
            "pdf": "PDF dhaan Ergi"
          },
          "stats": {
            "totalAttempts": "Waliigala Yaalii",
            "avgScore": "Qabxii Giddu-galeessa",
            "passRate": "Dhibbeentaa Darbinaa",
            "examsWithResults": "Qormaata Bu'aa Qaban"
          },
          "searchPlaceholder": "Maqaa barataa, email, ykn qormaataan barbaadi...",
          "filterExam": "Qormaataan calali",
          "allExams": "Qormaata Hunda",
          "table": {
            "title": "Bu'aa",
            "student": "Barataa",
            "email": "Imeelii",
            "exam": "Qormaata",
            "score": "Qabxii",
            "percentage": "Dhibbeentaa",
            "submitted": "Galche",
            "timeSpent": "Yeroo Fudhate",
            "status": "Haala"
          },
          "status": {
            "published": "Maxxanfame",
            "hidden": "Dhokataa"
          },
          "empty": {
            "title": "Bu'aan hin argamne",
            "filter": "Calalii kee sirreessuu yaali",
            "description": "Bu'aan yeroo barattoonni qormaata xumuran ni mul'ata"
          }
        },
        "analytics": {
          "title": "Analitiksii",
          "subtitle": "Raawwii qormaataa fi istaatistiksii waliigalaa",
          "stats": {
            "totalStudents": "Barattoota Waliigalaa",
            "totalExams": "Qormaata Waliigalaa",
            "completedAttempts": "Yaalii Xumurame",
            "averageScore": "Qabxii Giddu-galeessa"
          },
          "charts": {
            "examPerformance": "Raawwii Qormaataa",
            "scoreDistribution": "Raabsa Qabxii",
            "avgScoreLabel": "Qabxii Giddu-galeessa %"
          },
          "empty": {
            "title": "Ammatti odeeffannoon hin jiru",
            "description": "Analitiksiin yeroo barattoonni qormaata xumuran ni mul'ata"
          }
        }
      },
      "student": {
        "exams": {
          "title": "Qormaata Jiru",
          "subtitle": "Qormaata kee ilaali fi fudhadhu",
          "empty": {
            "title": "Qormaanni hin jiru",
            "description": "Yeroo ammaa qormaanni maxxanfame hin jiru. Maaloo booda deebi'ii ilaali."
          }
        },
        "results": {
          "title": "Bu'aa Kiyya",
          "subtitle": "Raawwii qormaata keetii ilaali",
          "status": {
            "passed": "Darbee",
            "failed": "Kufaa",
            "pending": "Bu'aa Eeggachaa Jira"
          },
          "marks": "qabxii",
          "time": "Yeroo: {{time}}",
          "submitted": "Galche: {{date}}",
          "review": "Deebii Ilaali",
          "pendingMessage": "Bu'aan keessan yeroo qorataan maxxanfamu ni argama.",
          "empty": {
            "title": "Ammatti bu'aan hin jiru",
            "description": "Bu'aa keessan asitti arguuf qormaata xumuraa"
          }
        },
        "exam": {
          "notFound": "Qormaanni hin argamne",
          "maxAttempts": "Yaalii Ol'aanaa irra ga'ameera",
          "maxAttemptsDesc": "Qormaata kana kanaan dura si'a {{count}} fudhatteetta.",
          "errorLoading": "Qormaata fe'uu hin dandeenye",
          "loading": "Qormaata fe'aa jira...",
          "startFailed": "Qormaata jalqabuu hin dandeenye",
          "submitted": "Qormaanni galfameera!",
          "submittedDesc": "Qormaanni keessan milkaa'inaan galfameera.",
          "submitFailed": "Qormaata galchuu hin dandeenye",
          "startDialog": {
            "title": "Qormaata Jalqabi",
            "desc": "Qormaata jalqabuuf qophoofteettaa? Sa'aatiin battalumatti ni jalqaba.",
            "duration": "Yeroo: Daqiiqaa {{minutes}}",
            "questions": "Gaaffiiwwan: {{count}}",
            "timer": "Sa'aatiin akkuma jalqabdeen ni ka'a",
            "warning": "Fuula kana hin haaromsin ykn hin dhiisin",
            "cancel": "Haqi",
            "start": "Jalqabi"
          },
          "submitDialog": {
            "title": "Qormaata Galchi",
            "desc": "Dhuguma galchuu barbaaddaa? Erga galchitee booda deebii kee jijjiiruu hin dandeessu.",
            "answered": "Gaaffiiwwan {{total}} keessaa {{answered}} deebisteetta.",
            "warning": "Akeekkachiisa: Gaaffiiwwan {{unanswered}} osoo hin deebisin haftaniittu.",
            "continue": "Qormaata Itti Fufi",
            "submitting": "Galchaa jira...",
            "cancel": "Haqi",
            "submit": "Galchi"
          },
          "question": "Gaaffii {{current}} kan {{total}}",
          "previous": "Kan duraa",
          "next": "Itti aanu",
          "submit": "Galchi",
          "timeRemaining": "Yeroo Hafte",
          "questionNavigator": "Qajeelcha Gaaffii",
          "timeUp": {
            "title": "Yeroon dhumateera!",
            "description": "Qormaanni keessan ofumaan galaa jira."
          },
          "shortcuts": {
            "trigger": "Gabaajee",
            "title": "Gabaajee Kiiyboordii",
            "next": "Gaaffii itti aanu",
            "prev": "Kan duraa",
            "select": "Filannoo filadhu",
            "submit": "Galchi"
          },
          "card": {
            "marks": "Qabxii {{count}}",
            "marks_plural": "Qabxii {{count}}",
            "explanation": "Ibsa:"
          }
        },
        "review": "Deebii Ilaali",
        "pendingMessage": "Bu'aan keessan yeroo qoraan maxxansu ni argama.",
        "empty": {
          "title": "Ammaan bu'aan hin jiru",
          "description": "Bu'aa kee asitti arguuf qormaata xumuri"
        },
        "messages": {
          "title": "Ergaa",
          "subtitle": "Bulchitoota qunnamuu",
          "send": "Ergi",
          "sending": "Ergaa jira...",
          "newMessage": "Ergaa Haaraa",
          "writeMessage": "Ergaa kee barreessi...",
          "writeComment": "Yaada ykn gaaffii kee bulchitootaaf barreessi...",
          "noMessages": "Ammaan ergaan hin jiru",
          "noMessagesDesc": "Bulchitoota waliin haasawa jalqabi",
          "messageSent": "Ergaan ergameera",
          "messageSentDesc": "Ergaan kee bulchitootaaf ergameera",
          "sendFailed": "Erguu hin dandeenye",
          "sendFailedDesc": "Maaloo irra deebi'ii yaali",
          "writeMessageError": "Ergaa barreessi",
          "writeMessageErrorDesc": "Maaloo yaada kee galchi.",
          "deleteConfirm": "Ergaa kana haquu barbaaddaa? Gocha kun deebi'ee hin argamu.",
          "messageDeleted": "Ergaan haqameera",
          "deleteFailed": "Haquu hin dandeenye",
          "deleteFailedDesc": "Maaloo irra deebi'ii yaali"
        }
      },
      "dashboard": {
        "welcome": "Baga Nagaan Deebite, {{name}}!",
        "adminSubtitle": "Wanta qormaata keerratti ta'aa jiru kunooti",
        "studentSubtitle": "Waa'ee adeemsa keetii gabaabaatti",
        "createExam": "Qormaata Uumi",
        "recentExams": "Qormaata Dhihoo",
        "availableExams": "Qormaata Jiru",
        "upcomingExams": "Qormaata Dhufu",
        "menu": {
          "dashboard": "Daashboordii",
          "manageExams": "Qormaata To'adhu",
          "allResults": "Bu'aa Hunda",
          "students": "Barattoota",
          "analytics": "Qaaccessa",
          "examiners": "Qortoota",
          "departments": "Muummee",
          "myResults": "Bu'aa Kiyya",
          "availableExams": "Qormaata Jiru"
        },
        "stats": {
          "totalExams": "Waliigala Qormaataa",
          "activeExams": "Qormaata Hojii Irra Jiru",
          "totalStudents": "Waliigala Barattootaa",
          "completedAttempts": "Qormaata Xumurame",
          "availableExams": "Qormaata Jira",
          "completedExams": "Qormaata Xumurame",
          "averageScore": "Qabxii Giddugaleessaa",
          "upcomingExams": "Qormaata Dhufu"
        },
        "noExams": "Qormaanni hin jiru",
        "createFirstExam": "Qormaata jalqabaa uumi",
        "noAvailableExams": "Qormaanni hin jiru",
        "checkBackLater": "Qormaata haaraaf booda deebi'ii ilaali",
        "noUpcomingExams": "Qormaanni dhufu hin jiru",
        "caughtUp": "Hunda xumurtee jirta!"
      },
      "aiAssistant": {
        "title": "Gargaaraa Barnoota AI",
        "subtitle": "Meeshaalee AI fi yaadota qophaa'an barnoota bu'a qabeessaaf",
        "description": "Barnoota keetiif gargaarsa AI argadhu Google NotebookLM fayyadamuun",
        "notebookDescription": "Galmee ol kaa'i, gaaffii gaafadhu, fi deebii battalumatti argadhu.",
        "loading": "Gargaaraa Barnoota AI fe'aa jira...",
        "error": "Gargaaraa Barnoota AI fe'uu hin dandeenye",
        "errorDescription": "Gargaaraan Barnoota AI fe'amuu hin dandeenye. Maaloo irra deebi'ii yaali.",
        "openExternal": "Geessituu Alaa Keessatti Bani",
        "note": "Yaadannoo: Meeshaaleen kun geessituu kee keessatti banamuu. NotebookLM fayyadamuuf akkaawuntii Google keetiin seenuu si barbaachisuu danda'a.",
        "launch": "Jalqabi",
        "prompts": {
          "b1": {
            "title": "Barsiisaa Michuu fi Hiriyyaa Barnootaa",
            "description": "Barnoota tarkaanfii-tarkaanfiin fakkeenya fi gaaffilee shaakalaa waliin",
            "prompt": "Akka barsiisaa michuu fi hiriyyaa barnootaa na tajaajili.\n\nDursa na gaafadhu: \"Afaan kamitti barachuu barbaadda?\"\nDeebii kiyya eegi; barnoota sana afaan sanatti itti fufi.\n\nSana booda mata-duree ykn faayila barachuufan barbaadu naa gaafadhu:\n[Barataa mata-duree galcha ykn faayila ol-kaasa]\n\nQajeelfama barsiisuu:\n1. Dursa gabaabbinaan waanan baradhu ibsi.\n2. Sana booda \"Next\" barreessi jedhee akka Tarkaanfii 1 jalqabu natti himi.\n3. Mata-duree gara tarkaanfii xiqqootti qoodi.\n4. Tarkaanfii 1 qofaan jalqabi.\n5. Ibsa ifaa fi salphaa kenni.\n6. Jechoota salphaa fi fakkeenya jireenya guyyaa guyyaa fayyadami.\n7. Tarkaanfii sanaaf yoo xiqqaate fakkeenya 3 kenni.\n8. Hubannoo qorachuuf MCQ 5 kenni.\n9. Yaada sana akkaan jechoota kiyyaatiin ibsuuf gaaffii gabaabaa tokko na gaafadhu.\n10. Tarkaanfii sana xumuruun gabaabsaan sirreessi.\n\nTarkaanfii xumuruun booda natti hafu.\n\"Next\" yoo barreesse itti fufa.\n\nAkka hiriyyaa deeggartuu tokkootti na barsiisi; barachuun salphaa fi gammachiisaa haa ta'u."
          },
          "b2": {
            "title": "Akka Daa'ima Umrii 5tti Naaf Ibsi",
            "description": "Mata-duree walxaxaa ta'eef ibsa salphaa argadhu",
            "prompt": "Dursa na gaafadhu: \"Afaan kamiin akkan sitti ibsu barbaadda?\"\nDeebii kiyya eegi; ibsa sana afaan sanaan kenni.\n\nSana booda [TOPIC] akka daa'ima umrii 5tti naaf ibsi. Jechoota salphaa fi fakkeenyoota fayyadami."
          },
          "b3": {
            "title": "Qajeelfama Barnootaa Uumuu",
            "description": "Dhimma kamiifuu qajeelfama barnootaa uumi",
            "prompt": "Dursa na gaafadhu: \"Qajeelfama barnootaa afaan kamiin barbaadda?\"\nDeebii kiyya eegi; qajeelfama sana afaan sanaan uumi.\n\nQajeelfama barnootaa guutuu [SUBJECT/TOPIC]f uumi. Yaadota ijoo, hiikota, fi gaaffilee shaakalaa dabaluu."
          },
          "b4": {
            "title": "Gargaaraa Hojii Manaa",
            "description": "Rakkoo hojii manaa hubachuuf gargaarsa argadhu",
            "prompt": "Dursa na gaafadhu: \"Afaan kamiin akkan si gargaaru barbaadda?\"\nDeebii kiyya eegi; gargaarsa sana afaan sanaan kenni.\n\nRakkoo hojii manaa kana hubachuuf na gargaari: [RAKKOO MAXXANSI]. Yaada sana ibsiitii furmaata tarkaanfii-tarkaanfiin na qajeelchi."
          },
          "b5": {
            "title": "Ijaaraa Jechootaa",
            "description": "Jechootahaaraa fi itti fayyadama isaanii baradhu",
            "prompt": "Dursa na gaafadhu: \"Jechootahaaraa afaan kamiin barachuu barbaadda?\"\nDeebii kiyya eegi; afaan sanaan barsiisi.\n\n[SUBJECT] waliin walqabatan jechootahaaraa barbaachisoo 10 na barsiisi. Jecha hundaaf: hiika, hima fakkeenya, fi mala yaadannoo kenni."
          },
          "i1": {
            "title": "Barsiisaa Beekamaa fi Qajeelchaa",
            "description": "Barnoota sirna qabu yaadota teekinikaa fi shaakalaa waliin",
            "prompt": "Akka barsiisaa beekamaa fi qajeelchaa na tajaajili.\n\nDursa na gaafadhu: \"Afaan kamitti barachuu barbaadda?\"\nDeebii kiyya eegi; barnoota sana afaan sanatti itti fufi.\n\nSana booda mata-duree ykn faayila barachuufan barbaadu naa gaafadhu:\n[Barataa mata-duree galcha ykn faayila ol-kaasa]\n\nQajeelfama barsiisuu:\n1. Wanta nan baradhu gabaabsaan ibsi.\n2. \"Next\" akka barreessu natti himi; Tarkaanfii 1 jalqabi.\n3. Mata-duree gara tarkaanfii sirnaawaaatti qoodi.\n4. Tarkaanfii 1 qofaan jalqabi.\n5. Ibsa ifaa fi sirnaawaa kenni.\n6. Afaan salphaa fayyadami; yaadota teekinikaa barbaachisan dabaluu.\n7. Fakkeenya jireenya guyyaa guyyaa kenni.\n8. Yoo xiqqaate fakkeenya 3 kenni.\n9. Hubannoo qorachuuf MCQ 5 kenni.\n10. Gaaffii gabaabaa ibsa ofii kootiin deebisu tokko naa dhiheessi.\n11. Xumura irratti gabaabsaan sirreessi.\n\nTarkaanfii xumuruun booda natti hafu.\n\"Next\" barreessuun itti fufa."
          },
          "i2": {
            "title": "Uumaa Karoora Barreeffamaa",
            "description": "Karoora barreeffamaa sirna qabu uumi",
            "prompt": "Dursa na gaafadhu: \"Karoora barreeffamaa afaan kamiin barbaadda?\"\nDeebii kiyya eegi; karoora sana afaan sanaan uumi.\n\nKaroora barreeffamaa bal'aa mata-duree: [TOPIC]f uumi. Dabaluu: ibsa yaada ijoo, qabxiilee ijoo 3-5 falmii deeggarsaa waliin, fi xumura."
          },
          "i3": {
            "title": "Walqunnamsiisaa Yaadaa",
            "description": "Yaadota walqabatan walitti hidhuu",
            "prompt": "Dursa na gaafadhu: \"Afaan kamiin akkan sitti ibsu barbaadda?\"\nDeebii kiyya eegi; afaan sanaan ibsi.\n\nAkkamitti [YAADA A] [YAADA B] waliin [SUBJECT] keessatti akka walqabatu ibsi. Walqunnamtii fi fakkeenyoota addunyaa dhugaa agarsiisi."
          },
          "i4": {
            "title": "Uumaa Qormaata Shaakalaa",
            "description": "Gaaffilee shaakalaa uumi",
            "prompt": "Dursa na gaafadhu: \"Qormaata shaakalaa afaan kamiin barbaadda?\"\nDeebii kiyya eegi; qormaata sana afaan sanaan uumi.\n\nQormaata shaakalaa [SUBJECT/TOPIC]f gaaffilee 10 waliin uumi. Dabaluu: filannoo dachaa 5, deebii gabaabaa 3, fi gaaffilee barreeffamaa 2. Furmaata kenni."
          },
          "i5": {
            "title": "Gargaaraa Qorannoo",
            "description": "Mata-duree qorannoof gargaarsa argadhu",
            "prompt": "Dursa na gaafadhu: \"Afaan kamiin akkan si gargaaru barbaadda?\"\nDeebii kiyya eegi; gargaarsa sana afaan sanaan kenni.\n\n[TOPIC] qorachaa jira. Kenni: 1) Naannolee ijoo qorachuu qaban, 2) Gaaffilee barbaachisoo deebisuu qaban, 3) Maddoota yaada kennan, 4) Akkamitti argannoo koo akkan qindeessu."
          },
          "a1": {
            "title": "Pirofeezera Beekamaa fi Gorsaa",
            "description": "Barnoota sadarkaa ol-aanaa yaadota gadi fageenya qaban waliin",
            "prompt": "Akka pirofeezera beekamaa fi gorsaa na tajaajili.\n\nDursa na gaafadhu: \"Afaan kamitti barachuu barbaadda?\"\nDeebii kiyya eegi; barnoota sana afaan sanatti itti fufi.\n\nSana booda mata-duree ykn faayila barachuufan barbaadu naa gaafadhu:\n[Barataa mata-duree galcha ykn faayila ol-kaasa]\n\nQajeelfama barsiisuu:\n1. Waa'ee mata-duree fi waanan sirnaan beekuu qabu gabaabsaan agarsiisi.\n2. \"Next\" akka barreessu natti himi; Tarkaanfii 1 jalqabi.\n3. Gara kutaa/koorsii sadarkaa ol-aanaatti qoodi.\n4. Tarkaanfii 1 qofaan jalqabi.\n5. Ibsa gadii fageenyaan garuu ifaa kenni.\n6. Ibsa teekinikaa fi salphaa waliin dhiheessi.\n7. Fakkeenya jireenya addunyaa fi guyyaa guyyaa kenni.\n8. Yoo xiqqaate fakkeenya 3 kenni.\n9. Hubannoo gadi fageenyaaf MCQ 5 rakkisaa kenni.\n10. Yaada hubannoo gadi fageenya qoru gaaffii yaad-rimee 1 dhiheessi.\n11. Dogoggora barattoonni yeroo hedduu raaw'atan tuqi.\n12. Xumura irratti gabaabsaan sirreessi.\n\nTarkaanfii hunda booda natti hafu.\n\"Next\" barreessuun itti fufa."
          },
          "a2": {
            "title": "Qajeelfama Xiinxala Qeeqaa",
            "description": "Barreeffamaa fi falmii qeeqaan xiinxali",
            "prompt": "Dursa na gaafadhu: \"Xiinxala afaan kamiin barbaadda?\"\nDeebii kiyya eegi; xiinxala sana afaan sanaan kenni.\n\n[BARREEFFAMA/FALMII] qeeqaan xiinxali. Madaali: 1) Yaada ijoo fi falmii deeggarsaa, 2) Ciminaa fi dadhabina, 3) Dogoggora loojikii, 4) Qulqullina ragaa, 5) Ilaalcha biroo, 6) Bu'aa fi xumura."
          },
          "a3": {
            "title": "Barsiisaa Socratic",
            "description": "Gaaffii qajeelchuun baradhu",
            "prompt": "Dursa na gaafadhu: \"Afaan kamiin barachuu barbaadda?\"\nDeebii kiyya eegi; afaan sanaan barnoota itti fufi.\n\nAkka barsiisaa Socratic [SUBJECT/TOPIC]f na tajaajili. Deebii kallattiin kennuu dhiisii, gaaffilee yaad-rimee ta'aniin akkan ofii kiyyaan argadhuuf na qajeelchi. Yaada koo qoradhuu fi qeeqaan akkan yaadu na gargaari."
          },
          "a4": {
            "title": "Guddina Yaada Ijoo",
            "description": "Ibsa yaada ijoo cimaa guddisi",
            "prompt": "Dursa na gaafadhu: \"Afaan kamiin hojjechuu barbaadda?\"\nDeebii kiyya eegi; afaan sanaan na gargaari.\n\nYaada ijoo cimaa barreeffama kiyyaa [TOPIC] irratti akkan guddisu na gargaari. Na qajeelchi: 1) Xiyyeeffannoo dhiphisuu, 2) Falmii ifaa bocuu, 3) Falmachuu akka danda'u mirkaneessuu, 4) Addaa fi deeggarsuu akka danda'u taasisuu, 5) Afaan fooyya'uu."
          },
          "admin1": {
            "title": "Uumaa MCQ (Bulchitootaaf Qofa)",
            "description": "Gaaffilee qormaataa deebii fi ibsa waliin uumi",
            "prompt": "Akka uumaa gaaffii qormaataa beekamaa na tajaajili.\n\nDursa na gaafadhu: \"Gaaffilee afaan kamiin barbaadda?\"\nDeebii kiyya eegi; gaaffilee hunda afaan sanaan uumi.\n\nGaaffilee filannoo dachaa qormaataaf uumuu barbaada.\n\nMata-duree:\n[Mata-duree asitti galchi]\n\nSadarkaa rakkina:\n[Salphaa / Giddu-galeessa / Rakkisaa]\n\nLakkoofsa gaaffilee:\n[Lakkoofsa galchi]\n\nQajeelfama:\n1. Gaaffilee qulqullina ol-aanaa mata-duree irratti hundaa'an uumi.\n2. Gaaffiin hundi filannoo 4 (A, B, C, D) qabaachuu qaba.\n3. Deebii sirrii * fayyadamuun mallattoo godhi.\n4. Gaaffii hunda booda ibsa gabaabaa maaliif deebiin sun sirrii ta'e kenni.\n5. Afaan salphaa fi ifaa afaan filatame waliin fayyadami.\n6. Gaaffilee irra-deddeebi'uu irraa of qusadhu.\n7. Gaaffilee barattootaaf ta'an uumi.\n\nBifa kanaan baasii qindeessi:\n\n1. Gaaffiin asitti?\nA. Filannoo\nB. Filannoo\nC. Deebii sirrii *\nD. Filannoo\n\nIbsa: Ibsa gabaabaa maaliif deebiin sun sirrii ta'e barreessi."
          }
        }
      },
      "mindMap": {
        "title": "Uumaa Kaartaa Sammuu",
        "subtitle": "CogniGuide AI'n Hojjetame",
        "description": "Meeshaalee barnoota keetii mul'isuuf fi qindeessuuf kaartaa sammuu AI uumi",
        "loading": "Uumaa Kaartaa Sammuu fe'aa jira...",
        "error": "Uumaa Kaartaa Sammuu fe'uu hin dandeenye",
        "errorDescription": "Uumaan Kaartaa Sammuu fe'amuu hin dandeenye. Maaloo irra deebi'ii yaali.",
        "openExternal": "Geessituu Alaa Keessatti Bani",
        "note": "Yaadannoo: Dhimmoota walxaxaa hubachuuf kaartaa sammuu mul'ataa uumi.",
        "launch": "Jalqabi"
      },
      "chatgpt": {
        "title": "ChatGPT",
        "description": "Ibsa argachuuf, rakkoo furuu fi yaad-rimee haaraa barachuuf AI waliin haasa'i."
      },
      "gemini": {
        "title": "Google Gemini",
        "description": "Gargaaraa AI Google kan ol'aanaa qorannoo, barreeffama fi rakkoo kalaqaa furuuf."
      },
      "exam": {
        "status": {
          "published": "Maxxanfame",
          "draft": "Wixinee",
          "ended": "Xumurame",
          "upcoming": "Dhufu",
          "active": "Hojii Irra",
          "notAvailable": "Ammatti Hin Jiru",
          "alreadyAttempted": "Yaalameera"
        },
        "action": {
          "start": "Qormaata Jalqabi",
          "edit": "Gulaali",
          "results": "Bu'aa"
        },
        "info": {
          "min": "daq",
          "questions": "gaafiwwan",
          "attempts": "yaalii",
          "startsIn": "Daq {{time}} keessatti jalqabu",
          "starts": "{{time}} tti jalqaba",
          "endsIn": "Daq {{time}} keessatti xumurama",
          "openNow": "Ammuma ni banaadha"
        },
        "stat": {
          "vsLastWeek": "torban darbee wajjin"
        }
      },
      "hero": {
        "badge": "Platformii Madaallii #1",
        "titlePre": "Madaallii Keessan",
        "titleHighlight": "To'adhaa",
        "description": "Dhaabbata keessan furmaata qormaataa amansiisaa, babal'achuu danda'u fi hayyamaa ta'een humneessaa. Barnoota ammayyaaf kan qophaa'e."
      },
      "features": {
        "heading": "Wanta Isin Barbaaddan Hunda",
        "subheading": "Qormaata onlaayinii salphaa fi bu'a qabeessa taasisuuf wanti hundi qophaahee jira .",
        "secure": {
          "title": "Amansiisaa fi Wabii",
          "desc": "Nageenya sadarkaa dhaabbataa kan to'annoo gahee irratti hundaa'e fi tooftaa qorannoo eegu."
        },
        "timed": {
          "title": "Madaallii Yeroo",
          "desc": "To'annoo yeroo ofumaan hojjetu kan ofumaan galchuu fi lakkoofsa yeroo qabu."
        },
        "results": {
          "title": "Bu'aa Battalaa",
          "desc": "Qabxii battalaa fi yaada barattootaaf kennuu yeroo galchan."
        },
        "analytics": {
          "title": "Qaaccessa Gadi Fageenyaa",
          "desc": "Gabaasa raawwii guutuu fi hubannoo barattootaa fi qorattootaaf."
        },
        "badges": {
          "freeSetup": "Qophii Bilisaa",
          "secure": "Nageenya",
          "fast": "Saffisaa"
        }
      },
      "validations": {
        "required": "{{field}} dirqama",
        "email": {
          "invalid": "Maaloo imeelii sirrii galchaa",
          "max": "Imeeliin qubee 255 gadi ta'uu qaba"
        },
        "password": {
          "min": "Jechi darbii yoo xiqqaate qubee 6 qabaachuu qaba",
          "max": "Jechi darbii qubee 72 gadi ta'uu qaba",
          "complexity": "Jechi darbii yoo xiqqaate qubee guddaa tokko, qubee xiqqaa tokko fi lakkoofsa tokko of keessaa qabaachuu qaba",
          "match": "Jechi darbii wal hin simne"
        },
        "name": {
          "max": "Maqaan qubee 100 gadi ta'uu qaba",
          "pattern": "Maqaan qubee, iddoo duwwaa, sararaa fi ' qofa of keessaa qabaachuu danda'a"
        },
        "exam": {
          "titleMax": "Matadureen qubee 200 gadi ta'uu qaba",
          "descMax": "Ibsi qubee 1000 gadi ta'uu qaba",
          "durationMin": "Yeroon yoo xiqqaate daqiiqaa 1 ta'uu qaba",
          "durationMax": "Yeroon sa'aatii 8 caaluu hin danda'u",
          "attemptsMin": "Yoo xiqqaate yaalii 1 hayyamuu qaba",
          "attemptsMax": "Yaalii 10 caaluu hin danda'u"
        },
        "question": {
          "textMax": "Gaaffiin qubee 2000 gadi ta'uu qaba",
          "optionEmpty": "Filannoon duwwaa ta'uu hin danda'u",
          "optionsMin": "Yoo xiqqaate filannoo 2 barbaachisa",
          "optionsMax": "Filannoo 6 caaluu hin danda'u",
          "correctOption": "Maaloo deebii sirrii filadhu",
          "marksMin": "Qabxiin yoo xiqqaate 1 ta'uu qaba",
          "marksMax": "Qabxiin 100 caaluu hin danda'u"
        }
      }
    }
  },
  am: {
    translation: {
      "common": {
        "examPro": "ExamPro",
        "signIn": "ግባ",
        "back": "ተመለስ",
        "getStarted": "አሁን ይጀምሩ",
        "learnMore": "ተጨማሪ ይወቁ",
        "welcomeBack": "እንኳን በደህና መጡ",
        "signInSubtitle": "ወደ ዳሽቦርድዎ ለመቀጠል ይግቡ",
        "email": "ኢሜይል",
        "password": "የይለፍ ቃል",
        "login": "ግባ",
        "signup": "ይመዝገቡ",
        "forgotPassword": "የይለፍ ቃል ረሱ?",
        "noAccount": "መለያ የለዎትም?",
        "hasAccount": "መለያ አለዎት?",
        "or": "ወይም",
        "fullName": "ሙሉ ስም",
        "confirmPassword": "የይለፍ ቃል ያረጋግጡ",
        "selectRole": "ሚና ይምረጡ",
        "student": "ተማሪ",
        "teacher": "አስተማሪ",
        "admin": "አስተዳዳሪ",
        "department": "የትምህርት ክፍል",
        "selectDepartment": "የትምህርት ክፍልዎን ይምረጡ",
        "loading": "በመጫን ላይ...",
        "noDepartments": "ምንም የትምህርት ክፍል የለም",
        "install": {
          "title": "ExamPro ን ይጫኑ",
          "desc": "በቀላሉ ለመድረስ ወደ መነሻ ገጽዎ ያክሉ",
          "button": "ይጫኑ",
          "ios": {
            "title": "በ iOS ላይ ይጫኑ",
            "step1": "የማጋራት አዝራሩን ይንኩ",
            "step2": "'ወደ መነሻ ገጽ አክል'ን ይምረጡ"
          }
        },
        "viewAll": "ሁሉንም ይመልከቱ",
        "profile": "መገለጫ",
        "settings": "ቅንብሮች",
        "signOut": "ውጣ",
        "footer": {
          "privacy": "የግላዊነት መመሪያ",
          "terms": "የአገልግሎት ውል",
          "support": "ድጋፍ",
          "contact": "እኛን ያግኙ",
          "rights": "© {{year}} ExamPro. መብቱ በህግ የተጠበቀ ነው።"
        },
        "resetPassword": {
          "sentTitle": "የዳግም ማስጀመሪያ ኢሜይል ተልኳል",
          "sentDesc": "የይለፍ ቃል ዳግም ማስጀመሪያ መመሪያዎችን ለማግኘት የገቢ መልእክት ሳጥንዎን ይመልከቱ።",
          "failedTitle": "የዳግም ማስጀመሪያ ኢሜይል መላክ አልተቻለም",
          "failedDesc": "እባክዎ ቆይተው እንደገና ይሞክሩ",
          "checkEmail": "ኢሜይልዎን ይመልከቱ",
          "sentTo": "የይለፍ ቃል ዳግም ማስጀመሪያ አገናኝ ወደዚህ ልከናል",
          "backToSignIn": "ወደ መግቢያ ተመለስ",
          "title": "የይለፍ ቃል ረሱ?",
          "subtitle": "ኢሜይልዎን ያስገቡ እና የዳግም ማስጀመሪያ አገናኝ እንልክልዎታለን"
        }
      },
      "admin": {
        "exams": {
          "title": "ፈተናዎችን ያስተዳድሩ",
          "titleMy": "የእኔ ፈተናዎች",
          "subtitle": "ሁሉንም ፈተናዎች ይፍጠሩ እና ያስተዳድሩ",
          "subtitleMy": "የፈጠሩትን ፈተናዎች ያስተዳድሩ",
          "create": "ፈተና ይፍጠሩ",
          "tabs": {
            "all": "ሁሉም",
            "published": "ታትሟል",
            "drafts": "ረቂቅ"
          },
          "empty": {
            "title": "ምንም ፈተና አልተገኘም",
            "description": "የመጀመሪያውን ፈተና በመፍጠር ይጀምሩ",
            "action": "ፈተና ይፍጠሩ"
          },
          "form": {
            "createTitle": "አዲስ ፈተና ይፍጠሩ",
            "editTitle": "ፈተናን ያርትዑ",
            "subtitle": "የፈተና ዝርዝሮችዎን ያዋቅሩ",
            "basicInfo": "መሰረታዊ መረጃ",
            "settings": "የፈተና ቅንብሮች",
            "title": "የፈተና ርዕስ",
            "titlePlaceholder": "ለምሳሌ፣ የሂሳብ አጋማሽ ፈተና",
            "description": "መግለጫ",
            "descriptionPlaceholder": "ይህ ፈተና ስለ ምን እንደሆነ ይግለጹ...",
            "department": "የትምህርት ክፍል",
            "selectDepartment": "የትምህርት ክፍል ይምረጡ",
            "allDepartments": "ሁሉም የትምህርት ክፍሎች",
            "departmentHelp": "ለ\"ሁሉም የትምህርት ክፍሎች\" የተመደቡ ፈተናዎች ለሁሉም ይታያሉ።",
            "duration": "ቆይታ (ደቂቃዎች)",
            "maxAttempts": "ከፍተኛ ሙከራዎች",
            "startTime": "የመጀመሪያ ጊዜ (አማራጭ)",
            "endTime": "የማብቂያ ጊዜ (አማራጭ)",
            "shuffleQuestions": "ጥያቄዎችን ያቀላቅሉ",
            "shuffleQuestionsDesc": "ለእያንዳንዱ ተማሪ የጥያቄ ቅደም ተከተል በዘፈቀደ ያድርጉ",
            "shuffleOptions": "አማራጮችን ያቀላቅሉ",
            "shuffleOptionsDesc": "የመልስ አማራጮች ቅደም ተከተል በዘፈቀደ ያድርጉ",
            "cancel": "ይቅር",
            "create": "ይፍጠሩ እና ጥያቄዎችን ያክሉ",
            "creating": "በመፍጠር ላይ...",
            "save": "ለውጦችን ያስቀምጡ",
            "saving": "በማስቀመጥ ላይ..."
          },
          "questions": {
            "title": "ጥያቄዎች",
            "add": "ጥያቄ ጨምር",
            "addFirst": "የመጀመሪያ ጥያቄዎን ይጨምሩ",
            "noQuestions": "ምንም ጥያቄዎች የሉም",
            "questionText": "የጥያቄ ጽሑፍ",
            "questionPlaceholder": "ጥያቄዎን እዚህ ያስገቡ...",
            "options": "ምርጫዎች (ትክክለኛውን መልስ ይምረጡ)",
            "optionPlaceholder": "ምርጫ {{number}}",
            "explanation": "ማብራሪያ (አማራጭ)",
            "explanationPlaceholder": "መልሱ ለምን ትክክል እንደሆነ ያብራሩ...",
            "explanationHelp": "በ\"ፈጣን ግብረመልስ\" ሁነታ ምርጫ በኋላ ወዲያውኑ ይታያል፣ ወይም በ\"ድብቅ\" ሁነታ ከማስረከብ በኋላ ብቻ ይታያል።",
            "feedbackType": "የግብረመልስ አይነት",
            "instantFeedback": "ፈጣን ግብረመልስ",
            "hiddenFeedback": "ድብቅ (ከማስረከብ በኋላ)",
            "marks": "ነጥብ",
            "feedback": "ግብረመልስ:",
            "on": "በርቷል (ፈጣን)",
            "off": "ጠፍቷል (ድብቅ)",
            "publish": "አትም",
            "unpublish": "ከህትመት አውርድ",
            "save": "አስቀምጥ",
            "saving": "በማስቀመጥ ላይ...",
            "deleteTitle": "ጥያቄ ሰርዝ",
            "deleteDesc": "እርግጠኛ ነዎት ይህን ጥያቄ መሰረዝ ይፈልጋሉ? ይህ ድርጊት ሊቀለበስ አይችልም።",
            "deleteCancel": "ተው",
            "deleteConfirm": "ሰርዝ"
          },
          "toasts": {
            "errorLoading": "ፈተናውን መጫን አልተቻለም",
            "questionDeleted": "ጥያቄው ተሰርዟል",
            "settingsUpdated": "ቅንብሮች ተዘምነዋል",
            "examUpdated": "ፈተናው በተሳካ ሁኔታ ተዘምኗል",
            "published": "ፈተናው ታትሟል",
            "unpublished": "ፈተናው ከህትመት ወርዷል",
            "publishedDesc": "ተማሪዎች አሁን ይህንን ፈተና መውሰድ ይችላሉ።",
            "unpublishedDesc": "ተማሪዎች ይህንን ፈተና ከአሁን በኋላ ማግኘት አይችሉም።",
            "invalidQuestions": "የተሳሳቱ ጥያቄዎች",
            "fillAllFields": "እባክዎ ሁሉንም የጥያቄ መስኮች እና አማራጮች ይሙሉ።",
            "examSaved": "ፈተናው ተቀምጧል!",
            "saveFailed": "ማስቀመጥ አልተቻለም",
            "cannotPublish": "ማተም አልተቻለም",
            "addQuestionFirst": "ከማተምዎ በፊት ቢያንስ አንድ ጥያቄ ይጨምሩ።",
            "updateFailed": "ማዘመን አልተቻለም",
            "feedbackUpdate": "የግብረመልስ ቅንብሮች ወደ {{type}} ተዘምነዋል"
          },
          "bulkImport": {
            "trigger": "በብዛት አስገባ",
            "title": "ጥያቄዎችን በብዛት አስገባ",
            "description": "ጥያቄዎችዎን ከዚህ በታች ይለጥፉ። ይህንን ቅርጸት ይከተሉ: \"1. የጥያቄ ጽሑፍ\", \"A. አማራጭ\", እና መልሱን በ \"*\" ወይም \"Answer: X\" ይለዩ።",
            "placeholder": "1. 2 + 2 ስንት ነው?\nA. 3\nB. 4 *\nC. 5\nD. 6\n\n2. የፈረንሳይ ዋና ከተማ ማን ናት?\nA. London\nB. Berlin\nC. Paris\nAnswer: C",
            "explanation": "ማብራሪያ:",
            "parsingErrors": "የትንታኔ ስህተቶች",
            "readyToImport": "ለማስገባት ዝግጁ",
            "foundQuestions": "{{count}} ትክክለኛ ጥያቄዎች ተገኝተዋል። አማራጮች በትክክል መመደባቸውን ለማረጋገጥ ከላይ ያለውን ቅድመ-እይታ ይገምግሙ።",
            "editText": "ጽሑፍ ያርትዑ",
            "cancel": "ይቅር",
            "analyze": "ጽሑፍን ይተንትኑ",
            "analyzing": "በመተንተን ላይ...",
            "import": "ጥያቄዎችን አስገባ",
            "importing": "በማስገባት ላይ...",
            "successTitle": "ማስገባት ተሳክቷል",
            "successDesc": "{{count}} ጥያቄዎች በተሳካ ሁኔታ ገብተዋል።",
            "failedTitle": "ማስገባት አልተሳካም",
            "failedDesc": "ጥያቄዎችን ወደ ዳታቤዝ ማስቀመጥ አልተቻለም።",
            "parseError": "የትንታኔ ስህተት",
            "unexpectedError": "በትንታኔ ጊዜ ያልተጠበቀ ስህተት አጋጥሟል።",
            "errors": {
              "missingText": "ጥያቄ {{n}}: የጥያቄ ጽሑፍ የለም።",
              "minOptions": "ጥያቄ {{n}}: ቢያንስ 2 አማራጮች ሊኖሩት ይገባል።",
              "noCorrect": "ጥያቄ {{n}}: ትክክለኛ መልስ አልተገኘም። '*' ወይም 'Answer: X' ይጠቀሙ።",
              "indexBounds": "ጥያቄ {{n}}: ትክክለኛ መልስ ቁጥር ከክልል ውጭ ነው።"
            }
          }
        },
        "results": {
          "title": "የሁሉም ተማሪ ውጤቶች",
          "subtitle": "የሁሉም ተማሪዎች የፈተና ውጤቶችን በአንድ ቦታ ይመልከቱ",
          "export": {
            "button": "ውጤቶችን ላክ",
            "csv": "እንደ CSV ላክ",
            "pdf": "እንደ PDF ላክ"
          },
          "stats": {
            "totalAttempts": "ጠቅላላ ሙከራዎች",
            "avgScore": "አማካይ ውጤት",
            "passRate": "የማለፍ መጠን",
            "examsWithResults": "ውጤት ያላቸው ፈተናዎች"
          },
          "searchPlaceholder": "በተማሪ ስም፣ ኢሜይል ወይም ፈተና ይፈልጉ...",
          "filterExam": "በፈተና አጣራ",
          "allExams": "ሁሉም ፈተናዎች",
          "table": {
            "title": "ውጤቶች",
            "student": "ተማሪ",
            "email": "ኢሜይል",
            "exam": "ፈተና",
            "score": "ውጤት",
            "percentage": "መቶኛ",
            "submitted": "ገብቷል",
            "timeSpent": "የወሰደው ጊዜ",
            "status": "ሁኔታ"
          },
          "status": {
            "published": "ታትሟል",
            "hidden": "ተደብቋል"
          },
          "empty": {
            "title": "ምንም ውጤት አልተገኘም",
            "filter": "ማጣሪያዎችዎን ለማስተካከል ይሞክሩ",
            "description": "ተማሪዎች ፈተናዎችን ሲያጠናቅቁ ውጤቶች ይታያሉ"
          }
        },
        "analytics": {
          "title": "ትንታኔ",
          "subtitle": "የፈተና አፈጻጸም እና ስታቲስቲክስ አጠቃላይ እይታ",
          "stats": {
            "totalStudents": "ጠቅላላ ተማሪዎች",
            "totalExams": "ጠቅላላ ፈተናዎች",
            "completedAttempts": "የተጠናቀቁ ሙከራዎች",
            "averageScore": "አማካይ ውጤት"
          },
          "charts": {
            "examPerformance": "የፈተና አፈጻጸም",
            "scoreDistribution": "የውጤት ስርጭት",
            "avgScoreLabel": "አማካይ ውጤት %"
          },
          "empty": {
            "title": "እስካሁን ምንም ውሂብ የለም",
            "description": "ተማሪዎች ፈተናዎችን ሲያጠናቅቁ ትንታኔ ይታያል"
          }
        }
      },
      "student": {
        "exams": {
          "title": "ያሉ ፈተናዎች",
          "subtitle": "ፈተናዎችን ያስሱ እና ይውሰዱ",
          "empty": {
            "title": "ምንም ፈተና የለም",
            "description": "በአሁኑ ጊዜ ምንም የታተሙ ፈተናዎች የሉም። እባክዎ በኋላ ተመልሰው ያረጋግጡ።"
          }
        },
        "results": {
          "title": "የእኔ ውጤቶች",
          "subtitle": "የፈተና ውጤትዎን ይመልከቱ",
          "status": {
            "passed": "አልፏል",
            "failed": "ወድቋል",
            "pending": "ውጤት በመጠባበቅ ላይ"
          },
          "marks": "ነጥብ",
          "time": "ሰዓት: {{time}}",
          "submitted": "የተረከበው: {{date}}",
          "exam": {
            "notFound": "ፈተናው አልተገኘም",
            "maxAttempts": "የሙከራ ገደብ ተደርሷል",
            "maxAttemptsDesc": "ይህንን ፈተና ከዚህ በፊት {{count}} ጊዜ ወስደዋል::",
            "errorLoading": "ፈተናውን መጫን አልተቻለም",
            "loading": "ፈተናው በመጫን ላይ...",
            "startFailed": "ፈተናውን መጀመር አልተቻለም",
            "submitted": "ፈተናው ተረክቧል!",
            "submittedDesc": "ፈተናዎ በተሳካ ሁኔታ ተረክቧል::",
            "submitFailed": "ፈተናውን ማስረከብ አልተቻለም",
            "startDialog": {
              "title": "ፈተና ይጀምሩ",
              "desc": "ፈተናውን ለመጀመር ዝግጁ ነዎት? ሰዓት ቆጣሪው ወዲያውኑ ይጀምራል::",
              "duration": "ቆይታ: {{minutes}} ደቂቃዎች",
              "questions": "ጥያቄዎች: {{count}}",
              "timer": "ሰዓት ቆጣሪው ወዲያውኑ ይጀምራል",
              "warning": "ይህንን ገጽ አያድሱ ወይም አይውጡ",
              "cancel": "ተው",
              "start": "ጀምር"
            },
            "submitDialog": {
              "title": "ፈተና ያስረክቡ",
              "desc": "እርግጠኛ ነዎት ማስረከብ ይፈልጋሉ? ካስረከቡ በኋላ መልስዎን መቀየር አይችሉም::",
              "answered": "ከ {{total}} ጥያቄዎች {{answered}} መልሰዋል::",
              "warning": "ማስጠንቀቂያ: {{unanswered}} ያልተመለሱ ጥያቄዎች አሉዎት::",
              "continue": "ፈተናውን ይቀጥሉ",
              "submitting": "በማስረከብ ላይ...",
              "cancel": "ተው",
              "submit": "ያስረክቡ"
            },
            "question": "ጥያቄ {{current}} ከ {{total}}",
            "previous": "ቀዳሚ",
            "next": "ቀጣይ",
            "submit": "ያስረክቡ",
            "timeRemaining": "የቀረው ጊዜ",
            "questionNavigator": "የጥያቄ መቃኛ",
            "timeUp": {
              "title": "ሰዓት አልቋል!",
              "description": "ፈተናዎ በራስ-ሰር እየተረከበ ነው።"
            },
            "shortcuts": {
              "trigger": "አቋራጮች",
              "title": "የቁልፍ ሰሌዳ አቋራጮች",
              "next": "ቀጣይ ጥያቄ",
              "prev": "ቀዳሚ",
              "select": "ምርጫ ይምረጡ",
              "submit": "ያስረክቡ"
            },
            "card": {
              "marks": "{{count}} ነጥብ",
              "marks_plural": "{{count}} ነጥቦች",
              "explanation": "ማብራሪያ:"
            }
          },
          "review": "መልሶችን ይገምግሙ",
          "pendingMessage": "ውጤትዎ ፈታኙ ሲያሳትም ይገኛል።",
          "empty": {
            "title": "እስካሁን ምንም ውጤት የለም",
            "description": "ውጤትዎን እዚህ ለማየት ፈተና ያጠናቅቁ"
          }
        },
        "messages": {
          "title": "መልዕክቶች",
          "subtitle": "አስተዳዳሪዎችን ያነጋግሩ",
          "send": "ላክ",
          "sending": "በመላክ ላይ...",
          "newMessage": "አዲስ መልዕክት",
          "writeMessage": "መልዕክትዎን ይፃፉ...",
          "writeComment": "አስተያየትዎን ወይም ጥያቄዎን ለአስተዳዳሪዎች ይፃፉ...",
          "noMessages": "እስካሁን ምንም መልዕክት የለም",
          "noMessagesDesc": "ከአስተዳዳሪዎች ጋር ውይይት ይጀምሩ",
          "messageSent": "መልዕክት ተልኳል",
          "messageSentDesc": "መልዕክትዎ ለአስተዳዳሪዎች ተልኳል",
          "sendFailed": "መላክ አልተቻለም",
          "sendFailedDesc": "እባክዎ እንደገና ይሞክሩ",
          "writeMessageError": "መልዕክት ይፃፉ",
          "writeMessageErrorDesc": "እባክዎ አስተያየትዎን ያስገቡ።",
          "deleteConfirm": "ይህን መልዕክት መሰረዝ እርግጠኛ ነዎት? ይህ ድርጊት መልሰው ማግኘት አይችሉም።",
          "messageDeleted": "መልዕክት ተሰርዟል",
          "deleteFailed": "መሰረዝ አልተቻለም",
          "deleteFailedDesc": "እባክዎ እንደገና ይሞክሩ"
        }
      },
      "dashboard": {
        "welcome": "እንኳን በደህና መጡ፣ {{name}}!",
        "adminSubtitle": "ከፈተናዎችዎ ጋር እየተከናወነ ያለው ይኸውና",
        "studentSubtitle": "የእድገትዎ አጠቃላይ እይታ ይኸውና",
        "createExam": "ፈተና ይፍጠሩ",
        "recentExams": "የቅርብ ጊዜ ፈተናዎች",
        "availableExams": "ያሉ ፈተናዎች",
        "upcomingExams": "መጪ ፈተናዎች",
        "menu": {
          "dashboard": "ዳሽቦርድ",
          "manageExams": "ፈተናዎችን ያስተዳድሩ",
          "allResults": "ሁሉም ውጤቶች",
          "students": "ተማሪዎች",
          "analytics": "ትንታኔ",
          "examiners": "ፈታኞች",
          "departments": "የትምህርት ክፍሎች",
          "myResults": "የእኔ ውጤቶች",
          "availableExams": "ያሉ ፈተናዎች"
        },
        "stats": {
          "totalExams": "ጠቅላላ ፈተናዎች",
          "activeExams": "ንቁ ፈተናዎች",
          "totalStudents": "ጠቅላላ ተማሪዎች",
          "completedAttempts": "የተጠናቀቁ ሙከራዎች",
          "availableExams": "ያሉ ፈተናዎች",
          "completedExams": "የተጠናቀቁ ፈተናዎች",
          "averageScore": "አማካይ ውጤት",
          "upcomingExams": "መጪ ፈተናዎች"
        },
        "noExams": "ምንም ፈተና የለም",
        "createFirstExam": "ለመጀመር የመጀመሪያውን ፈተና ይፍጠሩ",
        "noAvailableExams": "ምንም ፈተና የለም",
        "checkBackLater": "ለአዳዲስ ፈተናዎች በኋላ ተመልሰው ይመልከቱ",
        "noUpcomingExams": "ምንም መጪ ፈተና የለም",
        "caughtUp": "ሁሉንም ጨርሰዋል!"
      },
      "aiAssistant": {
        "title": "AI የጥናት ረዳት",
        "subtitle": "AI-የተጎለበተ የጥናት መሳሪያዎን ይምረጡ",
        "description": "Google NotebookLM በመጠቀም ለጥናትዎ AI-የተጎለበተ እገዛ ያግኙ",
        "notebookDescription": "ለጥናትዎ AI-የተጎለበተ እገዛ ያግኙ። ሰነዶችን ይስቀሉ፣ ጥያቄዎችን ይጠይቁ እና ፈጣን መልሶችን ያግኙ።",
        "loading": "AI የጥናት ረዳት በመጫን ላይ...",
        "error": "AI የጥናት ረዳት መጫን አልተቻለም",
        "errorDescription": "AI የጥናት ረዳት መጫን አልተቻለም። እባክዎ እንደገና ይሞክሩ።",
        "openExternal": "በውጫዊ አሳሽ ውስጥ ክፈት",
        "note": "ማስታወሻ: እነዚህ መሳሪያዎች በአሳሽዎ ውስጥ ይከፈታሉ። NotebookLMን ለመጠቀም በGoogle መለያዎ መግባት ሊያስፈልግዎ ይችላል።",
        "launch": "ጀምር",
        "promptLibrary": {
          "title": "የፕሮምፕት መፍለጊያ",
          "subtitle": "ለጀማሪ፣ ለመካከለኛ እና ለማስተር ደረጃ ዝግጁ ፕሮምፕቶችን ይቅዱ እና ይቀይሩ።",
          "beginner": "ጀማሪ",
          "intermediate": "መካከለኛ",
          "mastery": "ማስተር",
          "prompts": {
            "beg1": {
              "title": "በቀላሉ አብራራ",
              "text": "[topic] በቀላሉ አብራራ፣ ከእውቂያ ምሳሌ፣ 3 ዋና ነጥቦች እና 3 ጥያቄ ከመልሶች ጋር ያቀርቡ።"
            },
            "beg2": {
              "title": "7‑ቀን የስልጠና እቅድ",
              "text": "ለ[subject] 7 ቀናት የስልጠና እቅድ ይፍጠሩ። በየቀኑ: 1 ግብ፣ 2 ምንጮች፣ 20 ደቂቃ ልምድ ሥራ እና አጭር የመደመር ጥያቄ።"
            },
            "beg3": {
              "title": "ጀማሪ: በእርምጃ በእርምጃ መምሪያ (ሙሉ ፕሮምፕት)",
              "text": "🟢 ጀማሪ ደረጃ ፕሮምፕት:\nእንደ ተማሪ ጓደኛ እና ረዳት መምህር ይሆኑ።\n\nመጀመሪያ ይጠይቁኝ፡ \"በምን ቋንቋ ልትማር ትፈልጋለህ?\"\nመልሴን ጠብቅ እና ትምህርቱን በዚያ ቋንቋ ቀጥል።\n\nከዚያ በኋላ ርዕስ ወይም ለማማር የምፈልገውን ፋይል ስለምንቀርብ ጠይቀኝ፡\n[ተጠቃሚው ርዕስ ይግቡ ወይም ፋይል ይስቀሉ]\n\nየማስተማር መመሪያዎች:\n1. ምን እንደምማር አጭር እና ቀላል ማጠቃለያ ስጠኝ።\n2. ከማጠቃለያው በኋላ \"Next\" እንዲጻፍ አስተውለኝ እና ደረጃ 1 ጀምር።\n3. ርዕሱን ወደ ትንሽ ንዑስ ርዕሶች ክፈል።\n4. በደረጃ 1 ብቻ ጀምር።\n5. ግልጽ እና ቀላል ማብራሪያ ስጥ።\n6. ቀላል ቃላት እና የዕለታዊ ሕይወት ምሳሌዎች ተጠቀም።\n7. ለዚያ ደረጃ ቢያንስ 3 ምሳሌዎች ስጥ።\n8. ግንዛቤ ለመፈተን 5 የMCQ ጥያቄዎች ስጥ።\n9. ሀሳቡን በራሴ ቃላት እንድለምን አጭር ጥያቄ ጠይቀኝ።\n10. ደረጃውን በአጭር ማጠቃለያ ጨርስ።\n\nደረጃው ከተጠናቀቀ በኋላ ቆም እና ጠብቀኝ።\n\"Next\" ሲል ሲጻፍ እቀጥላለሁ።"
            },
            "int1": {
              "title": "በእርምጃ የተከተለ ልምድ ጥያቄዎች",
              "text": "በ[topic] ላይ 5 ልምድ ጥያቄዎች ከቀላል→ከባድ ይስጡ። እያንዳንዱን ከሞክርሁ በኋላ በእርምጃ የተከተለ መልስ እና የተለመዱ ስህተቶች አሳዩ።"
            },
            "int2": {
              "title": "አጭር ማጠቃለያ + ግንዛቤ ማረጋገጥ",
              "text": "ይህን ጽሑፍ በነጥብ-መደብ አጭር ያድርጉ፣ ከዚያ 10 የተለያዩ ጥያቄዎች (MCQ፣ አጭር መልስ) ጠይቁ እና ከማብራሪያ ጋር መልስ ቁልፍ ይስጡ።"
            },
            "int3": {
              "title": "መካከለኛ: የባለሙያ መመሪያ (ሙሉ ፕሮምፕት)",
              "text": "🟡 መካከለኛ ደረጃ ፕሮምፕት:\nእንደ ባለሙያ መምህር ይመሩ።\n\nመጀመሪያ ይጠይቁኝ፡ \"በምን ቋንቋ ልትማር ትፈልጋለህ?\"\nመልሴን ጠብቅ እና ትምህርቱን በዚያ ቋንቋ ቀጥል።\n\nከዚያ በኋላ ርዕስ ወይም ለማማር የምፈልገውን ፋይል ጠይቀኝ:\n[ተጠቃሚው ርዕስ ይግቡ ወይም ፋይል ይስቀሉ]\n\nመመሪያዎች:\n1. ምን እንደምማር አጭር እይታ ስጥ።\n2. \"Next\" እንዲጻፍ አስተውለኝ እና ደረጃ 1 ጀምር።\n3. ርዕሱን ወደ ሎጂካዊ እርምጃዎች ክፈል።\n4. በደረጃ 1 ብቻ ጀምር።\n5. ግልጽ እና የተዋቀረ ማብራሪያ ስጥ።\n6. ቀላል ቋንቋ ተጠቀም ግን አስፈላጊ ቴክኒክ ፅንሰ-ሀሳቦች አካትት።\n7. የዕለታዊ ሕይወት ምሳሌዎች ስጥ።\n8. ቢያንስ 3 ምሳሌዎች ስጥ።\n9. ግንዛቤን ለመፈተን 5 MCQ ስጥ።\n10. አጭር የማብራሪያ ጥያቄ ጠይቀኝ።\n11. እርምጃውን በአጭር ማጠቃለያ ጨርስ።\n\nእርምጃው ከተጠናቀቀ በኋላ ቆም እና ጠብቀኝ።\n\"Next\" ሲል ሲጻፍ እቀጥላለሁ።"
            },
            "mas1": {
              "title": "Socratic ልምድ",
              "text": "እንደ መምህር ይሆኑ። በ[topic] ላይ ጥርጣሬ ያለ ጥያቄ ይጠይቁ፣ ውስብስብነትን ያስጨምሩ። ምክር ሲጠይቅ ብቻ ይስጡ። በአስተሳሰብ ላይ ግብረመልስ ይስጡ።"
            },
            "mas2": {
              "title": "የፈተና ቅርጽ ጥያቄዎች ከረብሪክ ጋር",
              "text": "ለ[course] የተቀላቀሉ 12 ጥያቄዎች ይፍጠሩ፡ MCQ 6፣ አጭር መልስ 4፣ case study 2። የችግኝነት መለያዎችን እና የማረጋገጫ መለኪያ (rubric) ካብ ያካትቱ።"
            },
            "mas3": {
              "title": "ማስተር: የፕሮፌሰር ደረጃ መንገድ መምሪያ (ሙሉ ፕሮምፕት)",
              "text": "🔴 የላቀ / ማስተር ደረጃ ፕሮምፕት:\nእንደ ፕሮፌሰር እና መነጋገር ረዳት ይሆኑ።\n\nመጀመሪያ ይጠይቁኝ፡ \"በምን ቋንቋ ልትማር ትፈልጋለህ?\"\nመልሴን ጠብቅ እና ትምህርቱን በዚያ ቋንቋ ቀጥል።\n\nከዚያ በኋላ ርዕስ ወይም ለማማር የምፈልገውን ፋይል ጠይቀኝ:\n[ተጠቃሚው ርዕስ ይግቡ ወይም ፋይል ይስቀሉ]\n\nመመሪያዎች:\n1. ርዕሱን እና ምን እንደምማር አጭር እይታ ስጥ።\n2. \"Next\" እንዲጻፍ አስተውለኝ እና ደረጃ 1 ጀምር።\n3. ርዕሱን ወደ የላቀ ሞጁሎች ወይም ክፍሎች ክፈል።\n4. በደረጃ 1 ብቻ ጀምር።\n5. ጥልቅ ነገር ግን ግልጽ ማብራሪያ ስጥ።\n6. ቴክኒካዊ እና ቀላል ማብራሪያ አቀርብ።\n7. የዕለታዊ ሕይወት እና ከእውነተኛ ዓለም ምሳሌዎች ስጥ።\n8. ቢያንስ 3 ምሳሌዎች ስጥ።\n9. 5 ከባድ MCQ ስጥ።\n10. የግንዛቤ ጥርጣሬ ጥያቄ 1 አቅርብ።\n11. ተማሪዎች የሚያደርጉ የተለመዱ ስህተቶችን አስታውቅ።\n12. እርምጃውን በአጭር ማጠቃለያ ጨርስ።\n\nእያንዳንዱ እርምጃ ከተጠናቀቀ በኋላ ቆም እና ጠብቀኝ።\n\"Next\" ሲል ሲጻፍ እቀጥላለሁ።"
            }
          }
        }
      },
      "mindMap": {
        "title": "የአእምሮ ካርታ ጀነሬተር",
        "subtitle": "በCogniGuide AI የተጎለበተ",
        "description": "የጥናት ቁሳቁሶችዎን ለማየት እና ለማደራጀት AI-የተጎለበተ የአእምሮ ካርታዎችን ይፍጠሩ",
        "loading": "የአእምሮ ካርታ ጀነሬተር በመጫን ላይ...",
        "error": "የአእምሮ ካርታ ጀነሬተር መጫን አልተቻለም",
        "errorDescription": "የአእምሮ ካርታ ጀነሬተር መጫን አልተቻለም። እባክዎ እንደገና ይሞክሩ።",
        "openExternal": "በውጫዊ አሳሽ ውስጥ ክፈት",
        "note": "ማስታወሻ: ውስብስብ ርዕሶችን በተሻለ ለመረዳት የእይታ የአእምሮ ካርታዎችን ይፍጠሩ።",
        "launch": "ጀምር"
      },
      "chatgpt": {
        "title": "ChatGPT",
        "description": "ማብራሪያዎችን ለማግኘት፣ ችግሮችን ለመፍታት እና አዳዲስ ፅንሰ-ሀሳቦችን በይነተገናኝ መንገድ ለመማር ከAI ጋር ይወያዩ።"
      },
      "gemini": {
        "title": "Google Gemini",
        "description": "ለምርምር፣ ለጽሁፍ እና ለፈጠራ ችግር መፍታት የGoogle የላቀ AI ረዳት።"
      },
      "exam": {
        "status": {
          "published": "ታትሟል",
          "draft": "ረቂቅ",
          "ended": "ተጠናቋል",
          "upcoming": "መጪ",
          "active": "ንቁ",
          "notAvailable": "አሁን አይገኝም",
          "alreadyAttempted": "ተሞክሯል"
        },
        "action": {
          "start": "ፈተና ይጀምሩ",
          "edit": "አርትዕ",
          "results": "ውጤቶች"
        },
        "info": {
          "min": "ደቂቃ",
          "questions": "ጥያቄዎች",
          "attempts": "ሙከራዎች",
          "endsIn": "በ{{time}} ደቂቃ ውስጥ ያበቃል",
          "openNow": "አሁን ክፍት ነው"
        },
        "stat": {
          "vsLastWeek": "ከባለፈው ሳምንት ጋር"
        }
      },
      "hero": {
        "badge": "የ #1 የምዘና መድረክ",
        "titlePre": "ምዘናዎን በብቃት",
        "titleHighlight": "ይምሩ",
        "description": "ተቋምዎን አስተማማኝ፣ ሊሰፋ የሚችል እና ብልህ በሆነ የፈተና መፍትሄ ያጠናክሩ። ለዘመናዊ ትምህርት የተነደፈ።"
      },
      "features": {
        "heading": "የሚያስፈልግዎት ነገር ሁሉ",
        "subheading": "የመስመር ላይ ፈተናዎችን ቀላል እና ውጤታማ ለማድረግ የተነደፉ የተሟሉ መሳሪያዎች።",
        "secure": {
          "title": "አስተማማኝ እና ደህንነቱ የተጠበቀ",
          "desc": "በሚና ላይ የተመሰረተ የመዳረሻ ቁጥጥር እና የማጭበርበር መከላከያ እርምጃዎች ያለው የድርጅት ደረጃ ደህንነት።"
        },
        "timed": {
          "title": "የጊዜ ገደብ ያላቸው ምዘናዎች",
          "desc": "በራስ-ሰር ማስረከብ እና የእውነተኛ ጊዜ ቆጠራ ያለው የራስ-ሰር የጊዜ መቆጣጠሪያ።"
        },
        "results": {
          "title": "ፈጣን ውጤቶች",
          "desc": "ልክ እንዳስገቡ ለተማሪዎች ፈጣን ውጤት እና ግብረመልስ መስጠት።"
        },
        "analytics": {
          "title": "ጥልቅ ትንታኔ",
          "desc": "ለተማሪዎች እና ለፈታኞች አጠቃላይ የአፈጻጸም ሪፖርቶች እና ግንዛቤዎች።"
        },
        "badges": {
          "freeSetup": "ነጻ ዝግጅት",
          "secure": "ደህንነቱ የተጠበቀ",
          "fast": "ፈጣን"
        }
      },
      "validations": {
        "required": "{{field}} ያስፈልጋል",
        "email": {
          "invalid": "እባክዎ ትክክለኛ ኢሜይል ያስገቡ",
          "max": "ኢሜይል ከ 255 ቁምፊዎች በታች መሆን አለበት"
        },
        "password": {
          "min": "የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት",
          "max": "የይለፍ ቃል ከ 72 ቁምፊዎች በታች መሆን አለበት",
          "complexity": "የይለፍ ቃል ቢያንስ አንድ ትልቅ ፊደል ፣ አንድ ትንሽ ፊደል እና አንድ ቁጥር መያዝ አለበት",
          "match": "የይለፍ ቃሎች አይዛመዱም"
        },
        "name": {
          "max": "ስም ከ 100 ቁምፊዎች በታች መሆን አለበት",
          "pattern": "ስም ፊደላትን ፣ ክፍተቶችን ፣ ሰረዞችን እና ' ብቻ መያዝ ይችላል"
        },
        "exam": {
          "titleMax": "ርዕስ ከ 200 ቁምፊዎች በታች መሆን አለበት",
          "descMax": "መግለጫ ከ 1000 ቁምፊዎች በታች መሆን አለበት",
          "durationMin": "ቆይታ ቢያንስ 1 ደቂቃ መሆን አለበት",
          "durationMax": "ቆይታ ከ 8 ሰዓታት መብለጥ የለበትም",
          "attemptsMin": "ቢያንስ 1 ሙከራ መፍቀድ አለበት",
          "attemptsMax": "ከ 10 ሙከራዎች መብለጥ የለበትም"
        },
        "question": {
          "textMax": "ጥያቄ ከ 2000 ቁምፊዎች በታች መሆን አለበት",
          "optionEmpty": "አማራጭ ባዶ መሆን የለበትም",
          "optionsMin": "ቢያንስ 2 አማራጮች ያስፈልጋሉ",
          "optionsMax": "ከ 6 አማራጮች መብለጥ የለበትም",
          "correctOption": "እባክዎ ትክክለኛ መልስ ይምረጡ",
          "marksMin": "ማርክ ቢያንስ 1 መሆን አለበት",
          "marksMax": "ማርክ ከ 100 መብለጥ የለበትም"
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
