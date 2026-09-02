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
import React, { useState } from "react";
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
  "photography",
  "travel",
  "streetstyle",
  "architecture",
  "minimalism",
  "design",
  "lifestyle",
  "35mm",
];

const SUGGESTED_LOCATIONS = [
  "Tokyo, Japan",
  "New York, USA",
  "Paris, France",
  "Copenhagen, Denmark",
  "Rome, Italy",
];

const PostForm = ({ post, action }: PostFormProps) => {
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedFilter, setSelectedFilter] = useState(post?.filter || "normal");

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

  const handleSelectLocation = (loc: string) => {
    form.setValue("location", loc);
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

      toast({ title: "Post updated! ✨" });
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
        description: "Please ensure an image is selected.",
      });
    }

    toast({ title: "Post published to your feed! 🚀" });
    navigate("/");
  }

  const captionValue = form.watch("caption") || "";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full max-w-4xl"
      >
        {/* Media Upload & Filter Picker */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Photo / Media</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imagesUrl}
                  selectedFilter={selectedFilter}
                  onSelectFilter={setSelectedFilter}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        {/* Caption Field */}
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="shad-form_label">Write a caption</FormLabel>
                <span className="text-[11px] text-light-4">
                  {captionValue.length} / 2200
                </span>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Write a caption, mention people with @, or add context..."
                  className="shad-textarea min-h-24"
                  {...field}
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
              <FormLabel className="shad-form_label">Add location</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-light-4" />
                  <Input
                    type="text"
                    placeholder="e.g. Shinjuku, Tokyo or SoHo, New York"
                    className="shad-input pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="shad-form_message" />

              {/* Quick Location Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {SUGGESTED_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleSelectLocation(loc)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-dark-3 hover:bg-dark-4 text-light-3 hover:text-white transition-colors"
                  >
                    📍 {loc}
                  </button>
                ))}
              </div>
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
                Hashtags (comma separated)
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-3.5 w-4 h-4 text-primary-500" />
                  <Input
                    type="text"
                    placeholder="photography, travel, architecture"
                    className="shad-input pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="shad-form_message" />

              {/* Quick Tag Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[11px] text-light-4 mr-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary-500" /> Suggestions:
                </span>
                {SUGGESTED_TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleAddTag(t)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-dark-3 hover:bg-dark-4 text-light-3 hover:text-primary-500 transition-colors"
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </FormItem>
          )}
        />

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-4">
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
                <span>{action === "Create" ? "Sharing..." : "Saving..."}</span>
              </div>
            ) : (
              <span>{action === "Create" ? "Share" : "Done"}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
