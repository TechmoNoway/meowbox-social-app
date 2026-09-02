import Loader from "@/components/shared/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import {
  useGetUserById,
  useUpdateUser,
} from "@/lib/react-query/queriesAndMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Camera, Settings } from "lucide-react";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";

const ProfileValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string().max(250, { message: "Bio must be within 250 characters." }),
});

const UpdateProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, setUser } = useUserContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user.imageUrl);

  const { data: currentUser, isPending: isUserLoading } = useGetUserById(
    id || user.id
  );
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser();

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (values: z.infer<typeof ProfileValidation>) => {
    const updatedUser = await updateUser({
      userId: user.id,
      name: values.name,
      bio: values.bio,
      imageId: "",
      imageUrl: avatarPreview,
      file: avatarFile ? [avatarFile] : [],
    });

    if (!updatedUser) {
      return toast({
        variant: "destructive",
        title: "Update failed",
        description: "Please try again.",
      });
    }

    setUser({
      ...user,
      name: values.name,
      bio: values.bio,
      imageUrl: avatarPreview,
    });

    toast({ title: "Profile saved! ✨" });
    navigate(`/profile/${user.id}`);
  };

  if (isUserLoading && !currentUser) {
    return (
      <div className="w-full h-full flex-center bg-dark-1">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="common-container bg-dark-1">
      <div className="flex flex-col gap-8 max-w-2xl w-full">
        {/* Back Link */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="flex items-center gap-2 text-light-3 hover:text-white p-0 hover:bg-transparent w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Back to profile</span>
        </Button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <h1 className="h3-bold md:h2-bold text-left text-white tracking-tight">
            Edit profile
          </h1>
        </div>

        {/* Edit Form Container */}
        <div className="p-6 sm:p-8 rounded-2xl bg-dark-2 border border-dark-4 shadow-xl">
          {/* Avatar Picker */}
          <div className="flex items-center gap-5 mb-8 pb-6 border-b border-dark-4 bg-dark-3 p-4 rounded-xl">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Avatar className="h-16 w-16 ring-2 ring-primary-500">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback className="bg-dark-4 text-white font-bold">
                  {user.name ? user.name[0] : "U"}
                </AvatarFallback>
              </Avatar>

              <div className="absolute inset-0 rounded-full bg-black/40 flex-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="flex flex-col items-start gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <span className="text-sm font-bold text-light-1">
                {user.username || user.name}
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors"
              >
                Change profile photo
              </button>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        className="shad-input opacity-70"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Bio..."
                        className="shad-textarea min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />

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
                  disabled={isUpdatingUser}
                  className="shad-button_primary"
                >
                  {isUpdatingUser ? (
                    <div className="flex items-center gap-2">
                      <Loader size="sm" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
