import { useUserContext } from "@/context/AuthContext";
import { Bookmark, Compass, Home, PlusCircle, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Bottombar = () => {
  const { pathname } = useLocation();
  const { user } = useUserContext();

  const links = [
    {
      route: "/",
      label: "Feed",
      icon: Home,
    },
    {
      route: "/explore",
      label: "Explore",
      icon: Compass,
    },
    {
      route: "/create-post",
      label: "Post",
      icon: PlusCircle,
      isPrimary: true,
    },
    {
      route: "/all-users",
      label: "Creators",
      icon: Users,
    },
    {
      route: `/profile/${user.id}`,
      label: "Profile",
      icon: Bookmark,
    },
  ];

  return (
    <section className="bottom-bar">
      <div className="flex items-center justify-around w-full max-w-lg mx-auto">
        {links.map((link) => {
          const isActive = pathname === link.route;
          const Icon = link.icon;

          if (link.isPrimary) {
            return (
              <Link
                to={link.route}
                key={link.label}
                className="flex flex-col items-center justify-center -mt-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex-center shadow-glow hover:scale-105 active:scale-95 transition-all text-white border-2 border-dark-1">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-semibold text-primary-500 mt-1">
                  {link.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              to={link.route}
              key={link.label}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-primary-500 scale-105"
                  : "text-light-4 hover:text-light-2"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className={`text-[10px] font-medium ${isActive ? "font-bold text-white" : ""}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Bottombar;
