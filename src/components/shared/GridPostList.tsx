import { useUserContext } from "@/context/AuthContext";
import { Clapperboard, Heart, MessageCircle } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type GridPostListProps = {
  posts: any[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();

  if (!posts || posts.length === 0) {
    return (
      <div className="w-full py-16 text-center text-light-4 text-xs">
        No posts available to display.
      </div>
    );
  }

  return (
    <ul className="grid-container">
      {posts.map((post: any) => {
        if (!post) return null;
        const likesCount = post.likes ? post.likes.length : 0;
        const commentsCount = post.comments ? post.comments.length : 0;

        return (
          <li key={post.$id} className="relative aspect-square group">
            <Link
              to={`/posts/${post.$id}`}
              className="grid-post_link overflow-hidden rounded-none sm:rounded-lg"
            >
              <img
                src={post.imagesUrl}
                alt="post"
                className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  post.filter ? `filter-${post.filter}` : ""
                }`}
              />

              {/* Instagram Hover Stats Overlay */}
              {showStats && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex-center gap-6 text-white font-bold text-sm">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-5 h-5 fill-white" />
                    <span>{likesCount}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-5 h-5 fill-white -rotate-90" />
                    <span>{commentsCount}</span>
                  </div>
                </div>
              )}

              {/* User mini badge if showUser */}
              {showUser && post.creator && (
                <div className="grid-post_user opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={post.creator.imageUrl} />
                      <AvatarFallback className="text-[10px]">
                        {post.creator.name ? post.creator.name[0] : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs font-bold text-white line-clamp-1">
                      {post.creator.username || post.creator.name}
                    </p>
                  </div>
                </div>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default GridPostList;
