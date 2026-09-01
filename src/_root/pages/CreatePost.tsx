import PostForm from "@/components/forms/PostForm";
import { PlusCircle, Sparkles } from "lucide-react";

const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        {/* Header */}
        <div className="max-w-5xl flex items-center gap-3 justify-start w-full">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex-center text-white shadow-glow">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="h3-bold md:h2-bold text-left text-white tracking-tight">
              Create New Post
            </h1>
            <p className="text-xs text-light-4 flex items-center gap-1">
              Share your feline stories with the community <Sparkles className="w-3 h-3 text-secondary-500" />
            </p>
          </div>
        </div>

        {/* Post Form Studio */}
        <div className="w-full max-w-5xl p-6 sm:p-8 rounded-[28px] glass-card border border-white/10 shadow-2xl">
          <PostForm action="Create" />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
