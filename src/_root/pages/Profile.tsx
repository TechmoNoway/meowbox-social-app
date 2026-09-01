import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserContext } from "@/context/AuthContext";
import {
  getStoredFollows,
  getStoredPosts,
  getStoredSaves,
  saveStoredFollows,
} from "@/lib/mock/mockData";
import {
  useGetCurrentUser,
  useGetUserById,
} from "@/lib/react-query/queriesAndMutations";
import {
  Bookmark,
  Edit,
  Grid,
  Heart,
  MapPin,
  Sparkles,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import LikedPosts from "./LikedPosts";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useUserContext();

  const targetUserId = id || currentUser.id;
  const isOwnProfile = targetUserId === currentUser.id;

  const { data: userProfile, isPending: isProfileLoading } =
    useGetUserById(targetUserId);
  const { data: loggedInUser } = useGetCurrentUser();

  const [followedUsers, setFollowedUsers] = useState<string[]>(getStoredFollows());

  const toggleFollow = (creatorId: string) => {
    let updated: string[];
    if (followedUsers.includes(creatorId)) {
      updated = followedUsers.filter((uid) => uid !== creatorId);
    } else {
      updated = [...followedUsers, creatorId];
    }
    setFollowedUsers(updated);
    saveStoredFollows(updated);
  };

  if (isProfileLoading && !userProfile) {
    return (
      <div className="w-full h-full flex-center">
        <Loader size="lg" />
      </div>
    );
  }

  const profileData: any = isOwnProfile
    ? {
        ...currentUser,
        followersCount: 1420,
        followingCount: 382,
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
    <div className="profile-container">
      <div className="max-w-5xl w-full flex flex-col gap-8">
        {/* Profile Card with Cover Banner */}
        <div className="relative rounded-[32px] overflow-hidden glass-card border border-white/10 shadow-2xl">
          {/* Cover Photo Gradient Banner */}
          <div className="h-44 sm:h-56 w-full bg-gradient-to-r from-primary-500/40 via-secondary-500/30 to-accent-cyan/40 relative">
            <div className="absolute inset-0 bg-dark-1/30 backdrop-blur-[1px]" />
            <div className="absolute top-4 right-4">
              <Badge variant="glow" className="text-xs">
                Verified Creator ✨
              </Badge>
            </div>
          </div>

          {/* Profile Header Content */}
          <div className="px-6 sm:px-10 pb-8 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            {/* Avatar & User Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative group">
                <Avatar className="h-28 w-28 sm:h-32 sm:w-32 ring-4 ring-dark-2 shadow-2xl">
                  <AvatarImage
                    src={profileData.imageUrl}
                    alt={profileData.name}
                  />
                  <AvatarFallback className="bg-primary-500 text-white font-bold text-2xl">
                    {profileData.name ? profileData.name[0] : "M"}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-dark-2 rounded-full" />
              </div>

              <div className="flex flex-col gap-1 pb-2">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    {profileData.name}
                  </h2>
                  <Sparkles className="w-4 h-4 text-accent-cyan" />
                </div>
                <p className="text-xs sm:text-sm text-light-4 font-medium">
                  @{profileData.username}
                </p>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="pb-2">
              {isOwnProfile ? (
                <Link
                  to={`/update-profile/${currentUser.id}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-dark-4 hover:bg-dark-5 text-light-1 text-xs font-semibold border border-white/10 shadow-md transition-all active:scale-95"
                >
                  <Edit className="w-4 h-4 text-primary-500" />
                  <span>Edit Profile</span>
                </Link>
              ) : (
                <Button
                  onClick={() => toggleFollow(targetUserId)}
                  className={`h-10 px-6 rounded-2xl text-xs font-semibold transition-all ${
                    isFollowing
                      ? "bg-dark-4 text-light-3 hover:bg-dark-5 hover:text-white"
                      : "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow hover:shadow-glow-pink"
                  }`}
                >
                  {isFollowing ? (
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4" />
                      <span>Following</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4" />
                      <span>Follow</span>
                    </div>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Bio & Stats Bar */}
          <div className="px-6 sm:px-10 pb-8 pt-2 flex flex-col gap-6 border-t border-white/[0.06]">
            {/* Bio */}
            <p className="text-sm leading-relaxed text-light-2 max-w-2xl">
              {profileData.bio || "Happy cat living life to the fullest! 🐾 💤"}
            </p>

            {/* Stats Row */}
            <div className="flex items-center gap-8 text-center sm:text-left">
              <div>
                <span className="text-base sm:text-lg font-extrabold text-white mr-1.5">
                  {userPosts.length}
                </span>
                <span className="text-xs text-light-4">Posts</span>
              </div>

              <div>
                <span className="text-base sm:text-lg font-extrabold text-white mr-1.5">
                  {profileData.followersCount || 1420}
                </span>
                <span className="text-xs text-light-4">Followers</span>
              </div>

              <div>
                <span className="text-base sm:text-lg font-extrabold text-white mr-1.5">
                  {profileData.followingCount || 382}
                </span>
                <span className="text-xs text-light-4">Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content Navigation (Posts, Liked, Saved) */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-dark-3/80 p-1.5 rounded-2xl border border-white/[0.08]">
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2 rounded-xl text-xs font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-secondary-500 data-[state=active]:text-white"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Posts</span>
            </TabsTrigger>

            <TabsTrigger
              value="liked"
              className="flex items-center gap-2 rounded-xl text-xs font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-secondary-500 data-[state=active]:text-white"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Liked</span>
            </TabsTrigger>

            <TabsTrigger
              value="saved"
              className="flex items-center gap-2 rounded-xl text-xs font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-secondary-500 data-[state=active]:text-white"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved</span>
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab Content */}
          <TabsContent value="posts" className="mt-8">
            {userPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-[24px]">
                <span className="text-3xl mb-2">📸</span>
                <p className="font-semibold text-light-3 text-sm">
                  No posts published yet
                </p>
                {isOwnProfile && (
                  <Link
                    to="/create-post"
                    className="mt-4 px-4 py-2 rounded-xl bg-primary-500 text-white text-xs font-semibold shadow-glow"
                  >
                    Create Post
                  </Link>
                )}
              </div>
            ) : (
              <GridPostList posts={userPosts} showUser={false} />
            )}
          </TabsContent>

          {/* Liked Tab Content */}
          <TabsContent value="liked" className="mt-8">
            <LikedPosts />
          </TabsContent>

          {/* Saved Tab Content */}
          <TabsContent value="saved" className="mt-8">
            {savedPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-[24px]">
                <span className="text-3xl mb-2">🔖</span>
                <p className="font-semibold text-light-3 text-sm">
                  No saved posts in this collection
                </p>
              </div>
            ) : (
              <GridPostList posts={savedPosts} showUser={true} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
