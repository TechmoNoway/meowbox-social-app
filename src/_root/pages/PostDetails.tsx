import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import PostOptionsModal from "@/components/shared/PostOptionsModal";
import SharePostModal from "@/components/shared/SharePostModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useAddComment,
  useDeletePost,
  useDeleteSavedPost,
  useGetCurrentUser,
  useGetPostById,
  useGetRecentPosts,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Smile,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();

  const [commentInput, setCommentInput] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const { data: post, isLoading } = useGetPostById(id || "");
  const { data: userPosts, isLoading: isUserPostLoading } = useGetRecentPosts();
  const { data: currentUser } = useGetCurrentUser();

  const { mutate: likePostMutation } = useLikePost();
  const { mutate: savePostMutation } = useSavePost();
  const { mutate: deleteSavedPostMutation } = useDeleteSavedPost();
  const { mutate: deletePostMutation } = useDeletePost();
  const { mutateAsync: addCommentMutation, isPending: isAddingComment } =
    useAddComment();

  // Likes state
  const likesList: string[] = post?.likes || [];
  const [likes, setLikes] = useState<string[]>(likesList);
  const isLiked = likes.includes(user.id);

  // Saved state
  const savedPostRecord = currentUser?.save?.find(
    (record: any) => record?.post?.$id === post?.$id || record?.post?.id === post?.$id
  );
  const [isSaved, setIsSaved] = useState(!!savedPostRecord);

  const isAuthor =
    user.id === (post?.creator as any)?.$id ||
    user.id === (post?.creator as any)?.id;

  const handleLike = () => {
    let newLikes = [...likes];
    const hasLiked = newLikes.includes(user.id);

    if (hasLiked) {
      newLikes = newLikes.filter((userId) => userId !== user.id);
    } else {
      newLikes.push(user.id);
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.7 },
        colors: ["#ED4956", "#DD2A7B", "#F58529"],
      });
    }

    setLikes(newLikes);
    likePostMutation({ postId: post?.$id || "", likesArray: newLikes });
  };

  const handleSave = () => {
    if (savedPostRecord || isSaved) {
      setIsSaved(false);
      deleteSavedPostMutation(savedPostRecord?.$id || `save_${post?.$id}`);
      toast({ title: "Removed from Saved" });
    } else {
      setIsSaved(true);
      savePostMutation({ postId: post?.$id || "", userId: user.id });
      toast({ title: "Saved to your collection! 🔖" });
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !post) return;

    await addCommentMutation({
      postId: post.$id,
      commentText: commentInput.trim(),
      user,
    });

    setCommentInput("");
  };

  const handleDeletePost = () => {
    deletePostMutation({ postId: post?.$id || "", imageId: post?.imageId });
    toast({ title: "Post deleted" });
    navigate("/");
  };

  const relatedPosts =
    userPosts?.documents.filter((p: any) => p.$id !== post?.$id).slice(0, 6) ||
    [];

  if (isLoading || !post) {
    return (
      <div className="flex-center w-full h-full bg-dark-1">
        <Loader size="lg" />
      </div>
    );
  }

  const comments = post.comments || [];

  return (
    <div className="post_details-container bg-dark-1">
      {/* Back Button */}
      <div className="w-full max-w-5xl">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="flex items-center gap-2 text-light-3 hover:text-white p-0 hover:bg-transparent"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Back</span>
        </Button>
      </div>

      {/* Main Split-view Post Card */}
      <div className="post_details-card">
        {/* Left: High-Res Image with Filter */}
        <div className="relative md:w-[58%] aspect-square md:aspect-auto bg-black flex-center overflow-hidden">
          <img
            src={post.imagesUrl}
            alt="post"
            className={`w-full h-full object-cover ${
              post.filter ? `filter-${post.filter}` : ""
            }`}
          />
        </div>

        {/* Right: Comments, Stats & Interactions */}
        <div className="flex flex-col flex-1 justify-between bg-dark-1 md:border-l border-dark-4 max-h-[600px]">
          {/* Top Post Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark-4">
            <Link
              to={`/profile/${post.creator.$id || (post.creator as any)?.id}`}
              className="flex items-center gap-3 group"
            >
              <div className="ig-story-ring">
                <Avatar className="h-8 w-8 ring-2 ring-dark-1">
                  <AvatarImage src={post.creator.imageUrl} />
                  <AvatarFallback className="text-xs">
                    {post.creator.name ? post.creator.name[0] : "U"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-xs font-bold text-light-1 group-hover:text-light-3">
                  {post.creator.username || post.creator.name}
                </span>
                {post.location && (
                  <span className="text-[11px] text-light-4 truncate max-w-[180px]">
                    {post.location}
                  </span>
                )}
              </div>
            </Link>

            <button
              onClick={() => setShowOptionsModal(true)}
              className="p-1 rounded-full text-light-4 hover:text-white"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Comments & Caption Scroll Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
            {/* Author Caption */}
            {post.caption && (
              <div className="flex items-start gap-3 text-xs leading-relaxed">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={post.creator.imageUrl} />
                  <AvatarFallback>{post.creator.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <span className="font-bold text-light-1 mr-2">
                    {post.creator.username || post.creator.name}
                  </span>
                  <span className="text-light-2">{post.caption}</span>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-light-4">
                    <span>{multiFormatDateString(post.$createdAt)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pl-11">
                {post.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs text-primary-500 font-medium hover:underline cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <hr className="border-dark-4 my-1" />

            {/* Comments List */}
            {comments.map((c: any) => (
              <div
                key={c.id}
                className="flex items-start gap-3 text-xs leading-relaxed"
              >
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarImage src={c.userAvatar} />
                  <AvatarFallback className="text-[10px]">
                    {c.userName ? c.userName[0] : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <span className="font-bold text-light-1 mr-2">
                    {c.userName}
                  </span>
                  <span className="text-light-2">{c.text}</span>
                  <div className="flex items-center gap-3 pt-1 text-[10px] text-light-4">
                    <span>{c.createdAt}</span>
                    <button className="font-semibold hover:text-white">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Row & Like Counters */}
          <div className="p-4 border-t border-dark-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
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
                  onClick={() =>
                    document.getElementById("comment-input-field")?.focus()
                  }
                  className="text-light-1 hover:text-light-3"
                >
                  <MessageCircle className="w-6 h-6 stroke-[1.75px] -rotate-90" />
                </button>

                <button
                  onClick={() => setShowShareModal(true)}
                  className="text-light-1 hover:text-light-3"
                >
                  <Send className="w-6 h-6 stroke-[1.75px]" />
                </button>
              </div>

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

            {/* Like count & Date */}
            <div className="flex flex-col text-xs">
              <span className="font-bold text-light-1">
                {likes.length.toLocaleString()} likes
              </span>
              <span className="text-[10px] uppercase text-light-4 tracking-wider mt-0.5">
                {multiFormatDateString(post.$createdAt)}
              </span>
            </div>

            {/* Inline Comment Input */}
            <form
              onSubmit={handleAddComment}
              className="pt-2 border-t border-dark-4 flex items-center gap-2"
            >
              <Smile className="w-5 h-5 text-light-4 hover:text-light-3 cursor-pointer shrink-0" />
              <input
                id="comment-input-field"
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
                  className="text-xs font-bold text-primary-500 hover:text-primary-600 shrink-0"
                >
                  Post
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* More Posts Section */}
      {relatedPosts.length > 0 && (
        <div className="w-full max-w-5xl flex flex-col gap-6 pt-10 border-t border-dark-4">
          <h3 className="text-sm font-bold text-light-3">
            More posts from creators
          </h3>
          <GridPostList posts={relatedPosts} showStats={true} />
        </div>
      )}

      {/* Modals */}
      {showShareModal && (
        <SharePostModal
          post={post}
          onClose={() => setShowShareModal(false)}
        />
      )}

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
    </div>
  );
};

export default PostDetails;
