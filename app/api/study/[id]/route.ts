import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getStudyById } from "@/lib/services/study";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user || !id) {
      return NextResponse.json(
        {
          status: false,
          study: null,
          message: "Não encontramos a sessão do usuário ou id da organização",
        },
        { status: 401 }
      );
    }

    const study = await getStudyById(session.user.id, id);

    return NextResponse.json({
      status: true,
      study: study,
      message: "Sucesso ao deletar a experiência",
    });
  } catch (e) {
    return NextResponse.json(
      {
        status: false,
        study: null,
        message: "Erro interno no servidor",
      },
      { status: 500 }
    );
  }
}