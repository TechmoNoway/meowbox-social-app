import { IUser } from "@/types";

export interface IMockPost {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  caption: string;
  imagesUrl: string;
  imageId: string;
  location: string;
  tags: string[];
  likes: string[];
  comments?: Array<{
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    createdAt: string;
  }>;
  creator: {
    $id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
    followersCount?: number;
    followingCount?: number;
  };
}

export const CURRENT_DEMO_USER: IUser = {
  id: "user_demo_1",
  name: "Luna Whiskers",
  username: "lunacat",
  email: "luna@meowbox.app",
  imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
  bio: "Curious feline explorer & nap connoisseur 🐾 ✨ Sharing the cutest daily adventures.",
};

export const MOCK_USERS = [
  {
    $id: "user_demo_1",
    name: "Luna Whiskers",
    username: "lunacat",
    email: "luna@meowbox.app",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
    bio: "Curious feline explorer & nap connoisseur 🐾 ✨ Sharing the cutest daily adventures.",
    followersCount: 1420,
    followingCount: 382,
    postsCount: 12,
  },
  {
    $id: "user_demo_2",
    name: "Oliver Paws",
    username: "oliver_british",
    email: "oliver@meowbox.app",
    imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80",
    bio: "Chubby cheeks, gentle soul. British Shorthair royalty 👑",
    followersCount: 3890,
    followingCount: 140,
    postsCount: 24,
  },
  {
    $id: "user_demo_3",
    name: "Mochi & Matcha",
    username: "mochi_twins",
    email: "mochi@meowbox.app",
    imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80",
    bio: "Double trouble! Twin Scottish folds who love boxes and sunshine ☀️",
    followersCount: 5210,
    followingCount: 420,
    postsCount: 45,
  },
  {
    $id: "user_demo_4",
    name: "Professor Whiskers",
    username: "prof_whiskers",
    email: "prof@meowbox.app",
    imageUrl: "https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=400&q=80",
    bio: "PhD in Purr-ology. Cardboard box engineer & catnip inspector 🎓",
    followersCount: 2190,
    followingCount: 95,
    postsCount: 18,
  },
  {
    $id: "user_demo_5",
    name: "Bella The Calico",
    username: "bella_calico",
    email: "bella@meowbox.app",
    imageUrl: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=400&q=80",
    bio: "Living that 9-lives aesthetic life in Tokyo 🌸 🐈",
    followersCount: 4760,
    followingCount: 210,
    postsCount: 31,
  },
  {
    $id: "user_demo_6",
    name: "Captain Fluff",
    username: "captain_fluff",
    email: "fluff@meowbox.app",
    imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80",
    bio: "Maine Coon giant with a heart of gold. Master of bird watching 🐦",
    followersCount: 6890,
    followingCount: 315,
    postsCount: 52,
  },
];

export const MOCK_STORIES = [
  {
    id: "story_1",
    user: MOCK_USERS[0],
    media: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
    hasUnseen: true,
  },
  {
    id: "story_2",
    user: MOCK_USERS[1],
    media: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80",
    hasUnseen: true,
  },
  {
    id: "story_3",
    user: MOCK_USERS[2],
    media: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80",
    hasUnseen: true,
  },
  {
    id: "story_4",
    user: MOCK_USERS[3],
    media: "https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=600&q=80",
    hasUnseen: false,
  },
  {
    id: "story_5",
    user: MOCK_USERS[4],
    media: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=600&q=80",
    hasUnseen: false,
  },
  {
    id: "story_6",
    user: MOCK_USERS[5],
    media: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80",
    hasUnseen: false,
  },
];

