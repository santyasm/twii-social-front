import { LeftSidebar } from "@/components/left-side-bar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex justify-center bg-background text-foreground">
            <div className="fixed ">
                <LeftSidebar />
            </div>

            <div className="sm:w-[80px] md:w-[90px] lg:w-[250px] flex-shrink-0 hidden sm:block" />

            <main className="flex-1 flex justify-center">
                {children}
            </main>
        </div>
    );
}
