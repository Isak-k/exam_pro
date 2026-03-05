import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn, signUp, AppRole } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, signupSchema, getLoginSchema, getSignupSchema } from "@/lib/validations";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { GoogleProfileSetup } from "./GoogleProfileSetup";
import { GraduationCap, Loader2, Mail, Lock, User, Eye, EyeOff, Building } from "lucide-react";
import { getDepartments } from "@/lib/departments";
import { Department } from "@/integrations/firebase/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { signInWithGoogle, completeGoogleSignUpProfile } from "@/lib/firebase-auth";

export function AuthForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showGoogleProfileSetup, setShowGoogleProfileSetup] = useState(false);
  const [googleUserData, setGoogleUserData] = useState<{ userId: string; email: string; displayName: string } | null>(null);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});

  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  // Always default to student for self-signup
  const signupRole: AppRole = "student";
  const [signupErrors, setSignupErrors] = useState<{ name?: string; email?: string; password?: string; department?: string }>({});
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [selectedDept, setSelectedDept] = useState<string>("");

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

  // Check for password reset redirect
  useEffect(() => {
    if (searchParams.get("reset") === "true") {
      toast({
        title: "Password reset",
        description: "Please enter your new password in the settings after signing in.",
      });
    }
  }, [searchParams, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});

    const result = getLoginSchema(t).safeParse({
      email: loginEmail,
      password: loginPassword,
    });

    if (!result.success) {
      const errors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") errors.email = err.message;
        if (err.path[0] === "password") errors.password = err.message;
      });
      setLoginErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await signIn(loginEmail, loginPassword);
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupErrors({});

    const result = getSignupSchema(t).safeParse({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      role: signupRole,
    });

    if (!result.success) {
      const errors: { name?: string; email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "name") errors.name = err.message;
        if (err.path[0] === "email") errors.email = err.message;
        if (err.path[0] === "password") errors.password = err.message;
      });
      setSignupErrors(errors);
      return;
    }

    if (!selectedDept) {
      setSignupErrors(prev => ({ ...prev, department: t("common.selectDepartment") }));
      return;
    }

    setLoading(true);

    try {
      await signUp(signupEmail, signupPassword, signupName, signupRole, selectedDept);
      
      // Refresh profile to ensure the new role is loaded
      await refreshProfile();
      
      toast({
        title: "Account created!",
        description: "Welcome to ExamPro!",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      
      if (result.needsProfileSetup) {
        // New user - show profile setup
        setGoogleUserData({
          userId: result.user.uid,
          email: result.user.email || "",
          displayName: result.user.displayName || ""
        });
        setShowGoogleProfileSetup(true);
        setLoading(false);
      } else {
        // Existing user - redirect to dashboard
        await refreshProfile();
        toast({
          title: "Welcome back!",
          description: "You have been signed in with Google.",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Google sign-in failed",
        description: error.message || "Could not sign in with Google",
        variant: "destructive",
      });
    }
  };

  const handleCompleteGoogleProfile = async (fullName: string, departmentId: string) => {
    if (!googleUserData) return;
    
    setLoading(true);
    try {
      await completeGoogleSignUpProfile(
        googleUserData.userId,
        googleUserData.email,
        fullName, // Use the name provided by user (can be edited)
        departmentId,
        'student'
      );
      
      await refreshProfile();
      
      toast({
        title: "Profile completed!",
        description: "Welcome to ExamPro!",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Profile setup failed",
        description: error.message || "Could not complete profile setup",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <Card className="w-full max-w-md card-elevated animate-scale-in">
        <CardContent className="pt-6">
          <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
        </CardContent>
      </Card>
    );
  }

  if (showGoogleProfileSetup && googleUserData) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden p-8">
        <GoogleProfileSetup
          email={googleUserData.email}
          displayName={googleUserData.displayName}
          onComplete={handleCompleteGoogleProfile}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <Tabs value={tab} onValueChange={setTab}>
        {/* Header */}
        <div className="p-8 pb-6 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 border-b">
          <div className="hidden lg:block text-center space-y-3">
            <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              {t("common.examPro")}
            </h2>
            <p className="text-sm text-muted-foreground">
              Your secure online examination platform
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 pt-6">
          <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <TabsTrigger 
              value="login" 
              className="font-semibold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all"
            >
              {t("common.signIn")}
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="font-semibold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all"
            >
              {t("common.signup")}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-8 pt-6">
          <TabsContent value="login" className="mt-0">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t("common.email")}
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors z-10" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      setLoginErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className={cn(
                      "pl-12 h-12 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-cyan-500 focus:bg-white dark:focus:bg-gray-900 transition-all",
                      loginErrors.email && "border-red-500 focus:border-red-500"
                    )}
                    required
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-sm text-red-500 pl-2 flex items-center gap-1">
                    <span className="text-xs">⚠</span> {loginErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t("common.password")}
                  </Label>
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 h-auto text-xs text-cyan-600 hover:text-cyan-700 font-medium"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    {t("common.forgotPassword")}
                  </Button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors z-10" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    className={cn(
                      "pl-12 pr-12 h-12 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-cyan-500 focus:bg-white dark:focus:bg-gray-900 transition-all",
                      loginErrors.password && "border-red-500 focus:border-red-500"
                    )}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {loginErrors.password && (
                  <p className="text-sm text-red-500 pl-2 flex items-center gap-1">
                    <span className="text-xs">⚠</span> {loginErrors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("common.loading")}
                  </>
                ) : (
                  t("common.login")
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                    {t("common.or")}
                  </span>
                </div>
              </div>

              {/* Google Sign-In Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl text-base font-semibold border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-0">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t("common.fullName")}
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => {
                      setSignupName(e.target.value);
                      setSignupErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    className={cn(
                      "pl-12 h-12 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-cyan-500 focus:bg-white dark:focus:bg-gray-900 transition-all",
                      signupErrors.name && "border-red-500"
                    )}
                    required
                  />
                </div>
                {signupErrors.name && (
                  <p className="text-sm text-red-500 pl-2">{signupErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t("common.email")}
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => {
                      setSignupEmail(e.target.value);
                      setSignupErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className={cn(
                      "pl-12 h-12 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-cyan-500 focus:bg-white dark:focus:bg-gray-900 transition-all",
                      signupErrors.email && "border-red-500"
                    )}
                    required
                  />
                </div>
                {signupErrors.email && (
                  <p className="text-sm text-red-500 pl-2">{signupErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-dept" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t("common.department")}
                </Label>
                <div className="relative group">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors z-10" />
                  <Select value={selectedDept} onValueChange={(v) => {
                    setSelectedDept(v);
                    setSignupErrors((prev) => ({ ...prev, department: undefined }));
                  }}>
                    <SelectTrigger className={cn(
                      "pl-12 h-12 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-cyan-500 transition-all",
                      signupErrors.department && "border-red-500"
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
                {signupErrors.department && (
                  <p className="text-sm text-red-500 pl-2">{signupErrors.department}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t("common.password")}
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value);
                      setSignupErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    className={cn(
                      "pl-12 pr-12 h-12 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-cyan-500 focus:bg-white dark:focus:bg-gray-900 transition-all",
                      signupErrors.password && "border-red-500"
                    )}
                    minLength={6}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {signupErrors.password && (
                  <p className="text-sm text-red-500 pl-2">{signupErrors.password}</p>
                )}
                <p className="text-xs text-muted-foreground pl-2">
                  Must be 6+ characters with uppercase, lowercase, and number
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("common.loading")}
                  </>
                ) : (
                  t("common.signup")
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                    {t("common.or")}
                  </span>
                </div>
              </div>

              {/* Google Sign-In Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl text-base font-semibold border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </form>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
