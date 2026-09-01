import { useUserContext } from "@/context/AuthContext";
import { useAddComment } from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { Edit, Heart, MapPin, Send, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import PostStats from "./PostStats";

type PostCardProps = {
  post: any;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [doubleTapLiked, setDoubleTapLiked] = useState(false);

  const { mutate: addComment, isPending: isAddingComment } = useAddComment();

  if (!post || !post.creator) return null;

  const isAuthor =
    user.id === post.creator.$id ||
    user.id === post.creator.id ||
    user.id === post.creator;

  const handleDoubleTap = () => {
    setDoubleTapLiked(true);
    setTimeout(() => setDoubleTapLiked(false), 800);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment({
      postId: post.$id,
      commentText: commentText.trim(),
      user,
    });
    setCommentText("");
  };

  const creatorAvatar =
    post.creator.imageUrl ||
    post.creator.avatarUrl ||
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80";

  const tags = Array.isArray(post.tags) ? post.tags : [];
  const comments = Array.isArray(post.comments) ? post.comments : [];

  return (
    <article className="post-card relative overflow-hidden group">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link
            to={`/profile/${post.creator.$id || post.creator.id || user.id}`}
            className="relative"
          >
            <Avatar className="h-11 w-11 ring-2 ring-primary-500/40 hover:ring-primary-500 transition-all">
              <AvatarImage src={creatorAvatar} alt={post.creator.name} />
              <AvatarFallback className="bg-primary-500/20 text-primary-500 font-bold">
                {post.creator.name ? post.creator.name[0] : "C"}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <Link
                to={`/profile/${post.creator.$id || post.creator.id || user.id}`}
                className="font-bold text-light-1 text-sm sm:text-base hover:text-primary-500 transition-colors"
              >
                {post.creator.name}
              </Link>
              <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
            </div>

            <div className="flex items-center gap-2 text-light-4 text-xs">
              <span>{multiFormatDateString(post.$createdAt)}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 truncate max-w-[140px] sm:max-w-[200px]">
                    <MapPin className="w-3 h-3 text-secondary-500" />
                    {post.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Edit Button for Author */}
        {isAuthor && (
          <Link
            to={`/update-post/${post.$id}`}
            className="p-2 rounded-xl text-light-4 hover:text-light-1 hover:bg-white/[0.06] transition-all"
            title="Edit Post"
          >
            <Edit className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Caption & Tags */}
      <div className="mb-4 text-sm sm:text-[15px] leading-relaxed text-light-2">
        <p>{post.caption}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {tags.map((tag: string, index: number) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-dark-3/60 text-primary-500 border-primary-500/20 hover:bg-primary-500/10 cursor-pointer transition-colors"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Media Image with double-tap heart animation */}
      {post.imagesUrl && (
        <div
          className="relative rounded-[22px] overflow-hidden bg-dark-1/90 cursor-pointer select-none"
          onDoubleClick={handleDoubleTap}
        >
          <Link to={`/posts/${post.$id}`}>
            <img
              src={post.imagesUrl}
              alt="post"
              className="w-full object-cover max-h-[520px] transition-transform duration-500 hover:scale-[1.01]"
              loading="lazy"
            />
          </Link>

          {/* Double Tap Heart Pop Overlay */}
          {doubleTapLiked && (
            <div className="absolute inset-0 flex-center pointer-events-none animate-in fade-in-0 zoom-in-50 duration-200">
              <div className="w-20 h-20 rounded-full bg-secondary-500/30 backdrop-blur-md flex-center shadow-glow-pink">
                <Heart className="w-12 h-12 fill-secondary-500 text-secondary-500 animate-bounce" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Post Actions & Stats */}
      <PostStats
        post={post}
        userId={user.id}
        onCommentClick={() => setShowComments(!showComments)}
        commentCount={comments.length}
      />

      {/* Expandable Quick Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-3 animate-in fade-in-0 duration-200">
          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {comments.map((comment: any, idx: number) => (
                <div
                  key={comment.id || idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-dark-3/40 text-xs"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={comment.userAvatar} />
                    <AvatarFallback className="text-[10px]">
                      {comment.userName ? comment.userName[0] : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-light-1">
                        {comment.userName}
                      </span>
                      <span className="text-[10px] text-light-4">
                        {comment.createdAt}
                      </span>
                    </div>
                    <p className="text-light-2 mt-0.5">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-light-4 text-center py-2">
              No comments yet. Be the first to meow! 🐾
            </p>
          )}

          {/* New Comment Input */}
          <form onSubmit={handleSendComment} className="flex items-center gap-2 mt-1">
            <input
              type="text"
              placeholder="Add a friendly comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 h-9 px-3.5 rounded-xl bg-dark-3/80 border border-white/[0.08] text-xs text-light-1 placeholder:text-light-4 focus:outline-none focus:border-primary-500"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isAddingComment || !commentText.trim()}
              className="h-9 px-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      )}
    </article>
  );
};

export default PostCard;
