import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getVacancysFromRedisAdmin } from "@/lib/services/vacancy";

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session || !session.user || session.user.role != "admin") {
            return NextResponse.json(
                { status: false, vacancys: [], message: "Não encontramos a sessão do usuario" },
                { status: 401 }
            );
        }

        const vacancys = await getVacancysFromRedisAdmin();

        return NextResponse.json({
            status: vacancys.length > 0,
            vacancys,
            message: vacancys.length > 0 ? "Sucesso na consulta" : "Não encontramos uma vaga de acordo com seu perfil"
        });
    } catch (e: any) {
        return NextResponse.json({
            status: false,
            vacancys: [],
            message: "Erro interno no servidor"
        })
    }
}
