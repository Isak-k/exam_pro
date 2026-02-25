import { useEffect, useState, useCallback } from "react";
import { getAllStudents, StudentWithStats, toggleStudentStatus, deleteStudent, createStudent } from "@/lib/firebase-admin";
import { getDepartments } from "@/lib/departments";
import { Department } from "@/integrations/firebase/types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Users, Edit, Trash2, Ban, CheckCircle, Plus } from "lucide-react";

const AdminStudents = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentWithStats[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentWithStats | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    fullName: "",
    email: "",
    password: "",
    departmentId: ""
  });
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    departmentId: ""
  });

  const fetchStudents = useCallback(async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, [fetchStudents, fetchDepartments]);

  const handleCreateStudent = async () => {
    if (!createForm.fullName || !createForm.email || !createForm.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Email, Password).",
        variant: "destructive",
      });
      return;
    }

    try {
      await createStudent({
        fullName: createForm.fullName,
        email: createForm.email,
        password: createForm.password,
        departmentId: createForm.departmentId || ""
      });

      toast({
        title: "Student created",
        description: `${createForm.fullName} has been successfully added.`,
      });

      setCreateDialogOpen(false);
      setCreateForm({ fullName: "", email: "", password: "", departmentId: "" });
      fetchStudents();
    } catch (error: any) {
      console.error("Error creating student:", error);
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create student.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (student: StudentWithStats) => {
    setSelectedStudent(student);
    setEditForm({
      fullName: student.fullName,
      email: student.email,
      departmentId: student.departmentId || ""
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedStudent) return;

    try {
      const userRef = doc(db, "users", selectedStudent.userId);
      await updateDoc(userRef, {
        fullName: editForm.fullName,
        email: editForm.email,
        departmentId: editForm.departmentId || null
      });

      toast({
        title: "Student updated",
        description: "Student information has been updated successfully.",
      });

      setEditDialogOpen(false);
      fetchStudents();
    } catch (error: any) {
      console.error("Error updating student:", error);
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (student: StudentWithStats) => {
    try {
      await toggleStudentStatus(student.userId);
      
      toast({
        title: student.disabled ? "Student enabled" : "Student disabled",
        description: student.disabled 
          ? `${student.fullName} can now log in.`
          : `${student.fullName} has been disabled and cannot log in.`,
      });

      fetchStudents();
    } catch (error: any) {
      console.error("Error toggling student status:", error);
      toast({
        title: "Action failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (student: StudentWithStats) => {
    setSelectedStudent(student);
    setViewDialogOpen(false); // Close view dialog if open
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;

    try {
      await deleteStudent(selectedStudent.userId);
      
      toast({
        title: "Student deleted",
        description: `${selectedStudent.fullName} has been permanently deleted.`,
      });

      setDeleteDialogOpen(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (error: any) {
      console.error("Error deleting student:", error);
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "badge-success";
    if (score >= 60) return "badge-warning";
    if (score > 0) return "badge-danger";
    return "";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view student performance
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 input-focus"
            />
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <Card 
                key={student.userId} 
                className="card-interactive cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => {
                  setSelectedStudent(student);
                  setViewDialogOpen(true);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {student.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base truncate">
                          {student.fullName}
                        </CardTitle>
                        {student.disabled && (
                          <Badge variant="destructive" className="text-xs">
                            Disabled
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {student.email}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {student.examsCompleted}
                      </span>{" "}
                      exams completed
                    </div>
                    {student.examsCompleted > 0 && (
                      <Badge variant="outline" className={getScoreBadge(student.averageScore)}>
                        {student.averageScore}% avg
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/50 rounded-xl">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">
              {search ? "No students found" : "No students yet"}
            </h3>
            <p className="text-muted-foreground text-sm">
              {search
                ? "Try a different search term"
                : "Students will appear here once they register"}
            </p>
          </div>
        )}

      {/* Student Profile View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {selectedStudent.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedStudent.fullName}</h3>
                  <p className="text-muted-foreground">{selectedStudent.email}</p>
                </div>
                {selectedStudent.disabled ? (
                  <Badge variant="destructive" className="px-3 py-1">
                    <Ban className="h-3 w-3 mr-1" /> Account Disabled
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                    <CheckCircle className="h-3 w-3 mr-1" /> Account Active
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y">
                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">
                    {departments.find(d => d.id === selectedStudent.departmentId)?.name || "Not Assigned"}
                  </p>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">
                    {selectedStudent.createdAt?.toDate ? selectedStudent.createdAt.toDate().toLocaleDateString() : "Unknown"}
                  </p>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground">Exams Taken</p>
                  <p className="font-medium">{selectedStudent.examsCompleted}</p>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="font-medium">
                    <span className={selectedStudent.averageScore >= 80 ? "text-green-600" : selectedStudent.averageScore >= 60 ? "text-yellow-600" : "text-red-600"}>
                      {selectedStudent.averageScore}%
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => handleEditClick(selectedStudent)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </Button>
                  <Button 
                    variant="outline" 
                    className={selectedStudent.disabled ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"}
                    onClick={() => {
                      handleToggleStatus(selectedStudent);
                      // Update the local selectedStudent state to reflect the change immediately in the UI
                      setSelectedStudent({
                        ...selectedStudent,
                        disabled: !selectedStudent.disabled
                      });
                    }}
                  >
                    {selectedStudent.disabled ? (
                      <><CheckCircle className="h-4 w-4 mr-2" /> Enable Access</>
                    ) : (
                      <><Ban className="h-4 w-4 mr-2" /> Disable Access</>
                    )}
                  </Button>
                </div>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => handleDeleteClick(selectedStudent)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Student
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Student Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Create a new student account. They will be able to log in with these credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Full Name</Label>
              <Input
                id="create-name"
                value={createForm.fullName}
                onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email Address</Label>
              <Input
                id="create-email"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                placeholder="student@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Password</Label>
              <Input
                id="create-password"
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                placeholder="Min. 6 characters"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-department">Department (Optional)</Label>
              <Select
                value={createForm.departmentId}
                onValueChange={(value) => setCreateForm({ ...createForm, departmentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Department</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateStudent}>Create Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department">Department</Label>
              <Select
                value={editForm.departmentId}
                onValueChange={(value) => setEditForm({ ...editForm, departmentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Department</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student account
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminStudents;
