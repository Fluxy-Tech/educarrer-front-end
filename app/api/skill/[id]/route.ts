import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { deleteSkill, updateSkill } from "@/lib/services/skill";
import { UpdateSkillDTO } from "@/lib/interfaces/skill.interface";

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

    await deleteSkill(id, session.user.id);

    return NextResponse.json({
      status: true,
      message: "Sucesso ao deletar a skill",
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
  try {
    const { id } = await params;
    const { name, level, about } = await req.json();

    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { status: false, skill: null, message: "Não encontramos a sessão do usuário" },
        { status: 401 }
      );
    }

    const data: UpdateSkillDTO = {
      name,
      level,
      about
    }

    const skill = await updateSkill(
      id,
      data,
      session.user.id
    );

    return NextResponse.json({
      status: true,
      skill,
      message: "Sucesso na atualização"
    });
  } catch (e: any) {
    console.error(e);

    return NextResponse.json(
      {
        status: false,
        skill: null,
        message: "Erro interno no servidor"
      },
      { status: 500 }
    );
  }
}