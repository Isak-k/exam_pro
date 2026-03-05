import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDepartments } from "@/lib/departments";
import { Department } from "@/integrations/firebase/types";
import { useTranslation } from "react-i18next";
import { Building, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoogleProfileSetupProps {
  email: string;
  displayName: string;
  onComplete: (fullName: string, departmentId: string) => void;
  loading: boolean;
}

export function GoogleProfileSetup({ email, displayName, onComplete, loading }: GoogleProfileSetupProps) {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [fullName, setFullName] = useState<string>(displayName || "");
  const [errors, setErrors] = useState<{ name?: string; department?: string }>({});

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Failed to fetch departments", error);
      } finally {
        setLoadingDepts(false);
      }
    };
    fetchDepts();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate full name
    if (!fullName.trim()) {
      setErrors(prev => ({ ...prev, name: t("common.fullName") + " is required" }));
      return;
    }

    if (fullName.trim().length < 2) {
      setErrors(prev => ({ ...prev, name: "Name must be at least 2 characters" }));
      return;
    }

    // Validate department
    if (!selectedDept) {
      setErrors(prev => ({ ...prev, department: t("common.selectDepartment") }));
      return;
    }

    onComplete(fullName.trim(), selectedDept);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-display font-bold">Complete Your Profile</h3>
        <p className="text-muted-foreground">
          Welcome! Please complete your profile to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Email</Label>
          <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
            <p className="text-sm">{email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="full-name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("common.fullName")} *
          </Label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors z-10" />
            <Input
              id="full-name"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrors(prev => ({ ...prev, name: undefined }));
              }}
              className={cn(
                "pl-12 h-12 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-cyan-500 focus:bg-white dark:focus:bg-gray-900 transition-all",
                errors.name && "border-red-500 focus:border-red-500"
              )}
              required
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-500 pl-2 flex items-center gap-1">
              <span className="text-xs">⚠</span> {errors.name}
            </p>
          )}
          <p className="text-xs text-muted-foreground pl-2">
            You can edit this if needed
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dept-select" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("common.department")} *
          </Label>
          <div className="relative group">
            <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors z-10" />
            <Select value={selectedDept} onValueChange={(v) => {
              setSelectedDept(v);
              setErrors(prev => ({ ...prev, department: undefined }));
            }}>
              <SelectTrigger className={cn(
                "pl-12 h-12 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-cyan-500 transition-all",
                errors.department && "border-red-500"
              )}>
                <SelectValue placeholder={t("common.selectDepartment")} />
              </SelectTrigger>
              <SelectContent>
                {loadingDepts ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">{t("common.loading")}</div>
                ) : departments.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">{t("common.noDepartments")}</div>
                ) : (
                  departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          {errors.department && (
            <p className="text-sm text-red-500 pl-2 flex items-center gap-1">
              <span className="text-xs">⚠</span> {errors.department}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-95"
          disabled={loading || loadingDepts}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Setting up...
            </>
          ) : (
            "Complete Setup"
          )}
        </Button>
      </form>
    </div>
  );
}
