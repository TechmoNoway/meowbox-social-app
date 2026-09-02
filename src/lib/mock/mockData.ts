import { IUser } from "@/types";

export interface IStoryItem {
  id: string;
  media: string;
  timestamp: string;
  caption?: string;
}

export interface IMockStory {
  id: string;
  user: {
    $id: string;
    name: string;
    username: string;
    imageUrl: string;
  };
  hasUnseen: boolean;
  items: IStoryItem[];
}

export interface IMockHighlight {
  id: string;
  title: string;
  cover: string;
}

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
  filter?: string;
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
    website?: string;
    followersCount?: number;
    followingCount?: number;
    postsCount?: number;
  };
}

export interface IMockNotification {
  id: string;
  type: "like" | "comment" | "follow";
  user: {
    name: string;
    username: string;
    imageUrl: string;
  };
  time: string;
  postImage?: string;
  commentText?: string;
  isFollowingBack?: boolean;
}

export const CURRENT_DEMO_USER: IUser = {
  id: "user_demo_1",
  name: "Alex Rivers",
  username: "alexrivers",
  email: "alex@meowbox.app",
  imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  bio: "Photographer & Visual Creator 📸 | Chasing golden light & city stories 🏙️ | Tokyo ⇄ NYC ✈️",
  followersCount: 14200,
  followingCount: 480,
  postsCount: 28,
};

export const MOCK_USERS = [
  {
    $id: "user_demo_1",
    name: "Alex Rivers",
    username: "alexrivers",
    email: "alex@meowbox.app",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "Photographer & Visual Creator 📸 | Chasing golden light & city stories 🏙️ | Tokyo ⇄ NYC ✈️",
    followersCount: 14200,
    followingCount: 480,
    postsCount: 28,
  },
  {
    $id: "user_demo_2",
    name: "Maya Lin",
    username: "mayalin.design",
    email: "maya@meowbox.app",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    bio: "Architect & Spatial Designer 🏛️ | Minimalist living in Copenhagen ☕ | Studio Lin",
    followersCount: 28900,
    followingCount: 310,
    postsCount: 64,
  },
  {
    $id: "user_demo_3",
    name: "Liam Chen",
    username: "liamchen.raw",
    email: "liam@meowbox.app",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "35mm Film & Street Culture 🎞️ | Editorial & Lookbooks | Founder of @rawstreetwear",
    followersCount: 45300,
    followingCount: 520,
    postsCount: 92,
  },
  {
    $id: "user_demo_4",
    name: "Sophia Novak",
    username: "sophianovak",
    email: "sophia@meowbox.app",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    bio: "Travel Journalist & Coffee Explorer ☕ | Currently roaming around Rome & Amalfi Coast 🇮🇹",
    followersCount: 18400,
    followingCount: 420,
    postsCount: 51,
  },
  {
    $id: "user_demo_5",
    name: "David Kim",
    username: "davidk_cinema",
    email: "david@meowbox.app",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Cinematographer 🎬 | Drone pilot in Iceland & Norway ❄️ | Sony Alpha Ambassador",
    followersCount: 62100,
    followingCount: 290,
    postsCount: 110,
  },
  {
    $id: "user_demo_6",
    name: "Elena Rostova",
    username: "elena.style",
    email: "elena@meowbox.app",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    bio: "Fashion Stylist & Art Director 🌸 | Paris Fashion Week 🇫🇷 | Contact: elena@studio.fr",
    followersCount: 39500,
    followingCount: 380,
    postsCount: 78,
  },
];

