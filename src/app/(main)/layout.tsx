import { FloatingNavBar } from "@/components/floating-navbar";
import { LeftSidebar } from "@/components/left-side-bar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FloatingNavBar />

      <div className="min-h-screen flex justify-center text-foreground bg-background mx-auto">
        <div className="fixed">
          <LeftSidebar />
        </div>

        <div className="sm:w-[96px] md:w-[100px] lg:w-[250px] flex-shrink-0 hidden sm:block" />

        <main className="flex-1 flex justify-center pb-[90px] sm:pb-0">
          {children}
        </main>
      </div>
    </>
  );
}
