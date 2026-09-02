import PostForm from "@/components/forms/PostForm";

const CreatePost = () => {
  return (
    <div className="flex flex-1 bg-dark-1">
      <div className="common-container">
        {/* Header */}
        <div className="max-w-4xl flex items-center justify-between w-full pb-4 border-b border-dark-4">
          <div>
            <h1 className="h3-bold md:h2-bold text-left text-white tracking-tight">
              Create new post
            </h1>
            <p className="text-xs text-light-4 mt-0.5">
              Share photos and videos with filters and tags
            </p>
          </div>
        </div>

        {/* Post Form Studio */}
        <div className="w-full max-w-4xl p-6 sm:p-8 rounded-2xl bg-dark-2 border border-dark-4 shadow-xl">
          <PostForm action="Create" />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
