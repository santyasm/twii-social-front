import { Follow } from "./follow";
import { Post } from "./posts";

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  followers: Follow[];
  following: Follow[];
  Post: Post[];
  isFollowedByMe?: boolean;
}
