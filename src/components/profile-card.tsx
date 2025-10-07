"use client";

import Image from 'next/image'; // Para otimizar imagens
import { User } from '@/@types/users'; // Seu tipo de usuário
import { MapPin, CalendarDays } from 'lucide-react'; // Ícones
import { format } from 'date-fns'; // Para formatar a data
import { ptBR } from 'date-fns/locale';

interface ProfileCardProps {
    user: User;
}

export default function ProfileCard({ user }: ProfileCardProps) {
    // Helper para obter as iniciais (se precisar de fallback para avatar)
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const memberSince = user.createdAt
        ? format(new Date(user.createdAt), 'MMMM yyyy', { locale: ptBR })
        : 'Data desconhecida';

    const postCount = user.Post?.length || 0;

    return (
        <div className="bg-card rounded-2xl overflow-hidden mb-6 shadow-md w-full">
            <div className="relative h-40 bg-gray-700/20 dark:bg-gray-700">
                <div className="flex items-center justify-center h-full text-gray-500 text-lg" />
            </div>

            <div className="p-4 relative">
                <div className="relative -mt-20 mb-4 ml-4 w-32 h-32 rounded-full border-4 border-card bg-gray-800 overflow-hidden">
                    {user.avatarUrl ? (
                        <Image
                            src={user.avatarUrl}
                            alt={`${user.name}'s avatar`}
                            fill
                            className="object-cover"
                            sizes="128px"
                            priority
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-2xl font-bold">
                            {getInitials(user.name)}
                        </div>
                    )}
                </div>

                <h1 className="text-2xl font-bold -mt-16 ml-36">
                    {user.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm ml-36">
                    @{user.username}
                </p>

                {user.bio && (
                    <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed whitespace-pre-wrap">
                        {user.bio}
                    </p>
                )}

                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-sm mt-4">
                    <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        <span>Membro desde {memberSince}</span>
                    </div>
                </div>

                <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-1">
                        <span className="font-bold">{user.following?.length || 0}</span>
                        <span className="text-gray-5    00 dark:text-gray-400">Seguindo</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="font-bold">{user.followers?.length || 0}</span>
                        <span className="text-gray-5    00 dark:text-gray-400">Seguidores</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="font-bold">{postCount}</span>
                        <span className="text-gray-5    00 dark:text-gray-400">Posts</span>
                    </div>
                </div>
            </div>
        </div>
    );
}