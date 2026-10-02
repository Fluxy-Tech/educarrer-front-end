import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getExperienceByUserId, createExperience } from "@/lib/services/experience";
import { CreateExperienceDTO } from "@/lib/interfaces/experience.interface";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { status: false, experiences: [], message: "Não encontramos a sessão do usuario" },
        { status: 401 }
      );
    }

    const user = session.user;

    const experiences = await getExperienceByUserId(user.id);

    return NextResponse.json({
      status: true,
      experiences,
      message: "Sucesso na consulta das experiências"
    });
  } catch (e: any) {
    return NextResponse.json({
      status: false,
      experiences: [],
      message: "Erro interno no servidor"
    })
  }
}

export async function POST(req: Request) {
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

    const user = session.user;

    const data: CreateExperienceDTO = {
      name,
      seniority,
      about,
      startDate,
      endDate,
      currentJob,
      userId: user.id
    }

    const experience = await createExperience(data, user.id);

    return NextResponse.json({
      status: true,
      experience,
      message: "Sucesso na criação da experiencia"
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