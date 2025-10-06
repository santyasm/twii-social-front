"use client";

import { LeftSidebar } from "@/components/left-side-bar";
import { MainFeed } from "@/components/main-feed";
import { RightSidebar } from "@/components/right-side-bar";

export default function HomePageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/7 via-purple-50 to-pink-100 dark:from-[#0f0f0f] dark:via-[#1a1a1a] dark:to-[#0f0f0f] p-6">
      <main className="flex justify-center gap-6">
        <LeftSidebar />

        <MainFeed />

        <RightSidebar />
      </main>
    </div>
  );
}
