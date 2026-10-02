import { ExperienceRepository } from "@/lib/repositories/experience";
import { CreateExperienceDTO, UpdateExperienceDTO } from "@/lib/interfaces/experience.interface";
import { ExperienceRedis } from "@/lib/redis/experience";
import { redis } from "@/lib/redis/conection";

const experienceRepository = new ExperienceRepository();
const experienceRedis = new ExperienceRedis()

export async function getExperienceByUserId(userId: string) {
    const listExperiencesFromRedis = await experienceRedis.getExperiencesFromRedis(userId);

    if (listExperiencesFromRedis.length != 0) {
        return listExperiencesFromRedis;
    }

    const listExperiencesFromDataBase = await experienceRepository.getExperienceByUserId(userId);

    if (listExperiencesFromDataBase.length > 0) {
        experienceRedis.setExperiencesInRedis(userId, listExperiencesFromDataBase);
    }

    return listExperiencesFromDataBase;
}

export async function createExperience(data: CreateExperienceDTO, userId: string) {
    await redis.del(`experience:${userId}`);
    return await experienceRepository.createExperience(data);
}

export async function deleteExperience(id: string, userId: string) {
    await redis.del(`experience:${userId}`);
    return await experienceRepository.deleteExperience(id);
}

export async function updateExperience(id: string, data: Partial<UpdateExperienceDTO>, userId: string) {
    await redis.del(`experience:${userId}`);
    return await experienceRepository.updateExperience(id, data);
}

export async function getExperienceByUserIdAndId(userId: string, id: string) {
    const findExperienceByIdFromRedis = await experienceRedis.getExperienceByUserIdAndIdFromRedis(userId, id);

    if (findExperienceByIdFromRedis) {
        return findExperienceByIdFromRedis;
    }

    const findExperienceByIdFromDataBase = await experienceRepository.getExperienceByUserIdAndId(id);
    return findExperienceByIdFromDataBase;
}