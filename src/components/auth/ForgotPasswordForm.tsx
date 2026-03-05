import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { getPasswordResetSchema } from "@/lib/validations";
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = getPasswordResetSchema(t).safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email);

      setSent(true);
      toast({
        title: t("common.resetPassword.sentTitle"),
        description: t("common.resetPassword.sentDesc"),
      });
    } catch (error: any) {
      toast({
        title: t("common.resetPassword.failedTitle"),
        description: error.message || t("common.resetPassword.failedDesc"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <h3 className="font-display font-semibold text-lg">{t("common.resetPassword.checkEmail")}</h3>
        <p className="text-muted-foreground text-sm">
          {t("common.resetPassword.sentTo")} <strong>{email}</strong>
        </p>
        <Button variant="ghost" onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.resetPassword.backToSignIn")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center space-y-2 mb-6">
        <h3 className="font-display font-semibold text-lg">{t("common.resetPassword.title")}</h3>
        <p className="text-muted-foreground text-sm">
          {t("common.resetPassword.subtitle")}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-email" className="text-sm font-medium">
          {t("common.email")}
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="reset-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className={`pl-10 input-focus ${error ? "border-destructive" : ""}`}
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <Button type="submit" className="w-full btn-primary" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Reset Link"
        )}
      </Button>

      <Button type="button" variant="ghost" onClick={onBack} className="w-full">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to sign in
      </Button>
    </form>
  );
}
