import { createRoute } from "@tanstack/react-router";
import { Route as RootRoute } from "@/routes/__root";
import { useRecentActivity } from "@/lib/query-hooks";
import { NotificationsView } from "@/components/views/notifications-view";

function NotificationsPage() {
  const { data } = useRecentActivity();
  const activities = (data ?? []).map((a) => ({
    id: a.id,
    title: a.title,
    desc: a.description,
    type: a.activity_type,
    time: a.created_at,
  }));

  return (
    <NotificationsView
      activities={activities}
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
