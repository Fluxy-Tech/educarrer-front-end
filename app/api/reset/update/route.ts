import { NextResponse } from "next/server";
import { authClient } from "@/lib/auth/auth-client";
import { auth } from "@/lib/auth/auth";
import { ResetPassword } from "@/lib/services/resetPassword";

export async function POST(req: Request) {
  try {
    const { password, token } = await req.json();

    const { status } = await auth.api.resetPassword({
      body: {
        token,
        newPassword: password
      }
    });

    const resetPassword = new ResetPassword();
    await resetPassword.updateResetPasswordByTokenAndEmailUser(token);

    return NextResponse.json({
      status,
      message: status == true ? "Senha atualizada com sucesso" : "Erro ao atualizar senha"
    },
    { status: status ? 200 : 400 }
    );
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

