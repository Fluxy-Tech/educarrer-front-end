


import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { updateUser } from "@/lib/services/user";
import { UpdateUserDTO } from "@/lib/interfaces/user.interface";

export async function PUT(req: Request) {
  try {
    const { name, email, image } = await req.json();

    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { status: false, message: "Não encontramos a sessão do usuário" },
        { status: 401 }
      );
    };

    const data: UpdateUserDTO = {
      name,
      email,
      image
    };

    const skill = await updateUser(
      data
    );

    return NextResponse.json({
      status: true,
      message: "Sucesso na atualização do usuário",
    });
  } catch (e: any) {
    console.error(e);

    return NextResponse.json(
      {
        status: false,
        message: "Erro interno no servidor"
      },
      { status: 500 }
    );
  }
}