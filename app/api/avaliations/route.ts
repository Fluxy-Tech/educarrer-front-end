import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { createAvaliation, getAvaliations } from "@/lib/services/avaliations";

export async function POST(req: Request) {
  try {
    const { comment, satisfied, studyId } = await req.json();

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

    const avaliation = await createAvaliation({ userId: user.id, studyId, comment, satisfied });

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

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user || session.user.role != "admin") {
      return NextResponse.json(
        { status: false, avaliations: [], message: "Acesso negado" },
        { status: 401 }
      );
    }

    const user = session.user;

    const avaliations = await getAvaliations();

    return NextResponse.json({
      status: true,
      avaliations,
      message: "Sucesso na criação da avaliação"
    });
  } catch (e: any) {
    console.error(e);

    return NextResponse.json(
      {
        status: false,
        avaliations: [],
        message: "Erro interno no servidor"
      },
      { status: 500 }
    );
  }
}