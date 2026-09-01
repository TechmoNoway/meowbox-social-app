import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { getStoredPosts, getStoredSaves } from "@/lib/mock/mockData";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Bookmark, Compass, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Saved = () => {
  const { user } = useUserContext();
  const { data: currentUser, isPending } = useGetCurrentUser();

  if (isPending && !currentUser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader size="lg" />
      </div>
    );
  }

  // Get saved posts either from Appwrite response or mock storage
  let savedPosts: any[] = [];
  if (currentUser?.save && Array.isArray(currentUser.save)) {
    savedPosts = currentUser.save
      .map((s: any) => s.post)
      .filter(Boolean);
  }

  // If mock fallback or empty Appwrite array
  if (savedPosts.length === 0) {
    const savedIds = getStoredSaves();
    const allMockPosts = getStoredPosts();
    savedPosts = allMockPosts.filter((p) => savedIds.includes(p.$id));
  }

  return (
    <div className="saved-container">
      <div className="flex flex-col gap-8 max-w-5xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex-center text-white shadow-glow">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h1 className="h3-bold md:h2-bold text-left text-white tracking-tight">
                Saved Posts
              </h1>
              <p className="text-xs text-light-4">
                Your private collection of favorite cat moments & bookmarks
              </p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-dark-3/60 border border-white/[0.06] text-xs font-semibold text-primary-500">
            {savedPosts.length} saved
          </div>
        </div>

        {/* Saved Grid Area */}
        {savedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center glass-card rounded-[28px] w-full">
            <div className="w-16 h-16 rounded-3xl bg-primary-500/10 border border-primary-500/30 flex-center text-primary-500 mb-4">
              <Bookmark className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-light-1">No saved posts yet</h3>
            <p className="text-xs text-light-4 max-w-sm mt-1.5 mb-6">
              Tap the bookmark icon on any post in your feed to save it to this collection.
            </p>
            <Link
              to="/explore"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-semibold shadow-glow"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Posts</span>
            </Link>
          </div>
        ) : (
          <GridPostList posts={savedPosts} showStats={true} />
        )}
      </div>
    </div>
  );
};

export default Saved;
