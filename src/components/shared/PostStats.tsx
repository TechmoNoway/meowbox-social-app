import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import confetti from "canvas-confetti";
import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { toast } from "../ui/use-toast";

type PostStatsProps = {
  post?: any;
  userId: string;
  onCommentClick?: () => void;
  commentCount?: number;
};

const PostStats = ({
  post,
  userId,
  onCommentClick,
  commentCount,
}: PostStatsProps) => {
  const initialLikes = Array.isArray(post?.likes)
    ? post.likes.map((u: any) => (typeof u === "string" ? u : u?.$id || u?.id))
    : [];

  const [likes, setLikes] = useState<string[]>(initialLikes);
  const [isSaved, setIsSaved] = useState(false);
  const [isLikedAnim, setIsLikedAnim] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } =
    useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save?.find(
    (record: any) =>
      record?.post?.$id === post?.$id || record?.post === post?.$id
  );

  useEffect(() => {
    setIsSaved(Boolean(savedPostRecord));
  }, [currentUser, savedPostRecord]);

  const hasLiked = checkIsLiked(likes, userId);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    let newLikes = [...likes];

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
      setIsLikedAnim(true);
      setTimeout(() => setIsLikedAnim(false), 600);

      // Micro celebration burst
      confetti({
        particleCount: 18,
        spread: 45,
        origin: {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        },
        colors: ["#EC4899", "#8B5CF6", "#F43F5E"],
      });
    }

    setLikes(newLikes);
    likePost({ postId: post?.$id || "", likesArray: newLikes });
  };

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
      toast({
        title: "Removed from Saved",
      });
    } else {
      savePost({ postId: post?.$id || "", userId });
      setIsSaved(true);
      toast({
        title: "Saved to your collection! 🐾",
      });
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const shareUrl = `${window.location.origin}/posts/${post?.$id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied! 📋",
      description: "Post link copied to clipboard.",
    });
  };

  const totalComments =
    commentCount ?? (Array.isArray(post?.comments) ? post.comments.length : 0);

  return (
    <div className="flex items-center justify-between w-full pt-3 mt-1 border-t border-white/[0.06]">
      {/* Left Interactions (Like, Comment, Share) */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Like */}
        <button
          onClick={handleLikePost}
          className="flex items-center gap-1.5 group focus:outline-none"
        >
          <div
            className={`p-2 rounded-xl transition-all duration-200 ${
              hasLiked
                ? "bg-secondary-500/20 text-secondary-500 scale-110"
                : "text-light-3 hover:text-secondary-500 hover:bg-white/[0.05]"
            } ${isLikedAnim ? "scale-125 transition-transform" : ""}`}
          >
            <Heart
              className={`w-5 h-5 ${
                hasLiked ? "fill-secondary-500 text-secondary-500" : ""
              }`}
            />
          </div>
          <span
            className={`text-xs font-semibold ${
              hasLiked ? "text-secondary-500" : "text-light-3"
            }`}
          >
            {likes.length}
          </span>
        </button>

        {/* Comment */}
        <button
          onClick={onCommentClick}
          className="flex items-center gap-1.5 group focus:outline-none"
        >
          <div className="p-2 rounded-xl text-light-3 hover:text-accent-cyan hover:bg-white/[0.05] transition-all duration-200">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-light-3">
            {totalComments}
          </span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="p-2 rounded-xl text-light-3 hover:text-primary-500 hover:bg-white/[0.05] transition-all duration-200 focus:outline-none"
          title="Share Post"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Right Interaction (Save) */}
      <button
        onClick={handleSavePost}
        disabled={isSavingPost || isDeletingSaved}
        className="focus:outline-none"
        title={isSaved ? "Saved" : "Save Post"}
      >
        {isSavingPost || isDeletingSaved ? (
          <Loader size="sm" />
        ) : (
          <div
            className={`p-2 rounded-xl transition-all duration-200 ${
              isSaved
                ? "bg-primary-500/20 text-primary-500 scale-110"
                : "text-light-3 hover:text-primary-500 hover:bg-white/[0.05]"
            }`}
          >
            <Bookmark
              className={`w-5 h-5 ${
                isSaved ? "fill-primary-500 text-primary-500" : ""
              }`}
            />
          </div>
        )}
      </button>
    </div>
  );
};

export default PostStats;
