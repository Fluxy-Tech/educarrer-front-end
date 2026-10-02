import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getMetricsAdmin } from "@/lib/services/metrics";

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session || !session.user || session.user.role != "admin") {
            return NextResponse.json(
                { status: false, metrics: null, message: "Não encontramos a sessão do usuario" },
                { status: 401 }
            );
        }

        const metrics = await getMetricsAdmin();

        return NextResponse.json({
            status: true,
            metrics,
            message: "Sucesso na consulta"
        });
    } catch (e: any) {
        return NextResponse.json({
            status: false,
            metrics: null,
            message: "Erro interno no servidor"
        })
    }
}
