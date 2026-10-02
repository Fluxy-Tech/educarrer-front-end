
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { createSkill, getSkillByUserId } from "@/lib/services/skill";
import { CreateSkillDTO } from "@/lib/interfaces/skill.interface";
export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { status: false, skills: [], message: "Não encontramos a sessão do usuario" },
        { status: 401 }
      );
    }

    const user = session.user;

    const skills = await getSkillByUserId(user.id);

    return NextResponse.json({
      status: true,
      skills,
      message: "Sucesso na consulta"
    });
  } catch (e: any) {
    return NextResponse.json({
      status: false,
      skills: [],
      message: "Erro interno no servidor"
    })
  }
}

export async function POST(req: Request) {
  try {
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

    const user = session.user;
    const data: CreateSkillDTO = {
      name,
      level,
      about,
      userId: user.id
    }

    const skill = await createSkill(
      data,
      user.id
    );

    return NextResponse.json({
      status: true,
      skill,
      message: "Sucesso na criação da skill"
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