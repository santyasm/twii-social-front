import { Like } from "./like";
import { User } from "./users";
import { Comment } from "./comment";

export interface Post {
  id: string;
  authorId: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  likes?: Like[];
  comments?: Comment[];
  likeCount: number;
  commentCount: number;
  isLikedByMe?: boolean;
}
