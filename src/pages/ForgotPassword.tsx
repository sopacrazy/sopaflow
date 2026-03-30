import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { InputField } from "../components/InputField";
import { Mail, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Link de recuperação enviado para o seu email!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao solicitar recuperação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Recuperação de senha" 
      subtitle="Informe seu email para receber um link de redefinição de senha."
    >
      <form onSubmit={handleReset} className="space-y-4">
        <InputField 
          label="Seu Email" 
          type="email" 
          placeholder="seu@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={Mail}
        />

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-500 text-black py-4 rounded-3xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-500/10 disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar link"}
          </button>
        </div>

        <Link to="/login" className="flex items-center justify-center gap-2 text-zinc-500 hover:text-green-500 transition-colors mt-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Voltar para o login
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
