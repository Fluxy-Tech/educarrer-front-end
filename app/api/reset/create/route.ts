import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { ResetPassword } from "@/lib/services/resetPassword";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const resetPassword = new ResetPassword();

    const res = await resetPassword.resetPasswordByUserEmail(email);

    return NextResponse.json({
      status: res.status,
      message: res.message
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