export const MOCK_STORIES: IMockStory[] = [
  {
    id: "story_1",
    user: {
      $id: MOCK_USERS[1].$id,
      name: MOCK_USERS[1].name,
      username: MOCK_USERS[1].username,
      imageUrl: MOCK_USERS[1].imageUrl,
    },
    hasUnseen: true,
    items: [
      {
        id: "item_1_1",
        media: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
        timestamp: "2h ago",
        caption: "Morning light in the new studio ☕📐",
      },
      {
        id: "item_1_2",
        media: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
        timestamp: "1h ago",
        caption: "Material sample textures ✨",
      },
    ],
  },
  {
    id: "story_2",
    user: {
      $id: MOCK_USERS[2].$id,
      name: MOCK_USERS[2].name,
      username: MOCK_USERS[2].username,
      imageUrl: MOCK_USERS[2].imageUrl,
    },
    hasUnseen: true,
    items: [
      {
        id: "item_2_1",
        media: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80",
        timestamp: "4h ago",
        caption: "Street casting for tomorrow's lookbook 🛹",
      },
    ],
  },
  {
    id: "story_3",
    user: {
      $id: MOCK_USERS[3].$id,
      name: MOCK_USERS[3].name,
      username: MOCK_USERS[3].username,
      imageUrl: MOCK_USERS[3].imageUrl,
    },
    hasUnseen: true,
    items: [
      {
        id: "item_3_1",
        media: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80",
        timestamp: "5h ago",
        caption: "Sunset over Colosseum, Roma 🌅",
      },
      {
        id: "item_3_2",
        media: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
        timestamp: "3h ago",
        caption: "Best espresso in Trastevere ☕",
      },
    ],
  },
  {
    id: "story_4",
    user: {
      $id: MOCK_USERS[4].$id,
      name: MOCK_USERS[4].name,
      username: MOCK_USERS[4].username,
      imageUrl: MOCK_USERS[4].imageUrl,
    },
    hasUnseen: false,
    items: [
      {
        id: "item_4_1",
        media: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=900&q=80",
        timestamp: "8h ago",
        caption: "Chasing northern lights in Tromsø 🌌",
      },
    ],
  },
  {
    id: "story_5",
    user: {
      $id: MOCK_USERS[5].$id,
      name: MOCK_USERS[5].name,
      username: MOCK_USERS[5].username,
      imageUrl: MOCK_USERS[5].imageUrl,
    },
    hasUnseen: false,
    items: [
      {
        id: "item_5_1",
        media: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
        timestamp: "12h ago",
        caption: "Backstage fittings at Grand Palais 🇫🇷",
      },
    ],
  },
];

export const MOCK_HIGHLIGHTS: IMockHighlight[] = [
  {
    id: "hl_1",
    title: "Tokyo 🇯🇵",
    cover: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "hl_2",
    title: "35mm Film",
    cover: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "hl_3",
    title: "Architecture",
    cover: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "hl_4",
    title: "Lifestyle",
    cover: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "hl_5",
    title: "Travel ✈️",
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80",
  },
];

