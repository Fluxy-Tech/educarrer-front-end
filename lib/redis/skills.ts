import { redis } from "@/lib/redis/conection";
import { SkillDTO } from "@/lib/interfaces/skill.interface";
import { Skill } from "@/lib/entities/skill";


export class SkillsRedis {

    async setSkillsInRedis(userId: string, skills: SkillDTO[]) {
        const cacheKey = `skill:${userId}`;
        await redis.set(
            cacheKey,
            JSON.stringify(skills),
            "EX", 3600
        ); // Cache por 1 hora
    }

    async getSkillsFromRedis(userId: string): Promise<SkillDTO[]> {
        try {
            const cacheKey = `skill:${userId}`;
            const cachedSkills = await redis.get(cacheKey) ?? null;

            if (cachedSkills) {
                const skills: SkillDTO[] = JSON.parse(cachedSkills);

                if (skills) {

                    return skills.map((skill: SkillDTO) => new Skill(
                        skill.id,
                        skill.name,
                        skill.level,
                        skill.about ?? null,
                        skill.updatedAt ?? null,
                        userId
                    ));

                }
            }

            return [];
        } catch (e: any) {
            console.error("Error fetching skills from Redis:", e);
            return [];
        }
    }


    async getSkillByUserIdAndIdFromRedis(userId: string, id: string): Promise<SkillDTO | null> {
        try {
            const cacheKey = `skill:${userId}`;
            const cachedSkills = await redis.get(cacheKey) ?? null;

            if (cachedSkills) {
                const skills: SkillDTO[] = JSON.parse(cachedSkills);

                if (skills) {

                    const resSkillSearchByid = skills.find((skill: SkillDTO) => {
                        skill.id == id;
                    })

                    if (!resSkillSearchByid) return null;

                    return new Skill(
                        resSkillSearchByid.id,
                        resSkillSearchByid.name,
                        resSkillSearchByid.level,
                        resSkillSearchByid.about ?? null,
                        resSkillSearchByid.updatedAt ?? null,
                        userId
                    );

                }
            }

            return null;

        } catch (e: any) {
            console.error("Error fetching skills from Redis:", e);
            return null;
        }
    }
}