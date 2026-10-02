import { redis } from "@/lib/redis/conection";

export async function clearVacancysByUserIdCache(userId: string): Promise<boolean> {
    try {
        await redis.unlink(`vacancys:${userId}`);
        return true;
    } catch (e: any) {
        return false;
    }
}