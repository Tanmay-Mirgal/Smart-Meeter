import { redirect } from "next/navigation";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Create Meeting",
  description: "Create an instant room or schedule a meeting for later.",
  path: "/meetings/create",
  index: false,
});

export default function CreateMeetingRoute() {
  redirect("/meetings");
}
