import { MOCK_NOTIFICATIONS } from "@/lib/mock/mockData";
import { Heart, MessageCircle, UserPlus, X } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

type NotificationsPopoverProps = {
  onClose: () => void;
};

const NotificationsPopover = ({ onClose }: NotificationsPopoverProps) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const toggleFollowBack = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isFollowingBack: !n.isFollowingBack } : n
      )
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-start md:pl-[245px] pt-14 md:pt-0"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm h-full bg-dark-1 border-r border-dark-4 p-5 shadow-2xl overflow-y-auto custom-scrollbar flex flex-col gap-5 animate-in slide-in-from-left duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-dark-4">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Notifications
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-light-4 hover:text-white rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold text-light-3 uppercase tracking-wider">
            This Week
          </span>

          <div className="flex flex-col gap-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-dark-2 transition-colors text-xs"
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={n.user.imageUrl} />
                  <AvatarFallback>{n.user.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 leading-snug">
                  <span className="font-bold text-light-1 mr-1">
                    {n.user.username}
                  </span>
                  {n.type === "like" && (
                    <span className="text-light-3">liked your photo.</span>
                  )}
                  {n.type === "comment" && (
                    <span className="text-light-3">
                      commented: "{n.commentText}"
                    </span>
                  )}
                  {n.type === "follow" && (
                    <span className="text-light-3">started following you.</span>
                  )}
                  <span className="text-light-4 ml-1.5">{n.time}</span>
                </div>

                {n.postImage && (
                  <img
                    src={n.postImage}
                    alt="post"
                    className="w-10 h-10 rounded-lg object-cover border border-dark-4 shrink-0"
                  />
                )}

                {n.type === "follow" && (
                  <Button
                    size="sm"
                    onClick={() => toggleFollowBack(n.id)}
                    className={`h-7 px-3 text-xs font-semibold rounded-lg shrink-0 ${
                      n.isFollowingBack
                        ? "bg-dark-3 text-light-3 hover:bg-dark-4"
                        : "bg-primary-500 hover:bg-primary-600 text-white"
                    }`}
                  >
                    {n.isFollowingBack ? "Following" : "Follow"}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPopover;
