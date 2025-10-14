import { Comment } from "@/@types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatPostDate } from "@/utils/date-formatter";

interface CommentCardProps {
  comment: Comment;
}

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="flex gap-3 border-b border-border/50 p-5">
      <Avatar className="w-10 h-10">
        <AvatarImage src={comment?.author?.avatarUrl} />
        <AvatarFallback>{comment?.author?.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">{comment?.author?.name}</span>
          <span className="text-gray-500 text-xs">
            @{comment?.author?.username} · {formatPostDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-300">{comment.content}</p>
      </div>
    </div>
  );
}
