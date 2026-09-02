import { useUserContext } from "@/context/AuthContext";
import { Clapperboard, Compass, Home, PlusSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Bottombar = () => {
  const { pathname } = useLocation();
  const { user } = useUserContext();

  const bottomBarLinks = [
    { route: "/", icon: Home, label: "Home" },
    { route: "/explore", icon: Compass, label: "Explore" },
    { route: "/create-post", icon: PlusSquare, label: "Create" },
    { route: "/explore?tab=reels", icon: Clapperboard, label: "Reels" },
    {
      route: `/profile/${user.id}`,
      icon: null,
      isAvatar: true,
      label: "Profile",
    },
  ];

  return (
    <nav className="bottom-bar">
      {bottomBarLinks.map((link) => {
        const isActive = pathname === link.route;
        const Icon = link.icon;

        return (
          <Link
            to={link.route}
            key={link.label}
            className={`flex-center flex-col gap-1 p-2 transition-transform duration-150 ${
              isActive ? "text-white scale-110" : "text-light-4"
            }`}
          >
            {link.isAvatar ? (
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
            ) : (
              Icon && (
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? "stroke-[2.5px]" : "stroke-[1.75px]"
                  }`}
                />
              )
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default Bottombar;
