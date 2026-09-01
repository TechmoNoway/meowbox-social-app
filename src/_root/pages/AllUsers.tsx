import Loader from "@/components/shared/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import {
  getStoredFollows,
  MOCK_USERS,
  saveStoredFollows,
} from "@/lib/mock/mockData";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { Search, Sparkles, UserCheck, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const AllUsers = () => {
  const { data: creatorsData, isPending: isCreatorsLoading } = useGetUsers();
  const { user: currentUser } = useUserContext();

  const [searchCreator, setSearchCreator] = useState("");
  const [followedUsers, setFollowedUsers] = useState<string[]>(getStoredFollows());

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

  const allCreators = creatorsData?.documents || MOCK_USERS;

  const filteredCreators = allCreators.filter(
    (c: any) =>
      c.name.toLowerCase().includes(searchCreator.toLowerCase()) ||
      c.username.toLowerCase().includes(searchCreator.toLowerCase()) ||
      (c.bio && c.bio.toLowerCase().includes(searchCreator.toLowerCase()))
  );

  return (
    <div className="common-container">
      <div className="user-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex-center text-white shadow-glow">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="h3-bold md:h2-bold text-left text-white tracking-tight">
                All Creators
              </h1>
              <p className="text-xs text-light-4">
                Find and follow popular cat profiles around the globe
              </p>
            </div>
          </div>

          {/* Search Creators Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-light-4" />
            <Input
              type="text"
              placeholder="Search by name, handle, bio..."
              value={searchCreator}
              onChange={(e) => setSearchCreator(e.target.value)}
              className="h-10 pl-9 rounded-xl bg-dark-3/70 border-white/[0.08] text-xs text-light-1"
            />
          </div>
        </div>

        {/* Creators Grid */}
        {isCreatorsLoading && !creatorsData ? (
          <div className="w-full flex-center py-16">
            <Loader size="lg" />
          </div>
        ) : filteredCreators.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center p-12 text-center glass-card rounded-[28px]">
            <span className="text-4xl mb-3">🐱</span>
            <p className="font-bold text-light-1">No creators found</p>
            <p className="text-xs text-light-4 mt-1">Try another search keyword.</p>
          </div>
        ) : (
          <div className="user-grid">
            {filteredCreators.map((creator: any) => {
              const isFollowing = followedUsers.includes(creator.$id || creator.id);
              const isSelf = creator.$id === currentUser.id || creator.id === currentUser.id;

              return (
                <div
                  key={creator.$id || creator.id}
                  className="user-card group hover:border-primary-500/40 relative overflow-hidden"
                >
                  {/* Card Background Gradient Accent */}
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-cyan/10 pointer-events-none" />

                  {/* Creator Avatar */}
                  <Link
                    to={`/profile/${creator.$id || creator.id}`}
                    className="relative z-10 -mt-2"
                  >
                    <Avatar className="h-20 w-20 ring-4 ring-primary-500/30 group-hover:ring-primary-500 transition-all duration-300 shadow-xl">
                      <AvatarImage src={creator.imageUrl} alt={creator.name} />
                      <AvatarFallback className="bg-primary-500/20 text-primary-500 font-bold text-lg">
                        {creator.name ? creator.name[0] : "C"}
                      </AvatarFallback>
                    </Avatar>
                  </Link>

                  {/* Creator Info */}
                  <div className="flex flex-col items-center text-center gap-1 z-10 w-full px-2">
                    <Link
                      to={`/profile/${creator.$id || creator.id}`}
                      className="flex items-center gap-1.5 font-bold text-light-1 hover:text-primary-500 transition-colors text-base"
                    >
                      <span>{creator.name}</span>
                      <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                    </Link>

                    <p className="text-xs text-light-4">@{creator.username}</p>

                    <p className="text-xs text-light-3 line-clamp-2 mt-2 min-h-[32px]">
                      {creator.bio || "Feline lover & daily purr poster 🐾"}
                    </p>
                  </div>

                  {/* Creator Stats */}
                  <div className="grid grid-cols-2 gap-3 w-full py-2 px-3 rounded-2xl bg-dark-3/60 border border-white/[0.04] text-center z-10">
                    <div>
                      <p className="text-xs font-bold text-light-1">
                        {creator.followersCount || 1420}
                      </p>
                      <p className="text-[10px] text-light-4">Followers</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-light-1">
                        {creator.postsCount || 12}
                      </p>
                      <p className="text-[10px] text-light-4">Posts</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="w-full z-10 pt-1">
                    {isSelf ? (
                      <Link
                        to={`/profile/${currentUser.id}`}
                        className="w-full flex-center h-10 rounded-xl bg-dark-4 text-light-2 text-xs font-semibold hover:bg-dark-5 transition-all"
                      >
                        Your Profile
                      </Link>
                    ) : (
                      <Button
                        onClick={() => toggleFollow(creator.$id || creator.id)}
                        className={`w-full h-10 rounded-xl text-xs font-semibold transition-all ${
                          isFollowing
                            ? "bg-dark-4 text-light-3 hover:bg-dark-5 hover:text-white border border-white/[0.06]"
                            : "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow hover:shadow-glow-pink"
                        }`}
                      >
                        {isFollowing ? (
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Following</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Follow</span>
                          </div>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
