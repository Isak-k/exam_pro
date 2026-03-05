import { AuthForm } from "@/components/auth/AuthForm";
import { Link } from "react-router-dom";
import { GraduationCap, ArrowLeft, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useTranslation } from "react-i18next";

const Auth = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background relative overflow-hidden">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-500" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float delay-300" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <div className="space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <span className="font-display font-bold text-3xl">ExamPro</span>
            </div>
            
            <h1 className="text-5xl xl:text-6xl font-display font-bold leading-tight">
              Welcome to the Future of
              <span className="block mt-2">Online Examinations</span>
            </h1>
            
            <p className="text-xl text-cyan-50 leading-relaxed max-w-md">
              Secure, efficient, and user-friendly platform for conducting exams with real-time analytics.
            </p>
            
            {/* Features */}
            <div className="space-y-4 pt-8">
              {[
                "Real-time exam monitoring",
                "Advanced analytics dashboard",
                "Secure & encrypted",
                "Multi-device support"
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 animate-slide-in-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg text-cyan-50">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col relative">
        {/* Mobile background */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 dark:from-cyan-950/20 dark:via-teal-950/20 dark:to-blue-950/20" />
        <div className="lg:hidden absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Header */}
        <header className="relative z-10 p-6 flex justify-between items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-cyan-600 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            {t("common.back")}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8 animate-slide-up">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <span className="font-display font-bold text-2xl bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  ExamPro
                </span>
              </div>
              <h1 className="text-3xl font-display font-bold mb-2">{t("common.welcomeBack")}</h1>
              <p className="text-muted-foreground">
                {t("common.signInSubtitle")}
              </p>
            </div>

            {/* Auth Form with enhanced styling */}
            <div className="animate-scale-in">
              <AuthForm />
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="text-cyan-600 hover:text-cyan-700 underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-cyan-600 hover:text-cyan-700 underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
