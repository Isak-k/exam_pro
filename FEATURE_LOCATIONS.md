# Feature Locations - Quick Reference

## 🎯 Where to Find Each New Feature

### 1. Student Management (Full CRUD)

**Navigation Path**:
```
Login as Admin → Dashboard → Click "Students" in sidebar
```

**URL**: `http://localhost:8081/dashboard/students`

**What You'll See**:
```
┌─────────────────────────────────────────────────────┐
│ Students                                  [+ Add]   │
│ Manage and view student performance                │
├─────────────────────────────────────────────────────┤
│ [Search students...]                                │
├─────────────────────────────────────────────────────┤
│ ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│ │ Student  │  │ Student  │  │ Student  │          │
│ │ Card 1   │  │ Card 2   │  │ Card 3   │          │
│ │ [Click]  │  │ [Click]  │  │ [Click]  │          │
│ └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
```

**Click Any Student Card to See**:
- ✅ Edit Details button
- ✅ Enable/Disable Access button  
- ✅ Delete Student button

---

### 2. Department-Specific Publishing

**Navigation Path**:
```
Login as Admin → Dashboard → Exams → Click any exam → Click "Publish" button
```

**URL**: `http://localhost:8081/dashboard/exams/edit/[exam-id]`

**What You'll See**:
```
┌─────────────────────────────────────────────────────┐
│ Edit Exam                    [Delete] [Publish] [Save]│
├─────────────────────────────────────────────────────┤
│ Exam Settings                                       │
│ ...                                                 │
└─────────────────────────────────────────────────────┘
```

**Click "Publish" Button to See**:
```
┌─────────────────────────────────────────┐
│ 👥 Publish Exam                         │
├─────────────────────────────────────────┤
│ Select which departments can access     │
│                                         │
│ Available Departments:                  │
│ ☐ Computer Science                      │
│ ☐ Mathematics                           │
│ ☐ Physics                               │
│ ☐ Engineering                           │
│                                         │
│ ℹ️ All Departments: This exam will be  │
│    visible to students from all depts  │
│                                         │
│         [Cancel]  [👁️ Publish Exam]    │
└─────────────────────────────────────────┘
```

---

### 3. AI MCQ Generation from PDF

**Navigation Path**:
```
Login as Admin → Dashboard → Exams → Edit any exam → 
Scroll to Questions section → Click "Bulk Import" button
```

**URL**: Same as Edit Exam page, scroll down to Questions section

**What You'll See**:
```
┌─────────────────────────────────────────────────────┐
│ Questions (5)                                       │
│                    [Bulk Import] [+ Add Question]   │
├─────────────────────────────────────────────────────┤
│ Question cards...                                   │
└─────────────────────────────────────────────────────┘
```

**Click "Bulk Import" to See**:
```
┌─────────────────────────────────────────────────────┐
│ Bulk Import Questions                               │
├─────────────────────────────────────────────────────┤
│ [📄 Manual Input] [✨ AI Generation]  ← TABS       │
├─────────────────────────────────────────────────────┤
│                                                     │
│ AI MCQ Generation                                   │
│ Upload a PDF file and provide your AI API key      │
│                                                     │
│ PDF File:                                           │
│ [Choose File]                                       │
│                                                     │
│ AI API Key:                                         │
│ [••••••••••••]                                      │
│                                                     │
│ [📤 Generate MCQs from PDF]                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔍 Visual Indicators

### Student Cards
```
┌─────────────────────────────┐
│ 👤 JD  John Doe             │
│        john@example.com     │
│                             │
│ 3 exams completed    85% avg│
└─────────────────────────────┘
     ↑ Click to open profile
```

### Student Profile Dialog
```
┌─────────────────────────────────────┐
│ Student Profile                     │
├─────────────────────────────────────┤
│         👤                          │
│      John Doe                       │
│   john@example.com                  │
│   ✅ Account Active                 │
├─────────────────────────────────────┤
│ Department: CS    Joined: Jan 2024  │
│ Exams: 3          Avg: 85%          │
├─────────────────────────────────────┤
│ [✏️ Edit]  [🚫 Disable]            │
│ [🗑️ Delete Student]                │
└─────────────────────────────────────┘
```

### Department Selection
```
☑️ Computer Science  ← Selected (blue checkmark)
☐ Mathematics        ← Not selected
☑️ Physics           ← Selected (blue checkmark)
☐ Engineering        ← Not selected
```

### AI Generation Tab
```
Tab Active:    [📄 Manual Input] [✨ AI Generation]
                                  ↑ Blue underline
```

---

## 🎨 Color Coding

- **Green**: Active/Success states
- **Red**: Disabled/Delete actions
- **Blue**: Primary actions (Publish, Generate)
- **Gray**: Neutral/Inactive states

---

## 📱 Mobile View

All features adapt to mobile:
- Student cards stack vertically
- Dialogs become full-screen
- Buttons stack in columns
- Tabs remain horizontal (scrollable)

---

## ⚡ Quick Test Checklist

### Student Management
- [ ] Can see "Add Student" button
- [ ] Can click student cards
- [ ] Can see Edit/Disable/Delete buttons in profile
- [ ] Dialogs open and close properly

### Department Publishing
- [ ] "Publish" button visible in edit exam page
- [ ] Department selection dialog opens
- [ ] Checkboxes work
- [ ] Can publish to specific departments

### AI Generation
- [ ] "Bulk Import" button visible
- [ ] Two tabs appear in dialog
- [ ] "AI Generation" tab shows file upload
- [ ] API key input is password-masked

---

## 🐛 If Features Are Not Visible

1. **Clear Cache**: Ctrl+Shift+Delete → Clear all
2. **Hard Refresh**: Ctrl+F5
3. **Check Role**: Must be logged in as admin
4. **Check URL**: Verify you're on correct page
5. **Console**: F12 → Check for errors

---

## ✅ Success Confirmation

You'll know everything is working when:
1. ✅ Student cards show Edit/Disable/Delete options
2. ✅ Publish button shows department selection dialog
3. ✅ Bulk Import shows two tabs (Manual + AI)
4. ✅ No errors in browser console
5. ✅ All buttons are clickable and responsive

---

## 🎯 Test Scenarios

### Scenario 1: Create a Student
```
1. Go to /dashboard/students
2. Click "Add Student" (top right)
3. Fill in: Name, Email, Password
4. Select department (optional)
5. Click "Create Student"
6. ✅ New student appears in list
```

### Scenario 2: Publish to Specific Departments
```
1. Go to /dashboard/exams
2. Click any exam
3. Click "Publish" button
4. Check "Computer Science" and "Physics"
5. Click "Publish Exam"
6. ✅ Exam visible only to CS and Physics students
```

### Scenario 3: Try AI Generation
```
1. Edit any exam
2. Scroll to Questions
3. Click "Bulk Import"
4. Click "AI Generation" tab
5. ✅ See file upload and API key inputs
```

---

## 📞 Support

All features are live and accessible at:
- **Local**: http://localhost:8081/
- **Network**: http://10.232.80.197:8081/

Happy testing! 🚀