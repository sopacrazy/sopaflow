import React from "react";
import { LucideIcon } from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
}

export const InputField: React.FC<InputFieldProps> = ({ label, icon: Icon, ...props }) => {
  return (
    <div className="space-y-1 mb-2">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">{label}</label>
      <div className="relative group">
        <input 
          {...props}
          className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-5 py-3.5 text-white text-base placeholder:text-zinc-700 focus:outline-none focus:border-green-500/50 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
        />
        {Icon && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-green-500 transition-colors">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
