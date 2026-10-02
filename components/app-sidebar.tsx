"use client"

import logo from "@/public/logoSemFundo.png"
import * as React from "react"
import {
  BookOpenText,
  BriefcaseBusiness,
  BookMarked,
  UserCog,
  LogOut,
  User,
  ShieldUser,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient, useSession } from "@/lib/auth/auth-client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

const menuItems = [
  {
    title: "Vagas",
    url: "/jobs",
    icon: BriefcaseBusiness,
  },
  {
    title: "Estudo",
    url: "/learning",
    icon: BookMarked,
  },
  {
    title: "Perfil",
    url: "/profile",
    icon: UserCog,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const handleLogout = async () => {
    await authClient.signOut()
    router.push("/singin")
  }

  const items = React.useMemo(() => {
    const baseItems = [...menuItems]

    if (session?.user?.role === "admin") {
      baseItems.push({
        title: "Admin",
        url: "/admin",
        icon: ShieldUser,
      })
    }

    return baseItems
  }, [session?.user?.role])

  return (
    <Sidebar className="h-full border-r border-zinc-300">
      <SidebarHeader className="flex items-start justify-center py-5 px-4">
        <div className="flex items-center gap-2">
          <Image src={logo.src} width={200} height={200} alt="Logo" />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 px-2">
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={pathname === item.url ? "bg-blue-500! text-white! h-12 px-4 py-2" : "hover:bg-orange-200! hover:text-black! h-12 px-4 py-2"}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="pl-2">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="sidebar" className="w-full justify-start gap-2">
              <User className="h-4 w-4" />
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium">
                  {session?.user?.name || "Usuário"}
                </span>
                <span className="text-xs text-black">
                  {session?.user?.email}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-white cursor-pointer h-10 bg-blue-500 hover:bg-blue-600 transition flex items-center just" onClick={handleLogout}>
              <LogOut className="mr-1 text-white h-4 w-4" />
              <span>Deslogar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
