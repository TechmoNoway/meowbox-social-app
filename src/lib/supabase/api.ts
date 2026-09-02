import { INewPost, INewUser, IUpdatePost, IUpdateUser, IUser } from "@/types";
import { isSupabaseConfigured, supabase } from "./config";
import {
  getStoredPosts,
  getStoredSaves,
  getStoredUser,
  IMockPost,
  MOCK_USERS,
  saveStoredPosts,
  saveStoredSaves,
  saveStoredUser,
} from "../mock/mockData";

// Helper for simulated network delay in demo mode
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to format Supabase post to match app's post schema
const formatSupabasePost = (row: any) => {
  return {
    $id: row.id,
    $createdAt: row.created_at,
    $updatedAt: row.updated_at || row.created_at,
    caption: row.caption || "",
    imagesUrl: row.image_url,
    imageId: row.image_id || "",
    location: row.location || "",
    tags: row.tags || [],
    filter: row.filter || "normal",
    likes: (row.likes || []).map((l: any) => l.user_id || l),
    comments: (row.comments || []).map((c: any) => ({
      id: c.id,
      userId: c.user_id,
      userName: c.user_name,
      userAvatar: c.user_avatar,
      text: c.text,
      createdAt: c.created_at,
    })),
    creator: {
      $id: row.creator?.id || row.creator_id,
      name: row.creator?.name || "Creator",
      username: row.creator?.username || "creator",
      email: row.creator?.email || "",
      imageUrl:
        row.creator?.image_url ||
        `https://api.dicebear.com/7.x/bottts/svg?seed=${row.creator?.username || "user"}`,
      bio: row.creator?.bio || "",
      website: row.creator?.website || "",
    },
  };
};

// ============================== AUTH ==============================
export async function createUserAccount(user: INewUser) {
  if (!isSupabaseConfigured) {
    await delay(250);
    const mockUser = {
      $id: `user_${Date.now()}`,
      name: user.name,
      email: user.email,
      username: user.username,
      imageUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`,
      bio: "Creator on MeowBox 📸",
    };
    saveStoredUser({
      id: mockUser.$id,
      name: mockUser.name,
      email: mockUser.email,
      username: mockUser.username,
      imageUrl: mockUser.imageUrl,
      bio: mockUser.bio,
    });
    return mockUser;
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          name: user.name,
          username: user.username,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("User creation failed");

    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        image_url: avatarUrl,
        bio: "",
        website: "",
      })
      .select()
      .single();

    if (profileError) {
      console.warn("Profile creation warning:", profileError.message);
    }

    return profile || authData.user;
  } catch (error: any) {
    console.warn("createUserAccount:", error?.message || error);
    throw error;
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  if (!isSupabaseConfigured) {
    await delay(200);
    localStorage.setItem("meowbox_logged_in", "true");
    return { session: "mock_session" };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    });

    if (error) throw error;
    return data.session;
  } catch (error: any) {
    console.warn("signInAccount error:", error?.message || error);
    throw error;
  }
}

export async function signOutAccount() {
  if (!isSupabaseConfigured) {
    await delay(100);
    localStorage.removeItem("meowbox_logged_in");
    return { status: "ok" };
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { status: "ok" };
  } catch (error: any) {
    return { status: "ok" };
  }
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured) {
    await delay(80);
    const user = getStoredUser();
    const savedIds = getStoredSaves();
    return {
      $id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl,
      bio: user.bio,
      save: savedIds.map((id) => ({
        $id: `save_${id}`,
        post: { $id: id },
      })),
      posts: getStoredPosts().filter((p) => p.creator.$id === user.id),
      liked: getStoredPosts().filter((p) => p.likes.includes(user.id)),
    };
  }

  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) return null;

    // Fetch Profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    // Fetch Saves
    const { data: saves } = await supabase
      .from("saves")
      .select("id, post_id")
      .eq("user_id", authUser.id);

    return {
      $id: authUser.id,
      name: profile?.name || authUser.user_metadata?.name || "User",
      username:
        profile?.username ||
        authUser.user_metadata?.username ||
        authUser.email?.split("@")[0] ||
        "user",
      email: authUser.email || "",
      imageUrl:
        profile?.image_url ||
        `https://api.dicebear.com/7.x/bottts/svg?seed=${authUser.id}`,
      bio: profile?.bio || "",
      save: (saves || []).map((s) => ({
        $id: s.id,
        post: { $id: s.post_id },
      })),
    };
  } catch (error: any) {
    return null;
  }
}

