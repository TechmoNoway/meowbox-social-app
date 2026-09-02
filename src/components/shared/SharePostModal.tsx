import { MOCK_USERS } from "@/lib/mock/mockData";
import { Check, Copy, Search, Send, X } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

type SharePostModalProps = {
  post: any;
  onClose: () => void;
};

const SharePostModal = ({ post, onClose }: SharePostModalProps) => {
  const [searchUser, setSearchUser] = useState("");
  const [sentList, setSentList] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const filteredUsers = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.username.toLowerCase().includes(searchUser.toLowerCase())
  );

  const handleSendToUser = (username: string) => {
    if (sentList.includes(username)) return;
    setSentList([...sentList, username]);
    toast({
      title: `Sent post to @${username}! ✈️`,
    });
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/posts/${post?.$id || ""}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({
      title: "Link copied to clipboard! 📋",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-dark-2 border border-dark-4 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-4">
          <span className="w-6" />
          <h3 className="font-bold text-sm text-light-1">Share</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-light-4 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Field */}
        <div className="p-3 border-b border-dark-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-light-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-xl bg-dark-3 text-xs text-light-1 placeholder:text-light-4 focus:outline-none"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1 max-h-64">
          {filteredUsers.map((u) => {
            const hasSent = sentList.includes(u.username);

            return (
              <div
                key={u.$id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-dark-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={u.imageUrl} />
                    <AvatarFallback>{u.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-light-1">
                      {u.name}
                    </span>
                    <span className="text-[11px] text-light-4">
                      @{u.username}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleSendToUser(u.username)}
                  className={`h-8 px-4 text-xs font-semibold rounded-xl ${
                    hasSent
                      ? "bg-dark-4 text-light-3"
                      : "bg-primary-500 hover:bg-primary-600 text-white"
                  }`}
                >
                  {hasSent ? (
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Sent</span>
                    </div>
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Footer with Quick Actions */}
        <div className="p-3 border-t border-dark-4 flex items-center gap-2">
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="flex-1 h-10 rounded-xl border-dark-4 bg-dark-3 hover:bg-dark-4 text-xs font-semibold text-light-1 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy link</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SharePostModal;
