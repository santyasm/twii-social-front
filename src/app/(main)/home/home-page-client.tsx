"use client";

import { MainFeed } from "@/components/main-feed";
import { RightSidebar } from "@/components/right-side-bar";

export default function HomePageClient() {
  return (
    <div
      className="
        flex w-full justify-center
        mx-auto
        pb-12
      "
    >
      {/* Feed principal */}
      <MainFeed />

      {/* Sidebar direita */}
      <aside
        className="
          hidden xl:block
          w-[310px]
          lg:w-[350px]
          flex-shrink-0
        "
      >
        <RightSidebar />
      </aside>
    </div>
  );
}
