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
    <div className="flex h-screen bg-[#F8F9FA] text-zinc-900 font-sans overflow-hidden">
      <Sidebar currentTab={currentTab} onTabChange={onTabChange} />
      
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] overflow-y-auto custom-scrollbar-light pt-4 pb-32 px-4 md:px-8">
        {children}
      </div>

      <PlayerBar />
    </div>
  );
}
