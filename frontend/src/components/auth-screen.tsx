import { ChartLineUp, Lock, Phone, Storefront, Fingerprint, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn, primaryCta } from "@/lib/utils";
import { accountsApi } from "@/lib/endpoints";
import { useToast } from "@/components/ui/toast";

interface AuthScreenProps {
  authTab: "signup" | "login";
  onSetAuthTab: (tab: "signup" | "login") => void;
  onAuthenticate: () => void;
}

export function AuthScreen({ authTab, onSetAuthTab, onAuthenticate }: AuthScreenProps) {
  const { toast } = useToast();
  const [signupPin, setSignupPin] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupNin, setSignupNin] = useState("");
  const [loginPhone, setLoginPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidNigerianPhone = (p: string) => /^(07|08|09)\d{9}$/.test(p);
  const canSignup = signupName.trim() && isValidNigerianPhone(signupPhone) && signupNin.length === 11 && signupPin.length === 6;
  const canLogin = isValidNigerianPhone(loginPhone) && loginPin.length === 6;

  const handleSignup = async () => {
    if (!canSignup) {
      if (signupPhone && !isValidNigerianPhone(signupPhone)) {
        toast({ title: "Invalid Phone Number", description: "Enter a valid Nigerian number starting with 070, 080, or 090.", variant: "destructive" });
      }
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await accountsApi.signup({
        business_name: signupName.trim(),
        phone_number: signupPhone.trim(),
        nin: signupNin.trim(),
        pin: signupPin,
      });
      localStorage.setItem(
        "traka_user",
        JSON.stringify({
          token: res.access_token,
          refreshToken: res.refresh_token,
          virtualAccountNumber: res.virtual_account_number,
          businessName: signupName.trim(),
          phone: signupPhone.trim(),
          createdAt: new Date().toISOString(),
        }),
      );
      toast({ title: "Account Created", description: "Welcome to Traka! Setting up your ledger...", variant: "success" });
      onAuthenticate();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup failed. Please try again.";
      setError(msg);
      toast({ title: "Signup Failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!canLogin) {
      if (loginPhone && !isValidNigerianPhone(loginPhone)) {
        toast({ title: "Invalid Phone Number", description: "Enter a valid Nigerian number starting with 070, 080, or 090.", variant: "destructive" });
      }
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await accountsApi.login({
        phone_number: loginPhone.trim(),
        pin: loginPin,
      });
      localStorage.setItem(
        "traka_user",
        JSON.stringify({
          token: res.access_token,
          refreshToken: res.refresh_token,
          virtualAccountNumber: res.virtual_account_number,
          createdAt: new Date().toISOString(),
        }),
      );
      toast({ title: "Welcome Back", description: "Logging into your ledger...", variant: "success" });
      onAuthenticate();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(msg);
      toast({ title: "Login Failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-1 flex-col justify-center px-6 pt-16">
      {/* Brand */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-3xl text-primary">
          <ChartLineUp weight="fill" className="h-7 w-7" />
        </div>
        <h1 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-3xl font-black tracking-tight text-transparent">
          Traka
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lightweight Bookkeeping for Smart Retailers
        </p>
      </div>

      {/* Tab toggle */}
      <div className="mb-6 flex rounded-xl border border-border bg-secondary p-1">
        <Button
          variant="ghost"
          onClick={() => onSetAuthTab("signup")}
          className={`flex-1 cursor-pointer rounded-lg py-3 text-sm font-medium transition-all ${
            authTab === "signup"
              ? "bg-card text-primary"
              : "text-muted-foreground"
          }`}
        >
          Sign Up
        </Button>
        <Button
          variant="ghost"
          onClick={() => onSetAuthTab("login")}
          className={`flex-1 cursor-pointer rounded-lg py-3 text-sm font-medium transition-all ${
            authTab === "login"
              ? "bg-card text-primary"
              : "text-muted-foreground"
          }`}
        >
          Login
        </Button>
      </div>

      {/* Sign Up form */}
      {authTab === "signup" && (
        <div className="space-y-4">
          <Field label="Business Name" icon={Storefront}>
            <Input
              type="text"
              placeholder="e.g. Mama Nkechi Stores"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary"
            />
          </Field>
          <Field label="Phone Number" icon={Phone}>
            <Input
              type="tel"
              inputMode="numeric"
              placeholder="08012345678"
              maxLength={11}
              value={signupPhone}
              onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary"
            />
          </Field>
          <Field label="NIN (National Identification Number)" icon={Fingerprint}>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="11-digit NIN"
              maxLength={11}
              value={signupNin}
              onChange={(e) => setSignupNin(e.target.value.replace(/\D/g, "").slice(0, 11))}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary"
            />
          </Field>
          <Field label="Create PIN" icon={Lock}>
            <Input
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              placeholder="6-digit PIN"
              maxLength={6}
              value={signupPin}
              onChange={(e) => setSignupPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary"
            />
          </Field>
          {error && <p className="text-center text-xs font-medium text-destructive">{error}</p>}
          <button
            type="button"
            onClick={handleSignup}
            disabled={!canSignup || loading}
            className={cn(primaryCta, "mt-2 w-full cursor-pointer disabled:opacity-40")}
          >
            {loading ? "Creating Account..." : "Create My Traka Account"}
            <ArrowRight weight="bold" className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Login form */}
      {authTab === "login" && (
        <div className="space-y-4">
          <Field label="Phone Number" icon={Phone}>
            <Input
              type="tel"
              inputMode="numeric"
              placeholder="Enter your registered phone number"
              maxLength={11}
              value={loginPhone}
              onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary"
            />
          </Field>
          <Field label="PIN" icon={Lock}>
            <Input
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              placeholder="6-digit PIN"
              maxLength={6}
              value={loginPin}
              onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary"
            />
          </Field>
          {error && <p className="text-center text-xs font-medium text-destructive">{error}</p>}
          <button
            type="button"
            onClick={handleLogin}
            disabled={!canLogin || loading}
            className={cn(primaryCta, "mt-2 w-full cursor-pointer disabled:opacity-40")}
          >
            {loading ? "Logging In..." : "Log In to My Account"}
            <ArrowRight weight="bold" className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </label>
      {children}
    </div>
  );
}
