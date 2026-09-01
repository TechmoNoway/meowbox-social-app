import { useUserContext } from "@/context/AuthContext";
import { Sparkles, Heart, ShieldCheck } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const { isAuthenticated } = useUserContext();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex w-full min-h-screen bg-dark-1">
      {/* Form Container */}
      <section className="flex flex-1 justify-center items-center flex-col px-4 py-12 sm:px-8 z-10">
        <Outlet />
      </section>

      {/* Hero Visual Showcase Panel (Desktop) */}
      <section className="hidden xl:flex flex-1 relative overflow-hidden bg-gradient-to-br from-dark-2 via-dark-3 to-dark-1 border-l border-white/[0.08] items-center justify-center p-12">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-lg flex flex-col gap-8">
          <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl group">
            <img
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=85"
              alt="MeowBox Community"
              className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-1 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-card border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-500/20 border border-primary-500/40 flex-center text-primary-500">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Where Feline Stories Live</p>
                  <p className="text-xs text-light-3">Join 50,000+ cat lovers sharing daily paws & purrs</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-dark-3/60 border border-white/[0.06] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-secondary-500/20 text-secondary-500 flex-center">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-light-4 font-medium">Daily Likes</p>
                <p className="text-sm font-bold text-light-1">120K+ Paws</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-dark-3/60 border border-white/[0.06] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-cyan/20 text-accent-cyan flex-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-light-4 font-medium">Community</p>
                <p className="text-sm font-bold text-light-1">100% Cat Friendly</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthLayout;
