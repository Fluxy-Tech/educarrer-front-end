"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth/auth-client"
import { BookOpenText, Zap, BotMessageSquare, ChartCandlestick, Eye, EyeOff, ArrowRight, ArrowLeftToLine, Workflow, Layers } from "lucide-react"
import Image from "next/image"
import logo from "@/public/logoSemFundo.png"

// Validação dos dados do step 1 (nome e email)
const step1Schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z
    .string()
    .trim()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
})

// Validação dos dados do step 2 (senha e confirmação)
const step2Schema = z
  .object({
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(
        /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']/,
        "A senha deve conter pelo menos 1 caractere especial"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordSecond, setShowPasswordSecond] = useState(false)
  const [step, setStep] = useState(1)

  const nextStep = async () => {
    setError("")

    const result = step1Schema.safeParse({ name, email })

    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const result = step2Schema.safeParse({ password, confirmPassword })

    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setIsLoading(true)

    try {
      const signUpResult = await authClient.signUp.email({
        email,
        password,
        name,
      })

      console.log(signUpResult)

      if (signUpResult.error) {
        setError(signUpResult.error.message || "Erro ao criar conta")
      } else {
        router.push("/jobs")
      }
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.")
      console.log(err)
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
        <div className="hidden md:flex flex-col justify-between border-gray-200 border bg-white shadow-xl rounded-2xl p-12 relative overflow-hidden">
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

        {/* Right side - Signup Form */}
        <div className="flex flex-col justify-center">

          {step == 1 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-xl">
              <div className="mb-8">
                <p className="text-orange-500 text-md font-semibold tracking-wide mb-2">
                  Nova conta
                </p>
                <h3 className="text-3xl font-bold text-black mb-2">
                  Criar conta
                </h3>
                <p className="text-gray-500">
                  Preencha os dados abaixo para começar
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-black font-medium">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                    className="relative w-full flex items-center bg-white! border-zinc-300 focus-within:border-zinc-400 rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-black font-medium">
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

                <Button
                  type="button"
                  onClick={() => nextStep()}
                  variant={"create"}
                  disabled={isLoading}
                  className="w-full font-semibold py-6 rounded-lg transition-all duration-300"
                >
                  <ArrowRight /> Proximo
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-purple-500/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500!">
                      Já tem uma conta?
                    </span>
                  </div>
                </div>

                <Link
                  href="/singin"
                  className="block w-full text-center px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Fazer login
                </Link>
              </form>
            </div>
          )
          }

          {step == 2 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-xl">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-black mb-2">
                  Ja esta quase lá!
                </h3>
                <p className="text-gray-400">
                  Preencha sua senha agora para finalizar o cadastro
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-black font-medium">
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
                      <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500" onClick={() => setShowPassword(false)} />
                    ) : (
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500" onClick={() => setShowPassword(true)} />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Mínimo de 8 caracteres e 1 caractere especial (ex: ! @ # $ %)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-black font-medium">
                    Confirmar Senha
                  </Label>
                  <div className="relative w-full rounded-md">
                    <Input
                      id="confirmPassword"
                      type={showPasswordSecond ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="relative w-full flex items-center bg-white! border-zinc-300 focus-within:border-zinc-400 rounded-md"
                    />
                    {showPasswordSecond ? (
                      <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500" onClick={() => setShowPasswordSecond(false)} />
                    ) : (
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500" onClick={() => setShowPasswordSecond(true)} />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    type="submit"
                    variant={"create"}
                    disabled={isLoading}
                    className="w-full mb-0 text-white font-semibold py-6 rounded-lg transition-all duration-300"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Criando conta...
                      </div>
                    ) : (
                      "Criar conta"
                    )}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      setStep(1)
                      setPassword("")
                      setConfirmPassword("")
                      setError("")
                    }}
                    disabled={isLoading}
                    variant={"link"}
                    className="mt-5"
                  >
                    <ArrowLeftToLine /> Voltar
                  </Button>
                </div>


                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-purple-500/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500!">
                      Já tem uma conta?
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => router.push("/singin")}
                  variant={"link"}
                  className="w-full"
                >
                  Fazer login
                </Button>
              </form>
            </div>
          )}



          <p className="text-center text-gray-400 text-xs mt-6">
            © 2026 EduCarrer AI. Todos os direitos reservados.
          </p>
        </div>
      </div >
    </div >
  )
}