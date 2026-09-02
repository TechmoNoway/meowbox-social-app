import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import {
  Bookmark,
  Clapperboard,
  Compass,
  Heart,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  PlusSquare,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import NotificationsPopover from "./NotificationsPopover";

const LeftSidebar = () => {
  const { mutate: signOut } = useSignOutAccount();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useUserContext();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/sign-in");
  };

  const navItems = [
    { route: "/", label: "Home", icon: Home },
    { route: "/explore", label: "Explore", icon: Compass },
    { route: "/explore?tab=reels", label: "Reels", icon: Clapperboard },
    {
      route: "#notifications",
      label: "Notifications",
      icon: Heart,
      badge: true,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setShowNotifications(!showNotifications);
      },
    },
    { route: "/create-post", label: "Create", icon: PlusSquare },
    { route: "/saved", label: "Saved", icon: Bookmark },
    {
      route: `/profile/${user.id}`,
      label: "Profile",
      icon: null,
      isAvatar: true,
    },
  ];

  return (
    <>
      <nav className="leftsidebar">
        {/* Top Logo & Links */}
        <div className="flex flex-col gap-6 w-full">
          {/* Brand Wordmark */}
          <Link to="/" className="px-2 pt-2 flex items-center gap-2 group">
            <h1 className="text-2xl font-bold tracking-tight text-white font-inter">
              MeowBox
            </h1>
          </Link>

          {/* Navigation Links */}
          <ul className="flex flex-col gap-1.5 w-full">
            {navItems.map((item) => {
              const isActive =
                item.route !== "#notifications" && pathname === item.route;
              const Icon = item.icon;

              return (
                <li key={item.label}>
                  <NavLink
                    to={item.route}
                    onClick={item.onClick}
                    className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-150 group ${
                      isActive
                        ? "font-bold text-white bg-dark-3"
                        : "text-light-1 hover:bg-dark-3/60 font-medium"
                    }`}
                  >
                    {item.isAvatar ? (
                      <div className="relative">
                        <Avatar
                          className={`h-6 w-6 ring-2 ${
                            isActive ? "ring-white" : "ring-transparent"
                          }`}
                        >
                          <AvatarImage src={user.imageUrl} />
                          <AvatarFallback className="text-[10px]">
                            {user.name ? user.name[0] : "U"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ) : (
                      Icon && (
                        <div className="relative">
                          <Icon
                            className={`w-6 h-6 transition-transform group-hover:scale-105 ${
                              isActive ? "stroke-[2.5px]" : "stroke-[1.75px]"
                            }`}
                          />
                          {item.badge && (
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-secondary-500" />
                          )}
                        </div>
                      )
                    )}

                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom More Options Menu */}
        <div className="relative w-full pt-4 border-t border-dark-4">
          {showMoreMenu && (
            <div className="absolute bottom-16 left-0 w-52 bg-dark-2 border border-dark-4 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
              <Link
                to={`/update-profile/${user.id}`}
                onClick={() => setShowMoreMenu(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-dark-3 text-xs text-light-1"
              >
                <Settings className="w-4 h-4 text-light-3" />
                <span>Settings</span>
              </Link>
              <Link
                to="/saved"
                onClick={() => setShowMoreMenu(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-dark-3 text-xs text-light-1"
              >
                <Bookmark className="w-4 h-4 text-light-3" />
                <span>Saved Collection</span>
              </Link>
              <hr className="border-dark-4 my-1" />
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red/10 text-xs text-red w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-dark-3 text-light-1 w-full text-sm font-medium transition-colors"
          >
            <Menu className="w-6 h-6 stroke-[1.75px]" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* Notifications Drawer */}
      {showNotifications && (
        <NotificationsPopover onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
};

export default LeftSidebar;
