import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import {
  useGetRecentPosts,
  useSearchPosts,
} from "@/lib/react-query/queriesAndMutations";
import { Clapperboard, Compass, Flame, Layers, Search, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const CATEGORIES = [
  { label: "All", tag: "" },
  { label: "📸 Photography", tag: "photography" },
  { label: "🏛️ Architecture", tag: "architecture" },
  { label: "✈️ Travel", tag: "travel" },
  { label: "🛹 Streetstyle", tag: "streetstyle" },
  { label: "☕ Places & Cafe", tag: "copenhagen" },
  { label: "🌌 Night Vibes", tag: "nightphotography" },
];

const Explore = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "";

  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState(
    initialTab === "reels" ? "reels" : ""
  );

  const debouncedSearch = useDebounce(searchValue, 300);
  const { data: searchedPosts, isFetching: isSearchFetching } =
    useSearchPosts(debouncedSearch);

  const { data: recentPosts } = useGetRecentPosts();

  const handleCategoryClick = (tag: string) => {
    setActiveCategory(tag);
    setSearchValue(tag === "reels" ? "" : tag);
  };

  const shouldShowSearchResults = searchValue !== "";
  const posts = recentPosts?.documents || [];

  return (
    <div className="explore-container bg-dark-1">
      <div className="explore-inner_container">
        {/* Search Bar */}
        <div className="flex gap-1 px-4 w-full rounded-xl bg-dark-3 border border-dark-4 items-center">
          <Search className="w-5 h-5 text-light-4" />
          <Input
            type="text"
            placeholder="Search creators, hashtags, places..."
            className="explore-search border-none bg-transparent"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar w-full py-1">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.tag && !searchValue;

            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => handleCategoryClick(cat.tag)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isSelected
                    ? "bg-white text-dark-1"
                    : "bg-dark-3 text-light-3 hover:bg-dark-4 hover:text-white border border-dark-4"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explore Grid Content */}
      <div className="flex flex-wrap gap-9 w-full max-w-5xl mt-6">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : !posts || posts.length === 0 ? (
          <div className="w-full flex-center py-20">
            <Loader size="lg" />
          </div>
        ) : (
          <GridPostList posts={posts} showUser={true} />
        )}
      </div>
    </div>
  );
};

export default Explore;
