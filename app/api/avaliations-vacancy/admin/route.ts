import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getAvaliationVacancy } from "@/lib/services/avaliationsVacancys";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { status: false, avaliations: [], message: "Não encontramos a sessão do usuário" },
        { status: 401 }
      );
    }

    if (session.user.role != "admin") {
      
      
      return NextResponse.json({
        status: false,
        avaliations: [],
        message: "Seu usuario não tem permissão para acessar essa rota"
      });
    }

    const avaliations = await getAvaliationVacancy();
      
      return NextResponse.json({
        status: true,
        avaliations,
        message: "Sucesso na consulta das avaliações  das vagas"
      });
  } catch (e: any) {
    return NextResponse.json({
      status: false,
      avaliations: [],
      message: "Erro interno no servidor"
    })
  }
}