// ============================== USERS ==============================
export async function getUsers(limit?: number) {
  if (!isSupabaseConfigured) {
    await delay(100);
    return { documents: limit ? MOCK_USERS.slice(0, limit) : MOCK_USERS };
  }

  try {
    let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return { documents: MOCK_USERS };
    }

    const documents = data.map((p) => ({
      $id: p.id,
      name: p.name,
      username: p.username,
      email: p.email,
      imageUrl: p.image_url,
      bio: p.bio,
    }));

    return { documents };
  } catch (error: any) {
    return { documents: MOCK_USERS };
  }
}

export async function getUserById(userId: string) {
  if (!isSupabaseConfigured) {
    await delay(80);
    const currentUser = getStoredUser();
    if (userId === currentUser.id) {
      const posts = getStoredPosts().filter((p) => p.creator.$id === currentUser.id);
      return {
        $id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        email: currentUser.email,
        imageUrl: currentUser.imageUrl,
        bio: currentUser.bio,
        posts,
        followersCount: 14200,
        followingCount: 480,
      };
    }
    const found = MOCK_USERS.find((u) => u.$id === userId) || MOCK_USERS[0];
    const posts = getStoredPosts().filter((p) => p.creator.$id === found.$id);
    return { ...found, posts };
  }

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*, posts(*)")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      const found = MOCK_USERS.find((u) => u.$id === userId) || MOCK_USERS[0];
      return found;
    }

    return {
      $id: profile.id,
      name: profile.name,
      username: profile.username,
      email: profile.email,
      imageUrl: profile.image_url,
      bio: profile.bio,
      website: profile.website,
      posts: (profile.posts || []).map(formatSupabasePost),
      followersCount: 14200,
      followingCount: 480,
    };
  } catch (error: any) {
    const found = MOCK_USERS.find((u) => u.$id === userId) || MOCK_USERS[0];
    return found;
  }
}

