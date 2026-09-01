import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { INavLink } from "@/types";
import {
  Bookmark,
  Compass,
  Home,
  LogOut,
  PlusCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />,
  Explore: <Compass className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />,
  People: <Users className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />,
  Saved: <Bookmark className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />,
  "Create Post": <PlusCircle className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />,
};

const LeftSidebar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useUserContext();

  const handleSignOut = async () => {
    await signOut();
    navigate("/sign-in");
  };

  return (
    <nav className="leftsidebar custom-scrollbar">
      <div className="flex flex-col gap-7">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 px-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-500 via-secondary-500 to-accent-cyan flex-center shadow-glow group-hover:rotate-6 transition-transform duration-300">
            <span className="text-xl">🐱</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-white">Meow</span>
              <span className="text-2xl font-black tracking-tight gradient-text">Box</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-light-4 -mt-1 flex items-center gap-1">
              Social App <Sparkles className="w-2.5 h-2.5 text-primary-500" />
            </span>
          </div>
        </Link>

        {/* User Mini Profile Card */}
        <Link
          to={`/profile/${user.id}`}
          className="flex items-center gap-3 p-3 rounded-2xl bg-dark-3/60 border border-white/[0.06] hover:bg-dark-3/90 hover:border-primary-500/30 transition-all duration-200 group"
        >
          <div className="relative">
            <Avatar className="h-11 w-11 ring-2 ring-primary-500/40 group-hover:ring-primary-500 transition-all">
              <AvatarImage src={user.imageUrl} alt={user.name} />
              <AvatarFallback className="bg-primary-500/20 text-primary-500">
                {user.name ? user.name[0] : "M"}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-dark-2 rounded-full" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <p className="body-bold text-light-1 truncate text-sm group-hover:text-primary-500 transition-colors">
              {user.name || "Meow Explorer"}
            </p>
            <p className="text-xs text-light-4 truncate">
              @{user.username || "meowbox"}
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <ul className="flex flex-col gap-2">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li key={link.label}>
                <NavLink
                  to={link.route}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative ${
                    isActive
                      ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold shadow-glow"
                      : "text-light-3 hover:text-light-1 hover:bg-white/[0.06]"
                  }`}
                >
                  <span className={`${isActive ? "text-white" : "text-light-3 group-hover:text-primary-500"}`}>
                    {iconMap[link.label] || (
                      <img
                        src={link.imgURL}
                        alt={link.label}
                        className={`w-5 h-5 ${isActive ? "invert-white" : ""}`}
                      />
                    )}
                  </span>
                  <span className="text-[15px]">{link.label}</span>

                  {link.label === "Saved" && (
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-dark-4/60 text-light-3">
                      PRO
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer Controls & Quick Create Post */}
      <div className="flex flex-col gap-3 pt-6 border-t border-white/[0.06]">
        <Link
          to="/create-post"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 via-secondary-500 to-pink-500 text-white font-semibold shadow-glow hover:shadow-glow-pink hover:opacity-95 transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Post</span>
        </Link>

        <Button
          variant="ghost"
          className="w-full flex items-center justify-start gap-3 text-light-4 hover:text-red hover:bg-red/10 rounded-2xl py-3 px-4 transition-all duration-200"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Log Out</span>
        </Button>
      </div>
    </nav>
  );
};

export default LeftSidebar;
