import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "@/routes/__root";
import { useApp } from "@/store/app-context";
import { NotificationsView } from "@/components/views/notifications-view";

function NotificationsPage() {
  const { notifications } = useApp();

  return (
    <NotificationsView
      notifications={notifications}
      onClose={() => window.history.back()}
    />
  );
}

const notificationsRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/notifications",
  component: NotificationsPage,
});

export const Route = notificationsRoute;
