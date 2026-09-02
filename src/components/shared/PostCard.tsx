import { useUserContext } from "@/context/AuthContext";
import {
  useAddComment,
  useDeletePost,
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Smile,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "../ui/use-toast";
import PostOptionsModal from "./PostOptionsModal";
import SharePostModal from "./SharePostModal";

type PostCardProps = {
  post: any;
};

const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { data: currentUser } = useGetCurrentUser();

  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  // Likes state
  const likesList: string[] = post?.likes || [];
  const [likes, setLikes] = useState<string[]>(likesList);
  const isLiked = likes.includes(user.id);

  // Saved state
  const savedPostRecord = currentUser?.save?.find(
    (record: any) => record?.post?.$id === post?.$id || record?.post?.id === post?.$id
  );
  const [isSaved, setIsSaved] = useState(!!savedPostRecord);

  // Mutations
  const { mutate: likePostMutation } = useLikePost();
  const { mutate: savePostMutation } = useSavePost();
  const { mutate: deleteSavedPostMutation } = useDeleteSavedPost();
  const { mutate: deletePostMutation } = useDeletePost();
  const { mutateAsync: addCommentMutation, isPending: isAddingComment } =
    useAddComment();

  const isAuthor = user.id === post?.creator?.$id || user.id === post?.creator?.id;

  const handleLike = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    let newLikes = [...likes];
    const hasLiked = newLikes.includes(user.id);

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== user.id);
    } else {
      newLikes.push(user.id);
      // Heart burst
      confetti({
        particleCount: 18,
        spread: 45,
        origin: { y: 0.7 },
        colors: ["#ED4956", "#DD2A7B", "#F58529"],
      });
    }

    setLikes(newLikes);
    likePostMutation({ postId: post.$id, likesArray: newLikes });
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 900);

    if (!likes.includes(user.id)) {
      handleLike();
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedPostRecord || isSaved) {
      setIsSaved(false);
      deleteSavedPostMutation(savedPostRecord?.$id || `save_${post.$id}`);
      toast({ title: "Removed from Saved" });
    } else {
      setIsSaved(true);
      savePostMutation({ postId: post.$id, userId: user.id });
      toast({ title: "Saved to your collection! 🔖" });
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    await addCommentMutation({
      postId: post.$id,
      commentText: commentInput.trim(),
      user,
    });

    setCommentInput("");
  };

  const handleDeletePost = () => {
    deletePostMutation({ postId: post.$id, imageId: post?.imageId });
    toast({ title: "Post deleted" });
  };

  if (!post || !post.creator) return null;

  const comments = post.comments || [];
  const visibleComments = showAllComments ? comments : comments.slice(-2);

  return (
    <>
      <article className="post-card">
        {/* Post Header */}
        <div className="flex items-center justify-between p-3.5">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.creator.$id || post.creator.id}`}>
              <div className="ig-story-ring">
                <Avatar className="h-8 w-8 ring-2 ring-dark-1">
                  <AvatarImage src={post.creator.imageUrl} />
                  <AvatarFallback className="text-xs bg-dark-4">
                    {post.creator.name ? post.creator.name[0] : "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Link>

            <div className="flex flex-col leading-tight">
              <Link
                to={`/profile/${post.creator.$id || post.creator.id}`}
                className="text-xs font-bold text-light-1 hover:text-light-3 transition-colors flex items-center gap-1"
              >
                <span>{post.creator.username || post.creator.name}</span>
              </Link>
              {post.location && (
                <span className="text-[11px] text-light-4 font-normal truncate max-w-[200px]">
                  {post.location}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowOptionsModal(true)}
            className="p-1 rounded-full text-light-4 hover:text-white transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Post Image Container */}
        <div
          className="relative w-full aspect-square bg-black overflow-hidden select-none cursor-pointer"
          onDoubleClick={handleDoubleTap}
        >
          <img
            src={post.imagesUrl}
            alt="post"
            className={`w-full h-full object-cover transition-transform duration-300 ${
              post.filter ? `filter-${post.filter}` : ""
            }`}
          />

          {/* Double Tap Heart Pop Animation */}
          {showHeartOverlay && (
            <div className="absolute inset-0 flex-center pointer-events-none animate-fade-in">
              <Heart className="w-24 h-24 text-secondary-500 fill-secondary-500 drop-shadow-[0_10px_25px_rgba(237,73,86,0.6)] animate-like-bounce" />
            </div>
          )}
        </div>

        {/* Post Action Buttons */}
        <div className="p-3.5 pb-2 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            {/* Left Actions: Like, Comment, Share */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className="transition-transform active:scale-125"
              >
                <Heart
                  className={`w-6 h-6 stroke-[1.75px] ${
                    isLiked
                      ? "fill-secondary-500 text-secondary-500"
                      : "text-light-1 hover:text-light-3"
                  }`}
                />
              </button>

              <button
                onClick={() => navigate(`/posts/${post.$id}`)}
                className="text-light-1 hover:text-light-3 transition-colors"
              >
                <MessageCircle className="w-6 h-6 stroke-[1.75px] -rotate-90" />
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="text-light-1 hover:text-light-3 transition-colors"
              >
                <Send className="w-6 h-6 stroke-[1.75px]" />
              </button>
            </div>

            {/* Right Action: Bookmark */}
            <button
              onClick={handleSave}
              className="text-light-1 hover:text-light-3 transition-transform active:scale-125"
            >
              <Bookmark
                className={`w-6 h-6 stroke-[1.75px] ${
                  isSaved ? "fill-white text-white" : ""
                }`}
              />
            </button>
          </div>

          {/* Likes Counter */}
          <div className="text-xs font-bold text-light-1">
            {likes.length > 0 ? (
              <span>{likes.length.toLocaleString()} likes</span>
            ) : (
              <span className="font-normal text-light-4">Be the first to like this</span>
            )}
          </div>

          {/* Caption */}
          {post.caption && (
            <div className="text-xs text-light-1 leading-relaxed">
              <Link
                to={`/profile/${post.creator.$id || post.creator.id}`}
                className="font-bold mr-2 hover:underline inline"
              >
                {post.creator.username || post.creator.name}
              </Link>
              <span className="font-normal">{post.caption}</span>
            </div>
          )}

          {/* Tag Chips */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {post.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="text-[11px] text-primary-500 font-medium hover:underline cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments Section */}
          {comments.length > 0 && (
            <div className="flex flex-col gap-1 pt-1">
              {comments.length > 2 && (
                <button
                  onClick={() => setShowAllComments(!showAllComments)}
                  className="text-xs text-light-4 hover:text-light-3 text-left w-fit font-normal"
                >
                  {showAllComments
                    ? "Hide comments"
                    : `View all ${comments.length} comments`}
                </button>
              )}

              <div className="flex flex-col gap-1">
                {visibleComments.map((c: any) => (
                  <div key={c.id} className="text-xs leading-snug flex items-start gap-1.5">
                    <span className="font-bold text-light-1 shrink-0">
                      {c.userName}:
                    </span>
                    <span className="text-light-2">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <span className="text-[10px] uppercase text-light-4 tracking-wider pt-1">
            {multiFormatDateString(post.$createdAt)}
          </span>
        </div>

        {/* Quick Comment Input */}
        <form
          onSubmit={handleAddComment}
          className="border-t border-dark-4 px-3.5 py-2.5 flex items-center gap-2"
        >
          <Smile className="w-5 h-5 text-light-4 hover:text-light-3 cursor-pointer shrink-0" />
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="w-full bg-transparent text-xs text-light-1 placeholder:text-light-4 focus:outline-none"
          />
          {commentInput.trim() && (
            <button
              type="submit"
              disabled={isAddingComment}
              className="text-xs font-bold text-primary-500 hover:text-primary-600 shrink-0 transition-colors"
            >
              Post
            </button>
          )}
        </form>
      </article>

      {/* Share Modal */}
      {showShareModal && (
        <SharePostModal
          post={post}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Options Menu Modal */}
      {showOptionsModal && (
        <PostOptionsModal
          post={post}
          isAuthor={isAuthor}
          onClose={() => setShowOptionsModal(false)}
          onEdit={() => navigate(`/update-post/${post.$id}`)}
          onDelete={handleDeletePost}
          onShare={() => {
            setShowOptionsModal(false);
            setShowShareModal(true);
          }}
        />
      )}
    </>
  );
};

export default PostCard;
