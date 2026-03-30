import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { InputField } from "../components/InputField";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already logged in, redirect to app
  React.useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast.success("Conta criada com sucesso! Verifique seu email.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Criar sua conta" 
      subtitle="Junte-se ao SopaMusic e comece a ouvir agora mesmo."
    >
      <form onSubmit={handleRegister} className="space-y-3">
        <InputField 
          label="Nome Completo" 
          type="text" 
          placeholder="Seu Nome" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          icon={User}
        />
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
        <InputField 
          label="Senha" 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          icon={Lock}
        />
        <InputField 
          label="Confirmar Senha" 
          type="password" 
          placeholder="••••••••" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          icon={ShieldCheck}
        />

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-500 text-black py-4 rounded-3xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-500/10 disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-4 pb-2">
          Já tem uma conta? <Link to="/login" title="Entrar" className="text-green-500 font-bold hover:underline">Entrar agora</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
