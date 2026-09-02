import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  getStoredFollows,
  getStoredPosts,
  getStoredSaves,
  MOCK_HIGHLIGHTS,
  MOCK_USERS,
  saveStoredFollows,
} from "@/lib/mock/mockData";
import {
  useGetUserById,
} from "@/lib/react-query/queriesAndMutations";
import {
  Bookmark,
  Clapperboard,
  Grid,
  Link as LinkIcon,
  Plus,
  Settings,
  Tag,
  UserCheck,
  UserPlus,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useUserContext();
  const targetUserId = id || currentUser.id;
  const isOwnProfile = targetUserId === currentUser.id;

  const [activeTab, setActiveTab] = useState<"posts" | "reels" | "saved" | "tagged">("posts");
  const [followedUsers, setFollowedUsers] = useState<string[]>(getStoredFollows());

  const { data: userProfile, isLoading: isProfileLoading } = useGetUserById(
    targetUserId
  );

  const toggleFollow = () => {
    let updated: string[];
    if (followedUsers.includes(targetUserId)) {
      updated = followedUsers.filter((uid) => uid !== targetUserId);
    } else {
      updated = [...followedUsers, targetUserId];
    }
    setFollowedUsers(updated);
    saveStoredFollows(updated);
  };

  if (isProfileLoading && !userProfile) {
    return (
      <div className="w-full h-full flex-center bg-dark-1">
        <Loader size="lg" />
      </div>
    );
  }

  const profileData: any = isOwnProfile
    ? {
        ...currentUser,
        followersCount: 14200,
        followingCount: 480,
      }
    : userProfile || currentUser;

  // Filter posts created by this user
  const allPosts = getStoredPosts();
  const userPosts = allPosts.filter(
    (p: any) =>
      p.creator?.$id === targetUserId ||
      p.creator?.id === targetUserId ||
      (isOwnProfile && p.creator?.$id === currentUser.id)
  );

  // Saved posts
  const savedIds = getStoredSaves();
  const savedPosts = allPosts.filter((p) => savedIds.includes(p.$id));

  const isFollowing = followedUsers.includes(targetUserId);

  return (
    <div className="profile-container bg-dark-1">
      <div className="max-w-4xl w-full flex flex-col gap-8">
        {/* Profile Header (Instagram Desktop & Mobile Layout) */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-14 pb-8 border-b border-dark-4">
          {/* Large Avatar with Story Ring */}
          <div className="ig-story-ring shrink-0">
            <Avatar className="h-24 w-24 sm:h-36 sm:w-36 ring-4 ring-dark-1">
              <AvatarImage src={profileData.imageUrl} />
              <AvatarFallback className="bg-dark-3 text-2xl font-bold">
                {profileData.name ? profileData.name[0] : "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User Details & Action Buttons */}
          <div className="flex flex-col gap-4 flex-1 w-full text-center sm:text-left">
            {/* Row 1: Username & Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h2 className="text-xl font-normal text-light-1">
                {profileData.username || profileData.name}
              </h2>

              {isOwnProfile ? (
                <div className="flex items-center gap-2">
                  <Link to={`/update-profile/${currentUser.id}`}>
                    <Button
                      variant="outline"
                      className="h-8 px-4 rounded-lg bg-dark-3 hover:bg-dark-4 text-xs font-semibold text-light-1 border-dark-4"
                    >
                      Edit profile
                    </Button>
                  </Link>

                  <Link to={`/update-profile/${currentUser.id}`}>
                    <Button
                      variant="outline"
                      className="h-8 px-4 rounded-lg bg-dark-3 hover:bg-dark-4 text-xs font-semibold text-light-1 border-dark-4"
                    >
                      View archive
                    </Button>
                  </Link>

                  <Link
                    to={`/update-profile/${currentUser.id}`}
                    className="p-1.5 rounded-lg text-light-1 hover:bg-dark-3 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleFollow}
                    className={`h-8 px-5 rounded-lg text-xs font-semibold transition-all ${
                      isFollowing
                        ? "bg-dark-3 text-light-2 hover:bg-dark-4 border border-dark-4"
                        : "bg-primary-500 hover:bg-primary-600 text-white"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>

                  <Button
                    variant="outline"
                    className="h-8 px-4 rounded-lg bg-dark-3 hover:bg-dark-4 text-xs font-semibold text-light-1 border-dark-4"
                  >
                    Message
                  </Button>
                </div>
              )}
            </div>

            {/* Row 2: Stats (Posts, Followers, Following) */}
            <div className="flex items-center justify-center sm:justify-start gap-8 text-sm">
              <div>
                <span className="font-bold text-light-1">
                  {userPosts.length}
                </span>{" "}
                <span className="text-light-3">posts</span>
              </div>
              <div>
                <span className="font-bold text-light-1">
                  {(profileData.followersCount || 14200).toLocaleString()}
                </span>{" "}
                <span className="text-light-3">followers</span>
              </div>
              <div>
                <span className="font-bold text-light-1">
                  {(profileData.followingCount || 480).toLocaleString()}
                </span>{" "}
                <span className="text-light-3">following</span>
              </div>
            </div>

            {/* Row 3: Name, Bio, Links */}
            <div className="flex flex-col gap-1 text-xs sm:text-sm">
              <span className="font-bold text-light-1">{profileData.name}</span>
              <p className="text-light-2 whitespace-pre-line leading-relaxed max-w-md">
                {profileData.bio || "No bio yet."}
              </p>
              <div className="flex items-center gap-1 text-xs text-primary-500 hover:underline pt-1">
                <LinkIcon className="w-3.5 h-3.5" />
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold"
                >
                  meowbox.app/{profileData.username || "creator"}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Story Highlights Tray */}
        <div className="flex items-center gap-6 overflow-x-auto custom-scrollbar pb-2">
          {MOCK_HIGHLIGHTS.map((hl) => (
            <div
              key={hl.id}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div className="p-1 rounded-full border border-dark-4 group-hover:border-light-4 transition-colors">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={hl.cover} />
                  <AvatarFallback className="bg-dark-3 text-xs">
                    {hl.title[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs text-light-2 font-medium truncate max-w-[72px] text-center">
                {hl.title}
              </span>
            </div>
          ))}

          {isOwnProfile && (
            <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
              <div className="h-[72px] w-[72px] rounded-full border border-dark-4 group-hover:border-light-4 flex-center text-light-3 bg-dark-2 transition-colors">
                <Plus className="w-6 h-6 stroke-[1.5px]" />
              </div>
              <span className="text-xs text-light-2 font-medium">New</span>
            </div>
          )}
        </div>

        {/* Instagram Tab Switcher */}
        <div className="flex items-center justify-center border-t border-dark-4">
          <button
            onClick={() => setActiveTab("posts")}
            className={`profile-tab ${
              activeTab === "posts"
                ? "border-t-2 border-white text-white font-bold"
                : "text-light-4"
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Posts</span>
          </button>

          <button
            onClick={() => setActiveTab("reels")}
            className={`profile-tab ${
              activeTab === "reels"
                ? "border-t-2 border-white text-white font-bold"
                : "text-light-4"
            }`}
          >
            <Clapperboard className="w-4 h-4" />
            <span>Reels</span>
          </button>

          {isOwnProfile && (
            <button
              onClick={() => setActiveTab("saved")}
              className={`profile-tab ${
                activeTab === "saved"
                  ? "border-t-2 border-white text-white font-bold"
                  : "text-light-4"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("tagged")}
            className={`profile-tab ${
              activeTab === "tagged"
                ? "border-t-2 border-white text-white font-bold"
                : "text-light-4"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Tagged</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div>
          {activeTab === "posts" && (
            <GridPostList posts={userPosts} showUser={false} />
          )}

          {activeTab === "reels" && (
            <GridPostList posts={userPosts.slice(0, 3)} showUser={false} />
          )}

          {activeTab === "saved" && isOwnProfile && (
            <GridPostList posts={savedPosts} showUser={false} />
          )}

          {activeTab === "tagged" && (
            <div className="py-16 text-center text-light-4 text-sm flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full border border-dark-4 flex-center text-light-3">
                <Tag className="w-6 h-6 stroke-[1.5px]" />
              </div>
              <p className="font-bold text-light-1 text-base">Photos of you</p>
              <p className="text-xs text-light-4">
                When people tag you in photos, they'll appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
