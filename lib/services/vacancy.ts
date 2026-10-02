import { getVacancysFromRedis } from "@/lib/redis/vacancy";
import { VacancyRepository } from "@/lib/repositories/vacancy";
import { CreateVacancyData, VacancyDTO } from "@/lib/interfaces/vacancy.interface";
import { ExperienceDTO } from "@/lib/interfaces/experience.interface";
import { SkillDTO } from "@/lib/interfaces/skill.interface";
import { clearVacancysCache } from "@/lib/redis/clearCacheVacancys";
import { getSkillByUserId } from "@/lib/services/skill";
import { getExperienceByUserId } from "@/lib/services/experience";
import { HundleStudyWithOpenAi } from "@/lib/services/hundleStudyWithOpenAi";


const vacancysRedis = new getVacancysFromRedis();
const vacancysRepositoryDataBase = new VacancyRepository();

export async function getVacancys(userId: string) {
    const findVacanciesByUserIdFromRedis = await vacancysRedis.getVacancysFromRedis(userId);

    if (findVacanciesByUserIdFromRedis.length > 0) return findVacanciesByUserIdFromRedis;

    const vacancyRepository = new VacancyRepository();

    const [vacancies, skills, experiences] = await Promise.all([
        vacancyRepository.getVacancys(),
        getSkillByUserId(userId),
        getExperienceByUserId(userId)
    ]);

    if (skills.length === 0) {
        return [];
    }

    const vacanciesFilterToUser = await filterVacanciesBaseOfUserProfileWithAgenteAI(vacancies, skills, experiences);

    if (vacanciesFilterToUser.length > 0) {
        vacancysRedis.setVacancyInRedis(userId, vacanciesFilterToUser)
    }
    return vacanciesFilterToUser;

}

export async function getVacancysById(id: string) {
    const vacancy = await vacancysRedis.getVacanciesByIdFromRedis(id);

    if (vacancy) {
        return vacancy;
    }

    return await vacancysRepositoryDataBase.getVacancysById(id);
}

export async function createVacancy(data: CreateVacancyData) {
    await clearVacancysCache();
    return await vacancysRepositoryDataBase.createVacancy(data);
}

export async function updateVacancy(id: string, data: CreateVacancyData) {
    await clearVacancysCache();
    return await vacancysRepositoryDataBase.updateVacancy(id, data);
}

export async function getVacancysFromRedisAdmin() {
    return await vacancysRedis.getVacancysFromRedisAdmin()
}

export async function getNumberTotalVacancys() {
    return await vacancysRepositoryDataBase.getCountVacancies();
}

export async function getNumberTotalCompaniesByVacancys() {
    return await vacancysRepositoryDataBase.getCountCompaniesByVacancies();
}

// Filtrar vagas do usuario atraves do nosso agente de IA
async function filterVacanciesBaseOfUserProfileWithAgenteAI(vacancies: VacancyDTO[], skills: SkillDTO[], experiences: ExperienceDTO[]): Promise<VacancyDTO[]> {
    const openAi = new HundleStudyWithOpenAi();

    const response = await openAi.filterVacancysToUser(
        skills,
        experiences,
        vacancies
    );

    if (!response) {
        return [];
    }

    const resAgentFilter = JSON.parse(response);

    if (!resAgentFilter.ids) {
        return [];
    }

    const vacancyIds = resAgentFilter.ids;

    if (!Array.isArray(vacancyIds) || vacancyIds.length === 0) {
        return [];
    }

    const vacanciesFiltered: VacancyDTO[] = []

    for (const id of vacancyIds) {
        const vacancyFindFirst = vacancies.find((v) => v.id == id);

        if (vacancyFindFirst) {
            vacanciesFiltered.push(vacancyFindFirst);
        }
    }

    return vacanciesFiltered;
}
