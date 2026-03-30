import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Headphones, ArrowRight, Twitter, Instagram, Github } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-violet-500/30 scroll-smooth">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Headphones className="text-black w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">PumpBeats</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8 mr-4">
              <a href="#planos" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Planos</a>
              <Link to="/login" className="text-sm font-medium hover:text-violet-500 transition-colors">Entrar</Link>
            </div>
            <Link to="/register" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-xl">
              Criar conta
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/10 blur-[150px] rounded-full -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[150px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter max-w-4xl"
          >
            Toda música tem um momento. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-500 to-violet-600">O seu começa agora.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl leading-relaxed"
          >
            Uma experiência musical reimaginada. PumpBeats é onde o design moderno encontra sua trilha sonora favorita. 
            Sem complicação, só alto astral.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link to="/register" className="bg-violet-500 text-black px-12 py-5 rounded-full font-black text-xl flex items-center gap-3 hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-violet-500/40">
              Começar agora <ArrowRight className="w-6 h-6" />
            </Link>
            <a href="#planos" className="bg-zinc-900/50 text-white px-12 py-5 rounded-full font-black text-xl hover:bg-zinc-800 transition-all border border-white/10 backdrop-blur-sm">
              Ver planos
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Role para baixo</span>
            <div className="w-px h-12 bg-gradient-to-b from-violet-500 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Planos Section */}
      <section id="planos" className="py-32 px-6 bg-[#050505] relative border-t border-white/5">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-4xl lg:text-6xl font-black mb-6">Escolha seu plano</h2>
               <p className="text-zinc-400 text-lg">Ouça do seu jeito, sem limites com o Premium.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
               {/* Free Plan */}
               <motion.div 
                 whileHover={{ y: -10 }}
                 className="p-12 bg-zinc-900/30 rounded-[3rem] border border-white/5 flex flex-col h-full relative overflow-hidden"
               >
                  <span className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 px-1">Essencial</span>
                  <h3 className="text-4xl font-black mb-6">Plano Free</h3>
                  <div className="mb-10">
                     <span className="text-5xl font-black">R$ 0</span>
                     <span className="text-zinc-500 text-lg ml-2">/ mês</span>
                  </div>
                  <ul className="space-y-5 mb-14 flex-1">
                     <li className="flex items-center gap-4 text-zinc-400 text-lg">
                        <span className="text-violet-500">✓</span> Músicas de até 1 minuto
                     </li>
                     <li className="flex items-center gap-4 text-zinc-400 text-lg">
                        <span className="text-violet-500">✓</span> Com anúncios sonoros
                     </li>
                     <li className="flex items-center gap-4 text-zinc-400 text-lg">
                        <span className="text-violet-500">✓</span> Até 4 pulos por hora
                     </li>
                     <li className="flex items-center gap-4 text-zinc-600 line-through text-lg">
                        <span>×</span> Criar playlists
                     </li>
                  </ul>
                  <Link to="/register" className="w-full py-5 rounded-3xl bg-white text-black font-black text-lg hover:bg-zinc-200 transition-all text-center">
                    Começar grátis
                  </Link>
               </motion.div>
 
               {/* Premium Plan */}
               <motion.div 
                 whileHover={{ y: -10 }}
                 className="p-12 bg-gradient-to-b from-violet-500/10 to-transparent rounded-[3rem] border border-violet-500/30 flex flex-col h-full relative shadow-[0_30px_70px_rgba(139,92,246,0.1)]"
               >
                  <div className="absolute top-8 right-10 bg-violet-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Recomendado</div>
                  <span className="text-xs font-black text-violet-500 uppercase tracking-widest mb-4 px-1">Completo</span>
                  <h3 className="text-4xl font-black mb-6">Plano Premium</h3>
                  <div className="mb-10 text-violet-500">
                     <span className="text-5xl font-black">R$ 5,99</span>
                     <span className="text-zinc-500 text-lg ml-2">/ mês</span>
                  </div>
                  <ul className="space-y-5 mb-14 flex-1">
                     <li className="flex items-center gap-4 text-zinc-100 font-bold text-lg">
                        <span className="text-violet-500 font-black">✓</span> Músicas completas
                     </li>
                     <li className="flex items-center gap-4 text-zinc-100 font-bold text-lg">
                        <span className="text-violet-500 font-black">✓</span> Sem anúncios
                     </li>
                     <li className="flex items-center gap-4 text-zinc-100 font-bold text-lg">
                        <span className="text-violet-500 font-black">✓</span> Playlists ilimitadas
                     </li>
                     <li className="flex items-center gap-4 text-zinc-100 font-bold text-lg">
                        <span className="text-violet-500 font-black">✓</span> Pulos sem limites
                     </li>
                     <li className="flex items-center gap-4 text-zinc-100 font-bold text-lg">
                        <span className="text-violet-500 font-black">✓</span> Qualidade superior
                     </li>
                  </ul>
                  <button disabled className="w-full py-5 rounded-3xl bg-zinc-800 text-zinc-500 font-black text-lg cursor-not-allowed text-center">
                    Em breve
                  </button>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center">
                  <Headphones className="text-black w-6 h-6" />
               </div>
               <span className="text-2xl font-bold tracking-tight">PumpBeats</span>
            </div>
            
            <div className="flex gap-10 text-zinc-500 text-sm font-bold uppercase tracking-widest">
               <Link to="#" className="hover:text-white transition-colors">Termos</Link>
               <Link to="#" className="hover:text-white transition-colors">Privacidade</Link>
               <Link to="#" className="hover:text-white transition-colors">Suporte</Link>
            </div>

            <div className="flex gap-6">
               {[Twitter, Instagram, Github].map((Icon, i) => (
                  <a key={i} href="#" className="text-zinc-600 hover:text-violet-500 transition-colors">
                     <Icon className="w-6 h-6" />
                  </a>
               ))}
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-zinc-700 text-[10px] font-black uppercase tracking-[0.2em]">
            © 2024 PumpBeats. Sua trilha sonora começa aqui.
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
