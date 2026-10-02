import { SkillRepository } from "@/lib/repositories/skill";
import { CreateSkillDTO, SkillDTO, UpdateSkillDTO } from "@/lib/interfaces/skill.interface";
import { SkillsRedis } from "@/lib/redis/skills";
import { redis } from "@/lib/redis/conection";

const userRepository = new SkillRepository();
const skillsRedis = new SkillsRedis();

export async function getSkillByUserId(userId: string) {
    const getSkillsFromRedis = await skillsRedis.getSkillsFromRedis(userId);

    if(getSkillsFromRedis.length > 0){
        return getSkillsFromRedis;
    }

    const getSkillsFromDataBase = await userRepository.getSkillByUserId(userId);

    if(getSkillsFromDataBase.length > 0){
        skillsRedis.setSkillsInRedis(userId, getSkillsFromDataBase);
    }

    return getSkillsFromDataBase;
}

export async function createSkill(data: CreateSkillDTO, userId: string) {
    await redis.del(`skill:${userId}`);
    return await userRepository.createSkill(data);
}

export async function deleteSkill(id: string, userId: string) {
    await redis.del(`skill:${userId}`);
    return await userRepository.deleteSkill(id);
}

export async function updateSkill(id: string, data: UpdateSkillDTO, userId: string) {
    await redis.del(`skill:${userId}`);
    return await userRepository.updateSkill(id, data);
}

export async function getSkillByUserIdAndId(userId: string, id: string) {

    const findSkillByUserIdAndIdFromRedis = await skillsRedis.getSkillByUserIdAndIdFromRedis(userId, id);

    if(findSkillByUserIdAndIdFromRedis){
        return findSkillByUserIdAndIdFromRedis;
    }

    const findSkillByUserIdAndIdFromDataBase = await userRepository.getSkillByUserIdAndId(userId, id);
    return findSkillByUserIdAndIdFromDataBase;
}