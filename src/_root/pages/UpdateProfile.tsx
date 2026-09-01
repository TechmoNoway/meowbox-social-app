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
import { ArrowLeft, Camera, Sparkles, UserCheck } from "lucide-react";
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

    toast({ title: "Profile updated! ✨" });
    navigate(`/profile/${user.id}`);
  };

  if (isUserLoading && !currentUser) {
    return (
      <div className="w-full h-full flex-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="common-container">
      <div className="flex flex-col gap-8 max-w-5xl w-full">
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
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex-center text-white shadow-glow">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="h3-bold md:h2-bold text-left text-white tracking-tight">
              Edit Profile
            </h1>
            <p className="text-xs text-light-4 flex items-center gap-1">
              Customize your cat avatar, bio & personal details <Sparkles className="w-3 h-3 text-secondary-500" />
            </p>
          </div>
        </div>

        {/* Edit Form Container */}
        <div className="p-6 sm:p-10 rounded-[28px] glass-card border border-white/10 shadow-2xl">
          {/* Avatar Picker */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-white/[0.08]">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Avatar className="h-24 w-24 ring-4 ring-primary-500/40 group-hover:ring-primary-500 transition-all shadow-xl">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback className="bg-primary-500 text-white font-bold text-xl">
                  {user.name ? user.name[0] : "U"}
                </AvatarFallback>
              </Avatar>

              <div className="absolute inset-0 rounded-full bg-black/40 flex-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-9 px-4 rounded-xl bg-dark-4 hover:bg-dark-5 text-light-1 border border-white/10 text-xs font-semibold"
              >
                Change Avatar Photo
              </Button>
              <p className="text-[11px] text-light-4">
                Recommended: Square JPG or PNG, at least 400x400px
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Luna Whiskers" className="shad-input" {...field} />
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
                      <Input placeholder="lunacat" className="shad-input" {...field} />
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
                    <FormLabel className="shad-form_label">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="luna@meowbox.app"
                        className="shad-input"
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
                        placeholder="Tell the feline world about yourself..."
                        className="shad-textarea min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/[0.08]">
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
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Changes"
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
