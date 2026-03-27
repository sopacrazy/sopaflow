import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { PlayerBar } from "./PlayerBar";

interface AppLayoutProps {
  children: ReactNode;
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

export function AppLayout({ children, currentTab, onTabChange }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-[#121212] text-zinc-50 font-sans overflow-hidden">
      <Sidebar currentTab={currentTab} onTabChange={onTabChange} />
      
      <div className="flex-1 flex flex-col min-w-0 bg-[#121212] overflow-y-auto custom-scrollbar pt-4 pb-32 px-4 md:px-8">
        {children}
      </div>

      <PlayerBar />
    </div>
  );
}
