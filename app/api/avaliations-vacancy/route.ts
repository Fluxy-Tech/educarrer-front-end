import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { createAvaliationVacancy, getAvaliationVacancyByUserId } from "@/lib/services/avaliationsVacancys";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { status: false, solicited: true, message: "Não encontramos a sessão do usuário" },
        { status: 401 }
      );
    }

    const avaliation = await getAvaliationVacancyByUserId(session.user.id);

    return NextResponse.json({
      status: true,
      solicited: avaliation,
      message: "Sucesso na consulta das avaliações  das vagas"
    });
  } catch (e: any) {
    return NextResponse.json({
      status: false,
      solicited: true,
      message: "Erro interno no servidor"
    })
  }
}

export async function POST(req: Request) {
  try {
    const { comment, satisfied } = await req.json();

    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { status: false, avaliation: null, message: "Não encontramos a sessão do usuário" },
        { status: 401 }
      );
    }

    const user = session.user;

    const avaliation = await createAvaliationVacancy({ userId: user.id, comment, satisfied });

    return NextResponse.json({
      status: true,
      avaliation,
      message: "Sucesso na criação da avaliação"
    });
  } catch (e: any) {
    console.error(e);

    return NextResponse.json(
      {
        status: false,
        avaliation: null,
        message: "Erro interno no servidor"
      },
      { status: 500 }
    );
  }
}