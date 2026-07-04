import { DashboardPage } from "@/features/dashboard/components/dashboard-page";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Dashboard",
  description: "Monitor live meetings, summaries, and action items in your Smart Meet workspace.",
  path: "/dashboard",
  index: false,
});

export default function DashboardRoute() {
  return <DashboardPage />;
}
