import { createRoute, useNavigate } from "@tanstack/react-router";
import { Route as RootRoute } from "@/routes/__root";
import { LandingPage } from "@/components/landing-page";
import { useApp } from "@/store/app-context";
import { useEffect } from "react";

function IndexPage() {
  const { authenticated } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [authenticated, navigate]);

  if (authenticated) return null;

  return <LandingPage />;
}

const indexRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: IndexPage,
});

export const Route = indexRoute;
