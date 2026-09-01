import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutations";
import { PostValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Sparkles, Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import FileUploader from "../shared/FileUploader";
import Loader from "../shared/Loader";

type PostFormProps = {
  post?: any;
  action: "Create" | "Update";
};

const SUGGESTED_TAGS = [
  "cutekitties",
  "catlife",
  "loaf",
  "playtime",
  "purr",
  "naptime",
  "aesthetic",
];

const PostForm = ({ post, action }: PostFormProps) => {
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? (Array.isArray(post.tags) ? post.tags.join(", ") : post.tags) : "",
    },
  });

  const handleAddTag = (tag: string) => {
    const currentTags = form.getValues("tags") || "";
    const tagsList = currentTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (!tagsList.includes(tag)) {
      const updated = tagsList.length > 0 ? `${tagsList.join(", ")}, ${tag}` : tag;
      form.setValue("tags", updated);
    }
  };

  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imagesUrl: post?.imagesUrl,
      });

      if (!updatedPost) {
        return toast({
          variant: "destructive",
          title: "Update failed",
          description: "Please try again later.",
        });
      }

      toast({ title: "Post updated successfully! ✨" });
      return navigate(`/posts/${post.$id}`);
    }

    const newPost = await createPost({
      ...values,
      userId: user.id,
    });

    if (!newPost) {
      return toast({
        variant: "destructive",
        title: "Post creation failed",
        description: "Please ensure all fields are filled.",
      });
    }

    toast({ title: "Purr-fect! Post created successfully 🐾" });
    navigate("/");
  }

  const captionValue = form.watch("caption") || "";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-7 w-full max-w-5xl"
      >
        {/* Caption Field */}
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="shad-form_label">Caption</FormLabel>
                <span className="text-[11px] text-light-4">
                  {captionValue.length} / 2200
                </span>
              </div>
              <FormControl>
                <Textarea
                  placeholder="What is your cat up to today? 🐾 Tell the world..."
                  className="shad-textarea custom-scrollbar min-h-28"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        {/* Media Upload Zone */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos / Media</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imagesUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        {/* Location Field */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary-500" />
                  <Input
                    type="text"
                    placeholder="e.g. Cozy Corner, Sunny Living Room, Tokyo"
                    className="shad-input pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        {/* Tags Field with Suggested Chips */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Tags (comma separated)
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-3.5 w-4 h-4 text-primary-500" />
                  <Input
                    type="text"
                    placeholder="cutekitties, loaf, sunbeam"
                    className="shad-input pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="shad-form_message" />

              {/* Quick Tag Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[11px] text-light-4 mr-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary-500" /> Quick tags:
                </span>
                {SUGGESTED_TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleAddTag(t)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-dark-3/80 hover:bg-primary-500/20 text-light-3 hover:text-primary-500 border border-white/[0.06] transition-colors"
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </FormItem>
          )}
        />

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/[0.06]">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="shad-button_dark_4"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isLoadingCreate || isLoadingUpdate}
            className="shad-button_primary"
          >
            {isLoadingCreate || isLoadingUpdate ? (
              <div className="flex items-center gap-2">
                <Loader size="sm" />
                <span>{action === "Create" ? "Publishing..." : "Saving..."}</span>
              </div>
            ) : (
              <span>{action} Post</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
