"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth/auth-client"
import {
  BookOpenText,
  Zap,
  BotMessageSquare,
  Layers,
  Eye,
  EyeOff,
  Workflow,
} from "lucide-react"
import Image from "next/image"
import { z } from "zod"

import logo from "@/public/logoSemFundo.png"

const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z
    .string()
    .min(8, "A senha deve conter no mínimo 8 caracteres"),
})

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()

  const filterErrorMessage = (message: string) => {
    if (message === "Invalid email or password") {
      return "Email ou senha inválidos"
    } else if (message === "User not found") {
      return "Usuário não encontrado"
    } else if (message === "Invalid email") {
      return "Email inválido"
    } else {
      return message || "Erro ao fazer login"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validation = loginSchema.safeParse({
      email,
      password,
    })

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Dados inválidos")
      return
    }

    setIsLoading(true)

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      })

      if (result.error) {
        setError(filterErrorMessage(result.error.message ?? ""))
      } else {
        router.push("/jobs")
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-600 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-red-500 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl relative z-10">
        {/* Left side - Brand */}
        <div className="hidden md:flex flex-col justify-between bg-white border-gray-200 border shadow-xl rounded-2xl p-12 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center mb-8">
              <Image
                className="rounded-lg w-full"
                src={logo.src}
                width={200}
                height={200}
                alt="Logo"
              />
            </div>

            <h2 className="text-4xl text-blue-600 font-bold mb-4 leading-tight">
              Inteligência Artificial para impulsionar sua carreira.
            </h2>

            <p className="text-blue-600 text-lg font-semibold mb-6">
              Plataforma personalizada criação de estudos personalizados para seu dia a dia.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-orange-200 rounded-lg">
                  <BotMessageSquare className="w-8 h-8 text-orange-600" />
                </span>
                <span className="text-md text-orange-600">Agentes de IA para criação de estudos</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="p-2 bg-purple-200 rounded-lg">
                  <Workflow className="w-8 h-8 text-purple-600" />
                </span>
                <span className="text-md text-purple-600">Recomendações personalizadas</span>
              </div>

              <div className="flex items-center gap-3 text-blue-600">
                <span className="p-2 bg-green-200 rounded-lg">
                  <Layers className="w-8 h-8 text-green-600" />
                </span>
                <span className="text-md text-green-600">Escalabilidade profissional</span>
                
              </div>
            </div>
          </div>

          <div className="text-white/60 text-sm">
            Transformando dados em oportunidades
          </div>
        </div>

        {/* Right side - Login */}
        <div className="flex flex-col justify-center">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="mb-8">
              <p className="text-orange-500 text-md font-semibold mb-2">
                Bem Vindo
              </p>

              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Acesse sua conta
              </h3>

              <p className="text-gray-500">
                Entre para continuar na plataforma
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-zinc-600" htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="relative w-full flex items-center bg-white! border-zinc-300 focus-within:border-zinc-400 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-600" htmlFor="password">
                  Senha
                </Label>

                <div className="relative w-full rounded-md">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="relative w-full flex items-center bg-white! border-zinc-300 focus-within:border-zinc-400 rounded-md"
                  />

                  {showPassword ? (
                    <EyeOff
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <Eye
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="mb-0 w-full"
                variant="create"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>

              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Não tem uma conta?
                </span>
              </div>
            </div>

            <Button
              onClick={() => router.push("/singup")}
              variant="link"
            >
              Criar nova conta
            </Button>
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">
            © 2026 EduCarrer AI. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}