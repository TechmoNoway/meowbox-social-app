import Loader from "@/components/shared/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  getStoredFollows,
  MOCK_USERS,
  saveStoredFollows,
} from "@/lib/mock/mockData";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { Search, UserCheck, UserPlus, Users } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const AllUsers = () => {
  const { user } = useUserContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [followedUsers, setFollowedUsers] = useState<string[]>(getStoredFollows());

  const { data: creators, isLoading } = useGetUsers();

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

  const usersList = creators?.documents || MOCK_USERS;
  const filteredUsers = usersList.filter(
    (u: any) =>
      u.$id !== user.id &&
      (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.bio?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="common-container bg-dark-1">
      <div className="user-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 pb-4 border-b border-dark-4">
          <div>
            <h2 className="h3-bold md:h2-bold text-left text-white tracking-tight">
              Discover People
            </h2>
            <p className="text-xs text-light-4 mt-0.5">
              Connect with photographers, designers, and creators from around the world.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-light-4" />
            <input
              type="text"
              placeholder="Search creators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-dark-2 border border-dark-4 text-xs text-light-1 placeholder:text-light-4 focus:outline-none focus:border-dark-5"
            />
          </div>
        </div>

        {/* Creators Grid */}
        {isLoading && !creators ? (
          <div className="w-full flex-center py-20">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((creator: any) => {
              const isFollowing = followedUsers.includes(creator.$id);

              return (
                <div
                  key={creator.$id}
                  className="p-5 rounded-2xl bg-dark-2 border border-dark-4 flex flex-col items-center text-center gap-3 hover:border-dark-5 transition-all"
                >
                  <Link to={`/profile/${creator.$id}`} className="group">
                    <div className="ig-story-ring">
                      <Avatar className="h-16 w-16 ring-2 ring-dark-2">
                        <AvatarImage src={creator.imageUrl} />
                        <AvatarFallback className="bg-dark-3 text-sm font-bold">
                          {creator.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </Link>

                  <div className="flex flex-col items-center">
                    <Link
                      to={`/profile/${creator.$id}`}
                      className="text-sm font-bold text-light-1 hover:text-light-3 transition-colors"
                    >
                      {creator.username || creator.name}
                    </Link>
                    <span className="text-xs text-light-4">{creator.name}</span>
                  </div>

                  <p className="text-xs text-light-3 line-clamp-2 leading-relaxed px-2">
                    {creator.bio || "Creator on MeowBox"}
                  </p>

                  <div className="w-full pt-2">
                    <Button
                      onClick={() => toggleFollow(creator.$id)}
                      className={`w-full h-9 rounded-xl text-xs font-semibold transition-all ${
                        isFollowing
                          ? "bg-dark-3 text-light-2 hover:bg-dark-4 border border-dark-4"
                          : "bg-primary-500 hover:bg-primary-600 text-white"
                      }`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
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
