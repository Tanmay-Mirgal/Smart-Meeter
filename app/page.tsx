import React from "react";
import { Navbar } from "@/components/home/navbar";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { Footer } from "@/components/home/footer";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createMetadata, websiteJsonLd, softwareAppJsonLd } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Smart Meet — AI-Powered Meeting Intelligence",
  description:
    "Real-time transcription, AI summaries, action items, and team collaboration — all in one workspace. Start your first meeting free, no credit card needed.",
  path: "/",
  keywords: [
    "free meeting transcription",
    "AI meeting notes",
    "meeting recorder online",
    "meeting summary generator",
  ],
});

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20 landing-page">
      <Navbar />
      <main className="flex-1 flex flex-col items-center pt-32 pb-0">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
