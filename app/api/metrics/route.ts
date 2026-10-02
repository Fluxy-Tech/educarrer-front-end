import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getMetrics } from "@/lib/services/metrics";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { status: false, metrics: [], message: "Não encontramos a sessão do usuario" },
        { status: 401 }
      );
    }

    const metrics = await getMetrics();

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