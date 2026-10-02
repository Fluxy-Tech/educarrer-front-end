import { prisma } from "@/lib/prisma";
import { CreateExperienceDTO, ExperienceDTO, UpdateExperienceDTO } from "@/lib/interfaces/experience.interface";
import { Experience } from "@/lib/entities/experience";

export class ExperienceRepository {

    async getExperienceByUserId(userId: string): Promise<ExperienceDTO[]> {
        const experiences = await prisma.experience.findMany({
            where: {
                userId,
            },
        });

        return experiences.map(experience => new Experience(
            experience.id,
            experience.name,
            experience.seniority,
            experience.about,
            experience.startDate,
            experience.endDate,
            experience.currentJob,
            experience.updatedAt,
            experience.userId
        ));
    }

    async getExperienceByUserIdAndId(id: string): Promise<ExperienceDTO | null> {
        const experience = await prisma.experience.findUnique({
            where: {
                id
            }
        })

        if (experience) {
            return new Experience(
                experience.id,
                experience.name,
                experience.seniority,
                experience.about,
                experience.startDate,
                experience.endDate,
                experience.currentJob,
                experience.updatedAt,
                experience.userId
            )
        }

        return null;
    }

    async createExperience(data: CreateExperienceDTO): Promise<ExperienceDTO> {
        const experience = await prisma.experience.create({
            data
        });

        return new Experience(
            experience.id,
            experience.name,
            experience.seniority,
            experience.about,
            experience.startDate,
            experience.endDate,
            experience.currentJob,
            experience.updatedAt,
            experience.userId
        );
    }

    async deleteExperience(id: string) {
        return await prisma.experience.delete({
            where: {
                id
            }
        });
    }

    async updateExperience(id: string, data: Partial<UpdateExperienceDTO>): Promise<ExperienceDTO> {
        const experience = await prisma.experience.update({
            where: {
                id
            },
            data
        });

        return new Experience(
            experience.id,
            experience.name,
            experience.seniority,
            experience.about,
            experience.startDate,
            experience.endDate,
            experience.currentJob,
            experience.updatedAt,
            experience.userId
        );
    }
}