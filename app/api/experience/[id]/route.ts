import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { deleteExperience, updateExperience } from "@/lib/services/experience";

export async function DELETE(
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
          message: "Não encontramos a sessão do usuário ou id da organização",
        },
        { status: 401 }
      );
    }

    await deleteExperience(
      id,
      session.user.id
    );

    return NextResponse.json({
      status: true,
      message: "Sucesso ao deletar a experiência",
    });
  } catch (e) {
    return NextResponse.json(
      {
        status: false,
        message: "Erro interno no servidor",
      },
      { status: 500 }
    );
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
        experience: null,
        message: "ID da experiência não fornecido"
      },
      { status: 400 }
    );
  }

  try {
    const { name, seniority, about, startDate, endDate, currentJob } = await req.json();

    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { status: false, experience: null, message: "Não encontramos a sessão do usuário" },
        { status: 401 }
      );
    }

    const experience = await updateExperience(
      id,
      {
        name,
        seniority,
        about,
        startDate,
        endDate,
        currentJob
      },
      session.user.id
    )

    return NextResponse.json({
      status: true,
      experience,
      message: "Sucesso na atualização"
    });
  } catch (e: any) {
    console.error(e);

    return NextResponse.json(
      {
        status: false,
        experience: null,
        message: "Erro interno no servidor"
      },
      { status: 500 }
    );
  }
}