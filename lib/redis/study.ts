import { redis } from "@/lib/redis/conection";
import { StudyDTO } from "@/lib/interfaces/study.interface";

export class StudyRedis {

    async setStudyInRedis(userId: string, studys: StudyDTO[]) {
        const cacheKey = `studys:${userId}`;
        await redis.set(
            cacheKey,
            JSON.stringify(studys),
            "EX", 3600
        ); // Cache por 1 hora
    }

    async getStudyByUserIdFromRedis(userId: string): Promise<StudyDTO[]> {
        const cacheKey = `studys:${userId}`;
        const cachedStudys = await redis.get(cacheKey) ?? null;

        if (cachedStudys) {
            const studys: StudyDTO[] = JSON.parse(cachedStudys);
            return studys;
        }

        return [];
    }

    async getStudyByUserIdAndIdFromRedis(userId: string, id: string): Promise<StudyDTO | null> {
        const cacheKey = `studys:${userId}`;
        const cachedStudys = await redis.get(cacheKey) ?? null;

        if (cachedStudys) {
            const studys: StudyDTO[] = JSON.parse(cachedStudys);
            const findStudyById = studys.find((s) => s.id == id);
            
            if(findStudyById) return findStudyById;
        }
        return null;
    }
}