import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { InputField } from "../components/InputField";
import { Mail, Lock, Eye, EyeOff, Github } from "lucide-react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load remembered email
  React.useEffect(() => {
    const savedEmail = localStorage.getItem("PumpBeats-remembered-email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // If already logged in, redirect to app
  React.useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (rememberMe) {
        localStorage.setItem("PumpBeats-remembered-email", email);
      } else {
        localStorage.removeItem("PumpBeats-remembered-email");
      }

      toast.success("Login realizado com sucesso!");
      navigate("/app");
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Bem-vindo de volta" 
      subtitle="Entre com suas credenciais para continuar sua audição."
    >
      <form onSubmit={handleLogin} className="space-y-3">
        <InputField 
          label="Email" 
          type="email" 
          placeholder="seu@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          icon={Mail}
        />
        <div className="relative">
          <InputField 
            label="Senha" 
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            icon={showPassword ? EyeOff : Eye}
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-11 text-zinc-600 hover:text-violet-500 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center justify-between mb-4 px-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-white/10 bg-zinc-950 checked:bg-violet-500 transition-colors" 
            />
            <span className="text-sm text-zinc-500 group-hover:text-zinc-400">Lembrar de mim</span>
          </label>
          <Link to="/forgot-password" title="Recuperar Senha" className="text-sm text-violet-500 hover:underline">Esqueceu a senha?</Link>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-violet-500 text-black py-4 rounded-3xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-violet-500/10 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <div className="relative my-6 py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest text-zinc-600">
            <span className="bg-zinc-900 px-4">Ou continue com</span>
          </div>
        </div>

        <button 
          type="button" 
          className="w-full bg-white text-black py-4 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all border border-black/5"
        >
          <Github className="w-5 h-5" /> GitHub
        </button>

        <p className="text-center text-zinc-500 text-sm mt-4 pb-2">
          Não tem uma conta? <Link to="/register" title="Criar Conta" className="text-violet-500 font-bold hover:underline">Criar agora</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