export async function updateUser(user: IUpdateUser) {
  if (!isSupabaseConfigured) {
    await delay(150);
    let imageUrl = user.imageUrl as string;
    if (user.file && user.file.length > 0) {
      imageUrl = URL.createObjectURL(user.file[0]);
    }
    const updated = {
      id: user.userId,
      name: user.name,
      bio: user.bio,
      imageUrl: imageUrl || getStoredUser().imageUrl,
      username: getStoredUser().username,
      email: getStoredUser().email,
    };
    saveStoredUser(updated);
    return updated;
  }

  try {
    let imageUrl = user.imageUrl as string;

    if (user.file && user.file.length > 0) {
      const uploaded = await uploadFile(user.file[0]);
      if (uploaded?.url) {
        imageUrl = uploaded.url;
      }
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        name: user.name,
        bio: user.bio,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.warn("updateUser error:", error?.message || error);
    throw error;
  }
}

// ============================== STORAGE ==============================
export async function uploadFile(file: File) {
  if (!isSupabaseConfigured) {
    return {
      id: `mock_img_${Date.now()}`,
      url: URL.createObjectURL(file),
    };
  }

  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `posts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("media").getPublicUrl(filePath);

    return {
      id: filePath,
      url: data.publicUrl,
    };
  } catch (error: any) {
    console.warn("uploadFile error:", error?.message || error);
    return {
      id: `fallback_${Date.now()}`,
      url: URL.createObjectURL(file),
    };
  }
}

export function getFilePreview(fileId: string) {
  if (!isSupabaseConfigured) {
    return "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85";
  }
  const { data } = supabase.storage.from("media").getPublicUrl(fileId);
  return data.publicUrl;
}

export async function deleteFile(fileId: string) {
  if (!isSupabaseConfigured) return { status: "ok" };
  try {
    await supabase.storage.from("media").remove([fileId]);
    return { status: "ok" };
  } catch (error: any) {
    return { status: "ok" };
  }
}

// ============================== POSTS ==============================
export async function createPost(post: INewPost) {
  if (!isSupabaseConfigured) {
    await delay(200);
    const currentUser = getStoredUser();
    let fileUrl =
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85";
    if (post.file && post.file[0]) {
      fileUrl = URL.createObjectURL(post.file[0]);
    }
    const tags = post.tags
      ? post.tags.replace(/ /g, "").split(",").filter(Boolean)
      : ["lifestyle"];

    const newMockPost: IMockPost = {
      $id: `post_${Date.now()}`,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      caption: post.caption,
      imagesUrl: fileUrl,
      imageId: `img_${Date.now()}`,
      location: post.location || "Tokyo, Japan",
      tags,
      likes: [],
      comments: [],
      creator: {
        $id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        email: currentUser.email,
        imageUrl: currentUser.imageUrl,
        bio: currentUser.bio,
      },
    };

    const currentPosts = getStoredPosts();
    saveStoredPosts([newMockPost, ...currentPosts]);
    return newMockPost;
  }

  try {
    let fileUrl = "";
    let fileId = "";

    if (post.file && post.file[0]) {
      const uploaded = await uploadFile(post.file[0]);
      fileUrl = uploaded.url;
      fileId = uploaded.id;
    }

    const tags = post.tags ? post.tags.replace(/ /g, "").split(",").filter(Boolean) : [];

    const { data, error } = await supabase
      .from("posts")
      .insert({
        creator_id: post.userId,
        caption: post.caption,
        image_url: fileUrl,
        image_id: fileId,
        location: post.location || "",
        tags: tags,
      })
      .select("*, creator:profiles(*)")
      .single();

    if (error) throw error;
    return formatSupabasePost(data);
  } catch (error: any) {
    console.warn("createPost error:", error?.message || error);
    throw error;
  }
}

export async function getRecentPosts() {
  if (!isSupabaseConfigured) {
    await delay(100);
    const posts = getStoredPosts();
    return { documents: posts };
  }

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*, creator:profiles(*), likes(user_id), comments(*)")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !data || data.length === 0) {
      return { documents: getStoredPosts() };
    }

    return { documents: data.map(formatSupabasePost) };
  } catch (error: any) {
    return { documents: getStoredPosts() };
  }
}

export async function getPostById(postId: string) {
  if (!isSupabaseConfigured) {
    await delay(80);
    const posts = getStoredPosts();
    const post = posts.find((p) => p.$id === postId);
    return post || posts[0];
  }

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*, creator:profiles(*), likes(user_id), comments(*)")
      .eq("id", postId)
      .single();

    if (error || !data) {
      const posts = getStoredPosts();
      return posts.find((p) => p.$id === postId) || posts[0];
    }

    return formatSupabasePost(data);
  } catch (error: any) {
    const posts = getStoredPosts();
    return posts.find((p) => p.$id === postId) || posts[0];
  }
}

export async function updatePost(post: IUpdatePost) {
  if (!isSupabaseConfigured) {
    await delay(150);
    const posts = getStoredPosts();
    let imageUrl = post.imagesUrl as unknown as string;
    if (post.file && post.file[0]) {
      imageUrl = URL.createObjectURL(post.file[0]);
    }
    const tags = post.tags ? post.tags.replace(/ /g, "").split(",").filter(Boolean) : [];
    const updated = posts.map((p) =>
      p.$id === post.postId
        ? {
            ...p,
            caption: post.caption,
            imagesUrl: imageUrl || p.imagesUrl,
            location: post.location || p.location,
            tags,
            $updatedAt: new Date().toISOString(),
          }
        : p
    );
    saveStoredPosts(updated);
    return updated.find((p) => p.$id === post.postId);
  }

  try {
    let imageUrl = post.imagesUrl as string;
    let imageId = post.imageId;

    if (post.file && post.file[0]) {
      const uploaded = await uploadFile(post.file[0]);
      imageUrl = uploaded.url;
      imageId = uploaded.id;
    }

    const tags = post.tags ? post.tags.replace(/ /g, "").split(",").filter(Boolean) : [];

    const { data, error } = await supabase
      .from("posts")
      .update({
        caption: post.caption,
        image_url: imageUrl,
        image_id: imageId,
        location: post.location,
        tags: tags,
        updated_at: new Date().toISOString(),
      })
      .eq("id", post.postId)
      .select("*, creator:profiles(*)")
      .single();

    if (error) throw error;
    return formatSupabasePost(data);
  } catch (error: any) {
    console.warn("updatePost error:", error?.message || error);
    throw error;
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!isSupabaseConfigured) {
    await delay(80);
    const posts = getStoredPosts();
    saveStoredPosts(posts.filter((p) => p.$id !== postId));
    return { status: "ok" };
  }

  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) throw error;

    if (imageId) {
      await deleteFile(imageId);
    }
    return { status: "ok" };
  } catch (error: any) {
    return { status: "ok" };
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  if (!isSupabaseConfigured) {
    await delay(60);
    const posts = getStoredPosts();
    const updated = posts.map((p) =>
      p.$id === postId ? { ...p, likes: likesArray } : p
    );
    saveStoredPosts(updated);
    return updated.find((p) => p.$id === postId);
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (likesArray.includes(user.id)) {
      // Insert like
      await supabase.from("likes").insert({
        post_id: postId,
        user_id: user.id,
      });
    } else {
      // Delete like
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    }
    return { status: "ok" };
  } catch (error: any) {
    return { status: "ok" };
  }
}

export async function savePost(postId: string, userId: string) {
  if (!isSupabaseConfigured) {
    await delay(60);
    const saves = getStoredSaves();
    if (!saves.includes(postId)) {
      saveStoredSaves([...saves, postId]);
    }
    return { $id: `save_${postId}`, post: { $id: postId }, user: { $id: userId } };
  }

  try {
    const { data, error } = await supabase
      .from("saves")
      .insert({
        post_id: postId,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return { $id: data.id, post: { $id: data.post_id }, user: { $id: data.user_id } };
  } catch (error: any) {
    const saves = getStoredSaves();
    if (!saves.includes(postId)) {
      saveStoredSaves([...saves, postId]);
    }
    return { $id: `save_${postId}`, post: { $id: postId }, user: { $id: userId } };
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  if (!isSupabaseConfigured) {
    await delay(60);
    const postId = savedRecordId.replace("save_", "");
    const saves = getStoredSaves();
    saveStoredSaves(saves.filter((id) => id !== postId && `save_${id}` !== savedRecordId));
    return { status: "ok" };
  }

  try {
    await supabase.from("saves").delete().eq("id", savedRecordId);
    return { status: "ok" };
  } catch (error: any) {
    return { status: "ok" };
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  if (!isSupabaseConfigured) {
    await delay(100);
    const posts = getStoredPosts();
    return { documents: posts };
  }

  try {
    const from = (pageParam || 0) * 9;
    const to = from + 8;

    const { data, error } = await supabase
      .from("posts")
      .select("*, creator:profiles(*), likes(user_id), comments(*)")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error || !data || data.length === 0) {
      return { documents: getStoredPosts() };
    }

    return { documents: data.map(formatSupabasePost) };
  } catch (error: any) {
    return { documents: getStoredPosts() };
  }
}

export async function searchPosts(searchTerm: string) {
  if (!isSupabaseConfigured) {
    await delay(80);
    const term = searchTerm.toLowerCase();
    const posts = getStoredPosts().filter(
      (p) =>
        p.caption.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term)) ||
        p.creator.name.toLowerCase().includes(term) ||
        p.creator.username.toLowerCase().includes(term)
    );
    return { documents: posts };
  }

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*, creator:profiles(*), likes(user_id), comments(*)")
      .or(`caption.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);

    if (error || !data || data.length === 0) {
      const term = searchTerm.toLowerCase();
      const fallback = getStoredPosts().filter(
        (p) =>
          p.caption.toLowerCase().includes(term) ||
          p.tags.some((t) => t.toLowerCase().includes(term))
      );
      return { documents: fallback };
    }

    return { documents: data.map(formatSupabasePost) };
  } catch (error: any) {
    const term = searchTerm.toLowerCase();
    const fallback = getStoredPosts().filter((p) =>
      p.caption.toLowerCase().includes(term)
    );
    return { documents: fallback };
  }
}

export async function addCommentToPost(
  postId: string,
  commentText: string,
  user: IUser
) {
  if (!isSupabaseConfigured) {
    await delay(60);
    const posts = getStoredPosts();
    const newComment = {
      id: `c_${Date.now()}`,
      userId: user.id,
      userName: user.username || user.name,
      userAvatar: user.imageUrl,
      text: commentText,
      createdAt: "Just now",
    };
    const updated = posts.map((p) => {
      if (p.$id === postId) {
        return {
          ...p,
          comments: [...(p.comments || []), newComment],
        };
      }
      return p;
    });
    saveStoredPosts(updated);
    return newComment;
  }

  try {
    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: user.id,
        user_name: user.username || user.name,
        user_avatar: user.imageUrl,
        text: commentText,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      userId: data.user_id,
      userName: data.user_name,
      userAvatar: data.user_avatar,
      text: data.text,
      createdAt: "Just now",
    };
  } catch (error: any) {
    const newComment = {
      id: `c_${Date.now()}`,
      userId: user.id,
      userName: user.username || user.name,
      userAvatar: user.imageUrl,
      text: commentText,
      createdAt: "Just now",
    };
    return newComment;
  }
}
