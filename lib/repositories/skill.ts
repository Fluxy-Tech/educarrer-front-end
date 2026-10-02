import { prisma } from "@/lib/prisma";
import { CreateSkillDTO, SkillDTO, UpdateSkillDTO } from "@/lib/interfaces/skill.interface";
import { Skill } from "@/lib/entities/skill";

export class SkillRepository {

    async getSkillByUserId(userId: string): Promise<SkillDTO[]> {
        const skills = await prisma.skill.findMany({
            where: {
                userId,
            },
        });

        return skills.map(skill => new Skill(
            skill.id,
            skill.name,
            skill.level,
            skill.about,
            skill.updatedAt,
            skill.userId
        ));
    }

    async createSkill(data: CreateSkillDTO): Promise<SkillDTO> {
        const skill = await prisma.skill.create({
            data
        });

        return new Skill(
            skill.id,
            skill.name,
            skill.level,
            skill.about,
            skill.updatedAt,
            skill.userId
        );
    }

    async deleteSkill(id: string) {
        return await prisma.skill.delete({
            where: {
                id
            }
        });
    }

    async updateSkill(id: string, data: UpdateSkillDTO): Promise<SkillDTO> {
        const skill = await prisma.skill.update({
            where: {
                id
            },
            data
        });

        return new Skill(
            skill.id,
            skill.name,
            skill.level,
            skill.about,
            skill.updatedAt,
            skill.userId
        );
    }

    async getSkillByUserIdAndId(userId: string, id: string): Promise<SkillDTO | null> {
        const skill = await prisma.skill.findUnique({
            where: {
                id,
                userId
            }
        })

        if (!skill) {
            return null;
        }

        return new Skill(
            skill.id,
            skill.name,
            skill.level,
            skill.about,
            skill.updatedAt,
            skill.userId
        )
    }
}