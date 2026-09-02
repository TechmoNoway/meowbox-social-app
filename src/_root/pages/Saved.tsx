import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { getStoredPosts, getStoredSaves } from "@/lib/mock/mockData";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Bookmark, Lock } from "lucide-react";
import React from "react";

const Saved = () => {
  const { user } = useUserContext();
  const { data: currentUser, isLoading } = useGetCurrentUser();

  const allPosts = getStoredPosts();
  const savedIds = getStoredSaves();

  // Saved posts from current user record or mock storage
  const savedPosts = currentUser?.save
    ? currentUser.save
        .map((saveRecord: any) => ({
          ...saveRecord.post,
          creator: {
            $id: user.id,
            imageUrl: user.imageUrl,
            name: user.name,
            username: user.username,
          },
        }))
        .reverse()
    : allPosts.filter((p) => savedIds.includes(p.$id));

  return (
    <div className="saved-container bg-dark-1">
      <div className="flex flex-col gap-6 max-w-5xl w-full">
        {/* Header */}
        <div className="flex flex-col gap-1 pb-4 border-b border-dark-4">
          <div className="flex items-center gap-2">
            <h2 className="h3-bold md:h2-bold text-left text-white tracking-tight">
              Saved Posts
            </h2>
          </div>
          <p className="text-xs text-light-4 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-light-4" /> Only you can see what you've saved
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="w-full flex-center py-20">
            <Loader size="lg" />
          </div>
        ) : savedPosts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full border border-dark-4 flex-center text-light-4">
              <Bookmark className="w-7 h-7 stroke-[1.5px]" />
            </div>
            <h3 className="font-bold text-base text-light-1">Save Photos</h3>
            <p className="text-xs text-light-4 max-w-sm">
              Save photos and videos that you want to see again. No one is notified, and only you can see what you've saved.
            </p>
          </div>
        ) : (
          <GridPostList posts={savedPosts} showStats={true} showUser={false} />
        )}
      </div>
    </div>
  );
};

export default Saved;
