"use client";

import Link from "next/link";
import { Search, Mic, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Footer from "./footer";
import { User } from "@/@types/users";
import { useEffect, useState } from "react";
import { twiiApi } from "@/lib/twii-api";
import clsx from "clsx";
import { getInitials } from "@/utils/string-formatter";

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

  return (
    <aside
      className={clsx(
        "hidden sm:flex flex-col",
        "bg-card",
        "rounded-2xl shadow-md",
        "p-3 md:p-4",
        "w-[22vw] lg:w-[23vw]",
        "fixed right-4 top-4",
        "z-30",
        "overflow-y-auto",
        "transition-all duration-300"
      )}
    >
      {/* Search */}
      <div className="rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3>Search</h3>
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
        <div className="p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3>Sugestões</h3>
            <button className="text-gray-400 hover:text-gray-300 text-xs">
              Ver todos
            </button>
          </div>

          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center gap-3 group">
                <Link href={`/${user.username}`}>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{user.name}</p>
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
    </aside>
  );
}
