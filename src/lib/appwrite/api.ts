import { INewPost, INewUser, IUpdatePost, IUpdateUser, IUser } from "@/types";
import { ID, ImageGravity, Query } from "appwrite";
import {
  account,
  appwriteConfig,
  avatars,
  databases,
  isAppwriteConfigured,
  storage,
} from "./config";
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

// ============================== AUTH ==============================
export async function createUserAccount(user: INewUser) {
  if (!isAppwriteConfigured) {
    await delay(300);
    const mockUser = {
      $id: `user_${Date.now()}`,
      name: user.name,
      email: user.email,
      username: user.username,
      imageUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`,
      bio: "New MeowBox Explorer 🐾",
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
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL | string;
  username?: string;
}) {
  if (!isAppwriteConfigured) return user;

  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.error(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  if (!isAppwriteConfigured) {
    await delay(250);
    localStorage.setItem("meowbox_logged_in", "true");
    return { session: "mock_session" };
  }

  try {
    // Supports both createEmailPasswordSession (Appwrite 14+) and createEmailSession (earlier versions)
    const sessionFn =
      (account as any).createEmailPasswordSession?.bind(account) ||
      (account as any).createEmailSession?.bind(account);
    const session = await sessionFn(user.email, user.password);
    return session;
  } catch (error) {
    console.error(error);
  }
}

export async function signOutAccount() {
  if (!isAppwriteConfigured) {
    await delay(100);
    localStorage.removeItem("meowbox_logged_in");
    return { status: "ok" };
  }

  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentUser() {
  if (!isAppwriteConfigured) {
    await delay(100);
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
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
  }
}

// ============================== USERS ==============================
export async function getUsers(limit?: number) {
  if (!isAppwriteConfigured) {
    await delay(150);
    return { documents: limit ? MOCK_USERS.slice(0, limit) : MOCK_USERS };
  }

  const queries: any[] = [Query.orderDesc("$createdAt")];
  if (limit) queries.push(Query.limit(limit));

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );
    return users;
  } catch (error) {
    console.error(error);
    return { documents: MOCK_USERS };
  }
}

export async function getUserById(userId: string) {
  if (!isAppwriteConfigured) {
    await delay(100);
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
        followersCount: 1420,
        followingCount: 382,
      };
    }
    const found = MOCK_USERS.find((u) => u.$id === userId) || MOCK_USERS[0];
    const posts = getStoredPosts().filter((p) => p.creator.$id === found.$id);
    return { ...found, posts };
  }

  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );
    return user;
  } catch (error) {
    console.error(error);
  }
}

export async function updateUser(user: IUpdateUser) {
  if (!isAppwriteConfigured) {
    await delay(200);
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

  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    return updatedUser;
  } catch (error) {
    console.error(error);
  }
}

// ============================== POSTS ==============================
export async function createPost(post: INewPost) {
  if (!isAppwriteConfigured) {
    await delay(300);
    const currentUser = getStoredUser();
    let fileUrl = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80";
    if (post.file && post.file[0]) {
      fileUrl = URL.createObjectURL(post.file[0]);
    }
    const tags = post.tags ? post.tags.replace(/ /g, "").split(",").filter(Boolean) : ["meowbox"];
    const newMockPost: IMockPost = {
      $id: `post_${Date.now()}`,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      caption: post.caption,
      imagesUrl: fileUrl,
      imageId: `img_${Date.now()}`,
      location: post.location || "MeowBox Community",
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
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw Error;

    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imagesUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.error(error);
  }
}

export async function uploadFile(file: File) {
  if (!isAppwriteConfigured) {
    return { $id: `mock_file_${Date.now()}` };
  }
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.error(error);
  }
}

export function getFilePreview(fileId: string) {
  if (!isAppwriteConfigured) {
    return "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80";
  }
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      4000,
      4000,
      ImageGravity.Top,
      100
    );
    return fileUrl;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteFile(fileId: string) {
  if (!isAppwriteConfigured) return { status: "ok" };
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: "ok" };
  } catch (error) {
    console.error(error);
  }
}

export async function getRecentPosts() {
  if (!isAppwriteConfigured) {
    await delay(150);
    const posts = getStoredPosts();
    return { documents: posts };
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );
    return posts;
  } catch (error) {
    console.error(error);
    return { documents: getStoredPosts() };
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  if (!isAppwriteConfigured) {
    await delay(80);
    const posts = getStoredPosts();
    const updated = posts.map((p) =>
      p.$id === postId ? { ...p, likes: likesArray } : p
    );
    saveStoredPosts(updated);
    return updated.find((p) => p.$id === postId);
  }

  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );
    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}

export async function savePost(postId: string, userId: string) {
  if (!isAppwriteConfigured) {
    await delay(80);
    const saves = getStoredSaves();
    if (!saves.includes(postId)) {
      saveStoredSaves([...saves, postId]);
    }
    return { $id: `save_${postId}`, post: { $id: postId }, user: { $id: userId } };
  }

  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );
    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  if (!isAppwriteConfigured) {
    await delay(80);
    const postId = savedRecordId.replace("save_", "");
    const saves = getStoredSaves();
    saveStoredSaves(saves.filter((id) => id !== postId && `save_${id}` !== savedRecordId));
    return { status: "ok" };
  }

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );
    return { status: "ok" };
  } catch (error) {
    console.error(error);
  }
}

export async function getPostById(postId: string) {
  if (!isAppwriteConfigured) {
    await delay(100);
    const posts = getStoredPosts();
    const post = posts.find((p) => p.$id === postId);
    return post || posts[0];
  }

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    return post;
  } catch (error) {
    console.error(error);
    const posts = getStoredPosts();
    return posts.find((p) => p.$id === postId) || posts[0];
  }
}

export async function updatePost(post: IUpdatePost) {
  if (!isAppwriteConfigured) {
    await delay(200);
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

  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imagesUrl: post.imagesUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imagesUrl: fileUrl, imageId: uploadedFile.$id };
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imagesUrl: image.imagesUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!isAppwriteConfigured) {
    await delay(100);
    const posts = getStoredPosts();
    saveStoredPosts(posts.filter((p) => p.$id !== postId));
    return { status: "ok" };
  }

  if (!postId || !imageId) throw Error;

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    return { status: "ok" };
  } catch (error) {
    console.error(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  if (!isAppwriteConfigured) {
    await delay(150);
    const posts = getStoredPosts();
    return { documents: posts };
  }

  const queries: any[] = [Query.orderDesc("$createdAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );
    return posts;
  } catch (error) {
    console.error(error);
    return { documents: getStoredPosts() };
  }
}

export async function searchPosts(searchTerm: string) {
  if (!isAppwriteConfigured) {
    await delay(100);
    const term = searchTerm.toLowerCase();
    const posts = getStoredPosts().filter(
      (p) =>
        p.caption.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term)) ||
        p.creator.name.toLowerCase().includes(term)
    );
    return { documents: posts };
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );
    return posts;
  } catch (error) {
    console.error(error);
    const term = searchTerm.toLowerCase();
    const posts = getStoredPosts().filter((p) =>
      p.caption.toLowerCase().includes(term)
    );
    return { documents: posts };
  }
}

export async function addCommentToPost(
  postId: string,
  commentText: string,
  user: IUser
) {
  await delay(100);
  const posts = getStoredPosts();
  const newComment = {
    id: `c_${Date.now()}`,
    userId: user.id,
    userName: user.name,
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
