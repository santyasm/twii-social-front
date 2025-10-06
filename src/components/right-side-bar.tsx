import { Search, Mic, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Footer from "./footer";
import { User } from "@/@types/users";
import { useEffect, useState } from "react";
import { twiiApi } from "@/lib/twii-api";

export function RightSidebar() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await twiiApi.findAllUsers();

      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const suggestions = [
    {
      id: 1,
      name: "Alex Bishop",
      subtitle: "Coach, swim, reptball & 2...",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Bella Bean",
      subtitle: "🍓 Savoring every flavor the...",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "Tyra Dhillon",
      subtitle: "Style is a way to express w...",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    },
    {
      id: 4,
      name: "Adam Hayes",
      subtitle: "🎬 Cutting peace in the bas...",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    },
  ];

  return (
    <div className="w-[340px]">
      {/* Search */}
      <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white">Search</h3>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2 text-sm text-gray-300 placeholder:text-gray-500 outline-none focus:border-white/20"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400">
            <Mic className="w-4 h-4" />
          </button>
        </div>
        {/* Suggestions */}
        <div className="bg-[#2d2d2d] dark:bg-[#2d2d2d] rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white">Sugestões</h3>
            <button className="text-gray-400 hover:text-gray-300 text-xs">
              Ver todos
            </button>
          </div>

          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center gap-3 group">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{user.name}</p>
                  <p className="text-gray-400 text-xs truncate">
                    @{user?.username}
                  </p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
