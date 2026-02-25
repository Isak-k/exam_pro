# Exam Password Feature - Translation Keys

Add these translation keys to `src/lib/i18n.ts`:

## English (en.translation)

```javascript
// In admin.exams.form section:
"accessPassword": "Access Password/PIN",
"optional": "Optional",
"accessPasswordPlaceholder": "Enter password or PIN (e.g., 1234)",
"accessPasswordHelp": "Students will need this password to start the exam. Leave empty for no password.",

// In student.exam.startDialog section:
"passwordRequired": "Password required to start",

// Add new section student.exam.passwordDialog:
"passwordDialog": {
  "title": "Enter Exam Password",
  "description": "This exam requires a password to access. Please enter the password provided by your examiner.",
  "label": "Password/PIN",
  "placeholder": "Enter password",
  "incorrect": "Incorrect password. Please try again.",
  "cancel": "Back",
  "submit": "Start Exam"
}
```

## Oromo (om.translation)

```javascript
// In admin.exams.form section:
"accessPassword": "Jecha Iccitii/PIN Seensaa",
"optional": "Filannoo",
"accessPasswordPlaceholder": "Jecha iccitii ykn PIN galchi (fkn, 1234)",
"accessPasswordHelp": "Barattoonni qormaata jalqabuuf jecha iccitii kana barbaadu. Jecha iccitii hin barbaanne yoo ta'e duwwaa dhiisi.",

// In student.exam.startDialog section:
"passwordRequired": "Jalqabuuf jecha iccitii barbaachisa",

// Add new section student.exam.passwordDialog:
"passwordDialog": {
  "title": "Jecha Iccitii Qormaataa Galchi",
  "description": "Qormaanni kun seensuuf jecha iccitii barbaada. Maaloo jecha iccitii qorataan siif kenne galchi.",
  "label": "Jecha Iccitii/PIN",
  "placeholder": "Jecha iccitii galchi",
  "incorrect": "Jecha iccitii dogoggoraa. Maaloo irra deebi'ii yaali.",
  "cancel": "Duubatti",
  "submit": "Qormaata Jalqabi"
}
```

## Manual Steps Required

Since the i18n file is very large, you need to manually add these keys:

1. Open `src/lib/i18n.ts`
2. Find the `admin.exams.form` section in English
3. Add the `accessPassword`, `optional`, `accessPasswordPlaceholder`, and `accessPasswordHelp` keys
4. Find the `student.exam.startDialog` section
5. Add the `passwordRequired` key
6. Find the `student.exam` section
7. Add the entire `passwordDialog` object
8. Repeat steps 2-7 for the Oromo (om) translation section

## Quick Fix (Temporary)

If you want to test immediately without adding translations, the app will show the translation keys (e.g., "admin.exams.form.accessPassword") until you add the proper translations.
