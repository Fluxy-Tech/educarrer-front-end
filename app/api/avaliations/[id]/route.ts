import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { updateAvaliation, getAvaliationsByUserIdAndStudyId } from "@/lib/services/avaliations";


export async function GET(req: Request,
  { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          status: false,
          avaliation: null,
          message: "Id do estudo não fornecido"
        },
        { status: 400 }
      );
    }

    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { status: false, avaliation: null, message: "Não encontramos a sessão do usuario" },
        { status: 401 }
      );
    }

    const user = session.user;

    const avaliation = await getAvaliationsByUserIdAndStudyId(user.id, id);

    return NextResponse.json({
      status: true,
      avaliation,
      message: "Sucesso na consulta da avaliação"
    });
  } catch (e: any) {
    return NextResponse.json({
      status: false,
      avaliation: null,
      message: "Erro interno no servidor"
    })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      {
        status: false,
        avaliation: null,
        message: "ID da avaliação não fornecido"
      },
      { status: 400 }
    );
  }

  try {
    const { satisfied, comment } = await req.json();

    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { status: false, avaliation: null, message: "Não encontramos a sessão do usuário" },
        { status: 401 }
      );
    }

    const avaliation = await updateAvaliation(
      id,
      {
        satisfied,
        comment
      }
    );

    return NextResponse.json({
      status: true,
      avaliation,
      message: "Sucesso na atualização"
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