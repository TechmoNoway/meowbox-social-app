import { Bookmark, Copy, Edit, Link, Share2, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "../ui/use-toast";

type PostOptionsModalProps = {
  post: any;
  isAuthor: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
};

const PostOptionsModal = ({
  post,
  isAuthor,
  onClose,
  onEdit,
  onDelete,
  onShare,
}: PostOptionsModalProps) => {
  const handleCopyLink = () => {
    const url = `${window.location.origin}/posts/${post?.$id || ""}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied to clipboard! 📋" });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-dark-2 border border-dark-4 rounded-2xl overflow-hidden shadow-2xl flex flex-col divide-y divide-dark-4"
        onClick={(e) => e.stopPropagation()}
      >
        {isAuthor && (
          <>
            <button
              onClick={() => {
                onClose();
                onDelete?.();
              }}
              className="py-3.5 text-sm font-bold text-red hover:bg-dark-3 transition-colors text-center w-full"
            >
              Delete post
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit?.();
              }}
              className="py-3.5 text-sm font-medium text-light-1 hover:bg-dark-3 transition-colors text-center w-full"
            >
              Edit post
            </button>
          </>
        )}

        <button
          onClick={() => {
            onClose();
            onShare?.();
          }}
          className="py-3.5 text-sm font-medium text-light-1 hover:bg-dark-3 transition-colors text-center w-full"
        >
          Share to...
        </button>

        <button
          onClick={handleCopyLink}
          className="py-3.5 text-sm font-medium text-light-1 hover:bg-dark-3 transition-colors text-center w-full"
        >
          Copy link
        </button>

        <button
          onClick={onClose}
          className="py-3.5 text-sm font-medium text-light-4 hover:bg-dark-3 transition-colors text-center w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PostOptionsModal;
