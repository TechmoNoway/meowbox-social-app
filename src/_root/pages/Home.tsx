import PostCard from "@/components/shared/PostCard";
import StoryViewer from "@/components/shared/StoryViewer";
import Loader from "@/components/shared/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  getStoredFollows,
  MOCK_STORIES,
  MOCK_USERS,
  saveStoredFollows,
} from "@/lib/mock/mockData";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Check, Plus, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useUserContext();
  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [followedUsers, setFollowedUsers] = useState<string[]>(getStoredFollows());

  const toggleFollow = (userId: string) => {
    let updated: string[];
    if (followedUsers.includes(userId)) {
      updated = followedUsers.filter((id) => id !== userId);
    } else {
      updated = [...followedUsers, userId];
    }
    setFollowedUsers(updated);
    saveStoredFollows(updated);
  };

  const suggestedUsers = MOCK_USERS.filter((u) => u.$id !== user.id).slice(0, 5);

  return (
    <div className="flex flex-1 justify-center w-full h-full overflow-y-auto custom-scrollbar bg-dark-1">
      <div className="flex justify-center max-w-5xl w-full gap-10 py-6 px-0 sm:px-4">
        {/* Main Feed Column */}
        <div className="flex flex-col items-center max-w-[470px] w-full gap-6">
          {/* Stories Reel Tray */}
          <div className="w-full bg-dark-1 sm:bg-dark-1 border-b sm:border border-dark-4 sm:rounded-xl p-3.5 overflow-x-auto custom-scrollbar flex items-center gap-4">
            {/* User's own add story */}
            <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
              <div className="relative">
                <Avatar className="h-14 w-14 ring-2 ring-dark-4 group-hover:ring-primary-500 transition-all">
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback className="bg-dark-3 text-xs">
                    {user.name ? user.name[0] : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary-500 border-2 border-dark-1 flex-center text-white">
                  <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                </div>
              </div>
              <span className="text-[11px] text-light-3 truncate max-w-[64px] text-center">
                Your story
              </span>
            </div>

            {/* Friend Stories */}
            {MOCK_STORIES.map((story, index) => (
              <div
                key={story.id}
                onClick={() => setActiveStoryIdx(index)}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
              >
                <div
                  className={
                    story.hasUnseen ? "ig-story-ring" : "ig-story-ring-seen"
                  }
                >
                  <Avatar className="h-14 w-14 ring-2 ring-dark-1 group-hover:scale-[1.02] transition-transform">
                    <AvatarImage src={story.user.imageUrl} />
                    <AvatarFallback className="bg-dark-3 text-xs">
                      {story.user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-[11px] text-light-1 truncate max-w-[64px] text-center font-normal">
                  {story.user.username}
                </span>
              </div>
            ))}
          </div>

          {/* Posts Feed */}
          {isPostLoading && !posts ? (
            <div className="py-20">
              <Loader size="lg" />
            </div>
          ) : (
            <div className="flex flex-col gap-5 w-full">
              {posts?.documents.map((post: any) => (
                <PostCard key={post.$id} post={post} />
              ))}

              {/* End of Feed Indicator */}
              <div className="flex flex-col items-center justify-center py-8 text-center gap-2 border-t border-dark-4 max-w-[470px] mx-auto">
                <div className="w-10 h-10 rounded-full border border-dark-4 flex-center text-light-3">
                  <Check className="w-5 h-5 text-primary-500" />
                </div>
                <p className="text-sm font-bold text-light-1">You're all caught up</p>
                <p className="text-xs text-light-4">
                  You've seen all new posts from the past 3 days.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Desktop Suggestions Sidebar */}
        <aside className="hidden lg:flex flex-col w-[320px] pt-4 gap-5">
          {/* Current User Card */}
          <div className="flex items-center justify-between">
            <Link
              to={`/profile/${user.id}`}
              className="flex items-center gap-3 group"
            >
              <Avatar className="h-11 w-11 ring-1 ring-dark-4">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback>{user.name ? user.name[0] : "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-bold text-light-1 group-hover:text-light-3">
                  {user.username || user.name}
                </span>
                <span className="text-xs text-light-4 truncate max-w-[150px]">
                  {user.name}
                </span>
              </div>
            </Link>

            <Link
              to={`/profile/${user.id}`}
              className="text-xs font-bold text-primary-500 hover:text-white transition-colors"
            >
              Switch
            </Link>
          </div>

          {/* Suggestions Header */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-light-4">Suggested for you</span>
            <Link
              to="/all-users"
              className="text-xs font-bold text-light-1 hover:text-light-3"
            >
              See All
            </Link>
          </div>

          {/* Suggested Creators List */}
          <div className="flex flex-col gap-3">
            {suggestedUsers.map((creator) => {
              const isFollowing = followedUsers.includes(creator.$id);

              return (
                <div
                  key={creator.$id}
                  className="flex items-center justify-between"
                >
                  <Link
                    to={`/profile/${creator.$id}`}
                    className="flex items-center gap-3 group"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={creator.imageUrl} />
                      <AvatarFallback>{creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-bold text-light-1 group-hover:text-light-3">
                        {creator.username}
                      </span>
                      <span className="text-[11px] text-light-4 truncate max-w-[140px]">
                        Suggested for you
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={() => toggleFollow(creator.$id)}
                    className={`text-xs font-bold transition-colors ${
                      isFollowing
                        ? "text-light-4 hover:text-white"
                        : "text-primary-500 hover:text-primary-600"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Instagram Style Legal Footer */}
          <div className="pt-6 flex flex-col gap-4 text-[11px] text-light-4 leading-relaxed">
            <div className="flex flex-wrap gap-x-1.5 gap-y-1">
              <span>About</span> • <span>Help</span> • <span>Press</span> •{" "}
              <span>API</span> • <span>Jobs</span> • <span>Privacy</span> •{" "}
              <span>Terms</span> • <span>Locations</span> • <span>Language</span>
            </div>
            <span>© 2026 MEOWBOX FROM INSTA</span>
          </div>
        </aside>
      </div>

      {/* Fullscreen Story Viewer Modal */}
      {activeStoryIdx !== null && (
        <StoryViewer
          stories={MOCK_STORIES}
          initialStoryIndex={activeStoryIdx}
          onClose={() => setActiveStoryIdx(null)}
        />
      )}
    </div>
  );
};

export default Home;
