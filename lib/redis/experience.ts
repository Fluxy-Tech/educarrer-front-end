import { redis } from "@/lib/redis/conection";
import { ExperienceDTO } from "@/lib/interfaces/experience.interface";
import { Experience } from "@/lib/entities/experience";

export class ExperienceRedis {

    async setExperiencesInRedis(userId: string, experiences: ExperienceDTO[]): Promise<boolean> {
        try {
            const cacheKey = `experience:${userId}`;
            await redis.set(
                cacheKey,
                JSON.stringify(experiences),
                "EX", 3600
            );
            return true;
        } catch (e: any) {
            console.error("Error insert experieces in Redis:", e);
            return false;
        }
    }

    async getExperiencesFromRedis(userId: string): Promise<ExperienceDTO[]> {
        try {
            const cacheKey = `experience:${userId}`;
            const cachedExperiences = await redis.get(cacheKey) ?? null;

            if (cachedExperiences) {
                const experiences: ExperienceDTO[] = JSON.parse(cachedExperiences);
                return experiences.map((experience: ExperienceDTO) => new Experience(
                    experience.id,
                    experience.name,
                    experience.seniority,
                    experience.about,
                    experience.startDate ?? null,
                    experience.endDate ?? null,
                    experience.currentJob,
                    experience.updatedAt ?? null,
                    userId
                ));
            }

            return [];
        } catch (e: any) {
            console.error("Error fetching experieces from Redis:", e);
            return [];
        }
    }

    async getExperienceByUserIdAndIdFromRedis(userId: string, id: string): Promise<ExperienceDTO | null> {
        try {
            const cacheKey = `experience:${userId}`;
            const cachedExperiences = await redis.get(cacheKey) ?? null;

            if (cachedExperiences) {
                const experiences: ExperienceDTO[] = JSON.parse(cachedExperiences);
                const findExperienceById = experiences.find((e) => e.id == id)

                if (findExperienceById) {
                    return new Experience(
                        findExperienceById.id,
                        findExperienceById.name,
                        findExperienceById.seniority,
                        findExperienceById.about,
                        findExperienceById.startDate ?? null,
                        findExperienceById.endDate ?? null,
                        findExperienceById.currentJob,
                        findExperienceById.updatedAt ?? null,
                        userId
                    );
                }
            }

            return null;
        } catch (e: any) {
            console.error("Error fetching experiece by id from Redis:", e);
            return null;
        }
    }
}