export const INITIAL_MOCK_POSTS: IMockPost[] = [
  {
    $id: "post_1",
    $createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    $updatedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    caption: "Sunbeam perfection discovered! ☀️ Spent the entire morning chasing dust motes and mastering the art of the loaf.",
    imagesUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80",
    imageId: "img_1",
    location: "Sunny Living Room, Tokyo",
    tags: ["sunbeam", "catlife", "loaf", "cozyvibes"],
    likes: ["user_demo_2", "user_demo_3", "user_demo_4", "user_demo_1"],
    creator: MOCK_USERS[0],
    comments: [
      {
        id: "c1",
        userId: "user_demo_2",
        userName: "Oliver Paws",
        userAvatar: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80",
        text: "10/10 loaf form! No paws in sight 🍞✨",
        createdAt: "15 mins ago",
      },
      {
        id: "c2",
        userId: "user_demo_3",
        userName: "Mochi & Matcha",
        userAvatar: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80",
        text: "Save some sunshine for us! 🥺☀️",
        createdAt: "5 mins ago",
      },
    ],
  },
  {
    $id: "post_2",
    $createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    $updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    caption: "If I fits, I sits. The box delivery is officially mine now 📦🐾 Human can have whatever was inside.",
    imagesUrl: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=1200&q=80",
    imageId: "img_2",
    location: "Amazon Delivery Box, Kyoto",
    tags: ["boxlife", "ififitsisits", "calicocat", "meow"],
    likes: ["user_demo_1", "user_demo_3", "user_demo_5", "user_demo_6"],
    creator: MOCK_USERS[4],
    comments: [
      {
        id: "c3",
        userId: "user_demo_4",
        userName: "Professor Whiskers",
        userAvatar: "https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=400&q=80",
        text: "Top tier architecture. Highly recommended.",
        createdAt: "1 hour ago",
      },
    ],
  },
  {
    $id: "post_3",
    $createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    $updatedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    caption: "Gentle reminder to hydrate and take 14 naps today ☁️💤 The British Shorthair lifestyle requires dedication.",
    imagesUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1200&q=80",
    imageId: "img_3",
    location: "Velvet Cushion, London",
    tags: ["napqueen", "britishshorthair", "chubbycheeks", "peaceful"],
    likes: ["user_demo_1", "user_demo_2", "user_demo_4"],
    creator: MOCK_USERS[1],
    comments: [],
  },
  {
    $id: "post_4",
    $createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    $updatedAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    caption: "Synchronized bird-watching session! 🐦👀 Target acquired at 2 o'clock in the maple tree.",
    imagesUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1200&q=80",
    imageId: "img_4",
    location: "Window Perch, Vancouver",
    tags: ["twins", "birdwatching", "scottishfold", "huntingmode"],
    likes: ["user_demo_1", "user_demo_2", "user_demo_5", "user_demo_6"],
    creator: MOCK_USERS[2],
    comments: [],
  },
  {
    $id: "post_5",
    $createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    $updatedAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    caption: "Deep thoughts about the red laser dot. Where does it come from? Where does it go? 🔍🐾",
    imagesUrl: "https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=1200&q=80",
    imageId: "img_5",
    location: "The Philosophy Desk, Boston",
    tags: ["philosophy", "laserdot", "smartcat", "curious"],
    likes: ["user_demo_1", "user_demo_3", "user_demo_4"],
    creator: MOCK_USERS[3],
    comments: [],
  },
  {
    $id: "post_6",
    $createdAt: new Date(Date.now() - 1000 * 60 * 2880).toISOString(),
    $updatedAt: new Date(Date.now() - 1000 * 60 * 2880).toISOString(),
    caption: "Majestic floof check 🦁 Outdoor adventures in the snowy garden!",
    imagesUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=80",
    imageId: "img_6",
    location: "Snow Garden, Oslo",
    tags: ["mainecoon", "wintervibes", "fluffy", "adventures"],
    likes: ["user_demo_1", "user_demo_2", "user_demo_3", "user_demo_4", "user_demo_5"],
    creator: MOCK_USERS[5],
    comments: [],
  },
];

// LocalStorage Helper for mock state
const STORAGE_KEY_POSTS = "meowbox_mock_posts";
const STORAGE_KEY_SAVES = "meowbox_mock_saves";
const STORAGE_KEY_USER = "meowbox_mock_user";
const STORAGE_KEY_FOLLOWS = "meowbox_mock_follows";

export const getStoredPosts = (): IMockPost[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_POSTS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_MOCK_POSTS;
};

export const saveStoredPosts = (posts: IMockPost[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  } catch (e) {
    console.error(e);
  }
};

export const getStoredSaves = (): string[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_SAVES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return ["post_1", "post_3"];
};

export const saveStoredSaves = (saves: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_SAVES, JSON.stringify(saves));
  } catch (e) {
    console.error(e);
  }
};

export const getStoredFollows = (): string[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_FOLLOWS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return ["user_demo_2", "user_demo_5"];
};

export const saveStoredFollows = (follows: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_FOLLOWS, JSON.stringify(follows));
  } catch (e) {
    console.error(e);
  }
};

export const getStoredUser = (): IUser => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_USER);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return CURRENT_DEMO_USER;
};

export const saveStoredUser = (user: IUser) => {
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } catch (e) {
    console.error(e);
  }
};
