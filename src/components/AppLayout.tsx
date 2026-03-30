import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { PlayerBar } from "./PlayerBar";

interface AppLayoutProps {
  children: ReactNode;
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

export function AppLayout({ children, currentTab = "home", onTabChange }: AppLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-[#121212] text-zinc-50 font-sans overflow-hidden">
      <Sidebar currentTab={currentTab} onTabChange={onTabChange} />
      
      <main className="flex-1 relative flex flex-col min-w-0 bg-[#121212] overflow-y-auto custom-scrollbar pt-2 sm:pt-4 pb-[200px] md:pb-32 px-4 md:px-8">
        {children}
      </main>

      <PlayerBar />
      <MobileNav currentTab={currentTab} onTabChange={onTabChange || (() => {})} />
    </div>
  );
}
