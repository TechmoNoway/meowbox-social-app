import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { Edit3, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");

  if (isPending) {
    return (
      <div className="flex-center w-full h-full">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        {/* Header */}
        <div className="max-w-5xl flex items-center gap-3 justify-start w-full">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent-cyan to-primary-500 flex-center text-white shadow-glow-cyan">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="h3-bold md:h2-bold text-left text-white tracking-tight">
              Edit Post
            </h1>
            <p className="text-xs text-light-4 flex items-center gap-1">
              Update caption, tags or media <Sparkles className="w-3 h-3 text-accent-cyan" />
            </p>
          </div>
        </div>

        {/* Post Form Studio */}
        <div className="w-full max-w-5xl p-6 sm:p-8 rounded-[28px] glass-card border border-white/10 shadow-2xl">
          <PostForm action="Update" post={post} />
        </div>
      </div>
    </div>
  );
};

export default EditPost;
