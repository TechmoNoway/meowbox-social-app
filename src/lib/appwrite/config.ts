import { Account, Avatars, Client, Databases, Storage } from "appwrite";

export const appwriteConfig = {
  url: import.meta.env.VITE_APPWRITE_URL || "https://cloud.appwrite.io/v1",
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || "",
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || "",
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID || "",
  userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID || "",
  postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID || "",
  savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID || "",
};

export const isAppwriteConfigured = Boolean(
  appwriteConfig.projectId &&
  appwriteConfig.databaseId &&
  appwriteConfig.postCollectionId
);

export const client = new Client();

if (appwriteConfig.projectId) {
  client.setProject(appwriteConfig.projectId);
}
if (appwriteConfig.url) {
  client.setEndpoint(appwriteConfig.url);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
