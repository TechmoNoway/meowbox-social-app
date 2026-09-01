import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import {
  useAddComment,
  useDeletePost,
  useGetPostById,
  useGetRecentPosts,
} from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { ArrowLeft, Edit, MapPin, Send, Sparkles, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import GridPostList from "@/components/shared/GridPostList";

const PostDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUserContext();

  const [commentText, setCommentText] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: post, isPending } = useGetPostById(id || "");
  const { data: relatedPostsData } = useGetRecentPosts();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const { mutate: addComment, isPending: isAddingComment } = useAddComment();

  if (isPending || !post) {
    return (
      <div className="w-full h-full flex-center">
        <Loader size="lg" />
      </div>
    );
  }

  const isAuthor =
    user.id === post?.creator?.$id ||
    user.id === post?.creator?.id ||
    user.id === post?.creator;

  const handleDeletePost = () => {
    deletePost(
      { postId: post.$id, imageId: post?.imageId || "" },
      {
        onSuccess: () => {
          toast({ title: "Post deleted successfully" });
          navigate("/");
        },
      }
    );
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

  const tags = Array.isArray(post.tags) ? post.tags : [];
  const comments = Array.isArray(post.comments) ? post.comments : [];
  const creatorAvatar =
    post.creator?.imageUrl ||
    post.creator?.avatarUrl ||
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80";

  const relatedPosts = (relatedPostsData?.documents || []).filter(
    (p: any) => p.$id !== post.$id
  );

  return (
    <div className="post_details-container">
      {/* Top Back Navigation */}
      <div className="w-full max-w-5xl flex items-center justify-between">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="flex items-center gap-2 text-light-3 hover:text-white p-0 hover:bg-transparent"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Back to feed</span>
        </Button>
      </div>

      {/* Main Post Details Card */}
      <div className="post_details-card">
        {/* Post Image Showcase */}
        <div className="xl:w-[52%] bg-dark-1/80 flex-center overflow-hidden border-b xl:border-b-0 xl:border-r border-white/[0.08]">
          <img
            src={post.imagesUrl}
            alt="post"
            className="w-full h-full max-h-[600px] object-cover"
          />
        </div>

        {/* Post Details & Comments Panel */}
        <div className="post_details-info">
          {/* Author Header */}
          <div className="flex items-center justify-between w-full">
            <Link
              to={`/profile/${post.creator?.$id || post.creator?.id || user.id}`}
              className="flex items-center gap-3 group"
            >
              <Avatar className="h-11 w-11 ring-2 ring-primary-500/40 group-hover:ring-primary-500 transition-all">
                <AvatarImage src={creatorAvatar} alt={post.creator?.name} />
                <AvatarFallback className="bg-primary-500/20 text-primary-500 font-bold">
                  {post.creator?.name ? post.creator.name[0] : "C"}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-light-1 text-sm group-hover:text-primary-500 transition-colors">
                    {post.creator?.name}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                </div>
                <div className="flex items-center gap-2 text-light-4 text-xs">
                  <span>{multiFormatDateString(post.$createdAt)}</span>
                  {post.location && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-secondary-500" />
                        {post.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>

            {/* Author Actions (Edit / Delete) */}
            {isAuthor && (
              <div className="flex items-center gap-1">
                <Link
                  to={`/update-post/${post.$id}`}
                  className="p-2 rounded-xl text-light-3 hover:text-white hover:bg-white/[0.06] transition-all"
                  title="Edit Post"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="h-9 w-9 text-light-4 hover:text-red hover:bg-red/10 rounded-xl"
                  title="Delete Post"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <hr className="w-full border-white/[0.08]" />

          {/* Caption & Tag Chips */}
          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm leading-relaxed text-light-1">
              {post.caption}
            </p>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-dark-3/60 text-primary-500 border-primary-500/20"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Comments Thread */}
          <div className="flex flex-col flex-1 w-full gap-3 mt-2 min-h-[140px]">
            <span className="text-xs font-bold text-light-3 uppercase tracking-wider">
              Comments ({comments.length})
            </span>

            <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
              {comments.length > 0 ? (
                comments.map((c: any, idx: number) => (
                  <div
                    key={c.id || idx}
                    className="flex items-start gap-2.5 p-3 rounded-2xl bg-dark-3/50 text-xs border border-white/[0.04]"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={c.userAvatar} />
                      <AvatarFallback>{c.userName ? c.userName[0] : "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-light-1">{c.userName}</span>
                        <span className="text-[10px] text-light-4">{c.createdAt}</span>
                      </div>
                      <p className="text-light-2 mt-1">{c.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-light-4 text-center py-6">
                  No comments yet. Be the first to share love! 🐾
                </p>
              )}
            </div>
          </div>

          {/* Post Stats & Comment Input Form */}
          <div className="w-full flex flex-col gap-3 pt-2">
            <PostStats post={post} userId={user.id} commentCount={comments.length} />

            <form onSubmit={handleSendComment} className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 h-11 px-4 rounded-xl bg-dark-3/80 border border-white/[0.08] text-xs text-light-1 placeholder:text-light-4 focus:outline-none focus:border-primary-500"
              />
              <Button
                type="submit"
                disabled={isAddingComment || !commentText.trim()}
                className="h-11 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog Modal */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this post?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="rounded-xl border-white/10"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePost}
              disabled={isDeleting}
              className="rounded-xl"
            >
              {isDeleting ? "Deleting..." : "Delete Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <div className="w-full max-w-5xl mt-12 mb-8">
          <h3 className="body-bold md:h3-bold text-light-1 mb-6 flex items-center gap-2">
            <span>More from MeowBox Feed</span>
            <Sparkles className="w-4 h-4 text-primary-500" />
          </h3>
          <GridPostList posts={relatedPosts.slice(0, 6)} />
        </div>
      )}
    </div>
  );
};

export default PostDetails;
