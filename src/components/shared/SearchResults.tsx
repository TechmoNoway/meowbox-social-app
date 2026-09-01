import GridPostList from "./GridPostList";
import Loader from "./Loader";

type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};

const SearchResults = ({
  isSearchFetching,
  searchedPosts,
}: SearchResultProps) => {
  if (isSearchFetching) {
    return (
      <div className="w-full flex-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  const posts = searchedPosts?.documents || [];

  if (posts.length > 0) {
    return <GridPostList posts={posts} />;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-12 text-center glass-card rounded-[28px]">
      <span className="text-4xl mb-3">🔍</span>
      <h4 className="text-base font-bold text-light-1">No matching posts found</h4>
      <p className="text-xs text-light-4 mt-1">
        Try searching for tags like <span className="text-primary-500 font-semibold">#cutekitties</span>, <span className="text-secondary-500 font-semibold">#sunbeam</span>, or <span className="text-accent-cyan font-semibold">#loaf</span>
      </p>
    </div>
  );
};

export default SearchResults;
