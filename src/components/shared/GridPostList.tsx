import { useUserContext } from "@/context/AuthContext";
import { Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type GridPostListProps = {
  posts: any[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts = [],
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-[24px] w-full">
        <span className="text-3xl mb-2">🐾</span>
        <p className="font-semibold text-light-3 text-sm">No posts to display</p>
      </div>
    );
  }

  return (
    <ul className="grid-container">
      {posts.map((post) => {
        if (!post) return null;

        const creatorName = post.creator?.name || "Meow Creator";
        const creatorAvatar =
          post.creator?.imageUrl ||
          "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80";
        const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
        const commentsCount = Array.isArray(post.comments)
          ? post.comments.length
          : 0;

        return (
          <li
            key={post.$id || post.caption}
            className="relative h-80 sm:h-96 rounded-[24px] overflow-hidden group border border-white/[0.08] shadow-lg bg-dark-2"
          >
            {/* Post Image Link */}
            <Link
              to={`/posts/${post.$id}`}
              className="block w-full h-full overflow-hidden"
            >
              <img
                src={post.imagesUrl}
                alt={post.caption || "post"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </Link>

            {/* Bottom Floating Stats & User Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-1/90 via-dark-1/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end p-4">
              <div className="pointer-events-auto flex items-center justify-between w-full">
                {showUser && (
                  <Link
                    to={`/profile/${post.creator?.$id || post.creator?.id || user.id}`}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <Avatar className="h-8 w-8 ring-1 ring-white/20">
                      <AvatarImage src={creatorAvatar} />
                      <AvatarFallback className="text-xs">
                        {creatorName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-bold text-white truncate max-w-[120px]">
                      {creatorName}
                    </span>
                  </Link>
                )}

                {showStats && (
                  <div className="flex items-center gap-3 text-white text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-secondary-500 text-secondary-500" />
                      {likesCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
                      {commentsCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default GridPostList;
