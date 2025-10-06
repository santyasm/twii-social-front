import { Home, LogOutIcon, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import AppLogoIcon from "./app-logo-icon";
import { useAuth } from "@/hooks/auth/use-auth";

export function LeftSidebar() {
  const { user, logout } = useAuth();

  return (
    <div className="w-[270px] bg-[#ffffff] dark:bg-[#2d2d2d] rounded-3xl p-6 flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center pb-4 gap-1.5">
        <AppLogoIcon className="fill-current text-primary w-6" />
        <h1 className="font-bold text-xl">Twii</h1>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <Avatar className="w-20 h-20 mb-3 ring-2 ring-white/10">
          <AvatarImage src={user?.avatarUrl} />
          <AvatarFallback>JC</AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-1.5">
          <h3 className="text-white text-sm">{user?.name}</h3>
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <p className="text-sm text-gray-400">@{user?.username}</p>
        {user?.bio && (
          <p className="text-gray-300 text-xs text-center mt-3 leading-relaxed">
            {user.bio}
          </p>
        )}

        {/* Stats */}
        <div className="flex gap-8 mt-5">
          <div className="flex flex-col items-center">
            <span className="text-white">{user?.Post?.length}</span>
            <span className="text-gray-400 text-xs">Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white">{user?.followers?.length}</span>
            <span className="text-gray-400 text-xs">Seguidores</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white">{user?.following?.length}</span>
            <span className="text-gray-400 text-xs">Seguindo</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 mb-8">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 text-white transition-colors hover:bg-white/10">
          <Home className="w-5 h-5" />
          <span className="text-sm">Feed</span>
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-300 transition-colors hover:bg-white/5">
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </button>

        <button
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-300 transition-colors hover:bg-white/5"
          onClick={logout}
        >
          <LogOutIcon className="w-5 h-5" />
          <span className="text-sm">Sair</span>
        </button>
      </nav>
    </div>
  );
}
