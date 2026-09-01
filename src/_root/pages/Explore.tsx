import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import {
  useGetPosts,
  useSearchPosts,
} from "@/lib/react-query/queriesAndMutations";
import { Compass, Filter, Search, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const CATEGORIES = [
  { id: "all", label: "All Posts", icon: "✨" },
  { id: "trending", label: "Trending", icon: "🔥", tag: "sunbeam" },
  { id: "cutecats", label: "Cute Cats", icon: "🐱", tag: "catlife" },
  { id: "art", label: "Art & Floof", icon: "🎨", tag: "mainecoon" },
  { id: "sleepy", label: "Sleepy Loaf", icon: "💤", tag: "loaf" },
  { id: "boxes", label: "Box Royalty", icon: "📦", tag: "boxlife" },
];

const Explore = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage, isPending } = useGetPosts();

  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const debounceValue = useDebounce(searchValue, 300);

  const { data: searchedPosts, isFetching: isSearchFetching } =
    useSearchPosts(debounceValue);

  useEffect(() => {
    if (inView && !searchValue && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, searchValue, hasNextPage]);

  const handleCategoryClick = (cat: (typeof CATEGORIES)[0]) => {
    setSelectedCategory(cat.id);
    if (cat.tag) {
      setSearchValue(cat.tag);
    } else {
      setSearchValue("");
    }
  };

  if (isPending && !posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader size="lg" />
      </div>
    );
  }

  const allPosts =
    posts?.pages?.flatMap((page: any) => page?.documents || []) || [];

  const shouldShowSearchResults = searchValue !== "";

  return (
    <div className="explore-container">
      {/* Header & Search Bar */}
      <div className="explore-inner_container">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent-cyan to-primary-500 flex-center shadow-glow-cyan">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="h3-bold md:h2-bold text-white tracking-tight">
                Explore Feed
              </h1>
              <p className="text-xs text-light-4">
                Discover viral cat moments, tags & creators
              </p>
            </div>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-light-4" />
          <Input
            type="text"
            placeholder="Search captions, tags, locations, creators..."
            className="explore-search pl-12 pr-10"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute right-3.5 top-3.5 text-light-4 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 custom-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow"
                    : "bg-dark-3/70 text-light-3 border border-white/[0.06] hover:bg-dark-3 hover:text-white"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Today Subheader */}
      <div className="flex-between w-full max-w-5xl mt-10 mb-6">
        <div className="flex items-center gap-2">
          <h3 className="body-bold md:h3-bold text-light-1">
            {shouldShowSearchResults ? `Results for "${searchValue}"` : "Popular Feed"}
          </h3>
          <Sparkles className="w-4 h-4 text-secondary-500" />
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-3/60 border border-white/[0.06] text-xs font-medium text-light-3">
          <Filter className="w-3.5 h-3.5" />
          <span>Curated</span>
        </div>
      </div>

      {/* Posts Grid Area */}
      <div className="w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : (
          <GridPostList posts={allPosts} />
        )}
      </div>

      {/* Infinite Scroll Sentinel */}
      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10 mb-6">
          <Loader size="md" />
        </div>
      )}
    </div>
  );
};

export default Explore;
