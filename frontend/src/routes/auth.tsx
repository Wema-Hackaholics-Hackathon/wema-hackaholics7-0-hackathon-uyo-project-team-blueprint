import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "@/routes/__root";
import { AuthScreen } from "@/components/auth-screen";
import { useApp } from "@/store/app-context";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

function AuthPage() {
  const { authenticated, handleAuth } = useApp();
  const navigate = useNavigate();
  const [authTab, setAuthTab] = useState<"signup" | "login">("signup");

  if (authenticated) {
    navigate({ to: "/dashboard", replace: true });
    return null;
  }

  return (
    <AuthScreen
      authTab={authTab}
      onSetAuthTab={setAuthTab}
      onAuthenticate={() => {
        handleAuth();
        navigate({ to: "/dashboard", replace: true });
      }}
    />
  );
}

const authRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/auth",
  component: AuthPage,
});

export const Route = authRoute;
