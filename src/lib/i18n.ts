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
          "startsIn": "በ{{time}} ደቂቃ ውስጥ ይጀምራል",
          "starts": "{{time}} ይጀምራል",
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
