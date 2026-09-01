import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { getStoredPosts } from "@/lib/mock/mockData";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const LikedPosts = () => {
  const { user } = useUserContext();
  const { data: currentUser, isPending } = useGetCurrentUser();

  if (isPending && !currentUser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader size="lg" />
      </div>
    );
  }

  const allPosts = getStoredPosts();
  const likedPosts = allPosts.filter(
    (p) =>
      p.likes.includes(user.id) ||
      (Array.isArray(currentUser?.liked) &&
        currentUser.liked.some((lp: any) => lp.$id === p.$id))
  );

  if (likedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-[24px] w-full mt-4">
        <div className="w-12 h-12 rounded-2xl bg-secondary-500/10 border border-secondary-500/30 flex-center text-secondary-500 mb-3">
          <Heart className="w-6 h-6" />
        </div>
        <p className="font-bold text-light-1 text-sm">No liked posts yet</p>
        <p className="text-xs text-light-4 mt-1">Tap the heart on posts you adore!</p>
      </div>
    );
  }

  return <GridPostList posts={likedPosts} showStats={true} />;
};

export default LikedPosts;
