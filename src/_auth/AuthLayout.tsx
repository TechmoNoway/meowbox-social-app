import { useUserContext } from "@/context/AuthContext";
import { Camera, Compass, Heart, Sparkles } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const { isAuthenticated } = useUserContext();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex w-full min-h-screen bg-dark-1">
      {/* Hero Visual Showcase Panel (Desktop) */}
      <section className="hidden lg:flex flex-1 relative overflow-hidden bg-dark-1 items-center justify-center p-12 border-r border-dark-4">
        <div className="relative z-10 max-w-md flex flex-col gap-6">
          {/* Phone Frame Mockup */}
          <div className="relative rounded-[36px] p-3.5 bg-dark-2 border border-dark-4 shadow-2xl">
            <div className="relative rounded-[28px] overflow-hidden aspect-[4/5] bg-black">
              <img
                src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=85"
                alt="MeowBox Community"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">
                  MeowBox
                </span>
                <span className="text-[11px] text-light-3">• Stories</span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                <div className="flex flex-col">
                  <span className="text-xs font-bold">@alexrivers</span>
                  <span className="text-[11px] text-light-3">Tokyo, Japan</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-secondary-500">
                  <Heart className="w-4 h-4 fill-secondary-500" />
                  <span>14.2k</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 text-light-4 text-xs">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary-500" />
              <span>Share Moments</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-accent-cyan" />
              <span>Explore Creators</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-secondary-500" />
              <span>Connect Everyday</span>
            </div>
          </div>
        </div>
      </section>

      {/* Form Container */}
      <section className="flex flex-1 justify-center items-center flex-col px-4 py-12 sm:px-8 z-10">
        <Outlet />
      </section>
    </div>
  );
};

export default AuthLayout;
