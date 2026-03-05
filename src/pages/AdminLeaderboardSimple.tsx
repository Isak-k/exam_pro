import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleLeaderboard } from "@/components/SimpleLeaderboard";
import { getDepartments } from "@/lib/simple-leaderboard";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { adminRefreshLeaderboardCache } from "@/lib/firebase-leaderboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminLeaderboardSimple() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshSignal, setRefreshSignal] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const depts = await getDepartments();
        setDepartments(depts);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="h-8 w-8 text-primary" />
              Leaderboard Management
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage leaderboard rankings across departments
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Department Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
              disabled={loading}
            >
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name || dept.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SimpleLeaderboard 
              departmentId={selectedDepartment === "all" ? undefined : selectedDepartment}
              refreshSignal={refreshSignal}
            />
            <div className="pt-2">
              <Button
                onClick={async () => {
                  try {
                    const deptArg = selectedDepartment === "all" ? undefined : selectedDepartment;
                    const res = await adminRefreshLeaderboardCache(deptArg);
                    toast({
                      title: "Cache refreshed",
                      description: res.message || "Leaderboard cache updated",
                    });
                    setRefreshSignal((n) => n + 1);
                  } catch (err: any) {
                    toast({
                      title: "Failed to refresh",
                      description: err?.message || "Unknown error",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Refresh Leaderboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
