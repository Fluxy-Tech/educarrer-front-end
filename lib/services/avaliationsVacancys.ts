import { AvaliationVacancysRepository } from "@/lib/repositories/avaliationsVacancys";
import { getUserById } from "@/lib/services/user";

export async function getAvaliationVacancy() {
    try {
        const avaliation = new AvaliationVacancysRepository();
        return await avaliation.getAvaliations();
    } catch (e: any) {
        return []
    }
}

export async function getAvaliationVacancyByUserId(userId: string) {
    try {
        const user = await getUserById(userId);
        const timeCreatedUser = await hasPassed2HoursCreatedUser(user?.createdAt);

        if (!timeCreatedUser) {
            return false;
        }

        const avaliation = new AvaliationVacancysRepository();
        const lastAvaliation = await avaliation.getAvaliationsByUserId(userId);

        if (lastAvaliation == null) return true;

        return hasPassed2Days(lastAvaliation?.createdAt);
    } catch (e: any) {
        console.error("Erro ao buscar avaliação por ID de usuário:", e);
        return true
    }
}

export async function createAvaliationVacancy(data: { userId: string; comment?: string; satisfied: boolean }) {
    try {
        const avaliation = new AvaliationVacancysRepository();
        return avaliation.createAvaliation(data);
    } catch (e: any) {
        return null
    }
}

export async function updateAvaliationVacancy(id: string, data: { satisfied?: boolean; comment?: string }) {
    try {
        const avaliation = new AvaliationVacancysRepository();
        return avaliation.updateAvaliation(id, data);
    } catch (e: any) {
        return null
    }
}

function hasPassed2Days(createdAt: Date): boolean {
    const now = new Date();

    const differenceMs = now.getTime() - createdAt.getTime();

    const twoDaysMs = 2 * 24 * 60 * 60 * 1000; // 48 horas

    return differenceMs >= twoDaysMs;
}

async function hasPassed2HoursCreatedUser(createdAt: Date | undefined): Promise<boolean> {
    
    if (!createdAt) {
        return false;
    }

    const now = new Date();

    const differenceMs = now.getTime() - createdAt.getTime();

    const twoHoursMs = 2 * 60 * 60 * 1000; // 2 horas

    return differenceMs >= twoHoursMs;
}