export const INITIAL_MOCK_POSTS: IMockPost[] = [
  {
    $id: "post_1",
    $createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    $updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    caption: "Midnight in Shinjuku. Rain-soaked neon streets never fail to inspire. Shot on Leica M6 with Portra 400 🌧️📸",
    imagesUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85",
    imageId: "img_1",
    location: "Shinjuku, Tokyo, Japan",
    tags: ["tokyo", "streetphotography", "leica", "nightvibes", "filmisnotdead"],
    likes: ["user_demo_2", "user_demo_3", "user_demo_4", "user_demo_5", "user_demo_6"],
    creator: MOCK_USERS[0],
    comments: [
      {
        id: "c1",
        userId: "user_demo_2",
        userName: "Maya Lin",
        userAvatar: MOCK_USERS[1].imageUrl,
        text: "The reflections on the pavement are insane! 🔥",
        createdAt: "25m",
      },
      {
        id: "c2",
        userId: "user_demo_5",
        userName: "David Kim",
        userAvatar: MOCK_USERS[4].imageUrl,
        text: "Cinematic mood at its finest brother 🎬",
        createdAt: "10m",
      },
    ],
  },
  {
    $id: "post_2",
    $createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    $updatedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    caption: "Scandinavian simplicity. Natural oak, tactile ceramics, and afternoon sunlight in our newly completed loft project 🏛️☕",
    imagesUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    imageId: "img_2",
    location: "Copenhagen, Denmark",
    tags: ["architecture", "interiordesign", "minimalism", "copenhagen", "nordic"],
    likes: ["user_demo_1", "user_demo_3", "user_demo_4", "user_demo_6"],
    creator: MOCK_USERS[1],
    comments: [
      {
        id: "c3",
        userId: "user_demo_1",
        userName: "Alex Rivers",
        userAvatar: MOCK_USERS[0].imageUrl,
        text: "The light in this room is absolute perfection.",
        createdAt: "1h",
      },
    ],
  },
  {
    $id: "post_3",
    $createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    $updatedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    caption: "Autumn collection teaser. Heavyweight raw denim paired with vintage leather. Dropping this Friday worldwide 🛹⚡",
    imagesUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85",
    imageId: "img_3",
    location: "SoHo, New York",
    tags: ["streetwear", "fashion", "rawdenim", "lookbook", "vintage"],
    likes: ["user_demo_1", "user_demo_2", "user_demo_5"],
    creator: MOCK_USERS[2],
    comments: [],
  },
  {
    $id: "post_4",
    $createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    $updatedAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    caption: "Golden hour overlooking the ancient rooftops of Rome. There's magic in every cobblestone alley here 🇮🇹✨",
    imagesUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=85",
    imageId: "img_4",
    location: "Rome, Italy",
    tags: ["travel", "rome", "italy", "sunset", "wanderlust"],
    likes: ["user_demo_1", "user_demo_2", "user_demo_3", "user_demo_6"],
    creator: MOCK_USERS[3],
    comments: [],
  },
  {
    $id: "post_5",
    $createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    $updatedAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    caption: "Dancing green aurora over Reine, Lofoten Islands. 20-second exposure at f/1.8 under -12°C winter skies 🌌❄️",
    imagesUrl: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=85",
    imageId: "img_5",
    location: "Lofoten Islands, Norway",
    tags: ["aurora", "norway", "nightphotography", "nature", "landscape"],
    likes: ["user_demo_1", "user_demo_2", "user_demo_3", "user_demo_4"],
    creator: MOCK_USERS[4],
    comments: [],
  },
  {
    $id: "post_6",
    $createdAt: new Date(Date.now() - 1000 * 60 * 2880).toISOString(),
    $updatedAt: new Date(Date.now() - 1000 * 60 * 2880).toISOString(),
    caption: "Elegance in motion. Backstage details from Paris Haute Couture week 🌸🇫🇷",
    imagesUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",
    imageId: "img_6",
    location: "Paris, France",
    tags: ["fashionweek", "parisfashion", "couture", "editorial", "style"],
    likes: ["user_demo_1", "user_demo_2", "user_demo_3", "user_demo_4", "user_demo_5"],
    creator: MOCK_USERS[5],
    comments: [],
  },
];

export const MOCK_NOTIFICATIONS: IMockNotification[] = [
  {
    id: "notif_1",
    type: "like",
    user: {
      name: "Maya Lin",
      username: "mayalin.design",
      imageUrl: MOCK_USERS[1].imageUrl,
    },
    time: "15m",
    postImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "notif_2",
    type: "comment",
    user: {
      name: "David Kim",
      username: "davidk_cinema",
      imageUrl: MOCK_USERS[4].imageUrl,
    },
    time: "1h",
    commentText: "Cinematic mood at its finest brother 🎬",
    postImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "notif_3",
    type: "follow",
    user: {
      name: "Sophia Novak",
      username: "sophianovak",
      imageUrl: MOCK_USERS[3].imageUrl,
    },
    time: "3h",
    isFollowingBack: true,
  },
  {
    id: "notif_4",
    type: "like",
    user: {
      name: "Liam Chen",
      username: "liamchen.raw",
      imageUrl: MOCK_USERS[2].imageUrl,
    },
    time: "5h",
    postImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=80",
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
  return ["post_1", "post_2", "post_4"];
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
  return ["user_demo_2", "user_demo_3", "user_demo_5"];
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
