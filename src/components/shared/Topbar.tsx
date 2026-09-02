import { Heart, MessageCircle, PlusSquare } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import NotificationsPopover from "./NotificationsPopover";

const Topbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <section className="topbar">
        <div className="flex-between py-3 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white">
              MeowBox
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1 text-light-1 hover:text-white"
            >
              <Heart className="w-6 h-6 stroke-[1.75px]" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary-500" />
            </button>

            <Link to="/create-post" className="p-1 text-light-1 hover:text-white">
              <PlusSquare className="w-6 h-6 stroke-[1.75px]" />
            </Link>
          </div>
        </div>
      </section>

      {showNotifications && (
        <NotificationsPopover onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
};

export default Topbar;
