import React from "react";
import { motion } from "framer-motion";
import { Music, X } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden selection:bg-green-500 selection:text-black">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8 lg:p-10 relative z-10 shadow-2xl max-h-[95vh] overflow-y-auto custom-scrollbar"
      >
        <Link 
          to="/" 
          className="absolute top-6 right-8 text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
          title="Fechar"
        >
          <X className="w-6 h-6" />
        </Link>

        {/* Border Glow Gradient */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-50" />
        
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-3 mb-6 group">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-110 group-active:scale-95 transition-all">
              <Music className="text-black w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-white group-hover:text-green-500 transition-colors">SopaMusic</span>
          </Link>
          <h1 className="text-2xl font-black text-white text-center">{title}</h1>
          {subtitle && <p className="text-zinc-500 text-center mt-2 text-xs">{subtitle}</p>}
        </div>

        {children}
      </motion.div>
    </div>
  );
};
