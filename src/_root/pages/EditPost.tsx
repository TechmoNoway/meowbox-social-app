import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading } = useGetPostById(id || "");

  if (isLoading) {
    return (
      <div className="flex-center w-full h-full bg-dark-1">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 bg-dark-1">
      <div className="common-container">
        {/* Header */}
        <div className="max-w-4xl flex items-center justify-between w-full pb-4 border-b border-dark-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="p-0 text-light-3 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="h3-bold md:h2-bold text-left text-white tracking-tight">
              Edit info
            </h1>
          </div>
        </div>

        {/* Post Form Studio */}
        <div className="w-full max-w-4xl p-6 sm:p-8 rounded-2xl bg-dark-2 border border-dark-4 shadow-xl">
          <PostForm action="Update" post={post} />
        </div>
      </div>
    </div>
  );
};

export default EditPost;
