import { Link } from "react-router-dom";
import { GraduationCap, ArrowLeft, Shield, Clock, BarChart3, Zap, CheckCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Shield,
      title: t("features.secure.title"),
      description: t("features.secure.desc"),
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      icon: Clock,
      title: t("features.timed.title"),
      description: t("features.timed.desc"),
      color: "bg-orange-500/10 text-orange-500",
    },
    {
      icon: Zap,
      title: t("features.results.title"),
      description: t("features.results.desc"),
      color: "bg-yellow-500/10 text-yellow-500",
    },
    {
      icon: BarChart3,
      title: t("features.analytics.title"),
      description: t("features.analytics.desc"),
      color: "bg-green-500/10 text-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
            </Link>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <ThemeToggle />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-lg tracking-tight">ExamPro</span>
              </div>
            </div>
        </div>
      </header>

      {/* Features Section */}
      <div className="py-12 lg:py-24 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12 lg:mb-16 animate-slide-up">
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4 lg:mb-6 tracking-tight">
              {t("features.heading")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed px-4">
              {t("features.subheading")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 sm:p-8 rounded-3xl bg-card border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 animate-slide-up active:scale-[0.98]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-transform group-hover:scale-110 duration-300 ${feature.color}`}>
                  <feature.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
              <div className="flex flex-wrap justify-center gap-4 lg:gap-8 text-muted-foreground text-sm lg:text-base">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                  <span>{t("features.badges.freeSetup")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                  <span>{t("features.badges.secure")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                  <span>{t("features.badges.fast")}</span>
                </div>
              </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">ExamPro</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">{t("common.footer.privacy")}</a>
              <a href="#" className="hover:text-primary transition-colors">{t("common.footer.terms")}</a>
              <a href="#" className="hover:text-primary transition-colors">{t("common.footer.support")}</a>
              <a href="#" className="hover:text-primary transition-colors">{t("common.footer.contact")}</a>
            </div>

            <p className="text-sm text-muted-foreground">
              {t("common.footer.rights", { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
