import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  getStoredFollows,
  MOCK_STORIES,
  MOCK_USERS,
  saveStoredFollows,
} from "@/lib/mock/mockData";
import {
  useGetRecentPosts,
  useGetUsers,
} from "@/lib/react-query/queriesAndMutations";
import { Flame, Plus, Sparkles, TrendingUp, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const TRENDING_TAGS = [
  { tag: "cutekitties", posts: "24.5k" },
  { tag: "catloaf", posts: "18.2k" },
  { tag: "naptime", posts: "12.8k" },
  { tag: "mainecoon", posts: "9.4k" },
  { tag: "boxlife", posts: "8.1k" },
];

const Home = () => {
  const { data: posts, isPending: isPostLoading } = useGetRecentPosts();
  const { data: creatorsData } = useGetUsers(5);
  const { user } = useUserContext();

  const [followedUsers, setFollowedUsers] = useState<string[]>(getStoredFollows());
  const [activeStory, setActiveStory] = useState<any | null>(null);

  const toggleFollow = (creatorId: string) => {
    let updated: string[];
    if (followedUsers.includes(creatorId)) {
      updated = followedUsers.filter((id) => id !== creatorId);
    } else {
      updated = [...followedUsers, creatorId];
    }
    setFollowedUsers(updated);
    saveStoredFollows(updated);
  };

  const creators = creatorsData?.documents || MOCK_USERS.slice(0, 5);
  const postList = posts?.documents || [];

  return (
    <div className="flex flex-1 w-full justify-center overflow-hidden">
      {/* Main Center Feed Container */}
      <div className="home-container">
        <div className="home-posts">
          {/* Top Stories / Creator Reel */}
          <div className="w-full flex items-center gap-3.5 overflow-x-auto pb-2 pt-1 custom-scrollbar">
            {/* My Story Creator Add */}
            <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
              <div className="relative">
                <Avatar className="w-16 h-16 ring-2 ring-primary-500/40 p-0.5">
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback className="bg-primary-500/20 text-primary-500 font-bold">
                    {user.name ? user.name[0] : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex-center text-white border-2 border-dark-1 shadow-sm">
                  <Plus className="w-3 h-3" />
                </div>
              </div>
              <span className="text-[11px] font-medium text-light-3 group-hover:text-light-1">
                Your Story
              </span>
            </div>

            {/* Friend Stories */}
            {MOCK_STORIES.map((story) => (
              <div
                key={story.id}
                onClick={() => setActiveStory(story)}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
              >
                <div
                  className={`p-0.5 rounded-full transition-transform duration-200 group-hover:scale-105 ${
                    story.hasUnseen
                      ? "bg-gradient-to-tr from-primary-500 via-secondary-500 to-accent-cyan shadow-glow"
                      : "bg-white/10"
                  }`}
                >
                  <Avatar className="w-15 h-15 border-2 border-dark-1">
                    <AvatarImage src={story.user.imageUrl} />
                    <AvatarFallback>{story.user.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-[11px] font-medium text-light-3 truncate max-w-[64px] text-center group-hover:text-light-1">
                  {story.user.name.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>

          {/* Feed Header */}
          <div className="flex items-center justify-between w-full pt-2">
            <div className="flex items-center gap-2">
              <h1 className="h3-bold md:h2-bold text-white tracking-tight">Home Feed</h1>
              <span className="text-xl">🐾</span>
            </div>

            <Link
              to="/explore"
              className="flex items-center gap-1 text-xs font-semibold text-primary-500 hover:text-secondary-500 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore More</span>
            </Link>
          </div>

          {/* Posts List or Loader */}
          {isPostLoading && !posts ? (
            <div className="flex flex-col gap-6 w-full py-8">
              <Loader size="lg" />
              <p className="text-center text-xs text-light-4">Fetching fresh feline stories...</p>
            </div>
          ) : postList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-[28px] w-full">
              <span className="text-4xl mb-3">🐱</span>
              <p className="font-bold text-light-1">No posts yet</p>
              <p className="text-xs text-light-4 mt-1 mb-4">Be the first cat parent to share a moment!</p>
              <Link
                to="/create-post"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-semibold shadow-glow"
              >
                Create First Post
              </Link>
            </div>
          ) : (
            <div className="flex flex-col flex-1 gap-7 w-full">
              {postList.map((post: any) => (
                <PostCard key={post.$id || post.caption} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar (Desktop Creators & Trending) */}
      <aside className="home-creators">
        {/* Top Creators Widget */}
        <div className="flex flex-col gap-4 p-5 rounded-[24px] glass-card border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-500" />
              <h3 className="font-bold text-sm text-light-1">Top Creators</h3>
            </div>
            <Link
              to="/all-users"
              className="text-xs font-semibold text-primary-500 hover:underline"
            >
              See All
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {creators.map((creator: any) => {
              const isFollowing = followedUsers.includes(creator.$id);

              return (
                <div
                  key={creator.$id}
                  className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-all"
                >
                  <Link
                    to={`/profile/${creator.$id}`}
                    className="flex items-center gap-2.5 min-w-0"
                  >
                    <Avatar className="h-9 w-9 ring-1 ring-primary-500/30">
                      <AvatarImage src={creator.imageUrl} />
                      <AvatarFallback className="text-xs">
                        {creator.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <p className="text-xs font-bold text-light-1 truncate">
                        {creator.name}
                      </p>
                      <p className="text-[10px] text-light-4 truncate">
                        @{creator.username}
                      </p>
                    </div>
                  </Link>

                  <Button
                    size="sm"
                    onClick={() => toggleFollow(creator.$id)}
                    className={`h-7 px-3 text-[11px] font-semibold rounded-lg transition-all ${
                      isFollowing
                        ? "bg-dark-4 text-light-3 hover:bg-dark-5 hover:text-white"
                        : "bg-primary-500/20 text-primary-500 border border-primary-500/30 hover:bg-primary-500 hover:text-white"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trending Tags Widget */}
        <div className="flex flex-col gap-4 p-5 rounded-[24px] glass-card border border-white/[0.08]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-secondary-500" />
            <h3 className="font-bold text-sm text-light-1">Trending Topics</h3>
          </div>

          <div className="flex flex-col gap-2.5">
            {TRENDING_TAGS.map((item) => (
              <Link
                key={item.tag}
                to={`/explore`}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] transition-all text-xs"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-light-2 hover:text-primary-500 transition-colors">
                    #{item.tag}
                  </span>
                  <span className="text-[10px] text-light-4">
                    {item.posts} posts this week
                  </span>
                </div>
                <Flame className="w-3.5 h-3.5 text-secondary-500" />
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Story Viewer Lightbox Modal */}
      {activeStory && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex-center p-4"
          onClick={() => setActiveStory(null)}
        >
          <div
            className="relative max-w-sm w-full bg-dark-2 rounded-[28px] overflow-hidden border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Story Progress Bar */}
            <div className="absolute top-3 left-3 right-3 h-1 bg-white/20 rounded-full overflow-hidden z-20">
              <div className="h-full bg-primary-500 rounded-full animate-[shimmer_5s_linear]" />
            </div>

            {/* Story Header */}
            <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 ring-2 ring-primary-500">
                  <AvatarImage src={activeStory.user.imageUrl} />
                  <AvatarFallback>{activeStory.user.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-bold text-white shadow-sm">
                  {activeStory.user.name}
                </span>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="w-7 h-7 rounded-full bg-black/50 text-white flex-center text-xs hover:bg-black"
              >
                ✕
              </button>
            </div>

            <img
              src={activeStory.media}
              alt="Story"
              className="w-full h-[520px] object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
